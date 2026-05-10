import { notFound } from 'next/navigation';
import { getRestaurantById, checkSavedStatus } from '@/actions/restaurant';
import RestaurantClient from './RestaurantClient';

export default async function RestaurantDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const restaurantId = parseInt(id, 10);
  if (isNaN(restaurantId)) notFound();

  const restaurant = await getRestaurantById(restaurantId);
  if (!restaurant) notFound();

  const isSaved = await checkSavedStatus(restaurantId);

  return <RestaurantClient restaurant={restaurant} isSaved={isSaved} />;
}
