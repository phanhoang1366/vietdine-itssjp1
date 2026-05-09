import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import * as bookingService from '../services/booking.service';

const router = Router();

// All routes require authentication
router.use(requireAuth);

// ─── Create Reservation ──────────────────────────────────────
router.post('/', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { restaurantId, revDatetime, guestCount } = req.body;

    if (!restaurantId || !revDatetime || !guestCount) {
      return res.status(400).json({
        message: 'レストランID、日時、人数は必須です',
      });
    }

    const reservation = await bookingService.createReservation(
      userId,
      parseInt(restaurantId),
      revDatetime,
      parseInt(guestCount)
    );

    res.status(201).json({ reservation });
  } catch (error: any) {
    if (error.message.includes('予約') || error.message.includes('人数') || error.message.includes('レストラン')) {
      return res.status(400).json({ message: error.message });
    }
    console.error('Booking creation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ─── Get User's Reservations ─────────────────────────────────
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const reservations = await bookingService.getUserReservations(userId);
    res.json({ reservations });
  } catch (error) {
    console.error('Reservations fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ─── Get Single Reservation ─────────────────────────────────
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const roleId = (req as any).user.roleId;
    const reservationId = parseInt(req.params.id);

    if (isNaN(reservationId)) {
      return res.status(400).json({ message: 'Invalid reservation ID' });
    }

    const reservation = await bookingService.getReservationById(
      reservationId,
      userId,
      roleId
    );

    if (!reservation) {
      return res.status(404).json({ message: '予約が見つかりません' });
    }

    res.json({ reservation });
  } catch (error) {
    console.error('Reservation fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ─── Cancel Reservation ──────────────────────────────────────
router.put('/:id/cancel', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const reservationId = parseInt(req.params.id);

    if (isNaN(reservationId)) {
      return res.status(400).json({ message: 'Invalid reservation ID' });
    }

    const cancelled = await bookingService.cancelReservation(reservationId, userId);

    if (!cancelled) {
      return res.status(404).json({ message: '予約が見つかりません' });
    }

    res.json({ reservation: cancelled });
  } catch (error) {
    console.error('Cancel reservation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
