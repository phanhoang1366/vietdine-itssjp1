export interface ReviewLike {
  id?: number;
  rating?: number | null;
  comment?: string | null;
  createdAt?: string | null;
  user?: {
    fullName?: string | null;
    avatarUrl?: string | null;
  } | null;
}

export interface MenuLike {
  id?: number;
  dishNameVn?: string | null;
  dishNameJp?: string | null;
  ingredients?: string | null;
  imageUrl?: string | null;
  price?: number | null;
  promotions?: Array<{
    id: number;
    title: string;
    discountPercent: number;
    endDate?: string | null;
  }> | null;
}

export interface RestaurantLike {
  id: number;
  name: string;
  address?: string | null;
  imageUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  openingHours?: string | null;
  description?: string | null;
  reviews?: ReviewLike[] | null;
  menus?: MenuLike[] | null;
  owner?: {
    fullName?: string | null;
    avatarUrl?: string | null;
    emailPhone?: string | null;
  } | null;
  categories?: string | null;
  maxSeats?: number | null;
  activeReservationGuestCount?: number | null;
}

export function getAverageRating(restaurant: RestaurantLike) {
  const ratings = restaurant.reviews
    ?.map((review) => review.rating)
    .filter((rating): rating is number => typeof rating === 'number');

  if (!ratings?.length) return 'N/A';

  const average = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
  return average.toFixed(1);
}

export function getReviewCount(restaurant: RestaurantLike) {
  return restaurant.reviews?.length ?? 0;
}

function formatPrice(price: number) {
  if (price >= 1000000) {
    const millions = price / 1000000;
    return `${Number.isInteger(millions) ? millions.toFixed(0) : millions.toFixed(1)}M`;
  }

  return `${Math.round(price / 1000)}k`;
}

export function getPriceRange(restaurant: RestaurantLike) {
  const prices = restaurant.menus
    ?.map((menu) => menu.price)
    .filter((price): price is number => typeof price === 'number' && price > 0)
    .sort((a, b) => a - b);

  if (!prices?.length) return 'N/A';

  const min = prices[0];
  const max = prices[prices.length - 1];

  if (min === max) return `${formatPrice(min)} VND`;
  return `${formatPrice(min)} - ${formatPrice(max)} VND`;
}

export function isRestaurantAvailable(restaurant: RestaurantLike) {
  if (!restaurant.maxSeats) return true;
  return (restaurant.activeReservationGuestCount ?? 0) < restaurant.maxSeats;
}

export function getPrimaryCategory(restaurant: RestaurantLike) {
  return restaurant.categories?.split(',')[0]?.trim() || 'Restaurant';
}
