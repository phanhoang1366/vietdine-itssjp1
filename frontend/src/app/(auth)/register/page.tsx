'use client';

import Link from 'next/link';
import AuthHeader from '@/components/AuthHeader';
import { useLanguage } from '@/context/LanguageContext';

export default function RegisterSelectionPage() {
  const { t } = useLanguage();

  return (
    <>
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px]"></div>
        <img
          alt="Atmospheric interior of a minimalist Japanese restaurant"
          className="w-full h-full object-cover opacity-60"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBP2zhXGxZWhLh8hL-L2oAulwrtlkd4iUZDdaMK2cO9ahcNQjff-LUKz9IkLwOV3rDDaz2Gg-Qx16vLmBEkDVZ8LQSyi3Igrir9xjB5S1TulmnsIbodav8ZH9v95wmTl558r6wJO9vKEhjd0sZ29GzLZsZa-Hf-2KEY2efG_va5Ndw45RKOTXqZrAjfKtLQXfo7OIAP-Jbctl6NGSDkURxkBMSIIlaMKLIxPoRIFNPis63jNFsmYEaCj3mqx4DD-1ANSs86bH2YIuw"
        />
      </div>

      <AuthHeader mode="customer" />

      <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-20">
        <div className="w-full max-w-2xl">
          <div className="mb-10 text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#3d2e28] leading-tight mb-3">
              Tham gia VietDine
            </h1>
            <p className="text-[#504442] font-medium text-sm md:text-base">
              Bạn muốn đăng ký với vai trò gì?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Registration Card */}
            <Link 
              href="/user-register"
              className="group bg-white/95 backdrop-blur-md p-8 rounded-[2rem] shadow-sm border border-transparent hover:border-primary/30 hover:shadow-md transition-all flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl text-primary">person</span>
              </div>
              <h2 className="text-xl font-bold text-[#3d2e28] mb-2">{t.auth_user_register_label}</h2>
              <p className="text-[#504442] text-sm leading-relaxed mb-6">
                Dành cho thực khách muốn tìm kiếm, lưu trữ và đặt bàn tại các nhà hàng Nhật Bản chất lượng cao.
              </p>
              <span className="mt-auto text-primary font-bold text-sm group-hover:underline">
                Đăng ký ngay →
              </span>
            </Link>

            {/* Owner Registration Card */}
            <Link 
              href="/owner/register"
              className="group bg-white/95 backdrop-blur-md p-8 rounded-[2rem] shadow-sm border border-transparent hover:border-primary/30 hover:shadow-md transition-all flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl text-secondary">storefront</span>
              </div>
              <h2 className="text-xl font-bold text-[#3d2e28] mb-2">{t.auth_owner_register_label}</h2>
              <p className="text-[#504442] text-sm leading-relaxed mb-6">
                Dành cho chủ nhà hàng muốn quảng bá, quản lý thực đơn và tiếp nhận đặt bàn từ cộng đồng người Nhật.
              </p>
              <span className="mt-auto text-secondary font-bold text-sm group-hover:underline">
                Đăng ký ngay →
              </span>
            </Link>
          </div>

          <div className="mt-12 text-center">
            <Link href="/login" className="text-[#504442] font-medium text-sm hover:text-primary transition-colors">
              ← {t.common_back || 'Quay lại đăng nhập'}
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
