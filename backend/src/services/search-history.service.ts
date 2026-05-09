import prisma from '../db/prisma';

export const getSearchHistories = async (userId: number) => {
  return prisma.searchHistory.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });
};

export const addSearchHistory = async (userId: number, keyword: string) => {
  // Optional: check if keyword already exists for this user and just update timestamp
  const existing = await prisma.searchHistory.findFirst({
    where: { userId, keyword },
  });

  if (existing) {
    return prisma.searchHistory.update({
      where: { id: existing.id },
      data: { createdAt: new Date() },
    });
  }

  return prisma.searchHistory.create({
    data: {
      userId,
      keyword,
    },
  });
};

export const deleteSearchHistory = async (id: number, userId: number) => {
  // Ensure the history belongs to the user
  const history = await prisma.searchHistory.findUnique({ where: { id } });
  
  if (!history || history.userId !== userId) {
    throw new Error('Not found or unauthorized');
  }

  return prisma.searchHistory.delete({
    where: { id },
  });
};

export const clearSearchHistory = async (userId: number) => {
  return prisma.searchHistory.deleteMany({
    where: { userId },
  });
};
