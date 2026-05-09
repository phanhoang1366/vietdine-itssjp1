import { Router, Request, Response } from 'express';
import { LoginFormSchema } from '../lib/definitions';
import { findUserByEmail } from '../services/user.service';
import { createSessionCookie, clearSessionCookie } from '../lib/session';
import { compareSync } from 'bcryptjs';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const validated = LoginFormSchema.safeParse(req.body);

    if (!validated.success) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: validated.error.flatten().fieldErrors 
      });
    }

    const { email, password } = validated.data;
    const user = await findUserByEmail(email);

    if (!user || !compareSync(password, user.passwordHash)) {
      return res.status(401).json({ message: 'メールアドレスまたはパスワードが正しくありません' });
    }

    await createSessionCookie(res, user.id, user.roleId as 1 | 2 | 3);

    res.json({
      message: 'Login successful',
      user: { id: user.id, name: user.fullName, email: user.emailPhone, roleId: user.roleId },
    });
  } catch (error) {
    res.status(400).json({ message: 'Bad Request' });
  }
});

// DELETE /api/auth/logout
router.delete('/logout', (req: Request, res: Response) => {
  clearSessionCookie(res);
  res.json({ message: 'Logged out successfully' });
});

export default router;
