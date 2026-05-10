"use client";

import { Star, CheckCircle2 } from "lucide-react";

interface Review {
  id?: number;
  user?: {
    fullName: string;
    avatarUrl?: string;
  };
  rating: number;
  comment?: string;
  createdAt?: string;
}

interface ReviewsSectionProps {
  reviews: Review[];
  totalReviews?: number;
}

export default function ReviewsSection({
  reviews,
  totalReviews,
}: ReviewsSectionProps) {
  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <section className="space-y-8 mb-16">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary">信頼と評価</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-secondary">
            {totalReviews || reviews.length}件のレビュー
          </span>
          <span
            className="material-symbols-outlined text-secondary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            verified
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review, index) => (
          <div
            key={review.id || index}
            className="p-6 bg-surface-container rounded-xl"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden flex items-center justify-center flex-shrink-0">
                  {review.user?.avatarUrl ? (
                    <img
                      alt={review.user.fullName}
                      className="w-full h-full object-cover"
                      src={review.user.avatarUrl}
                    />
                  ) : (
                    <span className="material-symbols-outlined text-on-surface-variant">
                      account_circle
                    </span>
                  )}
                </div>

                {/* User Info */}
                <div>
                  <p className="font-bold text-sm text-primary">
                    {review.user?.fullName || "Anonymous"}
                  </p>
                  {review.createdAt && (
                    <p className="text-[10px] text-outline uppercase tracking-widest">
                      {new Date(review.createdAt).toLocaleDateString("ja-JP")}
                    </p>
                  )}
                </div>
              </div>

              {/* Rating Stars */}
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating
                        ? "text-secondary fill-secondary"
                        : "text-surface-variant"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Review Text */}
            {review.comment && (
              <p className="text-on-surface-variant text-sm italic mb-2">
                "{review.comment}"
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
