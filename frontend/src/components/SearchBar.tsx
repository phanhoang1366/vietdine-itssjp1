'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X, Bell, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import SearchOverlay from './SearchOverlay';
import { useLanguage } from '@/context/LanguageContext';
import { localeNames, localeFlags, type Locale } from '@/lib/i18n';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const { locale, setLocale, t } = useLanguage();

  // Handle click outside to close overlay
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsFocused(false);
      router.push(`/map?q=${encodeURIComponent(query)}`);
    }
  };

  const handleClear = () => {
    setQuery('');
    const input = document.getElementById('main-search-input');
    if (input) input.focus();
  };

  return (
    <div className="relative z-50 w-full" ref={searchRef}>
      <header className="flex items-center justify-between px-6 py-4 bg-surface h-[72px]">
        {/* Logo */}
        <div 
          className="text-2xl font-extrabold tracking-tighter text-primary cursor-pointer w-48"
          onClick={() => router.push('/')}
        >
          VietDine
        </div>

        {/* Search Input Container */}
        <div className="flex-1 max-w-2xl flex justify-center">
          <form 
            onSubmit={handleSearch} 
            className={`flex items-center w-full h-12 rounded-full border px-4 transition-all duration-300 ${
              isFocused ? 'bg-white border-primary shadow-sm' : 'bg-surface-container-low border-outline-variant hover:border-outline'
            }`}
          >
            <Search className="w-5 h-5 text-on-surface-variant mr-2" />
            <input
              id="main-search-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              placeholder={t.map_search_placeholder}
              className="flex-1 bg-transparent border-none outline-none text-on-surface placeholder:text-on-surface-variant"
            />
            {query && (
              <button 
                type="button" 
                onClick={handleClear}
                className="p-1 rounded-full hover:bg-surface-variant text-on-surface-variant"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>
        </div>

        {/* Right Icons */}
        <div className="flex items-center justify-end w-48 gap-3 text-on-surface-variant">
          {/* Language Selector */}
          <div ref={langRef} className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-surface-container transition-colors text-sm font-bold"
            >
              <span>{localeFlags[locale]}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {langOpen && (
              <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-outline-variant/30 overflow-hidden z-[60] min-w-[160px]">
                {(['ja', 'vi', 'en'] as Locale[]).map((loc) => (
                  <button
                    key={loc}
                    onClick={() => {
                      setLocale(loc);
                      setLangOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-medium hover:bg-surface-container-low transition-colors ${
                      locale === loc ? 'bg-surface-container-low text-secondary font-bold' : 'text-on-surface'
                    }`}
                  >
                    <span className="text-lg">{localeFlags[loc]}</span>
                    <span>{localeNames[loc]}</span>
                    {locale === loc && <span className="ml-auto text-secondary">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="p-2 rounded-full hover:bg-surface-container transition-colors">
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Dropdown Overlay */}
      {isFocused && (
        <div className="absolute top-[72px] left-0 w-full bg-surface shadow-xl border-t border-outline-variant rounded-b-3xl overflow-hidden pb-8">
          <SearchOverlay onSelect={(q) => { setQuery(q); setIsFocused(false); router.push(`/map?q=${encodeURIComponent(q)}`); }} />
        </div>
      )}
    </div>
  );
}

