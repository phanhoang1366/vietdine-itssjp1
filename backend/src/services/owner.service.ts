import prisma from '../db/prisma';

// ─── Restaurant ───────────────────────────────────────────────

export const getOwnerRestaurant = async (ownerId: number) => {
  return prisma.restaurant.findFirst({
    where: { ownerId },
    include: {
      _count: {
        select: { menus: true, reservations: true, reviews: true },
      },
    },
  });
};

export const updateRestaurantProfile = async (
  restaurantId: number,
  ownerId: number,
  data: {
    name?: string;
    address?: string;
    openingHours?: string;
    imageUrl?: string;
    maxSeats?: number;
    categories?: string;
    isClean?: boolean;
    hasJpMenu?: boolean;
    hasAirCon?: boolean;
    hasJpStaff?: boolean;
  }
) => {
  return prisma.restaurant.update({
    where: { id: restaurantId, ownerId },
    data,
  });
};

// ─── Dashboard Stats ──────────────────────────────────────────

export const getDashboardStats = async (restaurantId: number) => {
  const [totalReservations, avgRating, activePromotion, recentReservations] =
    await Promise.all([
      prisma.reservation.count({ where: { restaurantId } }),
      prisma.review.aggregate({
        where: { restaurantId },
        _avg: { rating: true },
        _count: { rating: true },
      }),
      prisma.promotion.findFirst({
        where: {
          restaurantId,
          isActive: true,
          endDate: { gte: new Date() },
          startDate: { lte: new Date() },
        },
        orderBy: { startDate: 'desc' },
      }),
      prisma.reservation.findMany({
        where: { restaurantId },
        include: {
          user: {
            select: { fullName: true, avatarUrl: true },
          },
        },
        orderBy: { revDatetime: 'desc' },
        take: 5,
      }),
    ]);

  return {
    totalReservations,
    averageRating: avgRating._avg.rating
      ? parseFloat(avgRating._avg.rating.toFixed(1))
      : 0,
    reviewCount: avgRating._count.rating,
    satisfaction: avgRating._avg.rating
      ? Math.round((avgRating._avg.rating / 5) * 100)
      : 0,
    activePromotion,
    recentReservations,
  };
};

// ─── Menu CRUD ────────────────────────────────────────────────

export const getMenus = async (restaurantId: number) => {
  return prisma.menu.findMany({
    where: { restaurantId },
    orderBy: { id: 'asc' },
  });
};

export const createMenu = async (
  restaurantId: number,
  data: {
    dishNameVn: string;
    dishNameJp: string;
    ingredients?: string;
    imageUrl?: string;
    price?: number;
  }
) => {
  return prisma.menu.create({
    data: {
      ...data,
      restaurantId,
    },
  });
};

export const updateMenu = async (
  menuId: number,
  restaurantId: number,
  data: {
    dishNameVn?: string;
    dishNameJp?: string;
    ingredients?: string;
    imageUrl?: string;
    price?: number;
  }
) => {
  // Ensure the menu belongs to the restaurant
  const menu = await prisma.menu.findFirst({
    where: { id: menuId, restaurantId },
  });
  if (!menu) return null;

  return prisma.menu.update({
    where: { id: menuId },
    data,
  });
};

export const deleteMenu = async (menuId: number, restaurantId: number) => {
  const menu = await prisma.menu.findFirst({
    where: { id: menuId, restaurantId },
  });
  if (!menu) return null;

  return prisma.menu.delete({ where: { id: menuId } });
};

// ─── Promotion CRUD ───────────────────────────────────────────

export const getPromotions = async (restaurantId: number) => {
  return prisma.promotion.findMany({
    where: { restaurantId },
    orderBy: { startDate: 'desc' },
  });
};

export const createPromotion = async (
  restaurantId: number,
  data: {
    title: string;
    description?: string;
    discountPercent: number;
    startDate: string | Date;
    endDate: string | Date;
  }
) => {
  return prisma.promotion.create({
    data: {
      ...data,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      restaurantId,
    },
  });
};

export const updatePromotion = async (
  promoId: number,
  restaurantId: number,
  data: {
    title?: string;
    description?: string;
    discountPercent?: number;
    startDate?: string | Date;
    endDate?: string | Date;
    isActive?: boolean;
  }
) => {
  const promo = await prisma.promotion.findFirst({
    where: { id: promoId, restaurantId },
  });
  if (!promo) return null;

  return prisma.promotion.update({
    where: { id: promoId },
    data: {
      ...data,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
    },
  });
};

export const deletePromotion = async (promoId: number, restaurantId: number) => {
  const promo = await prisma.promotion.findFirst({
    where: { id: promoId, restaurantId },
  });
  if (!promo) return null;

  return prisma.promotion.delete({ where: { id: promoId } });
};

// ─── Reservations ─────────────────────────────────────────────

export const getReservations = async (restaurantId: number) => {
  return prisma.reservation.findMany({
    where: { restaurantId },
    include: {
      user: {
        select: { fullName: true, avatarUrl: true },
      },
    },
    orderBy: { revDatetime: 'desc' },
  });
};

export const updateReservationStatus = async (
  reservationId: number,
  restaurantId: number,
  status: 'Confirmed' | 'Cancelled'
) => {
  const reservation = await prisma.reservation.findFirst({
    where: { id: reservationId, restaurantId },
  });
  if (!reservation) return null;

  return prisma.reservation.update({
    where: { id: reservationId },
    data: { status },
    include: {
      user: {
        select: { fullName: true, avatarUrl: true },
      },
    },
  });
};
