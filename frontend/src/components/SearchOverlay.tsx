'use client';

import { History, MapPin } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

interface SearchOverlayProps {
  onSelect: (query: string) => void;
}

export default function SearchOverlay({ onSelect }: SearchOverlayProps) {
  const { t } = useLanguage();

  const popularSearches = [
    { label: t.search_pop_sushi },
    { label: t.search_pop_pho },
    { label: t.search_pop_wifi, icon: true },
    { label: t.search_pop_lunch },
    { label: t.search_pop_terrace },
  ];

  const popularCategories = [
    { label: t.search_cat_sushi, image: '/images/sushi.png', icon: 'restaurant' },
    { label: t.search_cat_cafe, image: '/images/cafe.png', icon: 'local_cafe' },
    { label: t.search_cat_traditional, image: '/images/traditional.png', icon: 'festival' },
  ];

  const recentSearches = [
    { 
      title: 'ハノイフォー 専門店', 
      subtitle: `${t.search_recent_item_cat}: ベトナム料理`, 
      time: t.search_recent_item_time_min.replace('{count}', '10') 
    },
    { 
      title: '隠れ家 カフェ', 
      subtitle: `${t.search_recent_item_cat}: カフェ / スイーツ`, 
      time: t.search_recent_item_time_hour.replace('{count}', '2') 
    },
    { 
      title: '六本木 高級寿司', 
      subtitle: `${t.search_recent_item_loc}: 東京都港区`, 
      time: t.search_recent_item_time_yesterday 
    },
  ];

  return (
    <div className="max-w-5xl mx-auto flex gap-12 px-6 pt-6">
      {/* Left Column */}
      <div className="flex-1 flex flex-col gap-8">
        
        {/* Popular Searches */}
        <div>
          <h3 className="text-sm font-bold text-primary mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            {t.search_popular_title}
          </h3>
          <div className="flex flex-wrap gap-3">
            {popularSearches.map((item, idx) => (
              <button
                key={idx}
                onClick={() => onSelect(item.label)}
                className="px-4 py-2 rounded-xl bg-surface-container-low text-sm font-medium hover:bg-surface-variant transition-colors flex items-center gap-2"
              >
                {item.icon && <span className="material-symbols-outlined text-[16px]">wifi</span>}
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Popular Categories */}
        <div>
          <h3 className="text-sm font-bold text-primary mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            {t.search_cat_title}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex gap-4">
              {popularCategories.slice(0, 2).map((cat, idx) => (
                <button 
                  key={idx} 
                  onClick={() => onSelect(cat.label)}
                  className="relative flex-1 h-32 rounded-2xl overflow-hidden group"
                >
                  <Image src={cat.image} alt={cat.label} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors"></div>
                  <div className="absolute bottom-4 left-4 text-white font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">{cat.icon}</span>
                    {cat.label}
                  </div>
                </button>
              ))}
            </div>
            <button 
              onClick={() => onSelect(popularCategories[2].label)}
              className="relative w-full h-32 rounded-2xl overflow-hidden group"
            >
              <Image src={popularCategories[2].image} alt={popularCategories[2].label} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg gap-2">
                <span className="material-symbols-outlined text-[24px]">{popularCategories[2].icon}</span>
                {popularCategories[2].label}
              </div>
            </button>
          </div>
        </div>

      </div>

      {/* Right Column: Recent Searches */}
      <div className="w-[360px] bg-surface-container-low rounded-3xl p-6 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-bold text-primary flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            {t.search_recent_title}
          </h3>
          <button className="text-xs text-on-surface-variant hover:text-primary">{t.search_recent_clear}</button>
        </div>

        <div className="flex flex-col gap-6 flex-1">
          {recentSearches.map((item, idx) => (
            <div key={idx} className="flex gap-4 items-start cursor-pointer group" onClick={() => onSelect(item.title)}>
              <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant group-hover:bg-primary group-hover:text-white transition-colors">
                <History className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-sm text-on-surface group-hover:text-primary">{item.title}</h4>
                  <span className="text-[10px] text-on-surface-variant">{item.time}</span>
                </div>
                <p className="text-xs text-on-surface-variant mt-1">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        <button className="w-full mt-8 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:opacity-90 transition-opacity">
          {t.search_recent_view_all}
        </button>
      </div>
    </div>
  );
}
