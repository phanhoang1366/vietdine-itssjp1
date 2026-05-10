"use client";

import { MapPin, Clock, DollarSign } from "lucide-react";

interface LocationInfoCardProps {
  address: string;
  mapImageUrl?: string;
  openingHours?: string;
  isOpen?: boolean;
  budgetRange?: string;
}

export default function LocationInfoCard({
  address,
  mapImageUrl,
  openingHours,
  isOpen = false,
  budgetRange,
}: LocationInfoCardProps) {
  return (
    <div className="bg-surface-container-low rounded-2xl overflow-hidden border border-outline-variant/20">
      {/* Map Image */}
      <div className="h-48 bg-surface-container-highest relative overflow-hidden">
        {mapImageUrl ? (
          <img
            alt="Map location"
            className="w-full h-full object-cover grayscale opacity-50"
            src={mapImageUrl}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-surface-container to-surface-container-highest" />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="material-symbols-outlined text-primary text-5xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            location_on
          </span>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-6 space-y-4">
        {/* Address */}
        <div>
          <h4 className="text-xs font-bold text-outline uppercase tracking-widest mb-1">
            住所
          </h4>
          <p className="text-primary font-medium text-sm md:text-base break-words">
            {address}
          </p>
        </div>

        {/* Hours and Budget */}
        <div className="grid grid-cols-2 gap-4">
          {openingHours && (
            <div>
              <h4 className="text-xs font-bold text-outline uppercase tracking-widest mb-1">
                営業時間
              </h4>
              <p className="text-primary text-sm font-medium">{openingHours}</p>
              {isOpen && (
                <p className="text-tertiary text-[10px] font-bold mt-1">
                  営業中
                </p>
              )}
            </div>
          )}
          {budgetRange && (
            <div>
              <h4 className="text-xs font-bold text-outline uppercase tracking-widest mb-1">
                予算
              </h4>
              <p className="text-primary text-sm font-medium">{budgetRange}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
