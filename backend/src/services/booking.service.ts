import prisma from '../db/prisma';

// ─── Create Reservation ──────────────────────────────────────
export const createReservation = async (
  userId: number,
  restaurantId: number,
  revDatetime: string | Date,
  guestCount: number
) => {
  const dateObj = new Date(revDatetime);

  // Validate: date must be in the future
  if (dateObj <= new Date()) {
    throw new Error('予約日時は未来の日時を指定してください');
  }

  // Validate: guest count must be positive
  if (guestCount < 1) {
    throw new Error('人数は1名以上を指定してください');
  }

  // Check restaurant exists and get maxSeats
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
  });

  if (!restaurant) {
    throw new Error('レストランが見つかりません');
  }

  // Check seat capacity conflict (±2 hours window)
  if (restaurant.maxSeats) {
    const windowStart = new Date(dateObj.getTime() - 2 * 60 * 60 * 1000);
    const windowEnd = new Date(dateObj.getTime() + 2 * 60 * 60 * 1000);

    const overlapping = await prisma.reservation.aggregate({
      where: {
        restaurantId,
        status: { not: 'Cancelled' },
        revDatetime: {
          gte: windowStart,
          lte: windowEnd,
        },
      },
      _sum: { guestCount: true },
    });

    const totalGuests = (overlapping._sum.guestCount || 0) + guestCount;
    if (totalGuests > restaurant.maxSeats) {
      throw new Error(
        `この時間帯の予約可能残数を超えています（最大${restaurant.maxSeats}席）`
      );
    }
  }

  return prisma.reservation.create({
    data: {
      userId,
      restaurantId,
      revDatetime: dateObj,
      guestCount,
      status: 'Waiting',
    },
    include: {
      restaurant: {
        select: { name: true, imageUrl: true, address: true },
      },
    },
  });
};

// ─── Get User's Reservations ─────────────────────────────────
export const getUserReservations = async (userId: number) => {
  const reservations = await prisma.reservation.findMany({
    where: { userId },
    include: {
      restaurant: {
        select: {
          name: true,
          imageUrl: true,
          address: true,
          openingHours: true,
        },
      },
      _count: {
        select: { messages: true },
      },
    },
    orderBy: { revDatetime: 'desc' },
  });

  // Get unread counts for each reservation
  const withUnread = await Promise.all(
    reservations.map(async (r) => {
      const unread = await prisma.chatMessage.count({
        where: {
          reservationId: r.id,
          senderId: { not: userId },
          isRead: false,
        },
      });
      return { ...r, unreadCount: unread };
    })
  );

  return withUnread;
};

// ─── Get Reservation By ID ───────────────────────────────────
export const getReservationById = async (
  reservationId: number,
  userId: number,
  userRole: number
) => {
  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
    include: {
      restaurant: {
        select: {
          id: true,
          name: true,
          imageUrl: true,
          address: true,
          ownerId: true,
        },
      },
      user: {
        select: { id: true, fullName: true, avatarUrl: true },
      },
    },
  });

  if (!reservation) return null;

  // Authorization: user must be the customer or the restaurant owner
  const isCustomer = reservation.userId === userId;
  const isOwner = reservation.restaurant.ownerId === userId;

  if (!isCustomer && !isOwner) return null;

  return reservation;
};

// ─── Cancel Reservation ──────────────────────────────────────
export const cancelReservation = async (
  reservationId: number,
  userId: number
) => {
  const reservation = await prisma.reservation.findFirst({
    where: {
      id: reservationId,
      userId,
      status: { not: 'Cancelled' },
    },
  });

  if (!reservation) return null;

  return prisma.reservation.update({
    where: { id: reservationId },
    data: { status: 'Cancelled' },
    include: {
      restaurant: {
        select: { name: true },
      },
    },
  });
};
