import SearchBar from '@/components/SearchBar';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <SearchBar />
      
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-primary mb-6 tracking-tight">
          ベトナム料理を、<br />もっと身近に。
        </h1>
        <p className="text-lg text-on-surface-variant max-w-2xl mb-12 leading-relaxed">
          VietDineは、ハノイの日本人コミュニティによって認証された、安心・安全なベトナムレストランを探せるサービスです。衛生面や日本語対応など、あなたのこだわりに合わせて検索できます。
        </p>

        <div className="flex gap-4">
          <Link href="/map" className="px-8 py-4 rounded-full bg-primary text-white font-bold text-lg hover:opacity-90 transition-opacity shadow-lg">
            地図から探す
          </Link>
          <Link href="/login" className="px-8 py-4 rounded-full border-2 border-primary text-primary font-bold text-lg hover:bg-surface-container transition-colors">
            ログインして保存
          </Link>
        </div>
      </main>

      {/* Placeholder for featured restaurants / recommended list */}
      <section className="bg-surface-container-low py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-primary mb-8 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">verified</span>
            日本人コミュニティ認証済みの人気店
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Mock Data */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-40 bg-surface-variant relative">
                  <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 rounded-full text-xs font-bold text-primary flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">star</span> 4.8
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg text-on-surface mb-1">ハノイフォー 名人 {i}号店</h3>
                  <p className="text-sm text-on-surface-variant mb-4">ホアンキエム区 • ベトナム料理</p>
                  <div className="flex gap-2 text-xs">
                    <span className="px-2 py-1 bg-green-50 text-green-700 rounded-md font-medium border border-green-100">日本語OK</span>
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md font-medium border border-blue-100">清潔感高</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
