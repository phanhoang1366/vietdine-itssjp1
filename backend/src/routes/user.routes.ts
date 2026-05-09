import { Router, Request, Response } from 'express';
import { SignupFormSchema, ProfileUpdateSchema, ChangePasswordSchema } from '../lib/definitions';
import { findUserByEmail, createUser, findUserById, updateUser, toSafeUser, updatePassword } from '../services/user.service';
import { createSessionCookie } from '../lib/session';
import { requireAuth } from '../middleware/auth.middleware';
import { hashSync, compareSync } from 'bcryptjs';

const router = Router();

// POST /api/users/register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const validated = SignupFormSchema.safeParse(req.body);

    if (!validated.success) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: validated.error.flatten().fieldErrors 
      });
    }

    const { name, email, phone, password } = validated.data;

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'このメールアドレスは既に使用されています' });
    }

    const hashedPassword = hashSync(password, 10);
    const roleId = (req.body.roleId === 2 ? 2 : 1) as 1 | 2;
    
    const user = await createUser({
      name,
      email,
      phone,
      passwordHash: hashedPassword,
      roleId,
      restaurantName: req.body.restaurantName,
    });

    await createSessionCookie(res, user.id, user.roleId as 1 | 2 | 3);

    res.status(201).json({
      message: 'Registration successful',
      user: { id: user.id, name: user.fullName, email: user.emailPhone, roleId: user.roleId },
    });
  } catch (error) {
    res.status(400).json({ message: 'Bad Request' });
  }
});

// GET /api/users/profile
router.get('/profile', requireAuth, async (req: Request, res: Response) => {
  const session = (req as any).user;
  
  const user = await findUserById(session.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({ user: toSafeUser(user) });
});

// PUT /api/users/profile
router.put('/profile', requireAuth, async (req: Request, res: Response) => {
  const session = (req as any).user;

  try {
    const validated = ProfileUpdateSchema.safeParse(req.body);

    if (!validated.success) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: validated.error.flatten().fieldErrors 
      });
    }

    const updated = await updateUser(session.userId, validated.data);
    if (!updated) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user: toSafeUser(updated) });
  } catch (error) {
    res.status(400).json({ message: 'Bad Request' });
  }
});

// POST /api/users/change-password
router.post('/change-password', requireAuth, async (req: Request, res: Response) => {
  const session = (req as any).user;

  try {
    const validated = ChangePasswordSchema.safeParse(req.body);

    if (!validated.success) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: validated.error.flatten().fieldErrors 
      });
    }

    const { currentPassword, newPassword } = validated.data;
    const user = await findUserById(session.userId);

    if (!user || !compareSync(currentPassword, user.passwordHash)) {
      return res.status(401).json({ message: '現在のパスワードが正しくありません' });
    }

    const hashedPassword = hashSync(newPassword, 10);
    await updatePassword(user.id, hashedPassword);

    res.json({ message: 'パスワードが変更されました' });
  } catch (error) {
    res.status(400).json({ message: 'Bad Request' });
  }
});

export default router;
