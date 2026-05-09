import { Router, Request, Response } from 'express';
import { requireAuth, requireOwner } from '../middleware/auth.middleware';
import * as ownerService from '../services/owner.service';

const router = Router();

// All routes require auth + owner role
router.use(requireAuth, requireOwner);

// ─── Helper: get restaurant or 404 ───────────────────────────
async function getRestaurantOrFail(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const restaurant = await ownerService.getOwnerRestaurant(userId);
  if (!restaurant) {
    res.status(404).json({ message: 'レストランが見つかりません' });
    return null;
  }
  return restaurant;
}

// ─── Dashboard ────────────────────────────────────────────────
router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    const restaurant = await getRestaurantOrFail(req, res);
    if (!restaurant) return;

    const stats = await ownerService.getDashboardStats(restaurant.id);
    res.json({ restaurant, stats });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ─── Restaurant Profile ──────────────────────────────────────
router.get('/restaurant', async (req: Request, res: Response) => {
  try {
    const restaurant = await getRestaurantOrFail(req, res);
    if (!restaurant) return;
    res.json({ restaurant });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/restaurant', async (req: Request, res: Response) => {
  try {
    const restaurant = await getRestaurantOrFail(req, res);
    if (!restaurant) return;

    const updated = await ownerService.updateRestaurantProfile(
      restaurant.id,
      (req as any).user.userId,
      req.body
    );
    res.json({ restaurant: updated });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ─── Menu CRUD ────────────────────────────────────────────────
router.get('/menu', async (req: Request, res: Response) => {
  try {
    const restaurant = await getRestaurantOrFail(req, res);
    if (!restaurant) return;

    const menus = await ownerService.getMenus(restaurant.id);
    res.json({ menus });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/menu', async (req: Request, res: Response) => {
  try {
    const restaurant = await getRestaurantOrFail(req, res);
    if (!restaurant) return;

    const { dishNameVn, dishNameJp, ingredients, imageUrl, price } = req.body;
    if (!dishNameVn || !dishNameJp) {
      return res.status(400).json({ message: '料理名（ベトナム語・日本語）は必須です' });
    }

    const menu = await ownerService.createMenu(restaurant.id, {
      dishNameVn,
      dishNameJp,
      ingredients,
      imageUrl,
      price: price ? parseFloat(price) : undefined,
    });
    res.status(201).json({ menu });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/menu/:id', async (req: Request, res: Response) => {
  try {
    const restaurant = await getRestaurantOrFail(req, res);
    if (!restaurant) return;

    const menuId = parseInt(req.params.id);
    if (isNaN(menuId)) {
      return res.status(400).json({ message: 'Invalid menu ID' });
    }

    const { dishNameVn, dishNameJp, ingredients, imageUrl, price } = req.body;
    const updated = await ownerService.updateMenu(menuId, restaurant.id, {
      dishNameVn,
      dishNameJp,
      ingredients,
      imageUrl,
      price: price !== undefined ? parseFloat(price) : undefined,
    });

    if (!updated) {
      return res.status(404).json({ message: 'メニューが見つかりません' });
    }
    res.json({ menu: updated });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/menu/:id', async (req: Request, res: Response) => {
  try {
    const restaurant = await getRestaurantOrFail(req, res);
    if (!restaurant) return;

    const menuId = parseInt(req.params.id);
    if (isNaN(menuId)) {
      return res.status(400).json({ message: 'Invalid menu ID' });
    }

    const deleted = await ownerService.deleteMenu(menuId, restaurant.id);
    if (!deleted) {
      return res.status(404).json({ message: 'メニューが見つかりません' });
    }
    res.json({ message: '削除しました' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ─── Promotion CRUD ───────────────────────────────────────────
router.get('/promotions', async (req: Request, res: Response) => {
  try {
    const restaurant = await getRestaurantOrFail(req, res);
    if (!restaurant) return;

    const promotions = await ownerService.getPromotions(restaurant.id);
    res.json({ promotions });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/promotions', async (req: Request, res: Response) => {
  try {
    const restaurant = await getRestaurantOrFail(req, res);
    if (!restaurant) return;

    const { title, description, discountPercent, startDate, endDate } = req.body;
    if (!title || !discountPercent || !startDate || !endDate) {
      return res.status(400).json({ message: '必須項目を入力してください' });
    }

    const promotion = await ownerService.createPromotion(restaurant.id, {
      title,
      description,
      discountPercent: parseInt(discountPercent),
      startDate,
      endDate,
    });
    res.status(201).json({ promotion });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/promotions/:id', async (req: Request, res: Response) => {
  try {
    const restaurant = await getRestaurantOrFail(req, res);
    if (!restaurant) return;

    const promoId = parseInt(req.params.id);
    if (isNaN(promoId)) {
      return res.status(400).json({ message: 'Invalid promotion ID' });
    }

    const updated = await ownerService.updatePromotion(promoId, restaurant.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'プロモーションが見つかりません' });
    }
    res.json({ promotion: updated });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/promotions/:id', async (req: Request, res: Response) => {
  try {
    const restaurant = await getRestaurantOrFail(req, res);
    if (!restaurant) return;

    const promoId = parseInt(req.params.id);
    if (isNaN(promoId)) {
      return res.status(400).json({ message: 'Invalid promotion ID' });
    }

    const deleted = await ownerService.deletePromotion(promoId, restaurant.id);
    if (!deleted) {
      return res.status(404).json({ message: 'プロモーションが見つかりません' });
    }
    res.json({ message: '削除しました' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ─── Reservations ─────────────────────────────────────────────
router.get('/reservations', async (req: Request, res: Response) => {
  try {
    const restaurant = await getRestaurantOrFail(req, res);
    if (!restaurant) return;

    const reservations = await ownerService.getReservations(restaurant.id);
    res.json({ reservations });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/reservations/:id', async (req: Request, res: Response) => {
  try {
    const restaurant = await getRestaurantOrFail(req, res);
    if (!restaurant) return;

    const reservationId = parseInt(req.params.id);
    if (isNaN(reservationId)) {
      return res.status(400).json({ message: 'Invalid reservation ID' });
    }

    const { status } = req.body;
    if (!status || !['Confirmed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ message: 'ステータスは「Confirmed」または「Cancelled」のみ' });
    }

    const updated = await ownerService.updateReservationStatus(
      reservationId,
      restaurant.id,
      status
    );
    if (!updated) {
      return res.status(404).json({ message: '予約が見つかりません' });
    }
    res.json({ reservation: updated });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
