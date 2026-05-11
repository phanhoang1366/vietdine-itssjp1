import "dotenv/config";
import { PrismaClient, ReservationStatus } from "@prisma/client";
import { hashSync } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // Reset dữ liệu để demo ổn định, restaurant đầu tiên sẽ có id = 1
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE
      "ChatMessages",
      "Reservations",
      "SavedRestaurants",
      "SearchHistories",
      "Reviews",
      "Menus",
      "Restaurants",
      "Users",
      "Roles"
    RESTART IDENTITY CASCADE;
  `);

  // 1. Roles
  const customerRole = await prisma.role.create({
    data: {
      name: "Customer",
    },
  });

  const ownerRole = await prisma.role.create({
    data: {
      name: "Owner",
    },
  });

  const adminRole = await prisma.role.create({
    data: {
      name: "Admin",
    },
  });

  // 2. Users
  const owner = await prisma.user.create({
    data: {
      emailPhone: "owner@gmail.com",
      passwordHash: hashSync("123", 10),
      fullName: "Mock Restaurant Owner",
      roleId: ownerRole.id,
      avatarUrl: "https://i.pravatar.cc/150?img=12",
    },
  });

  const customer1 = await prisma.user.create({
    data: {
      emailPhone: "admin@gmail.com",
      passwordHash: hashSync("123", 10),
      fullName: "Nguyen Van A",
      roleId: customerRole.id,
      avatarUrl: "https://i.pravatar.cc/150?img=3",
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      emailPhone: "customer@gmail.com",
      passwordHash: hashSync("123", 10),
      fullName: "Tran Thi B",
      roleId: customerRole.id,
      avatarUrl: "https://i.pravatar.cc/150?img=5",
    },
  });

  await prisma.user.create({
    data: {
      emailPhone: "admin-user@gmail.com",
      passwordHash: hashSync("123", 10),
      fullName: "System Admin",
      roleId: adminRole.id,
      avatarUrl: "https://i.pravatar.cc/150?img=8",
    },
  });

  // 3. Restaurants
  const restaurant1 = await prisma.restaurant.create({
    data: {
      ownerId: owner.id,
      name: "Sakura Japanese Restaurant",
      address: "123 Kim Ma, Ba Dinh, Hanoi",
      latitude: 21.031,
      longitude: 105.812,
      openingHours: "10:00 - 22:00",
      isClean: true,
      hasJpMenu: true,
      hasAirCon: true,
      hasJpStaff: true,
    },
  });

  const restaurant2 = await prisma.restaurant.create({
    data: {
      ownerId: owner.id,
      name: "Tokyo Ramen House",
      address: "45 Linh Lang, Ba Dinh, Hanoi",
      latitude: 21.034,
      longitude: 105.810,
      openingHours: "09:30 - 21:30",
      isClean: true,
      hasJpMenu: true,
      hasAirCon: true,
      hasJpStaff: false,
    },
  });

  const restaurant3 = await prisma.restaurant.create({
    data: {
      ownerId: owner.id,
      name: "Osaka Sushi Bar",
      address: "88 Nguyen Chi Thanh, Dong Da, Hanoi",
      latitude: 21.023,
      longitude: 105.807,
      openingHours: "11:00 - 23:00",
      isClean: true,
      hasJpMenu: true,
      hasAirCon: true,
      hasJpStaff: true,
    },
  });

  // 4. Menus
  await prisma.menu.createMany({
    data: [
      {
        restaurantId: restaurant1.id,
        dishNameVn: "Set sushi cá hồi",
        dishNameJp: "サーモン寿司セット",
        ingredients: "Cơm Nhật, cá hồi, rong biển, wasabi",
        imageUrl:
          "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80",
      },
      {
        restaurantId: restaurant1.id,
        dishNameVn: "Tempura tôm",
        dishNameJp: "海老天ぷら",
        ingredients: "Tôm, bột tempura, rau củ",
        imageUrl:
          "https://images.unsplash.com/photo-1615361200141-f45040f367be?auto=format&fit=crop&w=800&q=80",
      },
      {
        restaurantId: restaurant1.id,
        dishNameVn: "Cơm cà ri Nhật",
        dishNameJp: "カレーライス",
        ingredients: "Cơm Nhật, cà ri, thịt bò, khoai tây, cà rốt",
        imageUrl:
          "https://images.unsplash.com/photo-1609183480237-ccbb2d7c5772?auto=format&fit=crop&w=800&q=80",
      },
      {
        restaurantId: restaurant2.id,
        dishNameVn: "Mì ramen miso",
        dishNameJp: "味噌ラーメン",
        ingredients: "Mì ramen, súp miso, trứng, thịt heo",
        imageUrl:
          "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
      },
      {
        restaurantId: restaurant2.id,
        dishNameVn: "Gyoza",
        dishNameJp: "餃子",
        ingredients: "Thịt heo, rau, vỏ bánh gyoza",
        imageUrl:
          "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=800&q=80",
      },
      {
        restaurantId: restaurant3.id,
        dishNameVn: "Sashimi tổng hợp",
        dishNameJp: "刺身盛り合わせ",
        ingredients: "Cá hồi, cá ngừ, bạch tuộc, wasabi",
        imageUrl:
          "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?auto=format&fit=crop&w=800&q=80",
      },
    ],
  });

  // 5. Reviews
  await prisma.review.createMany({
    data: [
      {
        userId: customer1.id,
        restaurantId: restaurant1.id,
        rating: 5,
        comment: "料理が美味しく、店内も清潔でした。また来たいです。",
        savedFlag: true,
      },
      {
        userId: customer2.id,
        restaurantId: restaurant1.id,
        rating: 4,
        comment: "Nhân viên thân thiện, đồ ăn ngon, không gian yên tĩnh.",
        savedFlag: false,
      },
      {
        userId: customer1.id,
        restaurantId: restaurant2.id,
        rating: 4,
        comment: "ラーメンの味が本格的でした。",
        savedFlag: true,
      },
      {
        userId: customer2.id,
        restaurantId: restaurant3.id,
        rating: 5,
        comment: "Sashimi rất tươi, phù hợp để đi cùng bạn bè.",
        savedFlag: true,
      },
    ],
  });

  // 6. Saved Restaurants
  await prisma.savedRestaurant.createMany({
    data: [
      {
        userId: customer1.id,
        restaurantId: restaurant1.id,
      },
      {
        userId: customer1.id,
        restaurantId: restaurant2.id,
      },
      {
        userId: customer2.id,
        restaurantId: restaurant3.id,
      },
    ],
  });

  // 7. Search Histories
  await prisma.searchHistory.createMany({
    data: [
      {
        userId: customer1.id,
        keyword: "sushi",
      },
      {
        userId: customer1.id,
        keyword: "ramen",
      },
      {
        userId: customer2.id,
        keyword: "japanese restaurant hanoi",
      },
    ],
  });

  // 8. Reservations
  const reservation1 = await prisma.reservation.create({
    data: {
      userId: customer1.id,
      restaurantId: restaurant1.id,
      revDatetime: new Date("2026-06-01T18:30:00.000Z"),
      guestCount: 2,
      status: ReservationStatus.Waiting,
    },
  });

  const reservation2 = await prisma.reservation.create({
    data: {
      userId: customer2.id,
      restaurantId: restaurant2.id,
      revDatetime: new Date("2026-06-02T12:00:00.000Z"),
      guestCount: 4,
      status: ReservationStatus.Confirmed,
    },
  });

  // 9. Chat Messages
  await prisma.chatMessage.createMany({
    data: [
      {
        reservationId: reservation1.id,
        senderId: customer1.id,
        messageContent: "こんにちは。2名で予約できますか？",
        isRead: true,
      },
      {
        reservationId: reservation1.id,
        senderId: owner.id,
        messageContent: "はい、可能です。ご来店をお待ちしております。",
        isRead: false,
      },
      {
        reservationId: reservation2.id,
        senderId: customer2.id,
        messageContent: "Can I book a table near the window?",
        isRead: true,
      },
    ],
  });

  console.log("Seed completed successfully.");
  console.log("Test accounts:");
  console.log("Owner: owner@gmail.com / 123");
  console.log("Customer: admin@gmail.com / 123");
  console.log("Customer: customer@gmail.com / 123");
  console.log(`Restaurant detail test URL: /restaurant/${restaurant1.id}`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });