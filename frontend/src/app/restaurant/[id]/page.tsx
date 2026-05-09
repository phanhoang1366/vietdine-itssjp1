import { notFound } from 'next/navigation';
import NavHeader from '@/components/NavHeader';
import SaveRestaurantButton from '@/components/SaveRestaurantButton';
import { getRestaurantById, checkSavedStatus } from '@/actions/restaurant';
import { MapPin, Clock, Star, Users, Snowflake, BookOpen, Languages } from 'lucide-react';

export default async function RestaurantDetailsPage({ params }: { params: { id: string } }) {
  const restaurantId = parseInt(params.id, 10);
  if (isNaN(restaurantId)) notFound();

  const restaurant = await getRestaurantById(restaurantId);
  if (!restaurant) notFound();

  const isSaved = await checkSavedStatus(restaurantId);

  // Calculate average rating
  const avgRating = restaurant.reviews.length > 0 
    ? (restaurant.reviews.reduce((acc: number, rev: any) => acc + rev.rating, 0) / restaurant.reviews.length).toFixed(1)
    : 'N/A';

  return (
    <div className="min-h-screen bg-[#faf8f6] font-body text-[#3d2e28]">
      <NavHeader />

      <main className="max-w-5xl mx-auto px-6 py-10 pb-24">
        
        {/* Hero Section */}
        <div className="relative w-full h-[300px] md:h-[400px] rounded-3xl overflow-hidden mb-8 shadow-md">
          {/* Mock image placeholder if none exists */}
          <div className="w-full h-full bg-[#3d2e28] flex items-center justify-center relative">
            <img 
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
              alt={restaurant.name} 
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          </div>
          
          <div className="absolute bottom-0 left-0 w-full p-8 flex justify-between items-end">
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-2 text-white">{restaurant.name}</h1>
              <div className="flex items-center gap-2 text-white/90">
                <MapPin className="w-5 h-5" />
                <span className="text-lg">{restaurant.address}</span>
              </div>
            </div>
            
            <div className="mb-2">
              <SaveRestaurantButton restaurantId={restaurantId} initialSaved={isSaved} />
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Main Info (Left Column) */}
          <div className="md:col-span-2 space-y-8">
            
            {/* Features & Stats */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-2xl shadow-sm border border-[#f0ede8]">
                <Star className="w-6 h-6 text-[#775a19]" fill="currentColor" />
                <div>
                  <div className="font-extrabold text-lg leading-none">{avgRating}</div>
                  <div className="text-[10px] uppercase tracking-wider text-[#827471]">{restaurant.reviews.length} reviews</div>
                </div>
              </div>
              
              {restaurant.openingHours && (
                <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl shadow-sm border border-[#f0ede8]">
                  <Clock className="w-5 h-5 text-[#827471]" />
                  <span className="font-bold text-sm">{restaurant.openingHours}</span>
                </div>
              )}
            </div>

            {/* Badges/Tags */}
            <div>
              <h2 className="text-lg font-bold mb-4">店舗の特徴 / Features</h2>
              <div className="flex flex-wrap gap-3">
                {restaurant.isClean && (
                  <div className="px-4 py-2 bg-[#f6f3ee] text-[#504442] rounded-full text-sm font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">cleaning_services</span> 清潔感高 / Clean
                  </div>
                )}
                {restaurant.hasJpMenu && (
                  <div className="px-4 py-2 bg-[#f6f3ee] text-[#504442] rounded-full text-sm font-bold flex items-center gap-2">
                    <BookOpen className="w-[18px] h-[18px]" /> 日本語メニュー / JP Menu
                  </div>
                )}
                {restaurant.hasAirCon && (
                  <div className="px-4 py-2 bg-[#f6f3ee] text-[#504442] rounded-full text-sm font-bold flex items-center gap-2">
                    <Snowflake className="w-[18px] h-[18px]" /> エアコン / Air Con
                  </div>
                )}
                {restaurant.hasJpStaff && (
                  <div className="px-4 py-2 bg-[#f6f3ee] text-[#504442] rounded-full text-sm font-bold flex items-center gap-2">
                    <Languages className="w-[18px] h-[18px]" /> 日本語対応スタッフ / JP Staff
                  </div>
                )}
              </div>
            </div>

            {/* Menu Section */}
            <div>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined">restaurant_menu</span>
                メニュー / Menu
              </h2>
              {restaurant.menus && restaurant.menus.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {restaurant.menus.map((menu: any) => (
                    <div key={menu.id} className="bg-white p-4 rounded-2xl shadow-sm border border-[#f0ede8] flex items-center gap-4 hover:shadow-md transition-shadow">
                      <div className="w-16 h-16 bg-[#f6f3ee] rounded-xl overflow-hidden shrink-0">
                        {menu.imageUrl && menu.imageUrl !== 'default.png' ? (
                          <img src={menu.imageUrl} alt={menu.dishNameJp} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#827471]">
                            <span className="material-symbols-outlined text-[24px]">image</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-[15px] text-[#3d2e28]">{menu.dishNameJp}</h3>
                        <p className="text-sm text-[#827471]">{menu.dishNameVn}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[#827471] italic text-sm">メニュー情報がありません / No menu available</p>
              )}
            </div>

            {/* Reviews Section */}
            <div>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined">reviews</span>
                レビュー / Reviews
              </h2>
              <div className="space-y-4">
                {restaurant.reviews && restaurant.reviews.length > 0 ? (
                  restaurant.reviews.map((review: any) => (
                    <div key={review.id} className="bg-white p-5 rounded-3xl shadow-sm border border-[#f0ede8]">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#e9c176] rounded-full flex items-center justify-center text-white font-bold">
                            {review.user?.fullName?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-[#3d2e28]">{review.user?.fullName || 'Anonymous'}</div>
                            <div className="text-[10px] text-[#827471]">{new Date(review.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < review.rating ? 'text-[#775a19]' : 'text-[#e5e2dd]'}`} 
                              fill="currentColor" 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-[#504442] leading-relaxed">
                        {review.comment || 'No comment provided.'}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-[#827471] italic text-sm">まだレビューがありません / No reviews yet.</p>
                )}
              </div>
            </div>

          </div>

          {/* Sidebar (Right Column) */}
          <div className="space-y-6">
            <div className="bg-[#f5f2eb] rounded-3xl p-6">
              <h3 className="font-bold text-lg mb-4 text-[#3d2e28]">オーナー情報 / Owner</h3>
              {restaurant.owner ? (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-full overflow-hidden shadow-sm flex shrink-0 items-center justify-center">
                    {restaurant.owner.avatarUrl ? (
                       <img src={restaurant.owner.avatarUrl} alt={restaurant.owner.fullName} className="w-full h-full object-cover" />
                    ) : (
                       <span className="material-symbols-outlined text-[#827471]">person</span>
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-[15px]">{restaurant.owner.fullName}</div>
                    <div className="text-xs text-[#827471]">レストラン管理者</div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-[#827471]">N/A</p>
              )}
            </div>

            <div className="bg-[#fffdf9] border border-[#f3e8d5] rounded-3xl p-6">
              <h3 className="font-bold text-[15px] mb-2 text-[#775a19] flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                予約 / Reservation
              </h3>
              <p className="text-sm text-[#504442] mb-6">
                このレストランは予約を受け付けています。
              </p>
              <button className="w-full py-4 bg-[#361f1a] text-white rounded-2xl font-bold hover:bg-[#4e342e] transition-colors shadow-lg">
                予約する / Book Now
              </button>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
