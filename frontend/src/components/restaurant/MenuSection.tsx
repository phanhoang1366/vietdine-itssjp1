"use client";

interface MenuItem {
  id?: number;
  dishNameJp: string;
  dishNameVn?: string;
  imageUrl?: string;
  price?: number;
  description?: string;
  tags?: string[];
}

interface MenuSectionProps {
  title?: string;
  subtitle?: string;
  items: MenuItem[];
}

export default function MenuSection({
  title = "季節の献立",
  subtitle = "旬の味覚",
  items,
}: MenuSectionProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-primary tracking-wide">MENU</p>
        <h2 className="text-2xl md:text-3xl font-extrabold text-on-surface">
          メニュー
        </h2>
      </div>

      <div className="overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex gap-5 w-max">
          {items.map((item) => (
            <article
              key={item.id}
              className="w-[260px] sm:w-[300px] md:w-[320px] shrink-0 rounded-2xl bg-surface border border-outline/10 shadow-sm overflow-hidden"
            >
              <div className="h-44 bg-surface-variant overflow-hidden">
                <img
                  src={
                    item.imageUrl ||
                    "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=800&q=80"
                  }
                  alt={item.dishNameJp}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="p-5 space-y-3">
                <div>
                  <h3 className="text-lg font-bold text-on-surface line-clamp-1">
                    {item.dishNameJp}
                  </h3>
                  <p className="text-sm text-on-surface/60 line-clamp-1">
                    {item.dishNameVn}
                  </p>
                </div>

                {item.description && (
                  <p className="text-sm text-on-surface/70 line-clamp-2">
                    {item.description}
                  </p>
                )}

                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-semibold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {item.price !== undefined && item.price > 0 && (
                  <p className="text-base font-extrabold text-primary">
                    {item.price.toLocaleString("vi-VN")} VND
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
