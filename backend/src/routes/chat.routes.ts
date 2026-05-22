import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import * as chatService from '../services/chat.service';

const router = Router();

router.use(requireAuth);

function getUser(req: Request) {
  return (req as any).user as { userId: number; roleId: number };
}

function parseId(value: string) {
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function isChatAccessError(error: any) {
  return (
    error.message?.includes('見つかりません') ||
    error.message?.includes('アクセス') ||
    error.message?.includes('自分') ||
    error.message?.includes('問い合わせ')
  );
}

function emitMessageUpdate(message: unknown, roomName: string | null, eventName: string) {
  if (!roomName) return;

  try {
    const { getIO } = require('../lib/socket');
    const io = getIO();
    io.to(roomName).emit(eventName, message);
  } catch {
    // Socket.IO may not be initialized in test environments.
  }
}

// ─── Direct Restaurant Conversations ──────────────────────────
router.get('/direct/conversations', async (req: Request, res: Response) => {
  try {
    const user = getUser(req);
    const conversations = await chatService.listDirectConversations(user.userId, user.roleId);
    res.json({ conversations });
  } catch (error) {
    console.error('Direct conversations fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/direct/restaurants/:restaurantId', async (req: Request, res: Response) => {
  try {
    const user = getUser(req);
    const restaurantId = parseId(req.params.restaurantId);

    if (!restaurantId) {
      return res.status(400).json({ message: 'Invalid restaurant ID' });
    }

    const conversation = await chatService.getOrCreateDirectConversation(
      restaurantId,
      user.userId
    );

    res.status(201).json({ conversation });
  } catch (error: any) {
    if (isChatAccessError(error)) {
      return res.status(403).json({ message: error.message });
    }
    console.error('Direct conversation create error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/direct/:conversationId', async (req: Request, res: Response) => {
  try {
    const user = getUser(req);
    const conversationId = parseId(req.params.conversationId);

    if (!conversationId) {
      return res.status(400).json({ message: 'Invalid conversation ID' });
    }

    const conversation = await chatService.getDirectConversation(
      conversationId,
      user.userId
    );

    res.json({ conversation });
  } catch (error: any) {
    if (isChatAccessError(error)) {
      return res.status(403).json({ message: error.message });
    }
    console.error('Direct conversation fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/direct/:conversationId/messages', async (req: Request, res: Response) => {
  try {
    const user = getUser(req);
    const conversationId = parseId(req.params.conversationId);

    if (!conversationId) {
      return res.status(400).json({ message: 'Invalid conversation ID' });
    }

    const cursor = req.query.cursor ? parseInt(req.query.cursor as string, 10) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;

    const messages = await chatService.getDirectMessages(
      conversationId,
      user.userId,
      cursor,
      limit
    );
    res.json({ messages });
  } catch (error: any) {
    if (isChatAccessError(error)) {
      return res.status(403).json({ message: error.message });
    }
    console.error('Direct chat fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/direct/:conversationId/messages', async (req: Request, res: Response) => {
  try {
    const user = getUser(req);
    const conversationId = parseId(req.params.conversationId);

    if (!conversationId) {
      return res.status(400).json({ message: 'Invalid conversation ID' });
    }

    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'メッセージを入力してください' });
    }

    const message = await chatService.createDirectMessage(
      conversationId,
      user.userId,
      content.trim()
    );

    emitMessageUpdate(message, `direct_${conversationId}`, 'new_direct_message');
    res.status(201).json({ message });
  } catch (error: any) {
    if (isChatAccessError(error)) {
      return res.status(403).json({ message: error.message });
    }
    console.error('Direct chat send error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/direct/:conversationId/read', async (req: Request, res: Response) => {
  try {
    const user = getUser(req);
    const conversationId = parseId(req.params.conversationId);

    if (!conversationId) {
      return res.status(400).json({ message: 'Invalid conversation ID' });
    }

    await chatService.markDirectMessagesAsRead(conversationId, user.userId);
    res.json({ success: true });
  } catch (error: any) {
    if (isChatAccessError(error)) {
      return res.status(403).json({ message: error.message });
    }
    console.error('Direct mark read error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ─── Message Ownership Actions ────────────────────────────────
router.patch('/messages/:messageId', async (req: Request, res: Response) => {
  try {
    const user = getUser(req);
    const messageId = parseId(req.params.messageId);

    if (!messageId) {
      return res.status(400).json({ message: 'Invalid message ID' });
    }

    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'メッセージを入力してください' });
    }

    const result = await chatService.updateOwnMessage(
      messageId,
      user.userId,
      content.trim()
    );

    emitMessageUpdate(result.message, result.roomName, 'message_updated');
    res.json({ message: result.message });
  } catch (error: any) {
    if (isChatAccessError(error)) {
      return res.status(403).json({ message: error.message });
    }
    console.error('Message update error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/messages/:messageId', async (req: Request, res: Response) => {
  try {
    const user = getUser(req);
    const messageId = parseId(req.params.messageId);

    if (!messageId) {
      return res.status(400).json({ message: 'Invalid message ID' });
    }

    const result = await chatService.retractOwnMessage(messageId, user.userId);

    emitMessageUpdate(result.message, result.roomName, 'message_updated');
    res.json({ message: result.message });
  } catch (error: any) {
    if (isChatAccessError(error)) {
      return res.status(403).json({ message: error.message });
    }
    console.error('Message retract error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ─── Get Messages for a Reservation ──────────────────────────
router.get('/:reservationId/messages', async (req: Request, res: Response) => {
  try {
    const user = getUser(req);
    const reservationId = parseId(req.params.reservationId);

    if (!reservationId) {
      return res.status(400).json({ message: 'Invalid reservation ID' });
    }

    const cursor = req.query.cursor ? parseInt(req.query.cursor as string, 10) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;

    const messages = await chatService.getMessages(
      reservationId,
      user.userId,
      cursor,
      limit
    );
    res.json({ messages });
  } catch (error: any) {
    if (isChatAccessError(error)) {
      return res.status(403).json({ message: error.message });
    }
    console.error('Chat fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ─── Send a Message (REST Fallback) ──────────────────────────
router.post('/:reservationId/messages', async (req: Request, res: Response) => {
  try {
    const user = getUser(req);
    const reservationId = parseId(req.params.reservationId);

    if (!reservationId) {
      return res.status(400).json({ message: 'Invalid reservation ID' });
    }

    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'メッセージを入力してください' });
    }

    const message = await chatService.createMessage(
      reservationId,
      user.userId,
      content.trim()
    );

    emitMessageUpdate(message, `reservation_${reservationId}`, 'new_message');
    res.status(201).json({ message });
  } catch (error: any) {
    if (isChatAccessError(error)) {
      return res.status(403).json({ message: error.message });
    }
    console.error('Chat send error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ─── Mark Reservation Messages As Read ────────────────────────
router.put('/:reservationId/read', async (req: Request, res: Response) => {
  try {
    const user = getUser(req);
    const reservationId = parseId(req.params.reservationId);

    if (!reservationId) {
      return res.status(400).json({ message: 'Invalid reservation ID' });
    }

    await chatService.markMessagesAsRead(reservationId, user.userId);
    res.json({ success: true });
  } catch (error: any) {
    if (isChatAccessError(error)) {
      return res.status(403).json({ message: error.message });
    }
    console.error('Mark read error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
