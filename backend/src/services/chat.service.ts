import prisma from '../db/prisma';

// ─── Get Messages (Paginated) ─────────────────────────────────
export const getMessages = async (
  reservationId: number,
  cursor?: number,
  limit: number = 50
) => {
  const messages = await prisma.chatMessage.findMany({
    where: { reservationId },
    include: {
      sender: {
        select: { id: true, fullName: true, avatarUrl: true },
      },
    },
    orderBy: { sentAt: 'asc' },
    ...(cursor
      ? {
          cursor: { id: cursor },
          skip: 1,
        }
      : {}),
    take: limit,
  });

  return messages;
};

// ─── Create Message ───────────────────────────────────────────
export const createMessage = async (
  reservationId: number,
  senderId: number,
  content: string
) => {
  // Verify the reservation exists and user has access
  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
    include: {
      restaurant: { select: { ownerId: true } },
    },
  });

  if (!reservation) {
    throw new Error('予約が見つかりません');
  }

  // Only the customer or restaurant owner can send messages
  const isCustomer = reservation.userId === senderId;
  const isOwner = reservation.restaurant.ownerId === senderId;

  if (!isCustomer && !isOwner) {
    throw new Error('このチャットへのアクセス権がありません');
  }

  return prisma.chatMessage.create({
    data: {
      reservationId,
      senderId,
      messageContent: content,
    },
    include: {
      sender: {
        select: { id: true, fullName: true, avatarUrl: true },
      },
    },
  });
};

// ─── Mark Messages As Read ────────────────────────────────────
export const markMessagesAsRead = async (
  reservationId: number,
  userId: number
) => {
  // Mark all messages NOT sent by this user as read
  return prisma.chatMessage.updateMany({
    where: {
      reservationId,
      senderId: { not: userId },
      isRead: false,
    },
    data: { isRead: true },
  });
};

// ─── Get Unread Count ─────────────────────────────────────────
export const getUnreadCount = async (
  reservationId: number,
  userId: number
) => {
  return prisma.chatMessage.count({
    where: {
      reservationId,
      senderId: { not: userId },
      isRead: false,
    },
  });
};
