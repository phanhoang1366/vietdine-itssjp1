'use client';

import NavHeader from '@/components/NavHeader';
import { useLanguage } from '@/context/LanguageContext';
import { MapPin, Star, BookOpen, Heart } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function SavedPage() {
  const { t } = useLanguage();
  const [savedRestaurants, setSavedRestaurants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSaved() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/saved`, {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setSavedRestaurants(data.data || []);
        }
      } catch (err) {
        console.error('Saved fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSaved();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf8f6] font-body text-[#3d2e28]">
        <NavHeader />
        <main className="flex-1 flex items-center justify-center py-20">
          <p className="text-[#827471]">{t.common_loading}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f6] font-body text-[#3d2e28]">
      <NavHeader />

      <main className="max-w-5xl mx-auto px-6 py-10 pb-24">
        <div className="mb-10 text-left">
          <h1 className="text-[2rem] font-extrabold mb-2">{t.saved_page_title}</h1>
          <p className="text-[#504442] text-[15px]">{t.saved_page_subtitle}</p>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#1c3821] text-white rounded-xl text-[13px] font-bold shadow-sm">
              <Star className="w-3.5 h-3.5 fill-current" /> {t.saved_filter_rating}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#f0ede8] text-[#3d2e28] rounded-xl text-[13px] font-bold hover:bg-[#eadecd] transition-colors">
              <MapPin className="w-3.5 h-3.5" /> {t.saved_filter_distance}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#f0ede8] text-[#3d2e28] rounded-xl text-[13px] font-bold hover:bg-[#eadecd] transition-colors">
              <span className="material-symbols-outlined text-[14px]">chair</span> {t.saved_filter_seats}
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#f0ede8] text-[#3d2e28] rounded-xl text-[13px] font-bold hover:bg-[#eadecd] transition-colors">
            <span className="material-symbols-outlined text-[14px]">tune</span> {t.saved_filter_btn}
          </button>
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
                    <div className="relative h-[220px] bg-[#e5e2dd] overflow-hidden rounded-[20px]">
                      <img 
                        src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                        alt={restaurant.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Heart Icon */}
                      <div className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm z-10 cursor-pointer">
                        <Heart className="w-5 h-5 text-[#ba1a1a] fill-current" />
                      </div>
                      
                      {/* Availability Badge */}
                      <div className="absolute bottom-4 left-4 z-10">
                        {restaurant.id % 2 === 0 ? (
                          <div className="px-3 py-1 bg-[#1c3821]/90 backdrop-blur-md text-white text-[11px] font-bold rounded-lg shadow-sm">
                            {t.saved_available}
                          </div>
                        ) : (
                          <div className="px-3 py-1 bg-[#ba1a1a]/90 backdrop-blur-md text-white text-[11px] font-bold rounded-lg shadow-sm">
                            {t.saved_full}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Content Area */}
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h2 className="font-extrabold text-[17px] text-[#3d2e28] line-clamp-1">{restaurant.name}</h2>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#fcd34d] text-[#775a19] rounded-md text-[13px] font-bold shrink-0">
                          <Star className="w-3.5 h-3.5 fill-current" /> {avgRating}
                        </div>
                      </div>
                      
                      <p className="text-[13px] text-[#504442] mb-4 line-clamp-1">
                        {restaurant.address || restaurant.name}
                      </p>
                      
                      <div className="mt-auto flex items-center gap-4 text-[12px] text-[#827471]">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>1.2 km</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[14px]">payments</span>
                          <span>$$$</span>
                        </div>
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
            <h2 className="text-xl font-bold mb-2">{t.saved_empty}</h2>
            <p className="text-[#827471] mb-8 max-w-sm">
              {t.saved_empty_sub}
            </p>
            <Link href="/" className="px-8 py-3 bg-[#361f1a] text-white rounded-full font-bold hover:bg-[#4e342e] transition-colors">
              {t.saved_find}
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
