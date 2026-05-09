import { Request, Response, NextFunction } from 'express';
import { decrypt } from '../lib/session';

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const sessionCookie = req.cookies.session;
  
  if (!sessionCookie) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const payload = await decrypt(sessionCookie);
  if (!payload) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Attach session data to request object
  (req as any).user = payload;
  next();
}
