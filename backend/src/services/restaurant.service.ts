import prisma from '../db/prisma';
import { Prisma } from '@prisma/client';

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

  // If geospatial search is required, we use raw query because Prisma lacks native geo filtering without PostGIS.
  if (lat !== undefined && lng !== undefined) {
    // Haversine formula
    const rawRestaurants: any[] = await prisma.$queryRaw`
      SELECT 
        r.*,
        (
          6371 * acos(
            cos(radians(${lat})) * cos(radians(r.latitude)) *
            cos(radians(r.longitude) - radians(${lng})) +
            sin(radians(${lat})) * sin(radians(r.latitude))
          )
        ) AS distance
      FROM "Restaurants" r
      WHERE r.latitude IS NOT NULL 
        AND r.longitude IS NOT NULL
        ${isClean ? Prisma.sql`AND r.is_clean = true` : Prisma.sql``}
        ${hasJpMenu ? Prisma.sql`AND r.has_jp_menu = true` : Prisma.sql``}
        ${hasAirCon ? Prisma.sql`AND r.has_air_con = true` : Prisma.sql``}
        ${hasJpStaff ? Prisma.sql`AND r.has_jp_staff = true` : Prisma.sql``}
        ${keyword ? Prisma.sql`AND (r.res_name ILIKE ${'%' + keyword + '%'} OR r.address ILIKE ${'%' + keyword + '%'})` : Prisma.sql``}
      HAVING (
          6371 * acos(
            cos(radians(${lat})) * cos(radians(r.latitude)) *
            cos(radians(r.longitude) - radians(${lng})) +
            sin(radians(${lat})) * sin(radians(r.latitude))
          )
        ) <= ${radius}
      ORDER BY distance ASC
      LIMIT ${limit}
      OFFSET ${skip};
    `;

    // To get count:
    const countRes: any[] = await prisma.$queryRaw`
      SELECT COUNT(*) as total
      FROM (
        SELECT r.res_id,
        (
          6371 * acos(
            cos(radians(${lat})) * cos(radians(r.latitude)) *
            cos(radians(r.longitude) - radians(${lng})) +
            sin(radians(${lat})) * sin(radians(r.latitude))
          )
        ) AS distance
        FROM "Restaurants" r
        WHERE r.latitude IS NOT NULL 
          AND r.longitude IS NOT NULL
          ${isClean ? Prisma.sql`AND r.is_clean = true` : Prisma.sql``}
          ${hasJpMenu ? Prisma.sql`AND r.has_jp_menu = true` : Prisma.sql``}
          ${hasAirCon ? Prisma.sql`AND r.has_air_con = true` : Prisma.sql``}
          ${hasJpStaff ? Prisma.sql`AND r.has_jp_staff = true` : Prisma.sql``}
          ${keyword ? Prisma.sql`AND (r.res_name ILIKE ${'%' + keyword + '%'} OR r.address ILIKE ${'%' + keyword + '%'})` : Prisma.sql``}
      ) AS geo_query
      WHERE distance <= ${radius}
    `;

    const total = Number(countRes[0]?.total || 0);

    return {
      data: rawRestaurants,
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
      include: {
        menus: { select: { dishNameVn: true, dishNameJp: true, imageUrl: true }, take: 1 },
      },
      orderBy: { id: 'desc' },
    }),
    prisma.restaurant.count({ where }),
  ]);

  return {
    data: restaurants,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getRestaurantById = async (id: number) => {
  return prisma.restaurant.findUnique({
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
};
