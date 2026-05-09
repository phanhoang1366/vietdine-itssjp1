import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { 
  getSearchHistories, 
  addSearchHistory, 
  deleteSearchHistory, 
  clearSearchHistory 
} from '../services/search-history.service';

const router = Router();

// GET /api/search-history
router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const session = (req as any).user;
    const histories = await getSearchHistories(session.userId);
    res.json({ data: histories });
  } catch (error) {
    console.error('Error fetching search history:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST /api/search-history
router.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const session = (req as any).user;
    const { keyword } = req.body;

    if (!keyword || typeof keyword !== 'string') {
      return res.status(400).json({ message: 'Keyword is required' });
    }

    const history = await addSearchHistory(session.userId, keyword.trim());
    res.status(201).json({ data: history });
  } catch (error) {
    console.error('Error adding search history:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// DELETE /api/search-history/:id
router.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const session = (req as any).user;
    const id = parseInt(req.params.id, 10);

    await deleteSearchHistory(id, session.userId);
    res.json({ message: 'Search history deleted' });
  } catch (error) {
    console.error('Error deleting search history:', error);
    res.status(400).json({ message: 'Bad Request' });
  }
});

// DELETE /api/search-history
router.delete('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const session = (req as any).user;
    await clearSearchHistory(session.userId);
    res.json({ message: 'All search history cleared' });
  } catch (error) {
    console.error('Error clearing search history:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
