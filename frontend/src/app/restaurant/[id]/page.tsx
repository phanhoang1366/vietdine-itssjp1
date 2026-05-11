import { notFound } from "next/navigation";
import NavHeader from "@/components/NavHeader";
import { getRestaurantById, checkSavedStatus } from "@/actions/restaurant";
import HeroSection from "@/components/restaurant/HeroSection";
import RestaurantDescription from "@/components/restaurant/RestaurantDescription";
import MenuSection from "@/components/restaurant/MenuSection";
import ReviewsSection from "@/components/restaurant/ReviewsSection";
import LocationInfoCard from "@/components/restaurant/LocationInfoCard";
import SafetyInfoCard from "@/components/restaurant/SafetyInfoCard";
import ReservationCard from "@/components/restaurant/ReservationCard";

export default async function RestaurantDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const restaurantId = parseInt(id, 10);
  if (isNaN(restaurantId)) notFound();

  const restaurant = await getRestaurantById(restaurantId);
  if (!restaurant) notFound();

  const reviews = restaurant.reviews ?? [];
  const menus = restaurant.menus ?? [];
  const isSaved = await checkSavedStatus(restaurantId);

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc: number, rev: any) => acc + rev.rating, 0) /
          reviews.length
        ).toFixed(1)
      : "N/A";

  return (
    <div className="min-h-screen bg-background font-body text-on-surface">
      <NavHeader />

      <main className="pt-20 pb-24 max-w-screen-xl mx-auto px-4 md:px-8">
        <HeroSection
          name={restaurant.name}
          imageUrl={
            restaurant.imageUrl ||
            "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
          }
          rating={avgRating}
          reviewCount={reviews.length}
          restaurantId={restaurantId}
          initialSaved={isSaved}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-16">
            <RestaurantDescription
              description={
                restaurant.description ||
                "ハノイの中心部で本格的な懐石料理の神髄をお届けします。禅の精神に基づいた空間で、四季折々の食材を活かした芸術的な一皿をお楽しみください。"
              }
              features={{
                wifi: true,
                temple: true,
                wine: true,
              }}
            />

            {menus.length > 0 && (
              <MenuSection
                items={menus.map((menu: any) => ({
                  id: menu.id,
                  dishNameJp: menu.dishNameJp,
                  dishNameVn: menu.dishNameVn,
                  imageUrl: menu.imageUrl,
                  price: menu.price ?? 0,
                  description: menu.description ?? menu.ingredients ?? "",
                  tags: menu.tags || [],
                }))}
              />
            )}

            {reviews && reviews.length > 0 && (
              <ReviewsSection
                reviews={reviews.map((review: any) => ({
                  id: review.id,
                  user: {
                    fullName: review.user?.fullName || "Anonymous",
                    avatarUrl: review.user?.avatarUrl,
                  },
                  rating: review.rating,
                  comment: review.comment,
                  createdAt: review.createdAt,
                }))}
                totalReviews={reviews.length}
              />
            )}
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              <LocationInfoCard
                address={restaurant.address}
                mapImageUrl={restaurant.mapImageUrl}
                openingHours={restaurant.openingHours}
                isOpen={true}
                budgetRange={restaurant.budgetRange || "1.5M - 5M VND"}
              />

              <SafetyInfoCard />

              <ReservationCard restaurantId={restaurantId} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
