"use client";

import Link from "next/link";

interface EmptySavedStateProps {
  message?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
}

export default function EmptySavedState({
  message = "保存されたレストランがありません",
  description = "お気に入りのレストランを見つけて、保存アイコンをタップするとここに追加されます。",
  buttonText = "レストランを探す",
  buttonHref = "/",
}: EmptySavedStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center min-h-[50vh]">
      {/* Icon */}
      <div className="w-24 h-24 bg-surface-container-low rounded-full flex items-center justify-center mb-6">
        <span className="material-symbols-outlined text-5xl text-outline-variant">
          bookmark
        </span>
      </div>

      {/* Message */}
      <h2 className="text-2xl font-bold text-primary mb-3">{message}</h2>

      {/* Description */}
      <p className="text-on-surface-variant mb-8 max-w-sm text-sm md:text-base">
        {description}
      </p>

      {/* CTA Button */}
      <Link
        href={buttonHref}
        className="px-8 py-3 bg-primary text-on-primary rounded-full font-bold hover:bg-primary-container transition-all active:scale-95 shadow-lg shadow-primary/20"
      >
        {buttonText}
      </Link>
    </div>
  );
}
