import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { toggleSavedRestaurant, getSavedRestaurants, checkSavedStatus } from '../services/saved-restaurant.service';

const router = Router();

// GET /api/saved
// Fetch all saved restaurants for the current user
router.get('/', requireAuth, async (req: Request, res: Response) => {
  const session = (req as any).user;
  try {
    const savedRestaurants = await getSavedRestaurants(session.userId);
    res.json({ data: savedRestaurants });
  } catch (error) {
    console.error('Error fetching saved restaurants:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST /api/saved/:restaurantId
// Toggle save status for a restaurant
router.post('/:restaurantId', requireAuth, async (req: Request, res: Response) => {
  const session = (req as any).user;
  const restaurantId = parseInt(req.params.restaurantId, 10);

  if (isNaN(restaurantId)) {
    return res.status(400).json({ message: 'Invalid restaurant ID' });
  }

  try {
    const result = await toggleSavedRestaurant(session.userId, restaurantId);
    res.json({ message: result.saved ? 'Restaurant saved' : 'Restaurant removed from saved', saved: result.saved });
  } catch (error) {
    console.error('Error toggling saved restaurant:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET /api/saved/:restaurantId/status
// Check if a restaurant is saved by the user
router.get('/:restaurantId/status', requireAuth, async (req: Request, res: Response) => {
  const session = (req as any).user;
  const restaurantId = parseInt(req.params.restaurantId, 10);

  if (isNaN(restaurantId)) {
    return res.status(400).json({ message: 'Invalid restaurant ID' });
  }

  try {
    const isSaved = await checkSavedStatus(session.userId, restaurantId);
    res.json({ saved: isSaved });
  } catch (error) {
    console.error('Error checking save status:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
