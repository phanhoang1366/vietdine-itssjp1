import NavHeader from '@/components/NavHeader';
import { getSavedRestaurants } from '@/actions/restaurant';
import { MapPin, Star, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default async function SavedPage() {
  const savedRestaurants = await getSavedRestaurants();

  return (
    <div className="min-h-screen bg-[#faf8f6] font-body text-[#3d2e28]">
      <NavHeader />

      <main className="max-w-5xl mx-auto px-6 py-10 pb-24">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">保存済みリスト</h1>
          <p className="text-[#827471] uppercase tracking-[0.2em] text-xs font-bold">Saved Collection / Danh sách đã lưu</p>
        </div>

        {savedRestaurants && savedRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedRestaurants.map((restaurant: any) => {
              const avgRating = restaurant.reviews && restaurant.reviews.length > 0 
                ? (restaurant.reviews.reduce((acc: number, rev: any) => acc + rev.rating, 0) / restaurant.reviews.length).toFixed(1)
                : 'N/A';

              return (
                <Link href={`/restaurant/${restaurant.id}`} key={restaurant.id}>
                  <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#f0ede8] group flex flex-col h-full">
                    {/* Image Area */}
                    <div className="relative h-48 bg-[#e5e2dd] overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                        alt={restaurant.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-[#775a19] flex items-center gap-1 shadow-sm">
                        <Star className="w-3.5 h-3.5" fill="currentColor" /> {avgRating}
                      </div>
                    </div>
                    
                    {/* Content Area */}
                    <div className="p-6 flex-1 flex flex-col">
                      <h2 className="font-extrabold text-xl mb-2 text-[#3d2e28] group-hover:text-[#775a19] transition-colors line-clamp-1">{restaurant.name}</h2>
                      
                      <div className="flex items-center gap-1.5 text-sm text-[#827471] mb-4 line-clamp-1">
                        <MapPin className="w-4 h-4 shrink-0" />
                        <span>{restaurant.address}</span>
                      </div>
                      
                      <div className="mt-auto pt-4 border-t border-[#f0ede8] flex flex-wrap gap-2">
                        {restaurant.isClean && (
                          <span className="px-2 py-1 bg-[#f6f3ee] text-[#504442] rounded-md text-[10px] font-bold">清潔感高</span>
                        )}
                        {restaurant.hasJpMenu && (
                          <span className="px-2 py-1 bg-[#f6f3ee] text-[#504442] rounded-md text-[10px] font-bold flex items-center gap-1">
                            <BookOpen className="w-3 h-3" /> 日本語メニュー
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-[#f6f3ee] rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-4xl text-[#d4c3bf]">bookmark</span>
            </div>
            <h2 className="text-xl font-bold mb-2">保存されたレストランがありません</h2>
            <p className="text-[#827471] mb-8 max-w-sm">
              お気に入りのレストランを見つけて、保存アイコンをタップするとここに追加されます。
            </p>
            <Link href="/" className="px-8 py-3 bg-[#361f1a] text-white rounded-full font-bold hover:bg-[#4e342e] transition-colors">
              レストランを探す
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
