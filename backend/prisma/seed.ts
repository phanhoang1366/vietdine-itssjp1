import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcryptjs';

const prisma = new PrismaClient();

type MenuSeed = {
  dishNameVn: string;
  dishNameJp: string;
  ingredients: string;
  price: number;
  imageQuery?: string;
};

type RestaurantSeed = {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  openingHours: string;
  isClean: boolean;
  hasJpMenu: boolean;
  hasAirCon: boolean;
  hasJpStaff: boolean;
  maxSeats: number;
  categories: string;
  imageQuery: string;
  menus: MenuSeed[];
};

// ─── Local Image Mapping ──────────────────────────────────────
// Maps restaurant names to their dedicated local cover image
const restaurantImageMap: Record<string, string> = {
  'Phở Thìn Bờ Hồ': '/images/pho_thin_bo_ho.png',
  'Bún Chả Hương Liên': '/images/bun_cha_huong_lien.png',
  'Nhà hàng Sen Tây Hồ': '/images/nha_hang_sen_tay_ho.png',
  'Quán Ăn Ngon': '/images/quan_an_ngon.png',
  'Chả Cá Lã Vọng': '/images/cha_ca_la_vong.png',
  'Bánh Cuốn Bà Hoành': '/images/banh_cuon_ba_hoanh.png',
  'Bếp Bắc An Nam': '/images/bep_bac_an_nam.png',
  'Cơm Niêu Phố Cổ': '/images/com_nieu_pho_co.png',
  'Gánh Huế Hàng Bông': '/images/ganh_hue_hang_bong.png',
  'Mì Quảng Hội An': '/images/mi_quang_hoi_an.png',
  'Cơm Gà Tam Kỳ': '/images/com_ga_tam_ky.png',
  'Hải Sản Cửa Lò': '/images/hai_san_cua_lo.png',
  'Lẩu Nấm Đà Lạt': '/images/lau_nam_da_lat.png',
  'Bánh Mì Saigon Station': '/images/banh_mi_saigon.png',
  'Chay Sen Xanh': '/images/chay_sen_xanh.png',
  'Bò Tơ Tây Ninh': '/images/bo_to_tay_ninh.png',
  'Lẩu Riêu Đồng': '/images/lau_rieu_dong.png',
  'Bún Bò Mệ Kéo': '/images/bun_bo_me_keo.png',
  'Nem Nướng Nha Trang': '/images/nem_nuong_nha_trang.png',
  'Bánh Canh Cua Gia Định': '/images/banh_canh_cua_gia_dinh.png',
  'Ốc Đêm Hồ Tây': '/images/oc_dem_ho_tay.png',
  'Cà Phê Trứng Phố Cổ': '/images/ca_phe_trung_pho_co.png',
  'Xôi Yến Nhà Xưa': '/images/xoi_yen_nha_xua.png',
  'Cháo Sườn Sụn': '/images/chao_suon_sun.png',
  'Bếp Mẹt Tây Bắc': '/images/bep_met_tay_bac.png',
  'Dê Núi Ninh Bình': '/images/de_nui_ninh_binh.png',
  'Vịt Cỏ Vân Đình': '/images/vit_co_van_dinh.png',
  'Gà Mạnh Hoạch': '/images/ga_manh_hoach.png',
  'Bún Đậu Hàng Khay': '/images/bun_dau_hang_khay.png',
  'Lẩu Thái Việt': '/images/lau_thai_viet.png',
  'Nướng Than Mộc': '/images/nuong_than_moc.png',
  'Bún Cá Hải Phòng': '/images/bun_ca_hai_phong.png',
  'Miến Lươn Nghệ An': '/images/mien_luon_nghe_an.png',
  'Hủ Tiếu Nam Vang': '/images/hu_tieu_nam_vang.png',
  'Bún Mắm Miền Tây': '/images/bun_mam_mien_tay.png',
  'Cơm Tấm Sài Gòn': '/images/com_tam_saigon.png',
  'Bánh Xèo Miền Trung': '/images/banh_xeo_mien_trung.png',
  'Gỏi Cuốn Kitchen': '/images/goi_cuon.png',
  'Phở Gà Tràng An': '/images/pho_ga_trang_an.png',
  'Bún Thang Hà Thành': '/images/bun_thang_ha_thanh.png',
  'Cơm Nhà Láng Hạ': '/images/com_nha_lang_ha.png',
  'Lẩu Bò Ba Toa': '/images/lau_bo_ba_toa.png',
};

// Maps dish keywords to the closest matching local image
function dishImage(dishName: string): string {
  const name = dishName.toLowerCase();
  // Phở / noodle soup
  if (name.includes('phở') || name.includes('pho')) return '/images/pho.png';
  // Bún chả / grilled pork
  if (name.includes('bún chả') || name.includes('chả nướng')) return '/images/bun_cha.png';
  // Bún bò / Huế noodles
  if (name.includes('bún bò') || name.includes('bún huế')) return '/images/ganh_hue_hang_bong.png';
  // Bún riêu / crab noodles
  if (name.includes('bún riêu') || name.includes('riêu')) return '/images/lau_rieu_dong.png';
  // Bún cá / fish noodles
  if (name.includes('bún cá') || name.includes('bánh đa cá')) return '/images/cha_ca.png';
  // Bún mắm
  if (name.includes('bún mắm')) return '/images/lau_rieu_dong.png';
  // Bún thang
  if (name.includes('bún thang')) return '/images/pho.png';
  // Bún đậu
  if (name.includes('bún đậu') || name.includes('đậu rán') || name.includes('đậu mơ')) return '/images/bun_cha.png';
  // Mì quảng
  if (name.includes('mì quảng')) return '/images/mi_quang_hoi_an.png';
  // Cao lầu
  if (name.includes('cao lầu')) return '/images/mi_quang_hoi_an.png';
  // Miến / glass noodles
  if (name.includes('miến')) return '/images/pho.png';
  // Hủ tiếu
  if (name.includes('hủ tiếu')) return '/images/pho.png';
  // Bánh canh
  if (name.includes('bánh canh')) return '/images/pho.png';
  // Cháo / porridge
  if (name.includes('cháo')) return '/images/pho.png';
  // Súp / soup
  if (name.includes('súp') || name.includes('canh')) return '/images/pho.png';
  // Bánh cuốn
  if (name.includes('bánh cuốn')) return '/images/banh_cuon.png';
  // Bánh xèo / bánh khọt
  if (name.includes('bánh xèo') || name.includes('bánh khọt')) return '/images/banh_xeo.png';
  // Bánh mì
  if (name.includes('bánh mì')) return '/images/banh_mi_saigon.png';
  // Bánh bèo / bánh nậm / bánh lọc
  if (name.includes('bánh bèo') || name.includes('bánh nậm') || name.includes('bánh lọc')) return '/images/ganh_hue_hang_bong.png';
  // Bánh flan
  if (name.includes('bánh flan') || name.includes('bánh chuối')) return '/images/che_sen.png';
  // Bánh giò / bánh mướt / bánh căn / bánh đập
  if (name.includes('bánh giò') || name.includes('bánh mướt') || name.includes('bánh căn') || name.includes('bánh đập')) return '/images/banh_cuon.png';
  // Nem / spring rolls
  if (name.includes('nem') || name.includes('chả giò') || name.includes('chả ram')) return '/images/goi_cuon.png';
  // Gỏi cuốn / fresh rolls
  if (name.includes('gỏi cuốn') || name.includes('cuốn')) return '/images/goi_cuon.png';
  // Gỏi / salad
  if (name.includes('gỏi') || name.includes('nộm') || name.includes('salad')) return '/images/goi_cuon.png';
  // Chả cá / cha ca
  if (name.includes('chả cá') || name.includes('cá lăng') || name.includes('cá chiên')) return '/images/cha_ca.png';
  // Cá kho / braised fish
  if (name.includes('cá kho') || name.includes('cá bống') || name.includes('cá basa') || name.includes('cá thu')) return '/images/ca_kho.png';
  // Cá nướng / grilled fish
  if (name.includes('cá nướng') || name.includes('cá rô') || name.includes('cá suối')) return '/images/cha_ca.png';
  // Tôm / shrimp
  if (name.includes('tôm hùm')) return '/images/tom_hum.png';
  if (name.includes('tôm')) return '/images/hai_san_cua_lo.png';
  // Cua / crab
  if (name.includes('cua') && !name.includes('dưa cua')) return '/images/hai_san_cua_lo.png';
  // Hải sản / seafood
  if (name.includes('mực') || name.includes('ghẹ') || name.includes('ngao') || name.includes('hàu') || name.includes('sò') || name.includes('ốc') || name.includes('sứa')) return '/images/hai_san_cua_lo.png';
  // Lẩu / hotpot
  if (name.includes('lẩu')) return '/images/lau_rieu_dong.png';
  // Bò / beef
  if (name.includes('bò') || name.includes('bê')) return '/images/bo_la_lot.png';
  // Bò nướng / grilled beef  
  if (name.includes('bò nướng') || name.includes('bò cuộn')) return '/images/bo_to_tay_ninh.png';
  // Dê / goat
  if (name.includes('dê')) return '/images/bo_to_tay_ninh.png';
  // Vịt / duck
  if (name.includes('vịt')) return '/images/com_ga_tam_ky.png';
  // Gà / chicken
  if (name.includes('gà')) return '/images/com_ga_tam_ky.png';
  // Lợn / lươn / pork / eel
  if (name.includes('lợn') || name.includes('lươn')) return '/images/bun_cha.png';
  // Sườn / ribs
  if (name.includes('sườn')) return '/images/bun_cha.png';
  // Thịt / meat general
  if (name.includes('thịt')) return '/images/bun_cha.png';
  // Cơm / rice dishes
  if (name.includes('cơm tấm') || name.includes('cơm gà') || name.includes('cơm chiên') || name.includes('cơm rang') || name.includes('cơm thịt') || name.includes('cơm sen')) return '/images/com_tam.png';
  if (name.includes('cơm niêu') || name.includes('cơm cháy') || name.includes('cơm gạo') || name.includes('cơm nhà')) return '/images/com_nieu_pho_co.png';
  if (name.includes('cơm lam')) return '/images/com_nieu_pho_co.png';
  // Xôi / sticky rice
  if (name.includes('xôi')) return '/images/com_tam.png';
  // Nấm / mushroom
  if (name.includes('nấm') || name.includes('đậu hũ') || name.includes('đậu phụ')) return '/images/lau_nam_da_lat.png';
  // Chay / vegetarian
  if (name.includes('chay')) return '/images/chay_sen_xanh.png';
  // Chè / dessert
  if (name.includes('chè') || name.includes('sữa chua') || name.includes('mè xửng')) return '/images/che_sen.png';
  // Cà phê / coffee / drinks
  if (name.includes('cà phê') || name.includes('bạc xỉu') || name.includes('cacao')) return '/images/cafe.png';
  // Trà / tea / drinks
  if (name.includes('trà') || name.includes('nước') || name.includes('sữa đậu') || name.includes('sữa bắp') || name.includes('sữa ngô') || name.includes('sấu') || name.includes('sâm')) return '/images/cafe.png';
  // Croissant / bakery
  if (name.includes('croissant') || name.includes('quẩy') || name.includes('bánh quẩy')) return '/images/banh_mi_saigon.png';
  // Ba chỉ nướng / BBQ
  if (name.includes('nướng') || name.includes('xiên') || name.includes('than')) return '/images/bo_to_tay_ninh.png';
  // Rau / vegetables
  if (name.includes('rau') || name.includes('khoai') || name.includes('đậu bắp') || name.includes('măng')) return '/images/chay_sen_xanh.png';
  // Dưa / pickles
  if (name.includes('dưa') || name.includes('đồ chua')) return '/images/goi_cuon.png';
  // Ruốc / dried meat
  if (name.includes('ruốc') || name.includes('pate')) return '/images/banh_mi_saigon.png';
  // Trứng / egg
  if (name.includes('trứng') || name.includes('cút lộn')) return '/images/banh_xeo.png';
  // Chân gà
  if (name.includes('chân gà')) return '/images/bun_cha.png';
  // Giò / chả
  if (name.includes('giò') || name.includes('chả') || name.includes('dồi')) return '/images/bun_cha.png';
  // Lòng / innards
  if (name.includes('lòng') || name.includes('gan')) return '/images/bun_cha.png';
  // Default fallback
  return '/images/traditional.png';
}

