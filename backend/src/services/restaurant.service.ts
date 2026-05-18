import prisma from '../db/prisma';
import { Prisma, ReservationStatus } from '@prisma/client';

export interface SearchRestaurantOptions {
  keyword?: string;
  isClean?: boolean;
  hasJpMenu?: boolean;
  hasAirCon?: boolean;
  hasJpStaff?: boolean;
  lat?: number;
  lng?: number;
  radius?: number; // in kilometers
  page?: number;
  limit?: number;
}

const ACTIVE_RESERVATION_STATUSES = [
  ReservationStatus.Waiting,
  ReservationStatus.Confirmed,
];

const restaurantSearchInclude = {
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
  reviews: {
    select: {
      rating: true,
    },
  },
} satisfies Prisma.RestaurantInclude;

function calculateDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
) {
  const toRadians = (degree: number) => (degree * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

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

export const searchRestaurants = async (options: SearchRestaurantOptions) => {
  const {
    keyword,
    isClean,
    hasJpMenu,
    hasAirCon,
    hasJpStaff,
    lat,
    lng,
    radius = 5,
    page = 1,
    limit = 20,
  } = options;

  const skip = (page - 1) * limit;

  // Basic filters
  const where: Prisma.RestaurantWhereInput = {};

  if (isClean !== undefined) where.isClean = isClean;
  if (hasJpMenu !== undefined) where.hasJpMenu = hasJpMenu;
  if (hasAirCon !== undefined) where.hasAirCon = hasAirCon;
  if (hasJpStaff !== undefined) where.hasJpStaff = hasJpStaff;

  if (keyword) {
    where.OR = [
      { name: { contains: keyword, mode: 'insensitive' } },
      { address: { contains: keyword, mode: 'insensitive' } },
      { menus: { some: { dishNameVn: { contains: keyword, mode: 'insensitive' } } } },
      { menus: { some: { dishNameJp: { contains: keyword, mode: 'insensitive' } } } },
    ];
  }

  if (lat !== undefined && lng !== undefined) {
    const candidates = await prisma.restaurant.findMany({
      where: {
        ...where,
        latitude: { not: null },
        longitude: { not: null },
      },
      include: restaurantSearchInclude,
    });

    const matchingRestaurants = candidates
      .map((restaurant) => ({
        ...restaurant,
        distance: calculateDistanceKm(
          lat,
          lng,
          restaurant.latitude as number,
          restaurant.longitude as number
        ),
      }))
      .filter((restaurant) => restaurant.distance <= radius)
      .sort((a, b) => a.distance - b.distance);

    const total = matchingRestaurants.length;
    const data = await withActiveReservationGuestCounts(
      matchingRestaurants.slice(skip, skip + limit)
    );

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Standard search via Prisma Client
  const [restaurants, total] = await Promise.all([
    prisma.restaurant.findMany({
      where,
      skip,
      take: limit,
      include: restaurantSearchInclude,
      orderBy: { id: 'desc' },
    }),
    prisma.restaurant.count({ where }),
  ]);

  const data = await withActiveReservationGuestCounts(restaurants);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getRestaurantById = async (id: number) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id },
    include: {
      menus: true,
      owner: {
        select: { fullName: true, avatarUrl: true },
      },
      reviews: {
        include: {
          user: { select: { fullName: true, avatarUrl: true } }
        },
        orderBy: { createdAt: 'desc' }
      }
    },
  });

  if (!restaurant) return null;

  const [restaurantWithCounts] = await withActiveReservationGuestCounts([restaurant]);
  return restaurantWithCounts;
};
