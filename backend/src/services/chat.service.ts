import prisma from '../db/prisma';

const messageInclude = {
  sender: {
    select: { id: true, fullName: true, avatarUrl: true },
  },
};

const directConversationInclude = {
  user: {
    select: { id: true, fullName: true, avatarUrl: true, emailPhone: true },
  },
  restaurant: {
    select: {
      id: true,
      name: true,
      imageUrl: true,
      address: true,
      ownerId: true,
      owner: {
        select: { id: true, fullName: true, avatarUrl: true, emailPhone: true },
      },
    },
  },
  messages: {
    orderBy: { sentAt: 'desc' as const },
    take: 1,
    include: messageInclude,
  },
};

async function getReservationForUser(reservationId: number, userId: number) {
  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
    include: {
      restaurant: { select: { ownerId: true, name: true, imageUrl: true } },
      user: { select: { id: true, fullName: true, avatarUrl: true } },
    },
  });

  if (!reservation) {
    throw new Error('予約が見つかりません');
  }

  const isCustomer = reservation.userId === userId;
  const isOwner = reservation.restaurant.ownerId === userId;

  if (!isCustomer && !isOwner) {
    throw new Error('このチャットへのアクセス権がありません');
  }

  return reservation;
}

async function getDirectConversationForUser(conversationId: number, userId: number) {
  const conversation = await prisma.directConversation.findUnique({
    where: { id: conversationId },
    include: directConversationInclude,
  });

  if (!conversation) {
    throw new Error('会話が見つかりません');
  }

  const isCustomer = conversation.userId === userId;
  const isOwner = conversation.restaurant.ownerId === userId;

  if (!isCustomer && !isOwner) {
    throw new Error('このチャットへのアクセス権がありません');
  }

  return conversation;
}

function getMessageRoom(message: { reservationId: number | null; conversationId: number | null }) {
  if (message.reservationId) return `reservation_${message.reservationId}`;
  if (message.conversationId) return `direct_${message.conversationId}`;
  return null;
}

// ─── Reservation Chat ─────────────────────────────────────────
export const getMessages = async (
  reservationId: number,
  userId: number,
  cursor?: number,
  limit: number = 50
) => {
  await getReservationForUser(reservationId, userId);

  return prisma.chatMessage.findMany({
    where: { reservationId },
    include: messageInclude,
    orderBy: { sentAt: 'asc' },
    ...(cursor
      ? {
          cursor: { id: cursor },
          skip: 1,
        }
      : {}),
    take: limit,
  });
};

export const createMessage = async (
  reservationId: number,
  senderId: number,
  content: string
) => {
  await getReservationForUser(reservationId, senderId);

  return prisma.chatMessage.create({
    data: {
      reservationId,
      senderId,
      messageContent: content,
    },
    include: messageInclude,
  });
};

export const markMessagesAsRead = async (
  reservationId: number,
  userId: number
) => {
  await getReservationForUser(reservationId, userId);

  return prisma.chatMessage.updateMany({
    where: {
      reservationId,
      senderId: { not: userId },
      isRead: false,
    },
    data: { isRead: true },
  });
};

export const getUnreadCount = async (
  reservationId: number,
  userId: number
) => {
  await getReservationForUser(reservationId, userId);

  return prisma.chatMessage.count({
    where: {
      reservationId,
      senderId: { not: userId },
      isRead: false,
    },
  });
};

// ─── Direct Restaurant Chat ───────────────────────────────────
export const getOrCreateDirectConversation = async (
  restaurantId: number,
  userId: number
) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
    select: { id: true, ownerId: true },
  });

  if (!restaurant) {
    throw new Error('レストランが見つかりません');
  }

  if (restaurant.ownerId === userId) {
    throw new Error('自分の店舗には問い合わせできません');
  }

  return prisma.directConversation.upsert({
    where: {
      userId_restaurantId: {
        userId,
        restaurantId,
      },
    },
    update: {},
    create: {
      userId,
      restaurantId,
    },
    include: directConversationInclude,
  });
};

export const getDirectConversation = async (
  conversationId: number,
  userId: number
) => getDirectConversationForUser(conversationId, userId);

export const listDirectConversations = async (userId: number, roleId: number) => {
  const where = roleId === 2
    ? { restaurant: { ownerId: userId } }
    : { userId };

  const conversations = await prisma.directConversation.findMany({
    where,
    include: directConversationInclude,
    orderBy: { updatedAt: 'desc' },
  });

  const unreadCounts = await prisma.chatMessage.groupBy({
    by: ['conversationId'],
    where: {
      conversationId: { in: conversations.map((conversation) => conversation.id) },
      senderId: { not: userId },
      isRead: false,
    },
    _count: { _all: true },
  });

  const unreadByConversation = new Map(
    unreadCounts.map((item) => [item.conversationId, item._count._all])
  );

  return conversations.map((conversation) => ({
    ...conversation,
    unreadCount: unreadByConversation.get(conversation.id) ?? 0,
  }));
};

export const getDirectMessages = async (
  conversationId: number,
  userId: number,
  cursor?: number,
  limit: number = 50
) => {
  await getDirectConversationForUser(conversationId, userId);

  return prisma.chatMessage.findMany({
    where: { conversationId },
    include: messageInclude,
    orderBy: { sentAt: 'asc' },
    ...(cursor
      ? {
          cursor: { id: cursor },
          skip: 1,
        }
      : {}),
    take: limit,
  });
};

export const createDirectMessage = async (
  conversationId: number,
  senderId: number,
  content: string
) => {
  await getDirectConversationForUser(conversationId, senderId);

  return prisma.$transaction(async (tx) => {
    const message = await tx.chatMessage.create({
      data: {
        conversationId,
        senderId,
        messageContent: content,
      },
      include: messageInclude,
    });

    await tx.directConversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    return message;
  });
};

export const markDirectMessagesAsRead = async (
  conversationId: number,
  userId: number
) => {
  await getDirectConversationForUser(conversationId, userId);

  return prisma.chatMessage.updateMany({
    where: {
      conversationId,
      senderId: { not: userId },
      isRead: false,
    },
    data: { isRead: true },
  });
};

// ─── Message Ownership Actions ────────────────────────────────
export const updateOwnMessage = async (
  messageId: number,
  userId: number,
  content: string
) => {
  const message = await prisma.chatMessage.findUnique({
    where: { id: messageId },
  });

  if (!message) {
    throw new Error('メッセージが見つかりません');
  }

  if (message.senderId !== userId) {
    throw new Error('自分のメッセージのみ編集できます');
  }

  if (message.isRetracted) {
    throw new Error('取り消したメッセージは編集できません');
  }

  const updated = await prisma.chatMessage.update({
    where: { id: messageId },
    data: {
      messageContent: content,
      editedAt: new Date(),
    },
    include: messageInclude,
  });

  return {
    message: updated,
    roomName: getMessageRoom(updated),
  };
};

export const retractOwnMessage = async (
  messageId: number,
  userId: number
) => {
  const message = await prisma.chatMessage.findUnique({
    where: { id: messageId },
  });

  if (!message) {
    throw new Error('メッセージが見つかりません');
  }

  if (message.senderId !== userId) {
    throw new Error('自分のメッセージのみ取り消せます');
  }

  const updated = await prisma.chatMessage.update({
    where: { id: messageId },
    data: {
      messageContent: '',
      isRetracted: true,
      editedAt: new Date(),
    },
    include: messageInclude,
  });

  return {
    message: updated,
    roomName: getMessageRoom(updated),
  };
};