// Restaurant image: look up dedicated image or fallback to category-based
function restaurantImage(name: string, _query: string): string {
  return restaurantImageMap[name] || '/images/traditional.png';
}

// Food/dish image: smart keyword matching to local images
const foodImage = (dishName: string, _query?: string): string => dishImage(dishName);

function dishes(items: Array<[string, string, number, string?]>): MenuSeed[] {
  return items.map(([dishNameVn, ingredients, price, imageQuery]) => ({
    dishNameVn,
    dishNameJp: dishNameVn,
    ingredients,
    price,
    imageQuery,
  }));
}

type RestaurantUpsertData = Omit<RestaurantSeed, 'imageQuery' | 'menus'> & {
  ownerId: number;
  imageUrl: string;
};

async function upsertRestaurant(data: RestaurantUpsertData) {
  const existingRestaurant = await prisma.restaurant.findFirst({
    where: { name: data.name },
  });

  if (existingRestaurant) {
    return prisma.restaurant.update({
      where: { id: existingRestaurant.id },
      data,
    });
  }

  return prisma.restaurant.create({ data });
}

const additionalRestaurantSeeds: RestaurantSeed[] = [
  {
    name: 'Bếp Bắc An Nam',
    address: '35 Nguyễn Hữu Huân, Hoàn Kiếm, Hà Nội',
    latitude: 21.0348,
    longitude: 105.8531,
    openingHours: '09:00 - 22:00',
    isClean: true,
    hasJpMenu: true,
    hasAirCon: true,
    hasJpStaff: false,
    maxSeats: 58,
    categories: 'Home Cooking,Northern,Vietnamese',
    imageQuery: 'northern vietnamese home cooking',
    menus: dishes([
      ['Canh Cua Rau Đay', 'Cua đồng, rau đay, mướp hương, mồng tơi', 68000],
      ['Cà Pháo Mắm Tôm', 'Cà pháo muối, mắm tôm, chanh, ớt', 35000],
      ['Thịt Rang Cháy Cạnh', 'Thịt ba chỉ, hành khô, nước mắm, tiêu', 95000],
      ['Đậu Phụ Sốt Cà', 'Đậu phụ non, cà chua, hành lá', 52000],
      ['Cá Rô Đồng Chiên Giòn', 'Cá rô đồng, bột nghệ, nước mắm gừng', 110000],
      ['Dưa Cải Xào Tóp Mỡ', 'Dưa cải chua, tóp mỡ, tỏi phi', 58000],
      ['Cơm Gạo Tám', 'Gạo tám thơm, muối vừng, hành phi', 25000],
      ['Chè Kho', 'Đậu xanh, đường thốt nốt, mè rang', 42000],
    ]),
  },
  {
    name: 'Cơm Niêu Phố Cổ',
    address: '12 Hàng Bạc, Hoàn Kiếm, Hà Nội',
    latitude: 21.0342,
    longitude: 105.8526,
    openingHours: '10:00 - 22:30',
    isClean: true,
    hasJpMenu: true,
    hasAirCon: true,
    hasJpStaff: true,
    maxSeats: 72,
    categories: 'Rice Pot,Family,Vietnamese',
    imageQuery: 'clay pot rice vietnam',
    menus: dishes([
      ['Cá Bống Kho Tiêu', 'Cá bống, tiêu xanh, nước màu, hành tím', 115000],
      ['Sườn Rim Mật Mía', 'Sườn non, mật mía, tỏi, tiêu đen', 138000],
      ['Rau Muống Xào Tỏi', 'Rau muống, tỏi ta, dầu hào', 62000],
      ['Canh Chua Cá Lóc', 'Cá lóc, dứa, bạc hà, cà chua, me', 128000],
      ['Thịt Luộc Mắm Tép', 'Thịt ba chỉ, mắm tép chưng, rau thơm', 98000],
      ['Tôm Rang Muối', 'Tôm đất, muối hạt, lá chanh', 155000],
      ['Cơm Niêu Cháy', 'Cơm niêu, gạo dẻo, cháy giòn', 45000],
      ['Dưa Góp Nhà Làm', 'Đu đủ, cà rốt, su hào, giấm gạo', 36000],
    ]),
  },
  {
    name: 'Gánh Huế Hàng Bông',
    address: '88 Hàng Bông, Hoàn Kiếm, Hà Nội',
    latitude: 21.0306,
    longitude: 105.8461,
    openingHours: '07:00 - 21:30',
    isClean: true,
    hasJpMenu: true,
    hasAirCon: false,
    hasJpStaff: false,
    maxSeats: 46,
    categories: 'Hue,Noodles,Central',
    imageQuery: 'hue cuisine vietnam',
    menus: dishes([
      ['Bún Bò Huế', 'Bún sợi to, bắp bò, giò heo, sả, mắm ruốc', 78000],
      ['Bánh Bèo Chén', 'Bột gạo, tôm chấy, mỡ hành, nước mắm', 52000],
      ['Bánh Nậm', 'Bột gạo, tôm thịt, lá chuối', 48000],
      ['Bánh Lọc Tôm', 'Bột lọc, tôm, thịt ba chỉ, hành phi', 50000],
      ['Cơm Hến', 'Cơm nguội, hến xào, tóp mỡ, rau thơm', 65000],
      ['Nem Lụi Huế', 'Thịt heo xay, sả cây, bánh tráng, rau sống', 92000],
      ['Chè Bột Lọc Heo Quay', 'Bột lọc, heo quay, gừng, đường phèn', 45000],
      ['Mè Xửng', 'Mè rang, mạch nha, đậu phộng', 38000],
    ]),
  },
  {
    name: 'Mì Quảng Hội An',
    address: '21 Phan Chu Trinh, Hoàn Kiếm, Hà Nội',
    latitude: 21.0252,
    longitude: 105.8523,
    openingHours: '08:00 - 22:00',
    isClean: true,
    hasJpMenu: false,
    hasAirCon: true,
    hasJpStaff: false,
    maxSeats: 54,
    categories: 'Hoi An,Noodles,Central',
    imageQuery: 'mi quang hoi an',
    menus: dishes([
      ['Mì Quảng Gà', 'Mì Quảng, gà ta, đậu phộng, bánh tráng mè', 72000],
      ['Mì Quảng Tôm Thịt', 'Mì Quảng, tôm, thịt heo, nước dùng nghệ', 82000],
      ['Cao Lầu', 'Sợi cao lầu, xá xíu, rau Trà Quế, tóp mỡ', 76000],
      ['Hoành Thánh Chiên', 'Vỏ hoành thánh, thịt xay, sốt cà chua', 58000],
      ['Bánh Đập Hến Xào', 'Bánh tráng, bánh ướt, hến, hành phi', 66000],
      ['Gỏi Mít Non', 'Mít non, tôm thịt, rau răm, đậu phộng', 62000],
      ['Ram Cuốn Cải', 'Ram giòn, cải xanh, đồ chua, nước chấm', 68000],
      ['Chè Bắp Hội An', 'Bắp nếp, nước cốt dừa, lá dứa', 39000],
    ]),
  },
  {
    name: 'Cơm Gà Tam Kỳ',
    address: '15 Tô Tịch, Hoàn Kiếm, Hà Nội',
    latitude: 21.0321,
    longitude: 105.8496,
    openingHours: '09:30 - 21:30',
    isClean: true,
    hasJpMenu: true,
    hasAirCon: true,
    hasJpStaff: false,
    maxSeats: 50,
    categories: 'Chicken,Rice,Central',
    imageQuery: 'vietnamese chicken rice',
    menus: dishes([
      ['Cơm Gà Xé', 'Gà ta xé, cơm nghệ, hành tây, rau răm', 72000],
      ['Cơm Gà Quay', 'Gà quay da giòn, cơm nghệ, nước sốt gà', 88000],
      ['Gỏi Gà Hành Tây', 'Gà xé, hành tây, rau răm, chanh', 78000],
      ['Cháo Gà Đậu Xanh', 'Gạo rang, gà ta, đậu xanh, tiêu', 58000],
      ['Miến Gà', 'Miến dong, gà ta, nấm hương, hành lá', 68000],
      ['Lòng Gà Xào Nghệ', 'Lòng gà, nghệ tươi, hành tây, rau răm', 72000],
      ['Canh Gà Lá Giang', 'Gà ta, lá giang, rau om, ớt', 95000],
      ['Sữa Bắp', 'Bắp nếp, sữa tươi, đường phèn', 35000],
    ]),
  },
  {
    name: 'Hải Sản Cửa Lò',
    address: '9 Trích Sài, Tây Hồ, Hà Nội',
    latitude: 21.0559,
    longitude: 105.8174,
    openingHours: '10:30 - 23:00',
    isClean: true,
    hasJpMenu: true,
    hasAirCon: true,
    hasJpStaff: true,
    maxSeats: 96,
    categories: 'Seafood,Hotpot,Vietnamese',
    imageQuery: 'vietnamese seafood table',
    menus: dishes([
      ['Mực Hấp Gừng', 'Mực tươi, gừng, hành lá, nước mắm gừng', 168000],
      ['Ghẹ Rang Me', 'Ghẹ xanh, sốt me, tỏi, ớt', 245000],
      ['Tôm Sú Nướng Muối Ớt', 'Tôm sú, muối hột, ớt xanh, chanh', 220000],
      ['Cá Thu Sốt Cà', 'Cá thu, cà chua, thì là, hành lá', 155000],
      ['Ngao Hấp Sả', 'Ngao trắng, sả, lá chanh, ớt', 98000],
      ['Cháo Hàu', 'Hàu sữa, gạo thơm, hành phi, tiêu', 89000],
      ['Sò Điệp Mỡ Hành', 'Sò điệp, mỡ hành, đậu phộng', 135000],
      ['Lẩu Hải Sản Chua Cay', 'Tôm, mực, cá, ngao, rau nhúng, bún', 360000],
    ]),
  },
  {
    name: 'Lẩu Nấm Đà Lạt',
    address: '42 Xuân Diệu, Tây Hồ, Hà Nội',
    latitude: 21.0616,
    longitude: 105.8272,
    openingHours: '10:00 - 22:00',
    isClean: true,
    hasJpMenu: true,
    hasAirCon: true,
    hasJpStaff: false,
    maxSeats: 64,
    categories: 'Hotpot,Vegetables,Dalat',
    imageQuery: 'mushroom hotpot vietnam',
    menus: dishes([
      ['Lẩu Nấm Thập Cẩm', 'Nấm đùi gà, nấm hương, nấm kim châm, nước dùng rau củ', 260000],
      ['Nấm Đùi Gà Áp Chảo', 'Nấm đùi gà, bơ tỏi, tiêu đen', 88000],
      ['Salad Atiso', 'Atiso non, rau mầm, sốt mè rang', 76000],
      ['Gà Hấp Lá Chanh', 'Gà ta, lá chanh, muối tiêu chanh', 145000],
      ['Đậu Hũ Sốt Nấm', 'Đậu hũ non, nấm hương, sốt xì dầu', 82000],
      ['Cơm Chiên Rau Củ', 'Cơm, cà rốt, đậu Hà Lan, bắp, nấm', 72000],
      ['Khoai Lang Mật Nướng', 'Khoai lang mật Đà Lạt, bơ lạt', 58000],
      ['Trà Atiso Đỏ', 'Atiso đỏ, mật ong, chanh vàng', 42000],
    ]),
  },
  {
    name: 'Bánh Mì Saigon Station',
    address: '5 Lý Quốc Sư, Hoàn Kiếm, Hà Nội',
    latitude: 21.0314,
    longitude: 105.8492,
    openingHours: '06:30 - 21:00',
    isClean: true,
    hasJpMenu: false,
    hasAirCon: false,
    hasJpStaff: false,
    maxSeats: 28,
    categories: 'Banh Mi,Street Food,Sai Gon',
    imageQuery: 'banh mi vietnam sandwich',
    menus: dishes([
      ['Bánh Mì Đặc Biệt', 'Pate, chả lụa, jambon, xá xíu, đồ chua', 48000],
      ['Bánh Mì Xíu Mại', 'Xíu mại sốt cà, pate, rau thơm', 46000],
      ['Bánh Mì Gà Xé', 'Gà xé, sốt bơ trứng, dưa leo, rau răm', 45000],
      ['Bánh Mì Chảo', 'Trứng, pate, xúc xích, xíu mại, bánh mì nóng', 72000],
      ['Bò Kho Bánh Mì', 'Bò hầm, cà rốt, sả, bánh mì giòn', 82000],
      ['Pate Gan Nhà Làm', 'Gan heo, bơ, tiêu, bánh mì nướng', 52000],
      ['Gỏi Đu Đủ Bò Khô', 'Đu đủ xanh, bò khô, rau răm, đậu phộng', 56000],
      ['Sữa Đậu Phộng', 'Đậu phộng rang, sữa tươi, đường phèn', 35000],
    ]),
  },
  {
    name: 'Chay Sen Xanh',
    address: '18 Ngõ Huế, Hai Bà Trưng, Hà Nội',
    latitude: 21.0187,
    longitude: 105.8489,
    openingHours: '09:00 - 21:30',
    isClean: true,
    hasJpMenu: true,
    hasAirCon: true,
    hasJpStaff: true,
    maxSeats: 62,
    categories: 'Vegetarian,Vegan,Vietnamese',
    imageQuery: 'vietnamese vegetarian food',
    menus: dishes([
      ['Cơm Sen Chay', 'Cơm gạo lứt, hạt sen, nấm, rau củ', 82000],
      ['Bún Huế Chay', 'Bún, nấm, đậu hũ, sả, mắm chay', 68000],
      ['Gỏi Cuốn Nấm', 'Bánh tráng, nấm áp chảo, rau thơm, bún', 56000],
      ['Đậu Hũ Non Sốt Tương', 'Đậu hũ non, tương nấm, hành boa rô', 64000],
      ['Nấm Kho Tiêu', 'Nấm rơm, tiêu xanh, nước tương, dừa tươi', 78000],
      ['Lẩu Chay Thanh Đạm', 'Nước dùng rau củ, nấm, đậu hũ, rau xanh', 230000],
      ['Chả Giò Rau Củ', 'Khoai môn, miến, cà rốt, nấm mèo', 62000],
      ['Chè Hạt Sen', 'Hạt sen, nhãn nhục, đường phèn', 42000],
    ]),
  },
  {
    name: 'Bò Tơ Tây Ninh',
    address: '67 Nguyễn Chí Thanh, Đống Đa, Hà Nội',
    latitude: 21.0229,
    longitude: 105.8087,
    openingHours: '10:00 - 22:30',
    isClean: true,
    hasJpMenu: false,
    hasAirCon: true,
    hasJpStaff: false,
    maxSeats: 88,
    categories: 'Beef,Grill,Southern',
    imageQuery: 'vietnamese grilled beef',
    menus: dishes([
      ['Bò Tơ Cuốn Bánh Tráng', 'Bò tơ luộc, bánh tráng, rau rừng, mắm nêm', 155000],
      ['Bò Nướng Lá Lốt', 'Thịt bò, lá lốt, sả, đậu phộng', 98000],
      ['Lẩu Bò Nhúng Giấm', 'Bắp bò, giấm gạo, dứa, hành tây', 285000],
      ['Gân Bò Xào Sa Tế', 'Gân bò, sa tế, hành tây, cần tàu', 128000],
      ['Bê Tái Chanh', 'Bê tơ, chanh, hành phi, rau răm', 135000],
      ['Bò Hấp Gừng', 'Bắp bò, gừng, sả, mắm gừng', 145000],
      ['Cháo Bò Đậu Xanh', 'Gạo, đậu xanh, bò băm, tiêu', 68000],
      ['Rau Rừng Chấm Mắm Nêm', 'Rau rừng, chuối chát, khế, mắm nêm', 56000],
    ]),
  },
  {
    name: 'Lẩu Riêu Đồng',
    address: '104 Bà Triệu, Hai Bà Trưng, Hà Nội',
    latitude: 21.0182,
    longitude: 105.8495,
    openingHours: '10:00 - 22:00',
    isClean: true,
    hasJpMenu: true,
    hasAirCon: true,
    hasJpStaff: false,
    maxSeats: 70,
    categories: 'Hotpot,Crab,Northern',
    imageQuery: 'bun rieu hotpot vietnam',
    menus: dishes([
      ['Lẩu Riêu Cua Bắp Bò', 'Cua đồng, bắp bò, cà chua, đậu phụ, rau nhúng', 295000],
      ['Bún Riêu Ốc', 'Bún, riêu cua, ốc, cà chua, mắm tôm', 72000],
      ['Chả Cua Lá Lốt', 'Thịt cua, lá lốt, thịt heo, tiêu', 98000],
      ['Đậu Rán Mắm Tôm', 'Đậu mơ, mắm tôm, kinh giới', 48000],
      ['Giò Tai Cuốn', 'Giò tai, bánh tráng, rau sống, nước chấm', 82000],
      ['Ốc Om Chuối Đậu', 'Ốc nhồi, chuối xanh, đậu phụ, tía tô', 135000],
      ['Rau Nhúng Đồng Quê', 'Rau muống, hoa chuối, kinh giới, tía tô', 45000],
      ['Sấu Đá', 'Sấu ngâm, đường, gừng, đá viên', 32000],
    ]),
  },
  {
    name: 'Bún Bò Mệ Kéo',
    address: '72 Trần Quốc Toản, Hoàn Kiếm, Hà Nội',
    latitude: 21.0221,
    longitude: 105.8491,
    openingHours: '06:30 - 21:00',
    isClean: true,
    hasJpMenu: true,
    hasAirCon: false,
    hasJpStaff: false,
    maxSeats: 42,
    categories: 'Bun Bo,Hue,Noodles',
    imageQuery: 'bun bo hue bowl',
    menus: dishes([
      ['Bún Bò Tái', 'Bún, bò tái, nước dùng sả, rau thơm', 68000],
      ['Bún Bò Giò Heo', 'Bún, giò heo, bò chín, mắm ruốc Huế', 78000],
      ['Bún Bò Chả Cua', 'Bún, chả cua, bò nạm, hành tây', 82000],
      ['Bún Bò Đặc Biệt', 'Bò tái, nạm, gân, chả cua, giò heo', 98000],
      ['Gân Bò Hầm', 'Gân bò, nước dùng sả, rau răm', 76000],
      ['Chả Huế', 'Chả bò Huế, tiêu, lá chuối', 52000],
      ['Rau Sống Huế', 'Bắp chuối, rau thơm, giá, húng quế', 28000],
      ['Sữa Đậu Nành', 'Đậu nành, lá dứa, đường phèn', 30000],
    ]),
  },
  {
    name: 'Nem Nướng Nha Trang',
    address: '19 Huỳnh Thúc Kháng, Đống Đa, Hà Nội',
    latitude: 21.0201,
    longitude: 105.8124,
    openingHours: '10:00 - 22:00',
    isClean: true,
    hasJpMenu: false,
    hasAirCon: true,
    hasJpStaff: false,
    maxSeats: 58,
    categories: 'Nha Trang,Rolls,Grill',
    imageQuery: 'nem nuong nha trang',
    menus: dishes([
      ['Nem Nướng Cuốn', 'Nem nướng, bánh tráng, rau sống, đồ chua', 88000],
      ['Bánh Hỏi Nem Nướng', 'Bánh hỏi, nem nướng, mỡ hành, đậu phộng', 92000],
      ['Chả Ram Tôm Đất', 'Tôm đất, bánh tráng, hành tím, tiêu', 76000],
      ['Gỏi Cá Mai', 'Cá mai, thính, rau thơm, nước chấm', 128000],
      ['Bún Sứa', 'Bún, sứa, chả cá, nước dùng cá biển', 72000],
      ['Bò Nướng Xiên', 'Bò ướp sả, xiên tre, sốt đậu phộng', 85000],
      ['Bánh Căn Trứng Cút', 'Bột gạo, trứng cút, hành lá, nước mắm', 65000],
      ['Nước Rong Biển', 'Rong biển, la hán quả, đường phèn', 32000],
    ]),
  },
  {
    name: 'Bánh Canh Cua Gia Định',
    address: '28 Nguyễn Du, Hai Bà Trưng, Hà Nội',
    latitude: 21.0196,
    longitude: 105.8457,
    openingHours: '07:30 - 21:30',
    isClean: true,
    hasJpMenu: true,
    hasAirCon: true,
    hasJpStaff: true,
    maxSeats: 56,
    categories: 'Crab,Noodles,Southern',
    imageQuery: 'banh canh cua vietnam',
    menus: dishes([
      ['Bánh Canh Cua', 'Bánh canh, thịt cua, chả cua, hành phi', 98000],
      ['Bánh Canh Giò Heo', 'Bánh canh, giò heo, nước dùng xương', 88000],
      ['Súp Cua Trứng Bắc Thảo', 'Cua, trứng bắc thảo, nấm tuyết, bắp', 76000],
      ['Gỏi Xoài Tôm Khô', 'Xoài xanh, tôm khô, rau răm, đậu phộng', 68000],
      ['Cua Lột Chiên Bơ', 'Cua lột, bơ tỏi, bột chiên giòn', 165000],
      ['Chả Cua Hấp', 'Thịt cua, trứng, tiêu, hành lá', 92000],
      ['Bánh Quẩy Giòn', 'Bột mì, mè, dầu nóng', 25000],
      ['Chè Sương Sa', 'Sương sa, hạt lựu, nước cốt dừa', 39000],
    ]),
  },
  {
    name: 'Ốc Đêm Hồ Tây',
    address: '6 Quảng Khánh, Tây Hồ, Hà Nội',
    latitude: 21.0611,
    longitude: 105.8226,
    openingHours: '16:00 - 00:30',
    isClean: false,
    hasJpMenu: false,
    hasAirCon: false,
    hasJpStaff: false,
    maxSeats: 80,
    categories: 'Snails,Seafood,Night Food',
    imageQuery: 'vietnamese snails seafood',
    menus: dishes([
      ['Ốc Hương Rang Muối', 'Ốc hương, muối hột, ớt, rau răm', 155000],
      ['Ốc Móng Tay Xào Me', 'Ốc móng tay, sốt me, tỏi, rau răm', 128000],
      ['Hàu Nướng Phô Mai', 'Hàu sữa, phô mai, bơ tỏi', 145000],
      ['Cút Lộn Xào Me', 'Trứng cút lộn, sốt me, rau răm', 68000],
      ['Ngao Xào Bơ Tỏi', 'Ngao, bơ, tỏi, ớt, rau thơm', 98000],
      ['Sò Huyết Cháy Tỏi', 'Sò huyết, tỏi phi, mỡ hành', 135000],
      ['Chân Gà Sả Tắc', 'Chân gà, sả, tắc, ớt, lá chanh', 72000],
      ['Trà Quất', 'Trà xanh, quất, đường mía', 28000],
    ]),
  },
  {
    name: 'Cà Phê Trứng Phố Cổ',
    address: '11 Hàng Gai, Hoàn Kiếm, Hà Nội',
    latitude: 21.0322,
    longitude: 105.8504,
    openingHours: '07:00 - 23:00',
    isClean: true,
    hasJpMenu: true,
    hasAirCon: true,
    hasJpStaff: true,
    maxSeats: 38,
    categories: 'Cafe,Dessert,Hanoi',
    imageQuery: 'hanoi egg coffee cafe',
    menus: dishes([
      ['Cà Phê Trứng', 'Cà phê robusta, lòng đỏ trứng, sữa đặc', 45000],
      ['Bạc Xỉu', 'Cà phê, sữa đặc, sữa tươi, đá', 42000],
      ['Cacao Trứng', 'Cacao nóng, kem trứng, sữa đặc', 48000],
      ['Bánh Flan Cà Phê', 'Trứng, sữa, caramel, cà phê đậm', 39000],
      ['Croissant Pate', 'Bánh croissant, pate gan, bơ lạt', 62000],
      ['Bánh Chuối Nướng', 'Chuối chín, nước cốt dừa, mè rang', 42000],
      ['Sữa Chua Nếp Cẩm', 'Sữa chua, nếp cẩm, nước cốt dừa', 38000],
      ['Trà Sen Nóng', 'Trà xanh, sen Tây Hồ, mật ong', 36000],
    ]),
  },
  {
    name: 'Xôi Yến Nhà Xưa',
    address: '44 Nguyễn Hữu Huân, Hoàn Kiếm, Hà Nội',
    latitude: 21.035,
    longitude: 105.8534,
    openingHours: '06:00 - 22:00',
    isClean: true,
    hasJpMenu: false,
    hasAirCon: true,
    hasJpStaff: false,
    maxSeats: 44,
    categories: 'Sticky Rice,Breakfast,Hanoi',
    imageQuery: 'xoi vietnam sticky rice',
    menus: dishes([
      ['Xôi Gà Xé', 'Xôi nếp, gà xé, hành phi, ruốc', 62000],
      ['Xôi Pate Lạp Xưởng', 'Xôi nếp, pate, lạp xưởng, trứng kho', 68000],
      ['Xôi Thịt Kho Trứng', 'Xôi trắng, thịt kho, trứng cút, nước kho', 72000],
      ['Xôi Ngô Hành Phi', 'Nếp, ngô nếp, hành phi, đậu xanh', 42000],
      ['Xôi Xéo Đậu Xanh', 'Nếp cái hoa vàng, đậu xanh, mỡ hành', 45000],
      ['Xôi Sườn Nướng', 'Xôi nếp, sườn nướng mật ong, đồ chua', 78000],
      ['Ruốc Nấm', 'Nấm hương, sả, lá chanh, nước tương', 38000],
      ['Sữa Ngô Non', 'Ngô non, sữa tươi, đường phèn', 32000],
    ]),
  },
  {
    name: 'Cháo Sườn Sụn',
    address: '16 Lý Nam Đế, Hoàn Kiếm, Hà Nội',
    latitude: 21.0371,
    longitude: 105.8454,
    openingHours: '06:30 - 20:30',
    isClean: true,
    hasJpMenu: true,
    hasAirCon: false,
    hasJpStaff: false,
    maxSeats: 36,
    categories: 'Porridge,Breakfast,Hanoi',
    imageQuery: 'vietnamese rice porridge',
    menus: dishes([
      ['Cháo Sườn Sụn', 'Gạo xay, sườn sụn, ruốc, hành phi', 52000],
      ['Cháo Trai', 'Gạo rang, trai sông, rau răm, tiêu', 48000],
      ['Quẩy Nóng', 'Bột mì, men, dầu nóng', 15000],
      ['Ruốc Heo', 'Thịt heo, nước mắm, tiêu, hành', 25000],
      ['Trứng Bắc Thảo', 'Trứng bắc thảo, gừng, rau răm', 28000],
      ['Sườn Rim Mặn Ngọt', 'Sườn non, nước mắm, đường, tiêu', 78000],
      ['Bánh Giò Nóng', 'Bột gạo, thịt băm, mộc nhĩ, lá chuối', 35000],
      ['Trà Gừng', 'Gừng tươi, mật ong, đường phèn', 30000],
    ]),
  },
  {
    name: 'Bếp Mẹt Tây Bắc',
    address: '23 Đặng Thai Mai, Tây Hồ, Hà Nội',
    latitude: 21.0652,
    longitude: 105.8263,
    openingHours: '10:30 - 22:30',
    isClean: true,
    hasJpMenu: true,
    hasAirCon: true,
    hasJpStaff: false,
    maxSeats: 76,
    categories: 'Northwest,Grill,Vietnamese',
    imageQuery: 'northwest vietnamese food',
    menus: dishes([
      ['Lợn Bản Nướng Mắc Khén', 'Lợn bản, mắc khén, hạt dổi, lá chanh', 165000],
      ['Gà Đồi Hấp Lá Chanh', 'Gà đồi, lá chanh, muối tiêu', 180000],
      ['Xôi Ngũ Sắc', 'Nếp nương, lá cẩm, gấc, nghệ, đậu xanh', 72000],
      ['Cá Suối Chiên Giòn', 'Cá suối, bột nghệ, rau rừng', 145000],
      ['Nộm Hoa Ban', 'Hoa ban, thịt bò, rau thơm, lạc rang', 98000],
      ['Canh Măng Chua', 'Măng chua, xương heo, lá mắc mật', 88000],
      ['Chẩm Chéo Rau Rừng', 'Rau rừng, chẩm chéo, măng luộc', 64000],
      ['Nước Táo Mèo', 'Táo mèo, mật ong, đá viên', 42000],
    ]),
  },
  {
    name: 'Dê Núi Ninh Bình',
    address: '51 Kim Mã, Ba Đình, Hà Nội',
    latitude: 21.0302,
    longitude: 105.8236,
    openingHours: '10:00 - 22:30',
    isClean: true,
    hasJpMenu: false,
    hasAirCon: true,
    hasJpStaff: false,
    maxSeats: 90,
    categories: 'Goat,Ninh Binh,Grill',
    imageQuery: 'ninh binh goat cuisine',
    menus: dishes([
      ['Dê Tái Chanh', 'Thịt dê, chanh, sả, gừng, rau ngổ', 145000],
      ['Dê Nướng Tảng', 'Thịt dê, mắc khén, sả, dầu điều', 185000],
      ['Lẩu Dê Thuốc Bắc', 'Dê, táo đỏ, kỷ tử, rau cải, mì trứng', 330000],
      ['Dê Xào Lăn', 'Thịt dê, nước cốt dừa, cà ri, sả', 155000],
      ['Cơm Cháy Sốt Dê', 'Cơm cháy, sốt dê, hành phi', 98000],
      ['Dê Hấp Sả', 'Dê núi, sả, gừng, lá chanh', 165000],
      ['Cháo Dê Đậu Xanh', 'Gạo, đậu xanh, thịt dê băm, tiêu', 72000],
      ['Rau Núi Xào Tỏi', 'Rau rừng, tỏi, dầu hào', 68000],
    ]),
  },
  {
    name: 'Vịt Cỏ Vân Đình',
    address: '17 Nguyễn Khang, Cầu Giấy, Hà Nội',
    latitude: 21.0288,
    longitude: 105.7952,
    openingHours: '10:00 - 22:00',
    isClean: true,
    hasJpMenu: true,
    hasAirCon: false,
    hasJpStaff: false,
    maxSeats: 84,
    categories: 'Duck,Northern,Vietnamese',
    imageQuery: 'vietnamese roast duck',
    menus: dishes([
      ['Vịt Nướng Than Hoa', 'Vịt cỏ, riềng, mẻ, mật ong, than hoa', 220000],
      ['Vịt Om Sấu', 'Vịt cỏ, sấu xanh, khoai sọ, rau rút', 245000],
      ['Bún Măng Vịt', 'Bún, măng khô, vịt luộc, rau thơm', 72000],
      ['Gỏi Vịt Bắp Cải', 'Vịt xé, bắp cải, rau răm, hành phi', 98000],
      ['Vịt Rang Riềng', 'Vịt chặt miếng, riềng, sả, lá chanh', 155000],
      ['Cháo Vịt', 'Gạo rang, vịt, hành lá, tiêu', 62000],
      ['Nem Vịt Chiên', 'Thịt vịt, miến, nấm mèo, bánh đa nem', 82000],
      ['Măng Trúc Xào', 'Măng trúc, tỏi, hành lá, tiêu', 68000],
    ]),
  },
  {
    name: 'Gà Mạnh Hoạch',
    address: '98 Hoàng Quốc Việt, Cầu Giấy, Hà Nội',
    latitude: 21.0467,
    longitude: 105.793,
    openingHours: '09:30 - 22:00',
    isClean: true,
    hasJpMenu: false,
    hasAirCon: true,
    hasJpStaff: false,
    maxSeats: 82,
    categories: 'Chicken,Family,Vietnamese',
    imageQuery: 'vietnamese chicken dishes',
    menus: dishes([
      ['Gà Hấp Muối', 'Gà ta, muối hột, sả, lá chanh', 210000],
      ['Gà Rang Gừng', 'Gà ta, gừng, nước mắm, tiêu', 165000],
      ['Gà Không Lối Thoát', 'Gà bọc xôi chiên, hành phi, nước chấm', 285000],
      ['Lẩu Gà Lá É', 'Gà ta, lá é, nấm, măng chua, bún', 295000],
      ['Chân Gà Chiên Mắm', 'Chân gà, nước mắm, tỏi, ớt', 92000],
      ['Nộm Gà Xé Phay', 'Gà xé, hành tây, rau răm, lạc rang', 88000],
      ['Miến Gà Trộn', 'Miến dong, gà xé, rau thơm, nước tương', 72000],
      ['Xôi Gà', 'Xôi nếp, gà xé, hành phi, ruốc', 65000],
    ]),
  },
  {
    name: 'Bún Đậu Hàng Khay',
    address: '31 Hàng Khay, Hoàn Kiếm, Hà Nội',
    latitude: 21.0276,
    longitude: 105.8525,
    openingHours: '10:00 - 21:00',
    isClean: false,
    hasJpMenu: true,
    hasAirCon: false,
    hasJpStaff: false,
    maxSeats: 52,
    categories: 'Bun Dau,Street Food,Hanoi',
    imageQuery: 'bun dau mam tom',
    menus: dishes([
      ['Bún Đậu Đầy Đủ', 'Bún lá, đậu rán, thịt luộc, chả cốm, dồi sụn', 82000],
      ['Chả Cốm', 'Thịt heo, cốm xanh, nước mắm, tiêu', 58000],
      ['Dồi Sụn Chiên', 'Sụn heo, thịt xay, rau răm, đậu phộng', 68000],
      ['Nem Chua Rán', 'Nem chua, bột chiên xù, tương ớt', 62000],
      ['Thịt Chân Giò Luộc', 'Chân giò, mắm tôm, rau thơm', 72000],
      ['Bún Thêm', 'Bún lá ép miếng, lá chuối', 18000],
      ['Đậu Mơ Rán', 'Đậu mơ, dầu nóng, mắm tôm', 42000],
      ['Trà Tắc', 'Trà xanh, tắc, đường mía', 28000],
    ]),
  },
  {
    name: 'Lẩu Thái Việt',
    address: '77 Trần Duy Hưng, Cầu Giấy, Hà Nội',
    latitude: 21.0068,
    longitude: 105.7987,
    openingHours: '10:30 - 23:00',
    isClean: true,
    hasJpMenu: true,
    hasAirCon: true,
    hasJpStaff: true,
    maxSeats: 104,
    categories: 'Hotpot,Thai,Vietnamese',
    imageQuery: 'tom yum hotpot vietnam',
    menus: dishes([
      ['Lẩu Thái Tomyum', 'Nước lẩu tomyum, tôm, mực, bò, rau nhúng', 320000],
      ['Tôm Càng Xanh', 'Tôm càng xanh, muối ớt xanh, chanh', 240000],
      ['Ba Chỉ Bò Mỹ', 'Ba chỉ bò, sốt sa tế, mè rang', 155000],
      ['Mực Trứng', 'Mực trứng, gừng, sả, ớt', 170000],
      ['Nấm Kim Châm', 'Nấm kim châm, nước lẩu, hành lá', 55000],
      ['Gỏi Xoài Cá Trê', 'Xoài xanh, cá trê chiên, rau thơm', 92000],
      ['Cánh Gà Chiên Mắm', 'Cánh gà, nước mắm, tỏi, ớt', 98000],
      ['Chè Thái', 'Mít, thạch, sầu riêng, nước cốt dừa', 48000],
    ]),
  },
  {
    name: 'Nướng Than Mộc',
    address: '14 Nguyễn Văn Huyên, Cầu Giấy, Hà Nội',
    latitude: 21.0397,
    longitude: 105.7932,
    openingHours: '16:00 - 23:30',
    isClean: true,
    hasJpMenu: false,
    hasAirCon: true,
    hasJpStaff: false,
    maxSeats: 92,
    categories: 'BBQ,Grill,Vietnamese',
    imageQuery: 'vietnamese charcoal grill',
    menus: dishes([
      ['Ba Chỉ Nướng Riềng Mẻ', 'Ba chỉ heo, riềng, mẻ, mắm tôm', 125000],
      ['Sườn Cây Sốt Mật Ong', 'Sườn heo, mật ong, tiêu đen, tỏi', 168000],
      ['Bạch Tuộc Nướng Sa Tế', 'Bạch tuộc, sa tế, sả, ớt', 155000],
      ['Bò Cuộn Nấm Kim Châm', 'Bò lát, nấm kim châm, sốt mè', 138000],
      ['Đậu Bắp Nướng', 'Đậu bắp, muối ớt, dầu tỏi', 52000],
      ['Cơm Lam', 'Gạo nếp, ống tre, muối vừng', 58000],
      ['Salad Dưa Leo', 'Dưa leo, rau thơm, sốt chanh tỏi', 45000],
      ['Bánh Chuối Nướng', 'Chuối, nếp, nước cốt dừa, mè', 42000],
    ]),
  },
  {
    name: 'Bún Cá Hải Phòng',
    address: '63 Láng Hạ, Đống Đa, Hà Nội',
    latitude: 21.0166,
    longitude: 105.815,
    openingHours: '07:00 - 21:30',
    isClean: true,
    hasJpMenu: true,
    hasAirCon: false,
    hasJpStaff: false,
    maxSeats: 48,
    categories: 'Fish,Noodles,Hai Phong',
    imageQuery: 'bun ca hai phong',
    menus: dishes([
      ['Bún Cá Cay', 'Bún, cá chiên, dọc mùng, cà chua, thì là', 68000],
      ['Cá Rô Chiên Giòn', 'Cá rô phi lê, bột nghệ, nước mắm gừng', 78000],
      ['Chả Cá Thì Là', 'Cá xay, thì là, tiêu, nước mắm', 62000],
      ['Lòng Cá Xào Nghệ', 'Lòng cá, nghệ, hành tây, rau răm', 82000],
      ['Nem Cua Bể', 'Cua bể, thịt heo, miến, bánh đa nem', 85000],
      ['Bánh Đa Cá', 'Bánh đa đỏ, cá chiên, chả cá, rau cần', 72000],
      ['Rau Cần Trụng', 'Rau cần, hành lá, nước dùng cá', 25000],
      ['Sấu Dầm', 'Sấu ngâm, đường, gừng, đá', 30000],
    ]),
  },
  {
    name: 'Miến Lươn Nghệ An',
    address: '3 Nguyễn Thị Định, Cầu Giấy, Hà Nội',
    latitude: 21.0098,
    longitude: 105.8003,
    openingHours: '06:30 - 21:00',
    isClean: true,
    hasJpMenu: false,
    hasAirCon: true,
    hasJpStaff: false,
    maxSeats: 46,
    categories: 'Eel,Noodles,Nghe An',
    imageQuery: 'mien luon vietnam eel noodle',
    menus: dishes([
      ['Miến Lươn Nước', 'Miến dong, lươn chiên, nước dùng xương', 76000],
      ['Miến Lươn Xào', 'Miến dong, lươn giòn, giá, hành răm', 82000],
      ['Súp Lươn', 'Lươn đồng, nghệ, hành tăm, rau răm', 78000],
      ['Cháo Lươn', 'Gạo rang, lươn xào nghệ, tiêu', 68000],
      ['Lươn Om Chuối Đậu', 'Lươn, chuối xanh, đậu phụ, tía tô', 145000],
      ['Lươn Chiên Giòn', 'Lươn đồng, bột chiên, nước mắm gừng', 128000],
      ['Bánh Mướt', 'Bánh gạo hấp, hành phi, nước chấm', 35000],
      ['Nước Chè Xanh', 'Lá chè xanh Nghệ An, đá viên', 25000],
    ]),
  },
  {
    name: 'Hủ Tiếu Nam Vang',
    address: '22 Tạ Hiện, Hoàn Kiếm, Hà Nội',
    latitude: 21.0352,
    longitude: 105.852,
    openingHours: '07:00 - 23:00',
    isClean: true,
    hasJpMenu: true,
    hasAirCon: true,
    hasJpStaff: false,
    maxSeats: 50,
    categories: 'Hu Tieu,Noodles,Southern',
    imageQuery: 'hu tieu nam vang',
    menus: dishes([
      ['Hủ Tiếu Khô', 'Hủ tiếu, tôm, thịt bằm, gan, sốt tỏi', 78000],
      ['Hủ Tiếu Nước', 'Hủ tiếu, nước dùng xương, tôm, thịt', 76000],
      ['Hủ Tiếu Xương', 'Hủ tiếu, xương heo hầm, hành lá', 85000],
      ['Tôm Thịt Hoành Thánh', 'Tôm, thịt heo, hoành thánh, cải xanh', 82000],
      ['Sườn Non Hầm', 'Sườn non, nước dùng, củ cải trắng', 95000],
      ['Gan Heo Luộc', 'Gan heo, gừng, nước tương tỏi', 48000],
      ['Giá Hẹ Trụng', 'Giá, hẹ, hành lá, nước dùng nóng', 22000],
      ['Sâm Lạnh', 'La hán quả, rong biển, mía lau', 32000],
    ]),
  },
  {
    name: 'Bún Mắm Miền Tây',
    address: '40 Nguyễn Khánh Toàn, Cầu Giấy, Hà Nội',
    latitude: 21.0413,
    longitude: 105.7985,
    openingHours: '10:00 - 22:00',
    isClean: true,
    hasJpMenu: false,
    hasAirCon: true,
    hasJpStaff: false,
    maxSeats: 60,
    categories: 'Mekong,Noodles,Hotpot',
    imageQuery: 'mekong vietnamese food',
    menus: dishes([
      ['Bún Mắm Cá Linh', 'Bún, cá linh, tôm, heo quay, rau miền Tây', 88000],
      ['Lẩu Mắm', 'Mắm cá linh, cá kèo, tôm, mực, rau nhúng', 330000],
      ['Cá Kèo Kho Tộ', 'Cá kèo, nước màu, tiêu xanh, hành lá', 135000],
      ['Bông Điên Điển Xào Tép', 'Bông điên điển, tép đồng, tỏi', 98000],
      ['Gỏi Bồn Bồn', 'Bồn bồn, tôm thịt, rau răm, đậu phộng', 86000],
      ['Chả Cá Thác Lác', 'Cá thác lác, thì là, tiêu, nước mắm', 105000],
      ['Rau Đắng Nhúng', 'Rau đắng, bông súng, kèo nèo, giá', 52000],
      ['Nước Thốt Nốt', 'Thốt nốt, đường phèn, đá viên', 38000],
    ]),
  },
  {
    name: 'Cơm Tấm Sài Gòn',
    address: '91 Chùa Láng, Đống Đa, Hà Nội',
    latitude: 21.0248,
    longitude: 105.8022,
    openingHours: '07:00 - 21:30',
    isClean: true,
    hasJpMenu: true,
    hasAirCon: true,
    hasJpStaff: false,
    maxSeats: 54,
    categories: 'Com Tam,Rice,Sai Gon',
    imageQuery: 'com tam vietnam',
    menus: dishes([
      ['Cơm Tấm Sườn Bì Chả', 'Cơm tấm, sườn nướng, bì, chả trứng', 78000],
      ['Sườn Cốt Lết Nướng', 'Sườn cốt lết, mật ong, sả, nước mắm', 88000],
      ['Bì Heo Thính', 'Bì heo, thính gạo, tỏi, rau thơm', 38000],
      ['Chả Trứng Hấp', 'Trứng, thịt băm, miến, mộc nhĩ', 45000],
      ['Trứng Ốp La', 'Trứng gà, tiêu, hành lá', 22000],
      ['Canh Khổ Qua', 'Khổ qua, thịt băm, nấm mèo', 42000],
      ['Đồ Chua', 'Cà rốt, củ cải, giấm gạo, đường', 25000],
      ['Nước Mơ', 'Mơ ngâm, đường phèn, đá viên', 32000],
    ]),
  },
  {
    name: 'Bánh Xèo Miền Trung',
    address: '24 Nguyễn Công Trứ, Hai Bà Trưng, Hà Nội',
    latitude: 21.0158,
    longitude: 105.8561,
    openingHours: '10:00 - 22:00',
    isClean: true,
    hasJpMenu: false,
    hasAirCon: true,
    hasJpStaff: false,
    maxSeats: 58,
    categories: 'Banh Xeo,Central,Street Food',
    imageQuery: 'banh xeo vietnam pancake',
    menus: dishes([
      ['Bánh Xèo Tôm Thịt', 'Bột gạo, tôm, thịt, giá, nghệ', 72000],
      ['Bánh Xèo Mực', 'Bột gạo, mực tươi, giá, hành lá', 82000],
      ['Bánh Khọt', 'Bột gạo, tôm, nước cốt dừa, mỡ hành', 68000],
      ['Nem Lụi', 'Thịt heo xay, sả, bánh tráng, rau sống', 88000],
      ['Gỏi Cuốn Heo Quay', 'Bánh tráng, heo quay, rau thơm, bún', 62000],
      ['Rau Rừng Cuốn', 'Cải xanh, xà lách, diếp cá, húng quế', 45000],
      ['Nước Mắm Đậu Phộng', 'Đậu phộng, nước mắm, tỏi, ớt', 22000],
      ['Chè Đậu Ván', 'Đậu ván, nước cốt dừa, lá dứa', 39000],
    ]),
  },
  {
    name: 'Gỏi Cuốn Kitchen',
    address: '8 Tống Duy Tân, Hoàn Kiếm, Hà Nội',
    latitude: 21.0296,
    longitude: 105.8464,
    openingHours: '09:00 - 22:00',
    isClean: true,
    hasJpMenu: true,
    hasAirCon: true,
    hasJpStaff: true,
    maxSeats: 42,
    categories: 'Rolls,Healthy,Vietnamese',
    imageQuery: 'goi cuon vietnam spring rolls',
    menus: dishes([
      ['Gỏi Cuốn Tôm Thịt', 'Bánh tráng, tôm, thịt, bún, rau thơm', 58000],
      ['Gỏi Cuốn Bò Nướng', 'Bánh tráng, bò nướng, dưa leo, rau thơm', 68000],
      ['Gỏi Cuốn Chay', 'Bánh tráng, đậu hũ, nấm, rau xanh', 52000],
      ['Bì Cuốn', 'Bánh tráng, bì heo, thính, rau sống', 56000],
      ['Phở Cuốn', 'Bánh phở, bò xào, rau thơm, nước chấm', 65000],
      ['Bún Thịt Nướng Cuốn', 'Bún, thịt nướng, bánh tráng, đồ chua', 72000],
      ['Nước Chấm Tương Đậu', 'Tương đậu, gan heo, đậu phộng, mè', 22000],
      ['Sữa Chua Trái Cây', 'Sữa chua, xoài, thanh long, granola', 48000],
    ]),
  },
  {
    name: 'Phở Gà Tràng An',
    address: '26 Hàng Hòm, Hoàn Kiếm, Hà Nội',
    latitude: 21.0331,
    longitude: 105.8488,
    openingHours: '06:00 - 21:30',
    isClean: true,
    hasJpMenu: true,
    hasAirCon: false,
    hasJpStaff: false,
    maxSeats: 40,
    categories: 'Pho,Chicken,Hanoi',
    imageQuery: 'chicken pho vietnam',
    menus: dishes([
      ['Phở Gà Ta', 'Bánh phở, gà ta, nước dùng xương gà', 62000],
      ['Phở Gà Đùi', 'Bánh phở, đùi gà, hành lá, lá chanh', 78000],
      ['Phở Gà Trộn', 'Bánh phở, gà xé, rau thơm, sốt tương', 68000],
      ['Miến Gà', 'Miến dong, gà ta, nấm hương, hành lá', 65000],
      ['Gà Xé Lá Chanh', 'Gà xé, lá chanh, hành tây, tiêu', 72000],
      ['Quẩy Giòn', 'Bột mì, dầu nóng, muối', 15000],
      ['Trứng Non Cháy Tỏi', 'Trứng non, tỏi phi, bơ, hành lá', 78000],
      ['Trà Chanh', 'Trà xanh, chanh tươi, đường mía', 30000],
    ]),
  },
  {
    name: 'Bún Thang Hà Thành',
    address: '4 Cửa Nam, Hoàn Kiếm, Hà Nội',
    latitude: 21.0285,
    longitude: 105.8442,
    openingHours: '06:30 - 20:30',
    isClean: true,
    hasJpMenu: true,
    hasAirCon: true,
    hasJpStaff: false,
    maxSeats: 44,
    categories: 'Bun Thang,Hanoi,Noodles',
    imageQuery: 'bun thang hanoi',
    menus: dishes([
      ['Bún Thang Truyền Thống', 'Bún, gà xé, giò lụa, trứng, củ cải khô', 82000],
      ['Chả Tôm', 'Tôm giã, trứng, thì là, tiêu', 58000],
      ['Trứng Tráng Sợi', 'Trứng gà, nước mắm, thái sợi mỏng', 25000],
      ['Gà Xé', 'Gà ta xé, lá chanh, tiêu, hành khô', 52000],
      ['Củ Cải Khô', 'Củ cải phơi, nước mắm, đường, gừng', 22000],
      ['Mắm Tôm Huế', 'Mắm tôm, chanh, ớt, dầu nóng', 18000],
      ['Bún Thang Đặc Biệt', 'Bún thang, tôm he, nấm hương, trứng muối', 98000],
      ['Chè Sen Long Nhãn', 'Hạt sen, long nhãn, đường phèn', 45000],
    ]),
  },
  {
    name: 'Cơm Nhà Láng Hạ',
    address: '12 Láng Hạ, Đống Đa, Hà Nội',
    latitude: 21.0187,
    longitude: 105.8194,
    openingHours: '10:00 - 21:30',
    isClean: true,
    hasJpMenu: false,
    hasAirCon: true,
    hasJpStaff: false,
    maxSeats: 68,
    categories: 'Family,Rice,Vietnamese',
    imageQuery: 'vietnamese family meal rice',
    menus: dishes([
      ['Cơm Thịt Kho Tàu', 'Cơm trắng, thịt kho, trứng, dưa leo', 76000],
      ['Canh Bí Nấu Tôm', 'Bí xanh, tôm tươi, hành lá, tiêu', 62000],
      ['Cá Basa Kho Gừng', 'Cá basa, gừng, nước màu, hành lá', 88000],
      ['Đậu Cô Ve Xào Bò', 'Đậu cô ve, bò lát, tỏi, dầu hào', 92000],
      ['Trứng Cuộn Thịt', 'Trứng, thịt băm, hành lá, cà rốt', 68000],
      ['Salad Rau Mầm', 'Rau mầm, cà chua, sốt mè rang', 58000],
      ['Cơm Gạo Lứt', 'Gạo lứt, mè rang, muối vừng', 35000],
      ['Nước Ép Dứa', 'Dứa tươi, chanh, mật ong', 38000],
    ]),
  },
  {
    name: 'Lẩu Bò Ba Toa',
    address: '55 Nguyễn Sơn, Long Biên, Hà Nội',
    latitude: 21.0427,
    longitude: 105.8794,
    openingHours: '10:30 - 22:30',
    isClean: true,
    hasJpMenu: true,
    hasAirCon: true,
    hasJpStaff: false,
    maxSeats: 86,
    categories: 'Beef Hotpot,Dalat,Vietnamese',
    imageQuery: 'vietnamese beef hotpot',
    menus: dishes([
      ['Lẩu Bò Ba Toa', 'Bò Đà Lạt, nước dùng xương, rau xanh, mì trứng', 320000],
      ['Bắp Bò Nhúng Lẩu', 'Bắp bò thái lát, gừng, hành tây', 155000],
      ['Gân Bò Hầm', 'Gân bò, quế, hồi, tiêu xanh', 128000],
      ['Đuôi Bò Hầm Thuốc Bắc', 'Đuôi bò, táo đỏ, kỷ tử, thảo quả', 188000],
      ['Bò Nướng Đá', 'Bò tảng, đá nóng, sốt tiêu xanh', 175000],
      ['Khoai Môn Chiên', 'Khoai môn, bột chiên, sốt mayonnaise', 62000],
      ['Rau Đà Lạt', 'Cải thảo, xà lách xoong, nấm, rau tần ô', 58000],
      ['Sữa Đậu Nành Nóng', 'Đậu nành, lá dứa, đường phèn', 32000],
    ]),
  },
];

