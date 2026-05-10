"use client";

import { Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface SavedRestaurantCardProps {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  rating: number | string;
  distance?: number;
  priceRange?: string;
  isOpen?: boolean;
  availability?: "available" | "full" | "unknown";
  onSaveToggle?: (id: number, isSaved: boolean) => void;
  initialSaved?: boolean;
}

export default function SavedRestaurantCard({
  id,
  name,
  description,
  imageUrl = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  rating,
  distance,
  priceRange = "$$",
  isOpen = true,
  availability = "available",
  onSaveToggle,
  initialSaved = true,
}: SavedRestaurantCardProps) {
  const [isSaved, setIsSaved] = useState(initialSaved);

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newSavedState = !isSaved;
    setIsSaved(newSavedState);
    onSaveToggle?.(id, newSavedState);
  };

  const getAvailabilityBadge = () => {
    switch (availability) {
      case "available":
        return (
          <span className="px-3 py-1 rounded-lg bg-tertiary-container/90 backdrop-blur text-on-tertiary-container text-xs font-bold uppercase tracking-wider">
            空席あり
          </span>
        );
      case "full":
        return (
          <span className="px-3 py-1 rounded-lg bg-error-container/90 backdrop-blur text-on-error-container text-xs font-bold uppercase tracking-wider">
            満席
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <Link href={`/restaurant/${id}`}>
      <div className="group flex flex-col bg-surface-container-lowest rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
        {/* Image Section */}
        <div className="relative h-64 w-full overflow-hidden bg-surface-container">
          <img
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            alt={name}
            src={imageUrl}
          />

          {/* Save Button */}
          <button
            onClick={handleSaveToggle}
            className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-surface/90 backdrop-blur text-error shadow-sm hover:bg-surface transition-all"
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              favorite
            </span>
          </button>

          {/* Availability Badge */}
          {getAvailabilityBadge() && (
            <div className="absolute bottom-4 left-4 flex gap-2">
              {getAvailabilityBadge()}
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Title and Rating */}
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-primary group-hover:text-secondary transition-colors">
              {name}
            </h3>
            <div className="flex items-center gap-1 bg-secondary-container px-2 py-1 rounded-lg flex-shrink-0 ml-2">
              <span
                className="material-symbols-outlined text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
              <span className="text-sm font-bold text-on-secondary-container">
                {rating}
              </span>
            </div>
          </div>

          {/* Description */}
          {description && (
            <p className="text-on-surface-variant text-sm mb-4 line-clamp-2">
              {description}
            </p>
          )}

          {/* Footer Info */}
          <div className="flex items-center gap-4 pt-4 border-t border-outline-variant/20">
            {distance !== undefined && (
              <div className="flex items-center gap-1 text-on-surface-variant text-xs">
                <span className="material-symbols-outlined text-sm">
                  location_on
                </span>
                <span>{distance} km</span>
              </div>
            )}
            {priceRange && (
              <div className="flex items-center gap-1 text-on-surface-variant text-xs">
                <span className="material-symbols-outlined text-sm">
                  payments
                </span>
                <span>{priceRange}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
