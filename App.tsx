import React, { useState, useEffect } from 'react';
import { Article, ViewMode, CATEGORIES } from './types';
import { NewsCard } from './components/NewsCard';
import { AdminPanel } from './components/AdminPanel';
import { TwitterFeed } from './components/TwitterFeed';
import { ArticleView } from './components/ArticleView';

// Initial Mock Data
const INITIAL_NEWS: Article[] = [
  {
    id: '1',
    title: 'إطلاق عرض تشويقي جديد للعبة GTA VI يحطم الأرقام القياسية',
    summary: 'كشفت روكستار عن عرض جديد يستعرض عالم اللعبة المذهل، محققاً ملايين المشاهدات في ساعات قليلة.',
    category: 'أخبار عامة',
    source: 'IGN Middle East',
    imageUrl: 'https://image.pollinations.ai/prompt/GTA%20VI%20screenshot%20miami?width=800&height=600&nologo=true',
    date: '2023-10-24'
  },
  {
    id: '2',
    title: 'مراجعة Spider-Man 2: تحفة فنية تستحق التجربة',
    summary: 'تستمر إنسومنياك في إبهار اللاعبين بتقديم تجربة قصصية وبصرية لا مثيل لها في أحدث إصداراتها.',
    category: 'مراجعات',
    source: 'Saudi Gamer',
    imageUrl: 'https://image.pollinations.ai/prompt/Spiderman%202%20ps5%20gameplay?width=800&height=600&nologo=true',
    date: '2023-10-22',
    rating: 9.5
  },
  {
    id: '3',
    title: 'نينتندو تعلن عن جهازها الجديد في مؤتمر سري',
    summary: 'شائعات قوية تشير إلى أن الجهاز القادم سيتم الكشف عنه رسمياً أوائل العام القادم مع دعم لتقنيات 4K.',
    category: 'Nintendo',
    source: 'TrueGaming',
    imageUrl: 'https://image.pollinations.ai/prompt/Nintendo%20switch%202%20concept?width=800&height=600&nologo=true',
    date: '2023-10-21'
  }
];

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.USER);
  const [articles, setArticles] = useState<Article[]>(INITIAL_NEWS);
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [searchTerm, setSearchTerm] = useState('');

  // Login Modal State
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Read More Modal State
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Check for admin access via URL param on mount
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('access') === 'admin') {
      setIsLoginOpen(true);
    }
  }, []);

  // Filter Logic
  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === 'الكل' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          article.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleLogout = () => {
    setViewMode(ViewMode.USER);
    // Remove query param without refreshing
    const url = new URL(window.location.href);
    url.searchParams.delete('access');
    window.history.pushState({}, '', url);
  };

  const submitLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginPassword === "admin123") {
      setViewMode(ViewMode.ADMIN);
      setIsLoginOpen(false);
    } else {
      setLoginError("كلمة المرور غير صحيحة");
    }
  };

  return (
    <div className="min-h-screen bg-gaming-dark font-sans selection:bg-gaming-accent selection:text-white pb-10">
      
      {/* Article Read More Modal */}
      {selectedArticle && (
        <ArticleView 
          article={selectedArticle} 
          onClose={() => setSelectedArticle(null)} 
        />
      )}

      {/* Login Modal */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 w-full max-w-sm shadow-2xl animate-fade-in relative">
            <button 
              onClick={() => {
                  setIsLoginOpen(false);
                  // Clean URL if they cancel
                  const url = new URL(window.location.href);
                  url.searchParams.delete('access');
                  window.history.pushState({}, '', url);
              }}
              className="absolute top-4 left-4 text-slate-400 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="text-center mb-8">
                <div className="inline-block p-3 rounded-full bg-slate-800 mb-4 border border-slate-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gaming-highlight" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-white">بوابة الإدارة الآمنة</h3>
                <p className="text-slate-500 text-xs mt-2">يرجى التحقق من الهوية للمتابعة</p>
            </div>
            
            <form onSubmit={submitLogin} className="space-y-4">
              <div>
                <input 
                  type="password"
                  autoFocus
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-black border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-gaming-highlight focus:outline-none text-center tracking-widest text-lg placeholder-slate-600 transition-colors"
                  placeholder="رمز الدخول"
                />
              </div>
              
              {loginError && (
                <p className="text-red-500 text-sm text-center font-bold">{loginError}</p>
              )}

              <button 
                type="submit"
                className="w-full bg-gaming-highlight hover:bg-emerald-600 text-slate-900 font-bold py-3 rounded-lg transition-colors shadow-lg shadow-emerald-900/20"
              >
                دخول النظام
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ADMIN HEADER */}
      {viewMode === ViewMode.ADMIN ? (
          <header className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50 shadow-lg">
              <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                       <div className="bg-red-500/10 text-red-500 px-2 py-1 rounded text-xs font-bold border border-red-500/20">وضع المدير</div>
                       <div dir="ltr" className="flex items-center gap-1 opacity-50">
                            <span className="text-lg font-black text-[#7c3aed]">G</span>
                            <span className="text-lg font-black text-white ml-[-2px]">S</span>
                       </div>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg border border-slate-700"
                  >
                      <span>تسجيل خروج</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                  </button>
              </div>
          </header>
      ) : (
          /* USER NAVBAR */
          <nav className="sticky top-0 z-50 bg-gaming-card/80 backdrop-blur-lg border-b border-white/10 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center gap-3">
                  <div dir="ltr" className="flex items-center justify-center transform -skew-x-12 select-none bg-black/20 px-2 py-1 rounded border border-white/5 hover:border-gaming-accent transition-colors">
                     <span className="text-4xl font-black text-[#7c3aed] leading-none tracking-tighter" style={{ fontFamily: 'Arial, sans-serif' }}>G</span>
                     <span className="text-4xl font-black text-white leading-none tracking-tighter ml-[-4px]" style={{ fontFamily: 'Arial, sans-serif' }}>S</span>
                  </div>
                  <span className="hidden md:block text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                    GAMES STATLON
                  </span>
                </div>
                
                <div className="hidden md:flex space-x-reverse space-x-8">
                  {CATEGORIES.slice(0, 4).map(cat => (
                    <button 
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setViewMode(ViewMode.USER);
                        window.scrollTo({top: 0, behavior: 'smooth'});
                      }}
                      className={`text-sm font-medium transition-colors ${selectedCategory === cat && viewMode === ViewMode.USER ? 'text-gaming-highlight' : 'text-slate-300 hover:text-white'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <a href="https://x.com/games_statlon" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors">
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current"><g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></g></svg>
                  </a>

                  <a href="https://www.instagram.com/games_statlon?igsh=YmxoMTZ6NmV6dHpi&utm_source=qr" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors">
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </a>
                  
                  {/* Admin Button Restored */}
                  <button 
                    onClick={() => setIsLoginOpen(true)}
                    className="text-slate-400 hover:text-white transition-colors p-1"
                    title="دخول المدير"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </nav>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {viewMode === ViewMode.ADMIN ? (
          <AdminPanel articles={articles} setArticles={setArticles} />
        ) : (
          <>
            {/* Hero Section */}
            <div className="relative rounded-2xl overflow-hidden bg-gaming-card mb-12 border border-slate-700 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent z-10 opacity-90"></div>
              <img 
                src="https://image.pollinations.ai/prompt/gaming%20setup%20neon%20dark?width=1200&height=400&nologo=true" 
                alt="Hero" 
                className="w-full h-64 md:h-96 object-cover opacity-60"
              />
              <div className="absolute bottom-0 right-0 p-8 md:p-12 z-20 max-w-2xl">
                <span className="bg-gaming-highlight text-black text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block">
                  الأكثر قراءة
                </span>
                <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
                  اكتشف أحدث أخبار الألعاب فور صدورها
                </h1>
                <p className="text-slate-300 text-lg mb-6">
                  مصدرك الأول للأخبار والمراجعات الحصرية في العالم العربي.
                </p>
                <div className="flex gap-4">
                  <input 
                    type="text" 
                    placeholder="ابحث عن خبر..." 
                    className="bg-white/10 backdrop-blur border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-gaming-highlight w-full max-w-xs"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Split Layout: Content & Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              
              {/* Main Content Column */}
              <div className="lg:col-span-3">
                 {/* Categories Pills */}
                <div className="flex flex-wrap gap-2 mb-8 justify-center md:justify-start">
                  <button
                     onClick={() => setSelectedCategory('الكل')}
                     className={`px-4 py-2 rounded-lg text-sm font-bold transition-all border ${
                       selectedCategory === 'الكل' 
                       ? 'bg-gaming-accent border-gaming-accent text-white' 
                       : 'bg-transparent border-slate-700 text-slate-400 hover:border-slate-500'
                     }`}
                  >
                    الكل
                  </button>
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition-all border ${
                        selectedCategory === cat 
                        ? 'bg-gaming-accent border-gaming-accent text-white' 
                        : 'bg-transparent border-slate-700 text-slate-400 hover:border-slate-500'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* News Grid */}
                {filteredArticles.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {filteredArticles.map(article => (
                      <NewsCard 
                        key={article.id} 
                        article={article} 
                        onReadMore={setSelectedArticle}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <p className="text-slate-500 text-xl">لا توجد أخبار تطابق بحثك.</p>
                  </div>
                )}
              </div>

              {/* Sidebar Column (Twitter Feed) */}
              <div className="lg:col-span-1">
                 <TwitterFeed />
              </div>

            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-auto py-8 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
          <div dir="ltr" className="flex items-center gap-2 mb-4">
             <span className="text-2xl font-black text-[#7c3aed]">G</span>
             <span className="text-2xl font-black text-white ml-[-2px]">S</span>
          </div>
          <p className="text-slate-500 mb-4">© 2024 GAMES STATLON. جميع الحقوق محفوظة.</p>
          <div className="flex gap-4">
             <a href="https://x.com/games_statlon" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current"><g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></g></svg>
             </a>
             <a href="https://www.instagram.com/games_statlon?igsh=YmxoMTZ6NmV6dHpi&utm_source=qr" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
             </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;