'use client';

import NavHeader from '@/components/NavHeader';
import { useLanguage } from '@/context/LanguageContext';
import { useEffect, useState } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface ReviewItem {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  restaurant: {
    id: number;
    name: string;
    imageUrl: string;
  };
}

export default function UserReviewsPage() {
  const { t } = useLanguage();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/users/profile/reviews`, {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
      }
    } catch (err) {
      console.error('Reviews fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f6] flex flex-col font-body text-[#3d2e28]">
      <NavHeader />
      <main className="flex-1 max-w-[600px] w-full mx-auto px-6 py-10">
        <div className="mb-8">
          <Link href="/profile" className="text-sm text-[#827471] hover:text-[#3d2e28] transition-colors font-medium">
            ← {t.common_back || 'Back'}
          </Link>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div className="pl-2 border-l-2 border-[#775a19]">
            <h1 className="text-3xl font-extrabold tracking-tight">{t.profile_reviews || 'Reviews'}</h1>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-[#827471]">{t.common_loading || 'Loading...'}</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-[#f6f3ee] rounded-full flex items-center justify-center mb-6">
              <MessageSquare className="w-10 h-10 text-[#d4c3bf]" />
            </div>
            <h2 className="text-xl font-bold mb-2">{t.restaurant_no_reviews || 'No reviews yet'}</h2>
            <Link href="/" className="mt-6 px-8 py-3 bg-[#361f1a] text-white rounded-full font-bold hover:bg-[#4e342e] transition-colors">
              {t.common_search || 'Search'}
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-2xl p-5 flex flex-col gap-4 shadow-sm border border-[#f0ede8] group hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden shrink-0 relative">
                    <Image
                      src={review.restaurant.imageUrl || '/placeholder-restaurant.png'}
                      alt={review.restaurant.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/restaurant/${review.restaurant.id}`}
                      className="font-bold text-[16px] text-[#3d2e28] hover:text-[#775a19] transition-colors block truncate"
                    >
                      {review.restaurant.name}
                    </Link>
                    <p className="text-[12px] text-[#a09491]">
                      {new Date(review.createdAt).toLocaleDateString('ja-JP', {
                        year: 'numeric', month: 'short', day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? 'fill-[#e3b044] text-[#e3b044]' : 'fill-transparent text-[#d4c3bf]'}`}
                    />
                  ))}
                </div>

                {review.comment && (
                  <p className="text-[14px] text-[#504442] leading-relaxed">
                    {review.comment}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
