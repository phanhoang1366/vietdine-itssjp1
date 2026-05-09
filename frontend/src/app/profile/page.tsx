import NavHeader from '@/components/NavHeader';
import { 
  MessageSquare, 
  Calendar, 
  User, 
  Bookmark, 
  Lock, 
  History, 
  LogOut,
  Settings,
  ChevronRight
} from 'lucide-react';

export default function ProfilePage() {
  const settingsLinks = [
    {
      icon: <User className="w-[22px] h-[22px] text-[#3d2e28]" strokeWidth={1.5} />,
      title: '個人情報',
      subtitle: 'PERSONAL INFORMATION / THÔNG TIN CÁ NHÂN',
      href: '/profile/personal-info'
    },
    {
      icon: <Bookmark className="w-[22px] h-[22px] text-[#3d2e28]" strokeWidth={1.5} />,
      title: '保存済みリスト',
      subtitle: 'SAVED COLLECTION / DANH SÁCH ĐÃ LƯU',
      href: '/saved'
    },
    {
      icon: <Lock className="w-[22px] h-[22px] text-[#3d2e28]" strokeWidth={1.5} />,
      title: 'パスワード変更',
      subtitle: 'PASSWORD CHANGE / ĐỔI MẬT KHẨU',
      href: '/profile/password'
    },
    {
      icon: <History className="w-[22px] h-[22px] text-[#3d2e28]" strokeWidth={1.5} />,
      title: '検索履歴',
      subtitle: 'SEARCH HISTORY / LỊCH SỬ TÌM KIẾM',
      href: '/profile/history'
    }
  ];

  return (
    <div className="min-h-screen bg-[#faf8f6] flex flex-col font-body text-[#3d2e28]">
      <NavHeader />

      <main className="flex-1 max-w-[700px] w-full mx-auto px-6 py-10 flex flex-col items-center">
        
        {/* Profile Header section */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative mb-6">
            {/* Avatar Placeholder */}
            <div className="w-[120px] h-[120px] bg-[#1a1a1a] rounded-2xl overflow-hidden flex items-end justify-center shadow-lg komorebi-shadow">
              {/* Simple stylized avatar using shapes since we don't have the image file */}
              <div className="w-[60px] h-[70px] bg-[#42505a] rounded-t-3xl relative">
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-10 h-10 bg-[#f1c27d] rounded-full"></div>
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[2px] h-full bg-[#1e272d]"></div>
                <div className="absolute top-2 left-1/2 w-3 h-5 bg-[#ffffff] transform skew-x-[20deg] origin-top-left"></div>
              </div>
            </div>
            {/* Settings Badge */}
            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#8a6b32] text-white rounded-full flex items-center justify-center border-[3px] border-[#faf8f6] shadow-sm hover:bg-[#775a19] transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>

          <h1 className="text-3xl font-extrabold mb-3 tracking-tight">Minh Nguyễn</h1>
          
          <div className="px-4 py-1 bg-[#f3e8d5] text-[#775a19] rounded-full text-sm font-bold flex items-center shadow-sm">
            プレミアム会員 <span className="mx-2 opacity-50">|</span> Premium Member
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 gap-4 w-full mb-12">
          {/* Reviews Stat */}
          <div className="bg-[#f5f2eb] rounded-3xl p-6 flex flex-col justify-between h-[140px]">
            <MessageSquare className="w-7 h-7 text-[#504442] mb-4" strokeWidth={1.5} />
            <div>
              <div className="text-[28px] font-black leading-none mb-1">25</div>
              <div className="text-[10px] font-bold text-[#504442] tracking-wider uppercase">REVIEWS / レビュー</div>
            </div>
          </div>
          
          {/* Bookings Stat */}
          <div className="bg-[#f5f2eb] rounded-3xl p-6 flex flex-col justify-between h-[140px]">
            <Calendar className="w-7 h-7 text-[#504442] mb-4" strokeWidth={1.5} />
            <div>
              <div className="text-[28px] font-black leading-none mb-1">12</div>
              <div className="text-[10px] font-bold text-[#504442] tracking-wider uppercase">BOOKINGS / 予約</div>
            </div>
          </div>
        </div>

        {/* Settings Section */}
        <div className="w-full">
          <h2 className="text-[11px] font-bold text-[#827471] tracking-[0.1em] uppercase mb-4 pl-2">
            ACCOUNT SETTINGS / アカウント設定
          </h2>
          
          <div className="flex flex-col gap-3">
            {settingsLinks.map((link, i) => (
              <a 
                key={i} 
                href={link.href}
                className="bg-white rounded-2xl p-4 flex items-center hover:shadow-md transition-shadow group cursor-pointer"
              >
                <div className="w-12 h-12 bg-[#faf8f6] rounded-xl flex items-center justify-center mr-4 group-hover:bg-[#f0ede8] transition-colors">
                  {link.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-[15px] leading-tight mb-0.5">{link.title}</h3>
                  <p className="text-[10px] text-[#827471] uppercase tracking-wider">{link.subtitle}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-[#d4c3bf] group-hover:text-[#827471] transition-colors" />
              </a>
            ))}

            {/* Logout Button */}
            <button className="bg-[#fcf9f4] border border-[#f0ede8] rounded-2xl p-4 flex items-center hover:bg-[#fff5f5] hover:border-[#ffd6d6] transition-colors group mt-2">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mr-4 shadow-sm group-hover:bg-[#fff5f5] transition-colors border border-[#f0ede8]">
                <LogOut className="w-[22px] h-[22px] text-[#ba1a1a]" strokeWidth={1.5} />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-bold text-[15px] leading-tight text-[#ba1a1a] mb-0.5">ログアウト</h3>
                <p className="text-[10px] text-[#e57373] uppercase tracking-wider">LOGOUT / ĐĂNG XUẤT</p>
              </div>
            </button>
          </div>
        </div>

        {/* Bottom Pagination Dots Placeholder */}
        <div className="flex items-center justify-center mt-12 gap-4 text-[#d4c3bf]">
          <div className="w-10 h-[2px] bg-[#d4c3bf] rounded-full"></div>
          <div className="w-[6px] h-[6px] rounded-full border border-[#d4c3bf]"></div>
          <div className="w-10 h-[2px] bg-[#d4c3bf] rounded-full"></div>
        </div>
      </main>
    </div>
  );
}
