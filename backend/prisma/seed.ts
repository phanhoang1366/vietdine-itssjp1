import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  await prisma.chatMessage.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.savedRestaurant.deleteMany();
  await prisma.searchHistory.deleteMany();
  await prisma.review.deleteMany();
  await prisma.promotion.deleteMany();
  await prisma.menu.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();

  console.log('🗑️  Cleared existing data');

  // ─── Roles ──────────────────────────────────────────────────
  const roles = await Promise.all([
    prisma.role.create({ data: { id: 1, name: 'Customer' } }),
    prisma.role.create({ data: { id: 2, name: 'Owner' } }),
    prisma.role.create({ data: { id: 3, name: 'Admin' } }),
  ]);
  console.log('✅ Roles created');

  // ─── Users ──────────────────────────────────────────────────
  const pw = hashSync('password123', 10);

  const customers = await Promise.all([
    prisma.user.create({ data: { fullName: 'Tanaka Yuki', emailPhone: 'customer@vietdine.com', passwordHash: pw, roleId: 1 } }),
    prisma.user.create({ data: { fullName: 'Nguyễn Minh', emailPhone: 'nguyen@vietdine.com', passwordHash: pw, roleId: 1 } }),
    prisma.user.create({ data: { fullName: 'Sato Kenji', emailPhone: 'sato@vietdine.com', passwordHash: pw, roleId: 1 } }),
  ]);

  const owners = await Promise.all([
    prisma.user.create({ data: { fullName: 'Trần Văn Hùng', emailPhone: 'owner1@vietdine.com', passwordHash: pw, roleId: 2 } }),
    prisma.user.create({ data: { fullName: 'Lê Thị Mai', emailPhone: 'owner2@vietdine.com', passwordHash: pw, roleId: 2 } }),
    prisma.user.create({ data: { fullName: 'Phạm Đức Anh', emailPhone: 'owner3@vietdine.com', passwordHash: pw, roleId: 2 } }),
  ]);
  console.log('✅ Users created');

  // ─── Restaurants ────────────────────────────────────────────
  const restaurants = await Promise.all([
    prisma.restaurant.create({
      data: {
        ownerId: owners[0].id, name: 'Phở Thìn Bờ Hồ', address: '13 Lò Đúc, Hai Bà Trưng, Hà Nội',
        latitude: 21.0285, longitude: 105.8542, openingHours: '06:00 - 22:00',
        isClean: true, hasJpMenu: true, hasAirCon: true, hasJpStaff: false,
        maxSeats: 40, categories: 'Phở,Noodles,Vietnamese',
        imageUrl: '/images/pho.png',
      },
    }),
    prisma.restaurant.create({
      data: {
        ownerId: owners[0].id, name: 'Bún Chả Hương Liên', address: '24 Lê Văn Hưu, Hai Bà Trưng, Hà Nội',
        latitude: 21.0190, longitude: 105.8510, openingHours: '10:00 - 21:00',
        isClean: true, hasJpMenu: true, hasAirCon: false, hasJpStaff: true,
        maxSeats: 50, categories: 'Bún Chả,BBQ,Vietnamese',
        imageUrl: '/images/bun_cha.png',
      },
    }),
    prisma.restaurant.create({
      data: {
        ownerId: owners[1].id, name: 'Nhà hàng Sen Tây Hồ', address: '614 Lạc Long Quân, Tây Hồ, Hà Nội',
        latitude: 21.0650, longitude: 105.8180, openingHours: '09:00 - 23:00',
        isClean: true, hasJpMenu: true, hasAirCon: true, hasJpStaff: true,
        maxSeats: 120, categories: 'Fine Dining,Vietnamese,Seafood',
        imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
      },
    }),
    prisma.restaurant.create({
      data: {
        ownerId: owners[1].id, name: 'Quán Ăn Ngon', address: '18 Phan Bội Châu, Hoàn Kiếm, Hà Nội',
        latitude: 21.0265, longitude: 105.8392, openingHours: '07:00 - 22:00',
        isClean: true, hasJpMenu: false, hasAirCon: true, hasJpStaff: false,
        maxSeats: 80, categories: 'Street Food,Vietnamese,Traditional',
        imageUrl: '/images/banh_xeo.png',
      },
    }),
    prisma.restaurant.create({
      data: {
        ownerId: owners[2].id, name: 'Chả Cá Lã Vọng', address: '14 Chả Cá, Hoàn Kiếm, Hà Nội',
        latitude: 21.0340, longitude: 105.8490, openingHours: '11:00 - 21:30',
        isClean: true, hasJpMenu: true, hasAirCon: true, hasJpStaff: false,
        maxSeats: 60, categories: 'Chả Cá,Fish,Vietnamese',
        imageUrl: '/images/cha_ca.png',
      },
    }),
    prisma.restaurant.create({
      data: {
        ownerId: owners[2].id, name: 'Bánh Cuốn Bà Hoành', address: '66 Tô Hiệu, Cầu Giấy, Hà Nội',
        latitude: 21.0380, longitude: 105.7885, openingHours: '06:00 - 14:00',
        isClean: false, hasJpMenu: false, hasAirCon: false, hasJpStaff: false,
        maxSeats: 30, categories: 'Bánh Cuốn,Breakfast,Vietnamese',
        imageUrl: '/images/banh_cuon.png',
      },
    }),
  ]);
  console.log('✅ Restaurants created');

  // ─── Menus ──────────────────────────────────────────────────
  const menuData = [
    // Phở Thìn
    { restaurantId: restaurants[0].id, dishNameVn: 'Phở Bò Tái', dishNameJp: 'レアビーフフォー', ingredients: 'Bánh phở, thịt bò tái, hành', price: 55000, imageUrl: '/images/pho.png' },
    { restaurantId: restaurants[0].id, dishNameVn: 'Phở Bò Chín', dishNameJp: 'ウェルダンビーフフォー', ingredients: 'Bánh phở, thịt bò chín, hành', price: 55000, imageUrl: '/images/pho.png' },
    { restaurantId: restaurants[0].id, dishNameVn: 'Phở Gà', dishNameJp: 'チキンフォー', ingredients: 'Bánh phở, thịt gà, hành', price: 50000, imageUrl: '/images/pho.png' },
    { restaurantId: restaurants[0].id, dishNameVn: 'Phở Đặc Biệt', dishNameJp: 'スペシャルフォー', ingredients: 'Bánh phở, thịt bò tái, chín, gầu, nạm', price: 70000, imageUrl: '/images/pho.png' },
    // Bún Chả
    { restaurantId: restaurants[1].id, dishNameVn: 'Bún Chả Obama', dishNameJp: 'オバマブンチャー', ingredients: 'Bún, chả nướng, nem rán, nước mắm', price: 60000, imageUrl: '/images/bun_cha.png' },
    { restaurantId: restaurants[1].id, dishNameVn: 'Bún Chả Thường', dishNameJp: 'ブンチャー（レギュラー）', ingredients: 'Bún, chả nướng, rau sống, nước mắm', price: 45000, imageUrl: '/images/bun_cha.png' },
    { restaurantId: restaurants[1].id, dishNameVn: 'Nem Rán', dishNameJp: '揚げ春巻き', ingredients: 'Thịt lợn, miến, mộc nhĩ, hành', price: 30000, imageUrl: '/images/bun_cha.png' },
    // Sen Tây Hồ
    { restaurantId: restaurants[2].id, dishNameVn: 'Cá Kho Tộ', dishNameJp: '土鍋煮魚', ingredients: 'Cá, nước mắm, đường, tiêu', price: 120000, imageUrl: '/images/ca_kho.png' },
    { restaurantId: restaurants[2].id, dishNameVn: 'Tôm Hùm Nướng', dishNameJp: 'ロブスターグリル', ingredients: 'Tôm hùm, bơ, tỏi', price: 450000, imageUrl: '/images/tom_hum.png' },
    { restaurantId: restaurants[2].id, dishNameVn: 'Gỏi Cuốn', dishNameJp: '生春巻き', ingredients: 'Bánh tráng, tôm, rau, bún', price: 45000, imageUrl: '/images/goi_cuon.png' },
    { restaurantId: restaurants[2].id, dishNameVn: 'Chè Sen', dishNameJp: '蓮の実スイーツ', ingredients: 'Hạt sen, đường, nước cốt dừa', price: 35000, imageUrl: '/images/che_sen.png' },
    // Quán Ăn Ngon
    { restaurantId: restaurants[3].id, dishNameVn: 'Bánh Xèo', dishNameJp: 'バインセオ', ingredients: 'Bột gạo, tôm, thịt, giá', price: 55000, imageUrl: '/images/banh_xeo.png' },
    { restaurantId: restaurants[3].id, dishNameVn: 'Cơm Tấm', dishNameJp: '砕き米プレート', ingredients: 'Cơm tấm, sườn nướng, bì, chả', price: 50000, imageUrl: '/images/com_tam.png' },
    { restaurantId: restaurants[3].id, dishNameVn: 'Bò Lá Lốt', dishNameJp: 'ロロットリーフ巻きビーフ', ingredients: 'Thịt bò, lá lốt, sả', price: 65000, imageUrl: '/images/bo_la_lot.png' },
    // Chả Cá Lã Vọng
    { restaurantId: restaurants[4].id, dishNameVn: 'Chả Cá Lã Vọng', dishNameJp: 'ラーヴォンチャーカー', ingredients: 'Cá lăng, nghệ, thì là, hành', price: 180000, imageUrl: '/images/cha_ca.png' },
    { restaurantId: restaurants[4].id, dishNameVn: 'Chả Cá Đặc Biệt', dishNameJp: 'スペシャルチャーカー', ingredients: 'Cá lăng, nghệ, thì là, hành, mắm tôm', price: 250000, imageUrl: '/images/cha_ca.png' },
    // Bánh Cuốn
    { restaurantId: restaurants[5].id, dishNameVn: 'Bánh Cuốn Nhân Thịt', dishNameJp: '肉入りバインクオン', ingredients: 'Bột gạo, thịt lợn, mộc nhĩ', price: 35000, imageUrl: '/images/banh_cuon.png' },
    { restaurantId: restaurants[5].id, dishNameVn: 'Bánh Cuốn Trứng', dishNameJp: '卵入りバインクオン', ingredients: 'Bột gạo, trứng', price: 30000, imageUrl: '/images/banh_cuon.png' },
    { restaurantId: restaurants[5].id, dishNameVn: 'Bánh Cuốn Chả', dishNameJp: 'チャー付きバインクオン', ingredients: 'Bột gạo, chả quế', price: 40000, imageUrl: '/images/banh_cuon.png' },
  ];

  await prisma.menu.createMany({ data: menuData });
  console.log('✅ Menus created');

  // ─── Reviews ────────────────────────────────────────────────
  const reviewData = [
    { userId: customers[0].id, restaurantId: restaurants[0].id, rating: 5, comment: 'とても美味しいフォーでした！スープが濃厚で最高です。Phở rất ngon!' },
    { userId: customers[1].id, restaurantId: restaurants[0].id, rating: 4, comment: 'Nước dùng đậm đà, thịt bò tươi. Rất đáng thử!' },
    { userId: customers[2].id, restaurantId: restaurants[0].id, rating: 5, comment: 'Best pho in Hanoi! Will definitely come back.' },
    { userId: customers[0].id, restaurantId: restaurants[1].id, rating: 5, comment: 'オバマ大統領も食べたブンチャー！味は本当に素晴らしい。' },
    { userId: customers[1].id, restaurantId: restaurants[1].id, rating: 4, comment: 'Bún chả ngon, nem rán giòn. Giá cả hợp lý.' },
    { userId: customers[2].id, restaurantId: restaurants[1].id, rating: 5, comment: 'Amazing bun cha! The Obama special is a must-try.' },
    { userId: customers[0].id, restaurantId: restaurants[2].id, rating: 4, comment: 'ロケーションが素晴らしい。西湖の景色を見ながら食事ができます。' },
    { userId: customers[1].id, restaurantId: restaurants[2].id, rating: 5, comment: 'Nhà hàng sang trọng, đồ ăn ngon, view Hồ Tây tuyệt đẹp.' },
    { userId: customers[2].id, restaurantId: restaurants[2].id, rating: 4, comment: 'Great fine dining. The lotus seed dessert is unique.' },
    { userId: customers[0].id, restaurantId: restaurants[3].id, rating: 4, comment: 'ベトナム料理の種類が豊富。バインセオがおすすめ。' },
    { userId: customers[1].id, restaurantId: restaurants[3].id, rating: 5, comment: 'Quán đẹp, nhiều món ngon. Bánh xèo giòn rụm!' },
    { userId: customers[0].id, restaurantId: restaurants[4].id, rating: 5, comment: 'チャーカーの名店！ディルとターメリックの組み合わせが絶妙。' },
    { userId: customers[2].id, restaurantId: restaurants[4].id, rating: 4, comment: 'The original cha ca restaurant. A Hanoi must-visit.' },
    { userId: customers[1].id, restaurantId: restaurants[5].id, rating: 4, comment: 'Bánh cuốn nóng hổi, chấm nước mắm chua ngọt. Tuyệt vời!' },
    { userId: customers[2].id, restaurantId: restaurants[5].id, rating: 3, comment: 'Good banh cuon but seating is limited. Come early.' },
  ];

  await prisma.review.createMany({ data: reviewData });
  console.log('✅ Reviews created');

  // ─── Promotions ─────────────────────────────────────────────
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());

  await prisma.promotion.createMany({
    data: [
      { restaurantId: restaurants[0].id, title: 'ランチタイム割引', description: '11:00-14:00のご注文で10%OFF', discountPercent: 10, startDate: now, endDate: nextMonth, isActive: true },
      { restaurantId: restaurants[1].id, title: 'オバマセット特別価格', description: 'ブンチャーオバマセットが20%OFF', discountPercent: 20, startDate: now, endDate: nextMonth, isActive: true },
      { restaurantId: restaurants[2].id, title: 'ディナーコース割引', description: '4名様以上で15%OFF', discountPercent: 15, startDate: now, endDate: nextMonth, isActive: true },
    ],
  });
  console.log('✅ Promotions created');

  // ─── Saved Restaurants ──────────────────────────────────────
  await prisma.savedRestaurant.createMany({
    data: [
      { userId: customers[0].id, restaurantId: restaurants[0].id },
      { userId: customers[0].id, restaurantId: restaurants[2].id },
      { userId: customers[1].id, restaurantId: restaurants[1].id },
    ],
  });
  console.log('✅ Saved restaurants created');

  console.log('\n🎉 Seeding complete!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📧 Customer accounts:');
  console.log('   customer@vietdine.com / password123');
  console.log('   nguyen@vietdine.com / password123');
  console.log('   sato@vietdine.com / password123');
  console.log('📧 Owner accounts:');
  console.log('   owner1@vietdine.com / password123');
  console.log('   owner2@vietdine.com / password123');
  console.log('   owner3@vietdine.com / password123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
