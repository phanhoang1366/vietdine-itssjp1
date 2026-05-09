'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function TermsPage() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-4">
          <Link href="/register" className="w-8 h-8 flex items-center justify-center hover:bg-surface-container-high rounded-full transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant text-xl">arrow_back</span>
          </Link>
          <span className="text-xl font-extrabold tracking-tighter text-primary">VietDine</span>
        </div>
        <button className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center hover:bg-surface-container transition-colors">
          <span className="material-symbols-outlined text-on-surface-variant text-lg">help</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-6 pt-6 pb-16">
        <div className="w-full max-w-3xl">
          <h1 className="text-3xl font-extrabold text-primary mb-6">利用規約</h1>
          <p className="text-on-surface-variant text-sm leading-relaxed mb-8">
            VietDineをご利用いただきありがとうございます。本規約は、当サービスの利用条件を定めるものです。
          </p>
          <hr className="border-outline-variant/30 mb-10" />

          <div className="space-y-8">
            {/* Section 1 */}
            <section className="bg-surface-container-low rounded-xl p-6 relative overflow-hidden">
              <div className="absolute left-0 top-6 bottom-6 w-1 rounded-r bg-secondary"></div>
              <h2 className="text-base font-bold text-primary mb-4 flex items-center gap-2">
                第1条（適用）
              </h2>
              <div className="space-y-4 text-sm text-on-surface-variant leading-relaxed">
                <p>1. 本規約は、ユーザーと当サービス運営者との間の、本サービスの利用に関わる一切の関係に適用されるものとします。</p>
                <p>2. 当サービスは、本規約のほか、ご利用にあたってのルール等、各種の規定を設けることがあります。これら諸規定はその名称のいかんにかかわらず、本規約の一部を構成するものとします。</p>
              </div>
            </section>

            {/* Section 2 */}
            <section className="bg-surface-container-low rounded-xl p-6 relative overflow-hidden">
              <div className="absolute left-0 top-6 bottom-6 w-1 rounded-r bg-secondary"></div>
              <h2 className="text-base font-bold text-primary mb-4 flex items-center gap-2">
                第2条（利用登録）
              </h2>
              <div className="space-y-4 text-sm text-on-surface-variant leading-relaxed">
                <p>1. 本サービスにおいては、登録希望者が本規約に同意の上、当方の定める方法によって利用登録を申請し、当方がこれを承認することによって、利用登録が完了するものとします。</p>
                <p>2. 当方は、利用登録の申請者に以下の事由があると判断した場合、利用登録の申請を承認しないことがあり、その理由については一切の開示義務を負わないものとします。</p>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li>利用登録の申請に際して虚偽の事項を届け出た場合</li>
                  <li>本規約に違反したことがある者からの申請である場合</li>
                  <li>その他、当方が利用登録を相当でないと判断した場合</li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section className="bg-surface-container-low rounded-xl p-6 relative overflow-hidden">
              <div className="absolute left-0 top-6 bottom-6 w-1 rounded-r bg-primary"></div>
              <h2 className="text-base font-bold text-primary mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">public</span>
                第3条（ユーザーIDおよびパスワードの管理）
              </h2>
              <div className="space-y-4 text-sm text-on-surface-variant leading-relaxed">
                <p>1. ユーザーは、自己の責任において、本サービスのユーザーIDおよびパスワードを適切に管理するものとします。</p>
                <p>2. ユーザーは、いかなる場合にも、ユーザーIDおよびパスワードを第三者に譲渡または貸与し、もしくは第三者と共用することはできません。</p>
              </div>
            </section>

            {/* Section 4 */}
            <section className="bg-surface-container-low rounded-xl p-6 relative overflow-hidden">
              <div className="absolute left-0 top-6 bottom-6 w-1 rounded-r bg-secondary"></div>
              <h2 className="text-base font-bold text-primary mb-4 flex items-center gap-2">
                第4条（禁止事項）
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-surface-container-high rounded-lg p-4">
                  <h3 className="font-bold text-primary text-sm mb-2">法令・公序良俗違反</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">法令または公序良俗に違反する行為、及び犯罪行為に関連する行為。</p>
                </div>
                <div className="bg-surface-container-high rounded-lg p-4">
                  <h3 className="font-bold text-primary text-sm mb-2">運営妨害</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">本サービスのサーバーまたはネットワークの機能を破壊したり、妨害したりする行為。</p>
                </div>
                <div className="bg-surface-container-high rounded-lg p-4">
                  <h3 className="font-bold text-primary text-sm mb-2">なりすまし</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">他のユーザーになりすます行為、または不正にアクセスする行為。</p>
                </div>
                <div className="bg-surface-container-high rounded-lg p-4">
                  <h3 className="font-bold text-primary text-sm mb-2">商用目的の無断使用</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">当方の許諾なく、本サービス上の情報を商用目的に利用する行為。</p>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section className="bg-surface-container-low rounded-xl p-6 relative overflow-hidden">
              <div className="absolute left-0 top-6 bottom-6 w-1 rounded-r bg-secondary"></div>
              <h2 className="text-base font-bold text-primary mb-4 flex items-center gap-2">
                第5条（サービスの提供の停止等）
              </h2>
              <div className="space-y-4 text-sm text-on-surface-variant leading-relaxed">
                <p>当方は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。</p>
                <div className="pl-4 border-l-2 border-outline-variant/30 py-1 text-on-surface-variant/80 text-xs">
                  メンテナンス、停電、火災、天災、その他不可抗力によりサービスの提供が困難となった場合。
                </div>
              </div>
            </section>
          </div>

          {/* Bottom Action Area */}
          <div className="mt-16 bg-primary-container rounded-2xl p-8 flex flex-col items-center text-center shadow-sm">
            <h3 className="text-on-primary-container text-xl font-bold mb-3">規約に同意して始めましょう</h3>
            <p className="text-on-primary-container/80 text-xs mb-8 max-w-md leading-relaxed">
              登録を完了することで、上記の利用規約およびプライバシーポリシーに同意したものとみなされます。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link 
                href="/register" 
                className="bg-secondary text-on-secondary hover:bg-secondary/90 font-bold py-3 px-8 rounded-xl flex items-center justify-center gap-2 transition-colors w-full sm:w-auto"
              >
                同意して登録に戻る
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
              <button className="bg-surface-container-highest/10 border border-on-primary-container/20 text-on-primary-container hover:bg-on-primary-container/10 font-bold py-3 px-8 rounded-xl flex items-center justify-center gap-2 transition-colors w-full sm:w-auto">
                PDFでダウンロード
              </button>
            </div>
          </div>

          {/* Footer Info */}
          <footer className="mt-12 flex flex-col items-center justify-center text-[10px] text-outline tracking-wider gap-1">
            <p>最終更新日：2024年5月20日</p>
            <p>© 2024 VietDine Japan. All rights reserved.</p>
          </footer>
        </div>
      </main>

      {/* Floating Scroll to Top */}
      {showScrollTop && (
        <button 
          className="fixed bottom-8 right-6 w-10 h-10 bg-surface-container-high rounded-xl flex items-center justify-center shadow-sm hover:bg-surface-container transition-all z-40"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="トップに戻る"
        >
          <span className="material-symbols-outlined text-on-surface-variant">keyboard_arrow_up</span>
        </button>
      )}

    </div>
  );
}
