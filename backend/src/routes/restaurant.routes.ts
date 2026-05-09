import { Router, Request, Response } from 'express';
import { searchRestaurants, getRestaurantById } from '../services/restaurant.service';

const router = Router();

// GET /api/restaurants
router.get('/', async (req: Request, res: Response) => {
  try {
    const { 
      q, 
      isClean, 
      hasJpMenu, 
      hasAirCon, 
      hasJpStaff, 
      lat, 
      lng, 
      radius, 
      page, 
      limit 
    } = req.query;

    const options = {
      keyword: q as string,
      isClean: isClean === 'true' ? true : undefined,
      hasJpMenu: hasJpMenu === 'true' ? true : undefined,
      hasAirCon: hasAirCon === 'true' ? true : undefined,
      hasJpStaff: hasJpStaff === 'true' ? true : undefined,
      lat: lat ? parseFloat(lat as string) : undefined,
      lng: lng ? parseFloat(lng as string) : undefined,
      radius: radius ? parseFloat(radius as string) : undefined,
      page: page ? parseInt(page as string, 10) : undefined,
      limit: limit ? parseInt(limit as string, 10) : undefined,
    };

    const result = await searchRestaurants(options);
    res.json(result);
  } catch (error) {
    console.error('Error searching restaurants:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET /api/restaurants/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const restaurant = await getRestaurantById(id);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.json({ data: restaurant });
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
