'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, User, Home, Map as MapIcon, Heart, Calendar, Settings, MapPin, Star } from 'lucide-react';
import Link from 'next/link';

// Dynamically import map to avoid SSR issues
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center bg-[#252831] text-white/50">地図を読み込み中...</div>
});

export default function MapPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState(q);
  const [activeRestaurantId, setActiveRestaurantId] = useState<number | null>(null);
  
  const carouselRef = useRef<HTMLDivElement>(null);

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
          // Set first as active
          if (data.data.length > 0) {
            setActiveRestaurantId(data.data[0].id || data.data[0].res_id);
          }
        }
      } catch (error) {
        console.error('Failed to fetch restaurants:', error);
      }
    };

    fetchRestaurants();
  }, [q]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.history.pushState(null, '', `/map?q=${encodeURIComponent(searchQuery)}`);
      // Re-trigger fetch or rely on Next.js routing if we use router.push
      // For a quick fix, reload:
      window.location.search = `?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  // Handle map marker click
  const handleRestaurantSelect = (id: number) => {
    setActiveRestaurantId(id);
    // Scroll carousel to the selected item
    if (carouselRef.current) {
      const card = carouselRef.current.querySelector(`[data-id="${id}"]`) as HTMLElement;
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  };

  return (
    <div className="flex h-screen bg-[#faf8f6] font-body overflow-hidden">
      
      {/* Left Sidebar */}
      <aside className="w-[280px] h-full flex flex-col border-r border-[#f0ede8] bg-[#faf8f6] z-20 shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        {/* Logo Area */}
        <div className="h-[80px] flex items-center px-8">
          <Link href="/" className="text-2xl font-extrabold tracking-tighter text-[#3d2e28]">
            VietDine
          </Link>
        </div>

        {/* Greetings */}
        <div className="px-8 py-6 pt-2">
          <h2 className="text-[20px] font-bold text-[#3d2e28] mb-1">こんにちは</h2>
          <p className="text-[13px] text-[#827471]">お腹が空きましたか？</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 flex flex-col gap-1.5 mt-2">
          <Link href="/" className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[#504442] hover:bg-[#f0ede8] transition-colors group">
            <Home className="w-5 h-5 text-[#827471] group-hover:text-[#3d2e28] transition-colors" strokeWidth={1.5} />
            <span className="font-bold text-[14px]">ホーム</span>
          </Link>
          <div className="flex items-center gap-4 px-4 py-3.5 rounded-2xl bg-[#f0ede8] text-[#3d2e28] transition-colors cursor-pointer">
            <MapIcon className="w-5 h-5 text-[#3d2e28]" strokeWidth={2} />
            <span className="font-bold text-[14px]">検索</span>
          </div>
          <Link href="/saved" className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[#504442] hover:bg-[#f0ede8] transition-colors group">
            <Heart className="w-5 h-5 text-[#827471] group-hover:text-[#3d2e28] transition-colors" strokeWidth={1.5} />
            <span className="font-bold text-[14px]">お気に入り</span>
          </Link>
          <Link href="/reservations" className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[#504442] hover:bg-[#f0ede8] transition-colors group">
            <Calendar className="w-5 h-5 text-[#827471] group-hover:text-[#3d2e28] transition-colors" strokeWidth={1.5} />
            <span className="font-bold text-[14px]">予約</span>
          </Link>
          <Link href="/profile" className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[#504442] hover:bg-[#f0ede8] transition-colors group">
            <Settings className="w-5 h-5 text-[#827471] group-hover:text-[#3d2e28] transition-colors" strokeWidth={1.5} />
            <span className="font-bold text-[14px]">設定</span>
          </Link>
        </nav>

        {/* Bottom CTA */}
        <div className="p-6">
          <button className="w-full py-[18px] bg-[#361f1a] text-white rounded-xl font-bold text-[13px] hover:bg-[#4e342e] transition-colors shadow-[0_8px_16px_rgba(54,31,26,0.15)]">
            テーブルを予約する
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full relative">
        
        {/* Top Header Overlay */}
        <header className="absolute top-0 left-0 w-full h-[90px] flex items-center justify-between px-8 z-10 pointer-events-none">
          {/* Top Links */}
          <div className="flex items-center gap-8 pointer-events-auto">
            <div className="font-bold text-[15px] text-[#3d2e28] border-b-[3px] border-[#3d2e28] pb-1 cursor-pointer">マップ</div>
            <div className="font-bold text-[15px] text-[#827471] hover:text-[#3d2e28] transition-colors cursor-pointer drop-shadow-sm">レストラン</div>
            <div className="font-bold text-[15px] text-[#827471] hover:text-[#3d2e28] transition-colors cursor-pointer drop-shadow-sm">特集</div>
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-4 pointer-events-auto pt-4 pr-4">
            <form onSubmit={handleSearch} className="flex items-center bg-white/95 backdrop-blur-md rounded-full pl-5 pr-3 py-2 w-[340px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-white">
              <Search className="w-4 h-4 text-[#827471] mr-3" />
              <input
                type="text"
                placeholder="ハノイの和食レストランを検索."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-[13px] text-[#3d2e28] placeholder:text-[#a09491] py-1.5"
              />
            </form>
            
            <button className="p-3 bg-white/95 backdrop-blur-md rounded-full text-[#3d2e28] shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:bg-white transition-colors border border-white">
              <SlidersHorizontal className="w-5 h-5" strokeWidth={1.5} />
            </button>
            <button className="p-3 bg-white/95 backdrop-blur-md rounded-full text-[#3d2e28] shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:bg-white transition-colors border border-white">
              <User className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>
        </header>

        {/* Map */}
        <div className="flex-1 relative z-0 bg-[#252831]">
          <MapComponent 
            restaurants={restaurants} 
            activeRestaurantId={activeRestaurantId}
            onRestaurantSelect={handleRestaurantSelect}
          />
        </div>

        {/* Bottom Carousel */}
        <div className="absolute bottom-8 left-0 w-full z-10 pointer-events-none px-8">
          <div 
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto pb-6 pt-4 pointer-events-auto snap-x snap-mandatory hide-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {restaurants.map((restaurant: any, index) => {
              const resId = restaurant.id || restaurant.res_id;
              const isActive = resId === activeRestaurantId;
              
              // Mocking some data for visual fidelity to mockup
              const isAvailable = index % 2 === 0; 
              const price = index % 2 === 0 ? '¥¥' : '¥¥¥';
              const rating = restaurant.reviews?.length > 0 ? '4.8' : '4.9'; // Mock
              const imageUrl = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80";

              return (
                <div 
                  key={resId} 
                  data-id={resId}
                  onClick={() => handleRestaurantSelect(resId)}
                  className={`shrink-0 w-[340px] bg-[#faf8f6] rounded-[24px] overflow-hidden shadow-[0_12px_32px_rgba(0,0,0,0.15)] snap-start cursor-pointer border-2 transition-all duration-300 ${
                    isActive ? 'border-[#db5a5a] scale-[1.02] shadow-[0_16px_40px_rgba(219,90,90,0.2)]' : 'border-transparent hover:border-[#f0ede8]'
                  }`}
                >
                  {/* Card Image */}
                  <div className="h-[140px] relative overflow-hidden bg-[#e5e2dd]">
                    <img src={imageUrl} alt={restaurant.name || restaurant.res_name} className="w-full h-full object-cover" />
                    
                    {/* Badge */}
                    <div className="absolute top-4 right-4">
                      {isAvailable ? (
                        <div className="px-3 py-1 bg-[#1c3821]/90 backdrop-blur-md text-white text-[11px] font-bold rounded-lg shadow-sm">
                          空席あり
                        </div>
                      ) : (
                        <div className="px-3 py-1 bg-[#8a2a2a]/90 backdrop-blur-md text-white text-[11px] font-bold rounded-lg shadow-sm">
                          本日満席
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-[17px] text-[#3d2e28] line-clamp-1">{restaurant.name || restaurant.res_name}</h3>
                      <div className="flex items-center gap-1 text-[#775a19] font-bold text-[13px] shrink-0">
                        <Star className="w-3.5 h-3.5" fill="currentColor" /> {rating}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[#827471] text-[12px]">
                      <MapPin className="w-3.5 h-3.5" strokeWidth={2} />
                      <span className="line-clamp-1">{restaurant.address}</span>
                    </div>

                    <div className="flex items-center justify-between mt-1 pt-1">
                      <div className="text-[12px] font-bold text-[#827471]">
                        鮨 • {price}
                      </div>
                      
                      {isAvailable ? (
                        <Link href={`/restaurant/${resId}`}>
                          <button className="px-5 py-2.5 bg-[#361f1a] text-white text-[12px] font-bold rounded-full hover:bg-[#4e342e] transition-colors shadow-sm">
                            詳細を見る
                          </button>
                        </Link>
                      ) : (
                        <button className="px-5 py-2.5 bg-[#e5e2dd] text-[#827471] text-[12px] font-bold rounded-full cursor-not-allowed">
                          キャンセル待ち
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
      </div>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        /* Adjust Leaflet zoom controls so it doesn't overlap carousel */
        .leaflet-bottom.leaflet-right {
          bottom: 280px !important;
          right: 24px !important;
        }
        
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
          border-radius: 8px !important;
          overflow: hidden;
        }
        
        .leaflet-control-zoom-in, .leaflet-control-zoom-out {
          background-color: #faf8f6 !important;
          color: #3d2e28 !important;
          border-bottom: 1px solid #f0ede8 !important;
          width: 36px !important;
          height: 36px !important;
          line-height: 36px !important;
          font-size: 18px !important;
        }
        
        .leaflet-control-zoom-in:hover, .leaflet-control-zoom-out:hover {
          background-color: #ffffff !important;
        }
      `}</style>
    </div>
  );
}
