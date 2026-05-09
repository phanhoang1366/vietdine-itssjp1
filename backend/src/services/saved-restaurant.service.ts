import prisma from '../db/prisma';

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
          menus: { select: { dishNameVn: true, dishNameJp: true, imageUrl: true }, take: 1 },
          reviews: { select: { rating: true } },
        },
      },
    },
    orderBy: { savedAt: 'desc' },
  });

  return saved.map((s) => s.restaurant);
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
