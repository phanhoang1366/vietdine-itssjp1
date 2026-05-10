'use client';

import NavHeader from '@/components/NavHeader';
import { useLanguage } from '@/context/LanguageContext';
import { useEffect, useState } from 'react';
import { Search, X, Trash2, Clock } from 'lucide-react';
import Link from 'next/link';

interface HistoryItem {
  id: number;
  keyword: string;
  createdAt: string;
}

export default function SearchHistoryPage() {
  const { t } = useLanguage();
  const [histories, setHistories] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/search-history`, {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setHistories(data.data || []);
      }
    } catch (err) {
      console.error('History fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteOne = async (id: number) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/search-history/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      setHistories(prev => prev.filter(h => h.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const clearAll = async () => {
    if (!confirm(t.history_clear_confirm)) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/search-history`, {
        method: 'DELETE',
        credentials: 'include',
      });
      setHistories([]);
    } catch (err) {
      console.error('Clear error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f6] flex flex-col font-body text-[#3d2e28]">
      <NavHeader />
      <main className="flex-1 max-w-[600px] w-full mx-auto px-6 py-10">
        <div className="mb-8">
          <Link href="/profile" className="text-sm text-[#827471] hover:text-[#3d2e28] transition-colors font-medium">
            ← {t.common_back}
          </Link>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div className="pl-2 border-l-2 border-[#775a19]">
            <h1 className="text-3xl font-extrabold tracking-tight">{t.history_title}</h1>
            <p className="mt-2 text-[#827471] text-sm">{t.profile_search_history_sub}</p>
          </div>
          {histories.length > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-[#ba1a1a] hover:bg-red-50 rounded-xl transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              {t.history_clear_all}
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-[#827471]">{t.common_loading}</p>
          </div>
        ) : histories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-[#f6f3ee] rounded-full flex items-center justify-center mb-6">
              <Search className="w-10 h-10 text-[#d4c3bf]" />
            </div>
            <h2 className="text-xl font-bold mb-2">{t.history_empty}</h2>
            <p className="text-[#827471] mb-8 max-w-sm">{t.history_empty_sub}</p>
            <Link href="/" className="px-8 py-3 bg-[#361f1a] text-white rounded-full font-bold hover:bg-[#4e342e] transition-colors">
              {t.common_search}
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {histories.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-[#f0ede8] group hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 bg-[#f6f3ee] rounded-xl flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-[#827471]" />
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/map?q=${encodeURIComponent(item.keyword)}`}
                    className="font-bold text-[15px] text-[#3d2e28] hover:text-[#775a19] transition-colors block truncate"
                  >
                    {item.keyword}
                  </Link>
                  <p className="text-[11px] text-[#a09491]">
                    {new Date(item.createdAt).toLocaleDateString('ja-JP', {
                      year: 'numeric', month: 'short', day: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                </div>
                <button
                  onClick={() => deleteOne(item.id)}
                  className="p-2 rounded-full text-[#d4c3bf] hover:text-[#ba1a1a] hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
