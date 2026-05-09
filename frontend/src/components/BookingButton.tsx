'use client';

import { useState } from 'react';
import BookingModal from './BookingModal';

interface BookingButtonProps {
  restaurantId: number;
  restaurantName: string;
  maxSeats?: number | null;
}

export default function BookingButton({
  restaurantId,
  restaurantName,
  maxSeats,
}: BookingButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="w-full py-4 bg-[#361f1a] text-white rounded-2xl font-bold hover:bg-[#4e342e] transition-colors shadow-lg"
        onClick={() => setIsOpen(true)}
      >
        <span className="material-symbols-outlined" style={{ verticalAlign: 'middle', marginRight: '8px', fontSize: '20px' }}>
          calendar_month
        </span>
        今すぐ予約する
      </button>
      <BookingModal
        restaurantId={restaurantId}
        restaurantName={restaurantName}
        maxSeats={maxSeats}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
