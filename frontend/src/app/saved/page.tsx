import NavHeader from "@/components/NavHeader";
import { getSavedRestaurants } from "@/actions/restaurant";
import {
  SavedPageHeader,
  FilterChipsSection,
  SavedRestaurantCard,
  EmptySavedState,
} from "@/components/saved";

export default async function SavedPage() {
  const savedRestaurants = await getSavedRestaurants();

  return (
    <div className="min-h-screen bg-background font-body text-on-background">
      <NavHeader />

      <main className="pt-24 pb-32 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <SavedPageHeader
          title="保存したレストラン"
          subtitle="保存したカフェ・飲食店"
        />

        {savedRestaurants && savedRestaurants.length > 0 ? (
          <>
            {/* Filter Chips */}
            <FilterChipsSection activeFilter="rating" />

            {/* Restaurant Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {savedRestaurants.map((restaurant: any) => {
                const avgRating =
                  restaurant.reviews && restaurant.reviews.length > 0
                    ? (
                        restaurant.reviews.reduce(
                          (acc: number, rev: any) => acc + rev.rating,
                          0,
                        ) / restaurant.reviews.length
                      ).toFixed(1)
                    : "N/A";

                return (
                  <SavedRestaurantCard
                    key={restaurant.id}
                    id={restaurant.id}
                    name={restaurant.name}
                    description={restaurant.address}
                    imageUrl={
                      restaurant.imageUrl ||
                      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                    }
                    rating={avgRating}
                    distance={1.2}
                    priceRange="$$"
                    availability="available"
                    initialSaved={true}
                  />
                );
              })}
            </div>
          </>
        ) : (
          <EmptySavedState
            message="保存されたレストランがありません"
            description="お気に入りのレストランを見つけて、保存アイコンをタップするとここに追加されます。"
            buttonText="レストランを探す"
            buttonHref="/"
          />
        )}
      </main>
    </div>
  );
}
