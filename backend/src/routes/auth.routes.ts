import { Router, Request, Response } from 'express';
import { LoginFormSchema } from '../lib/definitions';
import { findUserByEmail, findOrCreateGoogleUser } from '../services/user.service';
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

    if (!user || !user.passwordHash || !compareSync(password, user.passwordHash)) {
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

// POST /api/auth/google
router.post('/google', async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    // Verify access token by fetching user profile
    const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!userInfoRes.ok) {
      return res.status(400).json({ message: 'Invalid Google Token' });
    }

    const payload = await userInfoRes.json();
    
    if (!payload || !payload.email) {
      return res.status(400).json({ message: 'Invalid Google Token Payload' });
    }

    const { email, name, sub: googleId, picture } = payload;

    const user = await findOrCreateGoogleUser({
      email,
      name: name || 'Google User',
      googleId,
      avatarUrl: picture,
    });

    await createSessionCookie(res, user.id, user.roleId as 1 | 2 | 3);

    res.json({
      message: 'Google Login successful',
      user: { id: user.id, name: user.fullName, email: user.emailPhone, roleId: user.roleId },
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
});

// DELETE /api/auth/logout
router.delete('/logout', (req: Request, res: Response) => {
  clearSessionCookie(res);
  res.json({ message: 'Logged out successfully' });
});

export default router;