async function main() {
  console.log('🌱 Seeding database...');
  const shouldResetDb = process.env.RESET_DB === 'true';

  if (shouldResetDb) {
    await prisma.chatMessage.deleteMany();
    await prisma.directConversation.deleteMany();
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
  } else {
    console.log('ℹ️  Non-destructive seed mode: preserving existing data outside seeded demo records');
  }

  // ─── Roles ──────────────────────────────────────────────────
  const roles = await Promise.all([
    prisma.role.upsert({ where: { id: 1 }, update: { name: 'Customer' }, create: { id: 1, name: 'Customer' } }),
    prisma.role.upsert({ where: { id: 2 }, update: { name: 'Owner' }, create: { id: 2, name: 'Owner' } }),
    prisma.role.upsert({ where: { id: 3 }, update: { name: 'Admin' }, create: { id: 3, name: 'Admin' } }),
  ]);
  console.log('✅ Roles created');

  // ─── Users ──────────────────────────────────────────────────
  const pw = hashSync('password123', 10);

  const customers = await Promise.all([
    prisma.user.upsert({
      where: { emailPhone: 'customer@vietdine.com' },
      update: { fullName: 'Tanaka Yuki', passwordHash: pw, roleId: 1 },
      create: { fullName: 'Tanaka Yuki', emailPhone: 'customer@vietdine.com', passwordHash: pw, roleId: 1 },
    }),
    prisma.user.upsert({
      where: { emailPhone: 'nguyen@vietdine.com' },
      update: { fullName: 'Nguyễn Minh', passwordHash: pw, roleId: 1 },
      create: { fullName: 'Nguyễn Minh', emailPhone: 'nguyen@vietdine.com', passwordHash: pw, roleId: 1 },
    }),
    prisma.user.upsert({
      where: { emailPhone: 'sato@vietdine.com' },
      update: { fullName: 'Sato Kenji', passwordHash: pw, roleId: 1 },
      create: { fullName: 'Sato Kenji', emailPhone: 'sato@vietdine.com', passwordHash: pw, roleId: 1 },
    }),
  ]);

  const owners = await Promise.all([
    prisma.user.upsert({
      where: { emailPhone: 'owner1@vietdine.com' },
      update: { fullName: 'Trần Văn Hùng', passwordHash: pw, roleId: 2 },
      create: { fullName: 'Trần Văn Hùng', emailPhone: 'owner1@vietdine.com', passwordHash: pw, roleId: 2 },
    }),
    prisma.user.upsert({
      where: { emailPhone: 'owner2@vietdine.com' },
      update: { fullName: 'Lê Thị Mai', passwordHash: pw, roleId: 2 },
      create: { fullName: 'Lê Thị Mai', emailPhone: 'owner2@vietdine.com', passwordHash: pw, roleId: 2 },
    }),
    prisma.user.upsert({
      where: { emailPhone: 'owner3@vietdine.com' },
      update: { fullName: 'Phạm Đức Anh', passwordHash: pw, roleId: 2 },
      create: { fullName: 'Phạm Đức Anh', emailPhone: 'owner3@vietdine.com', passwordHash: pw, roleId: 2 },
    }),
  ]);
  console.log('✅ Users created');

  // ─── Restaurants ────────────────────────────────────────────
  const restaurants = await Promise.all([
    upsertRestaurant({
      ownerId: owners[0].id, name: 'Phở Thìn Bờ Hồ', address: '13 Lò Đúc, Hai Bà Trưng, Hà Nội',
      latitude: 21.0285, longitude: 105.8542, openingHours: '06:00 - 22:00',
      isClean: true, hasJpMenu: true, hasAirCon: true, hasJpStaff: false,
      maxSeats: 40, categories: 'Phở,Noodles,Vietnamese',
      imageUrl: '/images/pho_thin_bo_ho.png',
    }),
    upsertRestaurant({
      ownerId: owners[0].id, name: 'Bún Chả Hương Liên', address: '24 Lê Văn Hưu, Hai Bà Trưng, Hà Nội',
      latitude: 21.0190, longitude: 105.8510, openingHours: '10:00 - 21:00',
      isClean: true, hasJpMenu: true, hasAirCon: false, hasJpStaff: true,
      maxSeats: 50, categories: 'Bún Chả,BBQ,Vietnamese',
      imageUrl: '/images/bun_cha_huong_lien.png',
    }),
    upsertRestaurant({
      ownerId: owners[1].id, name: 'Nhà hàng Sen Tây Hồ', address: '614 Lạc Long Quân, Tây Hồ, Hà Nội',
      latitude: 21.0650, longitude: 105.8180, openingHours: '09:00 - 23:00',
      isClean: true, hasJpMenu: true, hasAirCon: true, hasJpStaff: true,
      maxSeats: 120, categories: 'Fine Dining,Vietnamese,Seafood',
      imageUrl: '/images/nha_hang_sen_tay_ho.png',
    }),
    upsertRestaurant({
      ownerId: owners[1].id, name: 'Quán Ăn Ngon', address: '18 Phan Bội Châu, Hoàn Kiếm, Hà Nội',
      latitude: 21.0265, longitude: 105.8392, openingHours: '07:00 - 22:00',
      isClean: true, hasJpMenu: false, hasAirCon: true, hasJpStaff: false,
      maxSeats: 80, categories: 'Street Food,Vietnamese,Traditional',
      imageUrl: '/images/quan_an_ngon.png',
    }),
    upsertRestaurant({
      ownerId: owners[2].id, name: 'Chả Cá Lã Vọng', address: '14 Chả Cá, Hoàn Kiếm, Hà Nội',
      latitude: 21.0340, longitude: 105.8490, openingHours: '11:00 - 21:30',
      isClean: true, hasJpMenu: true, hasAirCon: true, hasJpStaff: false,
      maxSeats: 60, categories: 'Chả Cá,Fish,Vietnamese',
      imageUrl: '/images/cha_ca_la_vong.png',
    }),
    upsertRestaurant({
      ownerId: owners[2].id, name: 'Bánh Cuốn Bà Hoành', address: '66 Tô Hiệu, Cầu Giấy, Hà Nội',
      latitude: 21.0380, longitude: 105.7885, openingHours: '06:00 - 14:00',
      isClean: false, hasJpMenu: false, hasAirCon: false, hasJpStaff: false,
      maxSeats: 30, categories: 'Bánh Cuốn,Breakfast,Vietnamese',
      imageUrl: '/images/banh_cuon_ba_hoanh.png',
    }),
  ]);

  const additionalRestaurants = await Promise.all(
    additionalRestaurantSeeds.map((restaurant, index) =>
      upsertRestaurant({
        ownerId: owners[index % owners.length].id,
        name: restaurant.name,
        address: restaurant.address,
        latitude: restaurant.latitude,
        longitude: restaurant.longitude,
        openingHours: restaurant.openingHours,
        isClean: restaurant.isClean,
        hasJpMenu: restaurant.hasJpMenu,
        hasAirCon: restaurant.hasAirCon,
        hasJpStaff: restaurant.hasJpStaff,
        maxSeats: restaurant.maxSeats,
        categories: restaurant.categories,
        imageUrl: restaurantImage(restaurant.name, restaurant.imageQuery),
      })
    )
  );

  restaurants.push(...additionalRestaurants);
  console.log(`✅ Restaurants created (${restaurants.length} total)`);

  // ─── Menus ──────────────────────────────────────────────────
  const menuData = [
    // Phở Thìn
    { restaurantId: restaurants[0].id, dishNameVn: 'Phở Bò Tái', dishNameJp: 'レアビーフフォー', ingredients: 'Bánh phở, thịt bò tái, hành', price: 55000, imageUrl: '/images/pho.png' },
    { restaurantId: restaurants[0].id, dishNameVn: 'Phở Bò Chín', dishNameJp: 'ウェルダンビーフフォー', ingredients: 'Bánh phở, thịt bò chín, hành', price: 55000, imageUrl: '/images/pho.png' },
    { restaurantId: restaurants[0].id, dishNameVn: 'Phở Gà', dishNameJp: 'チキンフォー', ingredients: 'Bánh phở, thịt gà, hành', price: 50000, imageUrl: '/images/pho.png' },
    { restaurantId: restaurants[0].id, dishNameVn: 'Phở Đặc Biệt', dishNameJp: 'スペシャルフォー', ingredients: 'Bánh phở, thịt bò tái, chín, gầu, nạm', price: 70000, imageUrl: '/images/pho.png' },
    { restaurantId: restaurants[0].id, dishNameVn: 'Phở Sốt Vang', dishNameJp: 'ビーフシチューフォー', ingredients: 'Bánh phở, bò sốt vang, quế, hồi', price: 75000, imageUrl: foodImage('Phở Sốt Vang') },
    { restaurantId: restaurants[0].id, dishNameVn: 'Quẩy Nóng', dishNameJp: '揚げパン', ingredients: 'Bột mì, men, muối, dầu nóng', price: 15000, imageUrl: foodImage('Quẩy Nóng') },
    { restaurantId: restaurants[0].id, dishNameVn: 'Nộm Bò Khô', dishNameJp: 'ビーフパパイヤサラダ', ingredients: 'Đu đủ xanh, bò khô, rau răm, đậu phộng', price: 45000, imageUrl: foodImage('Nộm Bò Khô') },
    { restaurantId: restaurants[0].id, dishNameVn: 'Trà Đá Hoa Nhài', dishNameJp: 'ジャスミンアイスティー', ingredients: 'Trà xanh, hoa nhài, đá viên', price: 12000, imageUrl: foodImage('Trà Đá Hoa Nhài') },
    // Bún Chả
    { restaurantId: restaurants[1].id, dishNameVn: 'Bún Chả Obama', dishNameJp: 'オバマブンチャー', ingredients: 'Bún, chả nướng, nem rán, nước mắm', price: 60000, imageUrl: '/images/bun_cha.png' },
    { restaurantId: restaurants[1].id, dishNameVn: 'Bún Chả Thường', dishNameJp: 'ブンチャー（レギュラー）', ingredients: 'Bún, chả nướng, rau sống, nước mắm', price: 45000, imageUrl: '/images/bun_cha.png' },
    { restaurantId: restaurants[1].id, dishNameVn: 'Nem Rán', dishNameJp: '揚げ春巻き', ingredients: 'Thịt lợn, miến, mộc nhĩ, hành', price: 30000, imageUrl: '/images/bun_cha.png' },
    { restaurantId: restaurants[1].id, dishNameVn: 'Bún Chả Lá Lốt', dishNameJp: 'ロロットブンチャー', ingredients: 'Bún, chả lá lốt, rau sống, nước mắm', price: 55000, imageUrl: foodImage('Bún Chả Lá Lốt') },
    { restaurantId: restaurants[1].id, dishNameVn: 'Chả Cốm', dishNameJp: 'グリーンライスポークケーキ', ingredients: 'Thịt heo, cốm xanh, tiêu, nước mắm', price: 45000, imageUrl: foodImage('Chả Cốm') },
    { restaurantId: restaurants[1].id, dishNameVn: 'Nem Cua Bể', dishNameJp: 'カニ揚げ春巻き', ingredients: 'Cua bể, thịt lợn, miến, bánh đa nem', price: 65000, imageUrl: foodImage('Nem Cua Bể') },
    { restaurantId: restaurants[1].id, dishNameVn: 'Dưa Góp', dishNameJp: 'ベトナムピクルス', ingredients: 'Đu đủ, cà rốt, su hào, giấm gạo', price: 20000, imageUrl: foodImage('Dưa Góp') },
    { restaurantId: restaurants[1].id, dishNameVn: 'Chè Đậu Xanh', dishNameJp: '緑豆チェー', ingredients: 'Đậu xanh, nước cốt dừa, đường phèn', price: 30000, imageUrl: foodImage('Chè Đậu Xanh') },
    // Sen Tây Hồ
    { restaurantId: restaurants[2].id, dishNameVn: 'Cá Kho Tộ', dishNameJp: '土鍋煮魚', ingredients: 'Cá, nước mắm, đường, tiêu', price: 120000, imageUrl: '/images/ca_kho.png' },
    { restaurantId: restaurants[2].id, dishNameVn: 'Tôm Hùm Nướng', dishNameJp: 'ロブスターグリル', ingredients: 'Tôm hùm, bơ, tỏi', price: 450000, imageUrl: '/images/tom_hum.png' },
    { restaurantId: restaurants[2].id, dishNameVn: 'Gỏi Cuốn', dishNameJp: '生春巻き', ingredients: 'Bánh tráng, tôm, rau, bún', price: 45000, imageUrl: '/images/goi_cuon.png' },
    { restaurantId: restaurants[2].id, dishNameVn: 'Chè Sen', dishNameJp: '蓮の実スイーツ', ingredients: 'Hạt sen, đường, nước cốt dừa', price: 35000, imageUrl: '/images/che_sen.png' },
    { restaurantId: restaurants[2].id, dishNameVn: 'Nộm Hoa Chuối', dishNameJp: 'バナナ花サラダ', ingredients: 'Hoa chuối, tôm, thịt, rau thơm', price: 85000, imageUrl: foodImage('Nộm Hoa Chuối') },
    { restaurantId: restaurants[2].id, dishNameVn: 'Bò Lúc Lắc', dishNameJp: '揺れる牛肉炒め', ingredients: 'Bò thăn, ớt chuông, hành tây, tiêu đen', price: 180000, imageUrl: foodImage('Bò Lúc Lắc') },
    { restaurantId: restaurants[2].id, dishNameVn: 'Súp Hải Sản', dishNameJp: 'シーフードスープ', ingredients: 'Tôm, mực, cua, nấm tuyết, trứng', price: 120000, imageUrl: foodImage('Súp Hải Sản') },
    { restaurantId: restaurants[2].id, dishNameVn: 'Cơm Rang Sen', dishNameJp: '蓮の実チャーハン', ingredients: 'Cơm, hạt sen, tôm, trứng, rau củ', price: 95000, imageUrl: foodImage('Cơm Rang Sen') },
    // Quán Ăn Ngon
    { restaurantId: restaurants[3].id, dishNameVn: 'Bánh Xèo', dishNameJp: 'バインセオ', ingredients: 'Bột gạo, tôm, thịt, giá', price: 55000, imageUrl: '/images/banh_xeo.png' },
    { restaurantId: restaurants[3].id, dishNameVn: 'Cơm Tấm', dishNameJp: '砕き米プレート', ingredients: 'Cơm tấm, sườn nướng, bì, chả', price: 50000, imageUrl: '/images/com_tam.png' },
    { restaurantId: restaurants[3].id, dishNameVn: 'Bò Lá Lốt', dishNameJp: 'ロロットリーフ巻きビーフ', ingredients: 'Thịt bò, lá lốt, sả', price: 65000, imageUrl: '/images/bo_la_lot.png' },
    { restaurantId: restaurants[3].id, dishNameVn: 'Gỏi Ngó Sen', dishNameJp: '蓮茎サラダ', ingredients: 'Ngó sen, tôm, thịt, rau răm, đậu phộng', price: 78000, imageUrl: foodImage('Gỏi Ngó Sen') },
    { restaurantId: restaurants[3].id, dishNameVn: 'Bún Bò Nam Bộ', dishNameJp: '南部牛肉ブン', ingredients: 'Bún, bò xào, rau thơm, đậu phộng', price: 68000, imageUrl: foodImage('Bún Bò Nam Bộ') },
    { restaurantId: restaurants[3].id, dishNameVn: 'Bánh Khọt', dishNameJp: 'バインコット', ingredients: 'Bột gạo, tôm, nước cốt dừa, mỡ hành', price: 62000, imageUrl: foodImage('Bánh Khọt') },
    { restaurantId: restaurants[3].id, dishNameVn: 'Chả Giò', dishNameJp: '揚げ春巻き', ingredients: 'Thịt heo, miến, khoai môn, bánh đa nem', price: 58000, imageUrl: foodImage('Chả Giò') },
    { restaurantId: restaurants[3].id, dishNameVn: 'Chè Ba Màu', dishNameJp: '三色チェー', ingredients: 'Đậu đỏ, đậu xanh, thạch, nước cốt dừa', price: 35000, imageUrl: foodImage('Chè Ba Màu') },
    // Chả Cá Lã Vọng
    { restaurantId: restaurants[4].id, dishNameVn: 'Chả Cá Lã Vọng', dishNameJp: 'ラーヴォンチャーカー', ingredients: 'Cá lăng, nghệ, thì là, hành', price: 180000, imageUrl: '/images/cha_ca.png' },
    { restaurantId: restaurants[4].id, dishNameVn: 'Chả Cá Đặc Biệt', dishNameJp: 'スペシャルチャーカー', ingredients: 'Cá lăng, nghệ, thì là, hành, mắm tôm', price: 250000, imageUrl: '/images/cha_ca.png' },
    { restaurantId: restaurants[4].id, dishNameVn: 'Lòng Cá Xào', dishNameJp: '魚モツ炒め', ingredients: 'Lòng cá, nghệ, hành, thì là', price: 140000, imageUrl: foodImage('Lòng Cá Xào') },
    { restaurantId: restaurants[4].id, dishNameVn: 'Canh Chua Cá', dishNameJp: '魚の酸味スープ', ingredients: 'Cá lăng, dứa, cà chua, me, rau om', price: 130000, imageUrl: foodImage('Canh Chua Cá') },
    { restaurantId: restaurants[4].id, dishNameVn: 'Gỏi Cá', dishNameJp: '魚サラダ', ingredients: 'Cá tươi, thính, rau thơm, nước chấm', price: 160000, imageUrl: foodImage('Gỏi Cá') },
    { restaurantId: restaurants[4].id, dishNameVn: 'Bún Cá Chấm', dishNameJp: '魚つけブン', ingredients: 'Bún, cá chiên, rau sống, nước chấm', price: 90000, imageUrl: foodImage('Bún Cá Chấm') },
    { restaurantId: restaurants[4].id, dishNameVn: 'Cá Lăng Nướng', dishNameJp: 'ラン魚グリル', ingredients: 'Cá lăng, riềng, mẻ, sả', price: 220000, imageUrl: foodImage('Cá Lăng Nướng') },
    { restaurantId: restaurants[4].id, dishNameVn: 'Bánh Tôm Hồ Tây', dishNameJp: '西湖エビフリッター', ingredients: 'Tôm, khoai lang, bột chiên, rau sống', price: 85000, imageUrl: foodImage('Bánh Tôm Hồ Tây') },
    // Bánh Cuốn
    { restaurantId: restaurants[5].id, dishNameVn: 'Bánh Cuốn Nhân Thịt', dishNameJp: '肉入りバインクオン', ingredients: 'Bột gạo, thịt lợn, mộc nhĩ', price: 35000, imageUrl: '/images/banh_cuon.png' },
    { restaurantId: restaurants[5].id, dishNameVn: 'Bánh Cuốn Trứng', dishNameJp: '卵入りバインクオン', ingredients: 'Bột gạo, trứng', price: 30000, imageUrl: '/images/banh_cuon.png' },
    { restaurantId: restaurants[5].id, dishNameVn: 'Bánh Cuốn Chả', dishNameJp: 'チャー付きバインクオン', ingredients: 'Bột gạo, chả quế', price: 40000, imageUrl: '/images/banh_cuon.png' },
    { restaurantId: restaurants[5].id, dishNameVn: 'Bánh Cuốn Ruốc Tôm', dishNameJp: 'エビそぼろバインクオン', ingredients: 'Bột gạo, ruốc tôm, hành phi', price: 42000, imageUrl: foodImage('Bánh Cuốn Ruốc Tôm') },
    { restaurantId: restaurants[5].id, dishNameVn: 'Bánh Cuốn Tôm', dishNameJp: 'エビバインクオン', ingredients: 'Bột gạo, tôm tươi, mộc nhĩ', price: 48000, imageUrl: foodImage('Bánh Cuốn Tôm') },
    { restaurantId: restaurants[5].id, dishNameVn: 'Bánh Cuốn Chay', dishNameJp: 'ベジタリアンバインクオン', ingredients: 'Bột gạo, nấm, cà rốt, đậu phụ', price: 36000, imageUrl: foodImage('Bánh Cuốn Chay') },
    { restaurantId: restaurants[5].id, dishNameVn: 'Nem Chua Rán', dishNameJp: '発酵豚揚げ', ingredients: 'Nem chua, bột chiên, tương ớt', price: 45000, imageUrl: foodImage('Nem Chua Rán') },
    { restaurantId: restaurants[5].id, dishNameVn: 'Sữa Đậu Nành', dishNameJp: '豆乳', ingredients: 'Đậu nành, lá dứa, đường phèn', price: 18000, imageUrl: foodImage('Sữa Đậu Nành') },
  ];

  const additionalMenuData = additionalRestaurantSeeds.flatMap((restaurant, restaurantIndex) =>
    restaurant.menus.map((menu) => ({
      restaurantId: restaurants[6 + restaurantIndex].id,
      dishNameVn: menu.dishNameVn,
      dishNameJp: menu.dishNameJp,
      ingredients: menu.ingredients,
      price: menu.price,
      imageUrl: foodImage(menu.dishNameVn),
    }))
  );

  const seededRestaurantIds = restaurants.map((restaurant) => restaurant.id);
  await prisma.menu.deleteMany({
    where: { restaurantId: { in: seededRestaurantIds } },
  });
  await prisma.menu.createMany({ data: [...menuData, ...additionalMenuData] });
  console.log(`✅ Menus created (${menuData.length + additionalMenuData.length} items)`);

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

  const generatedReviewComments = [
    'Menu đa dạng, phục vụ nhanh và món ăn đúng vị vùng miền.',
    'Không gian ổn, món ăn trình bày đẹp và nguyên liệu tươi.',
    'Rất hợp để giới thiệu bạn bè Nhật muốn thử món Việt.',
  ];

  const additionalReviewData = restaurants.slice(6).flatMap((restaurant, index) =>
    generatedReviewComments.map((comment, commentIndex) => ({
      userId: customers[(index + commentIndex) % customers.length].id,
      restaurantId: restaurant.id,
      rating: 4 + ((index + commentIndex) % 2),
      comment,
    }))
  );

  await prisma.review.deleteMany({
    where: {
      restaurantId: { in: seededRestaurantIds },
      userId: { in: customers.map((customer) => customer.id) },
    },
  });
  await prisma.review.createMany({ data: [...reviewData, ...additionalReviewData] });
  console.log(`✅ Reviews created (${reviewData.length + additionalReviewData.length} items)`);

  // ─── Promotions ─────────────────────────────────────────────
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
  const promotionMenus = await prisma.menu.findMany({
    where: { restaurantId: { in: restaurants.slice(0, 3).map((restaurant) => restaurant.id) } },
    orderBy: { id: 'asc' },
  });
  const firstMenuByRestaurant = new Map<number, number>();
  promotionMenus.forEach((menu) => {
    if (!firstMenuByRestaurant.has(menu.restaurantId)) {
      firstMenuByRestaurant.set(menu.restaurantId, menu.id);
    }
  });
  const promotionData = [
    { restaurantId: restaurants[0].id, menuId: firstMenuByRestaurant.get(restaurants[0].id) ?? null, title: 'ランチタイム割引', description: '11:00-14:00のご注文で10%OFF', discountPercent: 10, startDate: now, endDate: nextMonth, isActive: true },
    { restaurantId: restaurants[1].id, menuId: firstMenuByRestaurant.get(restaurants[1].id) ?? null, title: 'オバマセット特別価格', description: 'ブンチャーオバマセットが20%OFF', discountPercent: 20, startDate: now, endDate: nextMonth, isActive: true },
    { restaurantId: restaurants[2].id, menuId: firstMenuByRestaurant.get(restaurants[2].id) ?? null, title: 'ディナーコース割引', description: '4名様以上で15%OFF', discountPercent: 15, startDate: now, endDate: nextMonth, isActive: true },
  ];

  await prisma.promotion.deleteMany({
    where: {
      restaurantId: { in: promotionData.map((promotion) => promotion.restaurantId) },
      title: { in: promotionData.map((promotion) => promotion.title) },
    },
  });
  await prisma.promotion.createMany({
    data: promotionData,
  });
  console.log('✅ Promotions created');

  // ─── Saved Restaurants ──────────────────────────────────────
  await prisma.savedRestaurant.createMany({
    data: [
      { userId: customers[0].id, restaurantId: restaurants[0].id },
      { userId: customers[0].id, restaurantId: restaurants[2].id },
      { userId: customers[1].id, restaurantId: restaurants[1].id },
    ],
    skipDuplicates: true,
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
