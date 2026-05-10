"use client";

import { Star } from "lucide-react";
import SaveRestaurantButton from "@/components/SaveRestaurantButton";

interface HeroSectionProps {
  name: string;
  imageUrl: string;
  rating: number | string;
  reviewCount: number;
  restaurantId: number;
  initialSaved: boolean;
}

export default function HeroSection({
  name,
  imageUrl,
  rating,
  reviewCount,
  restaurantId,
  initialSaved,
}: HeroSectionProps) {
  return (
    <section className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-12 group">
      {/* Background Image */}
      <img
        alt={name}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        src={imageUrl}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent"></div>

      {/* Content Bottom */}
      <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          {/* Badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-secondary text-on-primary px-3 py-1 text-[10px] font-bold tracking-widest rounded-full uppercase">
              コミュニティ推奨店
            </span>
            <div className="flex items-center bg-surface/20 backdrop-blur-md rounded-full px-3 py-1">
              <Star className="text-secondary w-4 h-4" fill="currentColor" />
              <span className="text-white text-sm font-bold ml-1">
                {rating}
              </span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-white text-4xl md:text-5xl font-bold tracking-tight mb-2">
            {name}
          </h1>
          <p className="text-white/80 font-medium tracking-wide">
            本格懐石料理の体験
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 w-full md:w-auto">
          <button className="flex-1 md:flex-none bg-surface text-primary px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold transition-all hover:bg-surface-container-highest active:scale-95 shadow-xl">
            お問い合わせ
          </button>
          <SaveRestaurantButton
            restaurantId={restaurantId}
            initialSaved={initialSaved}
          />
          <button className="flex-1 md:flex-none bg-gradient-to-r from-primary to-primary-container text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold transition-all hover:brightness-110 active:scale-95 shadow-xl">
            予約する
          </button>
        </div>
      </div>
    </section>
  );
}
