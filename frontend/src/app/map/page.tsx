'use client';

import dynamic from 'next/dynamic';
import SearchBar from '@/components/SearchBar';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

// Dynamically import map to avoid SSR issues
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center bg-surface-variant text-on-surface-variant">地図を読み込み中...</div>
});

export default function MapPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q');
  
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    // Fetch restaurants based on query
    const fetchRestaurants = async () => {
      try {
        let url = 'http://localhost:3001/api/restaurants';
        if (q) {
          url += `?q=${encodeURIComponent(q)}`;
        }
        const res = await fetch(url);
        const data = await res.json();
        if (data && data.data) {
          setRestaurants(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch restaurants:', error);
      }
    };

    fetchRestaurants();
  }, [q]);

  return (
    <div className="flex flex-col h-screen bg-surface relative">
      {/* Top Search Bar */}
      <div className="absolute top-0 left-0 w-full z-10 bg-white/80 backdrop-blur-md shadow-sm">
        <SearchBar />
      </div>

      {/* Map Area */}
      <div className="flex-1 mt-[72px] relative z-0">
        <MapComponent restaurants={restaurants} />
      </div>

      {/* Bottom overlay for list view if needed (optional based on mockup, but let's keep it simple for now) */}
      <div className="absolute bottom-6 left-6 z-10 bg-white rounded-2xl shadow-xl p-4 w-80 max-h-96 overflow-y-auto">
        <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-[20px]">list</span>
          {q ? `「${q}」の検索結果` : '近くのレストラン'}
        </h3>
        {restaurants.length === 0 ? (
          <p className="text-sm text-on-surface-variant">レストランが見つかりません</p>
        ) : (
          <div className="flex flex-col gap-3">
            {restaurants.map((r: any) => (
              <div key={r.res_id} className="border-b border-outline-variant pb-3 last:border-0 last:pb-0">
                <h4 className="font-bold text-sm text-on-surface">{r.res_name}</h4>
                <p className="text-xs text-on-surface-variant line-clamp-1">{r.address}</p>
                <div className="flex gap-2 mt-2">
                  {r.is_clean && <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-100">清潔</span>}
                  {r.has_jp_menu && <span className="text-[10px] px-2 py-0.5 bg-green-50 text-green-700 rounded border border-green-100">日本語メニュー</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
