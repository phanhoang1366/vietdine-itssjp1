"use client";

interface SavedPageHeaderProps {
  title?: string;
  subtitle?: string;
}

export default function SavedPageHeader({
  title = "保存したレストラン",
  subtitle = "保存したカフェ・飲食店",
}: SavedPageHeaderProps) {
  return (
    <header className="mb-12">
      <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight mb-2">
        {title}
      </h1>
      <p className="text-xl text-on-surface-variant font-medium tracking-wide">
        {subtitle}
      </p>
    </header>
  );
}
