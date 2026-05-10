'use client';

import NavHeader from '@/components/NavHeader';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Search, MapPin, Star, ChevronDown, CheckCircle2, Globe2, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getRestaurants } from '@/actions/restaurant';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const { t } = useLanguage();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    getRestaurants().then(data => setRestaurants(data.slice(0, 6)));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/map?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  // Search/List View for authenticated users (or the existing default view)
  const renderSearchView = () => (
    <main className="max-w-6xl mx-auto px-6 py-8 animate-fade-in">
      {/* Hero Map & Search Split */}
      <div className="w-full h-[460px] rounded-[32px] overflow-hidden flex shadow-md mb-10 border border-[#f0ede8]">
        {/* Left: Search Area */}
        <div className="w-full md:w-[55%] relative flex flex-col justify-center px-12 z-10">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-[-1]">
            <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Hero bg" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-[#3d2e28]/80 mix-blend-multiply"></div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-8 tracking-tight">
            {t.home_search_title}
          </h1>
          
          <form onSubmit={handleSearch} className="bg-white p-2 rounded-2xl flex items-center shadow-lg w-full max-w-md">
            <div className="flex items-center flex-1 px-4">
              <Search className="w-5 h-5 text-[#827471] mr-3" />
              <input
                type="text"
                placeholder={t.home_search_placeholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-[#3d2e28] text-[15px] font-medium placeholder:text-[#a09491]"
              />
            </div>
            <button type="submit" className="px-8 py-4 bg-[#8a6b32] text-white font-bold rounded-xl hover:bg-[#775a19] transition-colors whitespace-nowrap">
              {t.home_search_btn}
            </button>
          </form>
        </div>
        
        {/* Right: Map Placeholder */}
        <div className="hidden md:block w-[45%] bg-[#e5e2dd] relative">
          {/* Map Background Mock */}
          <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Map bg" className="w-full h-full object-cover opacity-60 grayscale" />
          
          {/* Mock Pins */}
          <div className="absolute top-1/3 left-1/4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-[#3d2e28]">
            <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&w=100&q=80" className="w-10 h-10 rounded-full object-cover" />
          </div>
          <div className="absolute bottom-1/4 right-1/3 w-10 h-10 bg-[#3d2e28] text-white rounded-full flex items-center justify-center shadow-lg">
            <MapPin className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div className="flex p-1 bg-[#f0ede8] rounded-2xl w-full md:w-auto">
          <button className="flex-1 md:w-[120px] py-2.5 bg-[#3d2e28] text-white font-bold text-[14px] rounded-xl shadow-sm text-center">
            {t.home_tab_list}
          </button>
          <button className="flex-1 md:w-[120px] py-2.5 text-[#504442] font-bold text-[14px] rounded-xl hover:bg-[#e5e2dd] transition-colors text-center" onClick={() => window.location.href='/map'}>
            {t.home_tab_map}
          </button>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          <button className="flex items-center gap-2 px-5 py-3 bg-white border border-[#f0ede8] text-[#3d2e28] rounded-xl text-[14px] font-bold hover:bg-[#f6f3ee] transition-colors whitespace-nowrap shadow-sm">
            {t.home_filter_price} <ChevronDown className="w-4 h-4 text-[#827471]" />
          </button>
          <button className="flex items-center gap-2 px-5 py-3 bg-white border border-[#f0ede8] text-[#3d2e28] rounded-xl text-[14px] font-bold hover:bg-[#f6f3ee] transition-colors whitespace-nowrap shadow-sm">
            {t.home_filter_rating} <ChevronDown className="w-4 h-4 text-[#827471]" />
          </button>
          <button className="flex items-center gap-2 px-5 py-3 bg-white border border-[#f0ede8] text-[#3d2e28] rounded-xl text-[14px] font-bold hover:bg-[#f6f3ee] transition-colors whitespace-nowrap shadow-sm">
            {t.home_filter_category} <ChevronDown className="w-4 h-4 text-[#827471]" />
          </button>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {restaurants.map((restaurant) => (
          <Link href={`/restaurant/${restaurant.id}`} key={restaurant.id}>
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#f0ede8] group flex flex-col h-full">
              <div className="relative h-[220px] bg-[#e5e2dd] overflow-hidden rounded-[20px] m-2">
                <img 
                  src={restaurant.imageUrl || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                  alt={restaurant.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-[#8a6b32]/90 backdrop-blur-sm text-white text-[11px] font-bold rounded-lg shadow-sm">
                      {t.home_recommended}
                    </span>
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col pt-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h2 className="font-extrabold text-[18px] text-[#3d2e28] line-clamp-1">{restaurant.name}</h2>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#fcd34d] text-[#775a19] rounded-md text-[13px] font-bold shrink-0">
                    <Star className="w-3.5 h-3.5 fill-current" /> 4.9
                  </div>
                </div>
                
                <p className="text-[13px] text-[#504442] mb-4 line-clamp-1">
                  {restaurant.categories || t.home_cuisine_desc}
                </p>
                
                <div className="mt-auto flex items-center gap-4 text-[12px] text-[#827471] pt-4 border-t border-[#f0ede8]">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{restaurant.id * 0.5} km</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px]">payments</span>
                    <span>$$$</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );

  // Landing Page View for unauthenticated users
  const renderLandingView = () => (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden px-6">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" alt="Vietnamese Dining" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#3d2e28]/75 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#faf8f6] via-transparent to-transparent opacity-90"></div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-bold mb-8 shadow-sm">
            <Star className="w-4 h-4 text-[#fcd34d] fill-current" />
            <span>Premium Dining Experience</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight mb-6 whitespace-pre-line drop-shadow-md">
            {t.landing_hero_title}
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mb-12 font-medium leading-relaxed drop-shadow">
            {t.landing_hero_subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link href="/map" className="w-full sm:w-auto px-8 py-4 bg-[#8a6b32] text-white font-bold rounded-2xl hover:bg-[#775a19] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 text-lg">
              <Search className="w-5 h-5" />
              {t.landing_cta_explore}
            </Link>
            <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-white text-[#3d2e28] font-bold rounded-2xl hover:bg-[#f0ede8] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 text-lg">
              {t.landing_cta_login}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-[#faf8f6] px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#3d2e28] mb-4 tracking-tight">{t.landing_section_features}</h2>
            <div className="w-24 h-1 bg-[#8a6b32] mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-[#f0ede8] hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-[#f6f3ee] rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-8 h-8 text-[#8a6b32]" />
              </div>
              <h3 className="text-xl font-bold text-[#3d2e28] mb-3">{t.landing_feat1_title}</h3>
              <p className="text-[#504442] leading-relaxed">{t.landing_feat1_desc}</p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-[#f0ede8] hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-[#f6f3ee] rounded-2xl flex items-center justify-center mb-6">
                <Globe2 className="w-8 h-8 text-[#8a6b32]" />
              </div>
              <h3 className="text-xl font-bold text-[#3d2e28] mb-3">{t.landing_feat2_title}</h3>
              <p className="text-[#504442] leading-relaxed">{t.landing_feat2_desc}</p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-[#f0ede8] hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-[#f6f3ee] rounded-2xl flex items-center justify-center mb-6">
                <CheckCircle2 className="w-8 h-8 text-[#8a6b32]" />
              </div>
              <h3 className="text-xl font-bold text-[#3d2e28] mb-3">{t.landing_feat3_title}</h3>
              <p className="text-[#504442] leading-relaxed">{t.landing_feat3_desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Preview Section */}
      <section className="py-24 bg-white px-6 border-t border-[#f0ede8]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#3d2e28] tracking-tight">{t.landing_section_popular}</h2>
            </div>
            <Link href="/map" className="hidden sm:flex items-center gap-2 text-[#8a6b32] font-bold hover:text-[#775a19] transition-colors">
              {t.landing_view_all} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {restaurants.slice(0, 3).map((restaurant) => (
              <div key={restaurant.id} className="bg-[#faf8f6] rounded-3xl overflow-hidden shadow-sm border border-[#f0ede8] group flex flex-col h-full">
                <div className="relative h-[220px] bg-[#e5e2dd] overflow-hidden rounded-[20px] m-2">
                  <img 
                    src={restaurant.imageUrl || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                    alt={restaurant.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                     <span className="px-3 py-1 bg-[#8a6b32]/90 backdrop-blur-sm text-white text-[11px] font-bold rounded-lg shadow-sm">
                       {t.home_recommended}
                     </span>
                  </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col pt-3">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h2 className="font-extrabold text-[18px] text-[#3d2e28] line-clamp-1">{restaurant.name}</h2>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#fcd34d] text-[#775a19] rounded-md text-[13px] font-bold shrink-0">
                      <Star className="w-3.5 h-3.5 fill-current" /> 4.9
                    </div>
                  </div>
                  
                  <p className="text-[13px] text-[#504442] mb-4 line-clamp-1">
                    {restaurant.categories || t.home_cuisine_desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link href="/map" className="inline-flex items-center gap-2 text-[#8a6b32] font-bold">
              {t.landing_view_all} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#361f1a] px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
           <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Texture" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">{t.landing_ready_title}</h2>
          <p className="text-white/80 text-lg mb-10">{t.landing_ready_subtitle}</p>
          <Link href="/register" className="inline-block px-10 py-5 bg-[#8a6b32] text-white font-extrabold rounded-full hover:bg-[#775a19] transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 text-lg">
            {t.landing_cta_login}
          </Link>
        </div>
      </section>

    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf8f6] font-body text-[#3d2e28] flex flex-col">
        <NavHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#e5e2dd] border-t-[#8a6b32] rounded-full animate-spin"></div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f6] font-body text-[#3d2e28]">
      <NavHeader />
      {isAuthenticated ? renderSearchView() : renderLandingView()}
      
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
