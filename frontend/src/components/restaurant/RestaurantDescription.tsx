"use client";

import { Wifi, Wine, Lightbulb } from "lucide-react";

interface RestaurantDescriptionProps {
  description: string;
  features?: {
    wifi?: boolean;
    temple?: boolean;
    wine?: boolean;
  };
}

export default function RestaurantDescription({
  description,
  features = {},
}: RestaurantDescriptionProps) {
  return (
    <div className="space-y-6 mb-12">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary">店舗詳細</h2>
        <div className="flex gap-4">
          {features.wifi && (
            <span className="material-symbols-outlined text-outline">wifi</span>
          )}
          {features.temple && (
            <span className="material-symbols-outlined text-outline">
              temple_buddhist
            </span>
          )}
          {features.wine && (
            <span className="material-symbols-outlined text-outline">
              wine_bar
            </span>
          )}
        </div>
      </div>
      <p className="text-on-surface-variant leading-relaxed text-base md:text-lg">
        {description}
      </p>
    </div>
  );
}
