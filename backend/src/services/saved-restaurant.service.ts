import prisma from '../db/prisma';
import { ReservationStatus } from '@prisma/client';

const ACTIVE_RESERVATION_STATUSES = [
  ReservationStatus.Waiting,
  ReservationStatus.Confirmed,
];

async function withActiveReservationGuestCounts<T extends { id: number }>(
  restaurants: T[]
) {
  if (restaurants.length === 0) return restaurants;

  const activeReservations = await prisma.reservation.groupBy({
    by: ['restaurantId'],
    where: {
      restaurantId: { in: restaurants.map((restaurant) => restaurant.id) },
      status: { in: ACTIVE_RESERVATION_STATUSES },
    },
    _sum: {
      guestCount: true,
    },
  });

  const activeGuestCounts = new Map(
    activeReservations.map((reservation) => [
      reservation.restaurantId,
      reservation._sum.guestCount ?? 0,
    ])
  );

  return restaurants.map((restaurant) => ({
    ...restaurant,
    activeReservationGuestCount: activeGuestCounts.get(restaurant.id) ?? 0,
  }));
}

export const toggleSavedRestaurant = async (userId: number, restaurantId: number) => {
  const existingSave = await prisma.savedRestaurant.findUnique({
    where: {
      userId_restaurantId: {
        userId,
        restaurantId,
      },
    },
  });

  if (existingSave) {
    // Unsave
    await prisma.savedRestaurant.delete({
      where: { id: existingSave.id },
    });
    return { saved: false };
  } else {
    // Save
    await prisma.savedRestaurant.create({
      data: {
        userId,
        restaurantId,
      },
    });
    return { saved: true };
  }
};

export const getSavedRestaurants = async (userId: number) => {
  const saved = await prisma.savedRestaurant.findMany({
    where: { userId },
    include: {
      restaurant: {
        include: {
          menus: {
            select: {
              id: true,
              dishNameVn: true,
              dishNameJp: true,
              imageUrl: true,
              price: true,
            },
            take: 3,
          },
          reviews: { select: { rating: true } },
        },
      },
    },
    orderBy: { savedAt: 'desc' },
  });

  return withActiveReservationGuestCounts(saved.map((s) => s.restaurant));
};

export const checkSavedStatus = async (userId: number, restaurantId: number) => {
  const existingSave = await prisma.savedRestaurant.findUnique({
    where: {
      userId_restaurantId: {
        userId,
        restaurantId,
      },
    },
  });
  return !!existingSave;
};
