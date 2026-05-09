import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import * as chatService from '../services/chat.service';

const router = Router();

router.use(requireAuth);

// ─── Get Messages for a Reservation ──────────────────────────
router.get('/:reservationId/messages', async (req: Request, res: Response) => {
  try {
    const reservationId = parseInt(req.params.reservationId);
    if (isNaN(reservationId)) {
      return res.status(400).json({ message: 'Invalid reservation ID' });
    }

    const cursor = req.query.cursor ? parseInt(req.query.cursor as string) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;

    const messages = await chatService.getMessages(reservationId, cursor, limit);
    res.json({ messages });
  } catch (error) {
    console.error('Chat fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ─── Send a Message (REST Fallback) ──────────────────────────
router.post('/:reservationId/messages', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const reservationId = parseInt(req.params.reservationId);

    if (isNaN(reservationId)) {
      return res.status(400).json({ message: 'Invalid reservation ID' });
    }

    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'メッセージを入力してください' });
    }

    const message = await chatService.createMessage(reservationId, userId, content.trim());

    // Also broadcast via Socket.IO if available
    try {
      const { getIO } = require('../lib/socket');
      const io = getIO();
      io.to(`reservation_${reservationId}`).emit('new_message', message);
    } catch {
      // Socket.IO may not be initialized in test environments
    }

    res.status(201).json({ message });
  } catch (error: any) {
    if (error.message.includes('予約') || error.message.includes('アクセス')) {
      return res.status(403).json({ message: error.message });
    }
    console.error('Chat send error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ─── Mark Messages As Read ────────────────────────────────────
router.put('/:reservationId/read', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const reservationId = parseInt(req.params.reservationId);

    if (isNaN(reservationId)) {
      return res.status(400).json({ message: 'Invalid reservation ID' });
    }

    await chatService.markMessagesAsRead(reservationId, userId);
    res.json({ success: true });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
