'use client';

import { useState } from 'react';
import { Bookmark } from 'lucide-react';
import { toggleSavedRestaurant } from '@/actions/restaurant';

interface Props {
  restaurantId: number;
  initialSaved: boolean;
}

export default function SaveRestaurantButton({ restaurantId, initialSaved }: Props) {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      const result = await toggleSavedRestaurant(restaurantId);
      if (result.saved !== undefined) {
        setIsSaved(result.saved);
      }
    } catch (error) {
      console.error('Failed to toggle save status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
        isSaved 
          ? 'bg-[#f3e8d5] text-[#775a19] shadow-inner' 
          : 'bg-white text-[#504442] shadow-md hover:bg-[#faf8f6]'
      }`}
      aria-label={isSaved ? "Remove from saved" : "Save restaurant"}
    >
      <Bookmark 
        className="w-6 h-6" 
        fill={isSaved ? "currentColor" : "none"} 
        strokeWidth={isSaved ? 2 : 1.5}
      />
    </button>
  );
}
