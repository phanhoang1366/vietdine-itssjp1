"use client";

import { CheckCircle2, Info } from "lucide-react";

interface SafetyInfoItem {
  icon: string;
  text: string;
}

interface SafetyInfoCardProps {
  items?: SafetyInfoItem[];
}

export default function SafetyInfoCard({ items }: SafetyInfoCardProps) {
  const defaultItems = [
    {
      icon: "check_circle",
      text: "アレルギー表示あり（日・越・英）。",
    },
    {
      icon: "check_circle",
      text: "ベジタリアン対応可（24時間前までの要予約）。",
    },
    {
      icon: "check_circle",
      text: "ハラール対応オプションあり。",
    },
  ];

  const displayItems = items || defaultItems;

  return (
    <div className="bg-surface-container-highest/30 border border-outline-variant/10 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-secondary">info</span>
        <h4 className="font-bold text-primary">お食事の情報</h4>
      </div>
      <ul className="space-y-3">
        {displayItems.map((item, index) => (
          <li key={index} className="flex items-start gap-3">
            <span
              className="material-symbols-outlined text-tertiary text-sm mt-0.5 flex-shrink-0"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {item.icon}
            </span>
            <p className="text-xs text-on-surface-variant">{item.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
