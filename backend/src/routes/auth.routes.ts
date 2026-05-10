import { Router, Request, Response } from 'express';
import { LoginFormSchema } from '../lib/definitions';
import { findUserByEmail } from '../services/user.service';
import { createSessionCookie, clearSessionCookie } from '../lib/session';
import { compareSync } from 'bcryptjs';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    console.log('LOGIN BODY:', req.body);

    const validated = LoginFormSchema.safeParse(req.body);

    if (!validated.success) {
      console.log('VALIDATION ERROR:', validated.error.flatten().fieldErrors);

      return res.status(400).json({
        message: 'Validation failed',
        errors: validated.error.flatten().fieldErrors,
      });
    }

    const { email, password } = validated.data;

    const user = await findUserByEmail(email);

    console.log('FOUND USER:', user
      ? {
          id: user.id,
          emailPhone: user.emailPhone,
          roleId: user.roleId,
          hasPasswordHash: !!user.passwordHash,
        }
      : null
    );

    if (!user) {
      return res.status(401).json({
        message: 'メールアドレスまたはパスワードが正しくありません',
      });
    }

    if (!user.passwordHash) {
      return res.status(500).json({
        message: 'User passwordHash is missing',
      });
    }

    const isPasswordCorrect = compareSync(password, user.passwordHash);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: 'メールアドレスまたはパスワードが正しくありません',
      });
    }

    await createSessionCookie(res, user.id, user.roleId as 1 | 2 | 3);

    return res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.fullName,
        email: user.emailPhone,
        roleId: user.roleId,
      },
    });
  } catch (error) {
    console.error('LOGIN ERROR:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
});

// DELETE /api/auth/logout
router.delete('/logout', (req: Request, res: Response) => {
  clearSessionCookie(res);
  res.json({ message: 'Logged out successfully' });
});

export default router;
