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
    <section className="mb-16">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-primary tracking-tight">
            {title}
          </h2>
          <p className="text-secondary font-medium mt-1">{subtitle}</p>
        </div>
        <button className="text-primary font-bold flex items-center gap-2 border-b-2 border-primary/10 hover:border-primary transition-all pb-1 hidden md:flex">
          お品書きを見る
          <span className="material-symbols-outlined text-sm">
            arrow_forward
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item, index) => (
          <div
            key={item.id || index}
            className="bg-surface-container-lowest p-6 rounded-xl hover:bg-white transition-colors border border-transparent hover:border-outline-variant/30"
          >
            {/* Image */}
            {item.imageUrl && (
              <div className="aspect-[4/3] rounded-lg overflow-hidden mb-4">
                <img
                  alt={item.dishNameJp}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  src={item.imageUrl}
                />
              </div>
            )}

            {/* Content */}
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-xl text-primary">
                {item.dishNameJp}
              </h3>
              {item.price && (
                <span className="text-primary font-bold whitespace-nowrap ml-2">
                  {item.price.toLocaleString()}k
                </span>
              )}
            </div>

            {item.dishNameVn && (
              <p className="text-secondary text-sm font-medium mb-3">
                {item.dishNameVn}
              </p>
            )}

            {item.description && (
              <p className="text-on-surface-variant text-sm mb-4">
                {item.description}
              </p>
            )}

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-surface-container text-[10px] font-bold uppercase tracking-tighter text-outline rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
