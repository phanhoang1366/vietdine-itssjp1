'use client';

import { useLanguage } from '@/context/LanguageContext';
import NavHeader from '@/components/NavHeader';
import { MapPin, Star } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import BookingModal from '@/components/BookingModal';

interface RestaurantClientProps {
  restaurant: any;
  isSaved: boolean;
}

export default function RestaurantClient({ restaurant, isSaved }: RestaurantClientProps) {
  const { t } = useLanguage();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const avgRating = restaurant.reviews.length > 0 
    ? (restaurant.reviews.reduce((acc: number, rev: any) => acc + rev.rating, 0) / restaurant.reviews.length).toFixed(1)
    : 'N/A';

  return (
    <div className="min-h-screen bg-[#faf8f6] font-body text-[#3d2e28]">
      <NavHeader />

      <main className="max-w-5xl mx-auto px-6 py-10 pb-24">
        
        {/* Hero Section */}
        <div className="relative w-full h-[360px] md:h-[460px] rounded-3xl overflow-hidden mb-12 shadow-sm">
          <img 
            src={restaurant.imageUrl || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"} 
            alt={restaurant.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 w-full p-8 md:p-10 flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="text-white flex-1">
              <div className="flex gap-3 mb-4">
                <span className="px-3 py-1 bg-[#8a6b32] text-white text-[11px] font-bold rounded-full">{t.rest_community_rec}</span>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[11px] font-bold rounded-full flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-current" /> {avgRating}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-white tracking-tight">{restaurant.name}</h1>
              <p className="text-white/90 text-[15px] font-medium">{t.rest_placeholder_subtitle}</p>
            </div>
            
            <div className="flex gap-4 shrink-0">
              <button className="px-6 py-3.5 bg-white text-[#3d2e28] font-bold text-[13px] rounded-xl hover:bg-[#f0ede8] transition-colors shadow-sm">
                {t.rest_contact}
              </button>
              <button 
                className="px-6 py-3.5 bg-[#3d2e28] text-white font-bold text-[13px] rounded-xl hover:bg-[#2a1f1b] transition-colors shadow-sm border border-[#504442]"
                onClick={() => setIsBookingModalOpen(true)}
              >
                {t.restaurant_reservation}
              </button>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Main Info (Left Column) */}
          <div className="md:col-span-2 space-y-12">
            
            {/* Store Details */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-extrabold text-[#3d2e28]">{t.rest_details_title}</h2>
                <div className="flex gap-4 text-[#827471]">
                  <span className="material-symbols-outlined text-[24px]">wifi</span>
                  <span className="material-symbols-outlined text-[24px]">workspace_premium</span>
                  <span className="material-symbols-outlined text-[24px]">wine_bar</span>
                </div>
              </div>
              <p className="text-[#504442] text-[15px] leading-relaxed">
                {restaurant.description || t.rest_placeholder_desc}
              </p>
            </div>

            {/* Seasonal Menu */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-extrabold text-[#3d2e28]">{t.rest_seasonal_menu}</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {restaurant.menus?.map((menu: any) => (
                  <div key={menu.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#f0ede8] flex flex-col group">
                    <div className="h-48 overflow-hidden bg-[#e5e2dd]">
                      <img 
                        src={menu.imageUrl && menu.imageUrl !== 'default.png' ? menu.imageUrl : "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"} 
                        alt={menu.dishNameVn} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-extrabold text-lg text-[#3d2e28]">{menu.dishNameVn}</h3>
                        <span className="font-bold text-[15px] text-[#3d2e28]">{menu.price ? `${(menu.price / 1000).toLocaleString()}k` : 'N/A'}</span>
                      </div>
                      <p className="text-[11px] font-bold text-[#8a6b32] mb-3">{menu.dishNameJp}</p>
                      <p className="text-[13px] text-[#827471] mb-6 leading-relaxed flex-1">
                        {menu.ingredients || 'Đang cập nhật nguyên liệu...'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="pt-8 border-t border-[#f0ede8]">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-extrabold text-[#3d2e28]">{t.rest_trust_reviews}</h2>
                <div className="flex items-center gap-2">
                  <span className="text-[#8a6b32] font-bold text-[13px]">{t.rest_reviews_count.replace('{count}', '42')}</span>
                  <span className="material-symbols-outlined text-[#8a6b32] text-[18px]">verified</span>
                </div>
              </div>
              
              <div className="bg-[#f0ede8]/50 p-6 rounded-3xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#3eb489] rounded-full overflow-hidden border-2 border-white shadow-sm flex items-center justify-center text-white">
                      <span className="material-symbols-outlined text-[20px]">face</span>
                    </div>
                    <div>
                      <div className="font-bold text-[14px] text-[#3d2e28]">Takeshi Sato</div>
                      <div className="text-[11px] text-[#a09491]">{t.rest_review_author_loc}</div>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-[#8a6b32]" fill="currentColor" />
                    ))}
                  </div>
                </div>
                <p className="text-[13px] text-[#504442] leading-relaxed italic">
                  "{t.rest_review_placeholder}"
                </p>
              </div>
            </div>

          </div>

          {/* Sidebar (Right Column) */}
          <div className="space-y-6">
            <div className="w-full h-[220px] bg-[#d3ceca] rounded-3xl relative overflow-hidden flex items-center justify-center">
              <span className="material-symbols-outlined text-[#3d2e28] text-5xl">location_on</span>
              <div className="absolute inset-0 bg-white/20"></div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#f0ede8]">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-[11px] font-bold text-[#827471] mb-1">{t.rest_hours}</p>
                  <p className="text-[14px] text-[#3d2e28] font-bold">{restaurant.openingHours || '11:30 - 22:00'}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-[#dcfce7] text-[#166534] text-[10px] font-bold rounded">{t.rest_status_open}</span>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-bold text-[#827471] mb-1">{t.rest_budget}</p>
                  <p className="text-[14px] text-[#3d2e28] font-bold">1.5M - 5M VND</p>
                </div>
              </div>
            </div>

            <div className="bg-[#faf8f6] rounded-3xl p-6 border border-[#f0ede8]">
              <h3 className="font-bold text-[14px] mb-4 text-[#3d2e28] flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#8a6b32]">info</span>
                {t.rest_dining_info}
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-[12px] text-[#504442]">
                  <span className="material-symbols-outlined text-[16px] text-[#2e7d32]">check_circle</span>
                  <span>{t.rest_info_allergy}</span>
                </li>
                <li className="flex items-start gap-3 text-[12px] text-[#504442]">
                  <span className="material-symbols-outlined text-[16px] text-[#2e7d32]">check_circle</span>
                  <span>{t.rest_info_vege}</span>
                </li>
                <li className="flex items-start gap-3 text-[12px] text-[#504442]">
                  <span className="material-symbols-outlined text-[16px] text-[#2e7d32]">check_circle</span>
                  <span>{t.rest_info_halal}</span>
                </li>
              </ul>
            </div>

            <div className="pt-2">
              <button 
                className="w-full bg-[#3d2e28] text-white py-4 rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 hover:bg-[#2a1f1b] transition-colors shadow-sm"
                onClick={() => setIsBookingModalOpen(true)}
              >
                <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                {t.booking_reserve_now}
              </button>
            </div>
            
          </div>
          
        </div>
        <BookingModal 
          isOpen={isBookingModalOpen} 
          onClose={() => setIsBookingModalOpen(false)} 
          restaurantId={restaurant.id} 
          restaurantName={restaurant.name} 
          maxSeats={restaurant.maxSeats} 
        />
      </main>
    </div>
  );
}
