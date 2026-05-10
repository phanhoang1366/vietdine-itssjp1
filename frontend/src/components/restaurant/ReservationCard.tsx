"use client";

interface ReservationCardProps {
  restaurantId?: number;
  isDisabled?: boolean;
}

export default function ReservationCard({
  restaurantId,
  isDisabled = false,
}: ReservationCardProps) {
  const handleReserve = () => {
    console.log("Reserve restaurant:", restaurantId);
    alert(`予約テスト: Restaurant ID ${restaurantId ?? "N/A"}`);
  };

  return (
    <button
      type="button"
      onClick={handleReserve}
      disabled={isDisabled}
      className="w-full bg-primary text-on-primary py-5 rounded-xl font-extrabold tracking-tight flex items-center justify-center gap-3 transition-transform active:scale-95 shadow-lg shadow-primary/20 hover:bg-primary-container disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span className="material-symbols-outlined">event_available</span>
      今すぐ予約する
    </button>
  );
}
