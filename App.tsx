import React, { useState, useEffect } from 'react';
import { Article, ViewMode, CATEGORIES, Language, CATEGORY_TRANSLATIONS, UserProfile } from './types';
import { NewsCard } from './components/NewsCard';
import { AdminPanel } from './components/AdminPanel';
import { TwitterFeed } from './components/TwitterFeed';
import { CommunityRatings } from './components/CommunityRatings';
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

// Translations Dictionary
const TRANSLATIONS = {
  ar: {
    home: 'الرئيسية',
    all: 'الكل',
    searchPlaceholder: 'ابحث عن خبر...',
    readMore: 'اقرأ المزيد',
    mostRead: 'الأكثر قراءة',
    heroTitle: 'عالم الألعاب بين يديك',
    heroSubtitle: 'تغطية شاملة ومباشرة لأحدث الإصدارات والمراجعات.',
    adminPanel: 'لوحة التحكم',
    logout: 'خروج',
    loginTitle: 'بوابة اللاعبين',
    loginSubtitle: 'انضم إلى مجتمع المحترفين',
    googleLogin: 'تسجيل الدخول باستخدام Google',
    adminAccess: 'دخول الإدارة',
    backToLogin: 'رجوع لتسجيل الدخول',
    passwordPlaceholder: 'رمز الدخول',
    enter: 'دخول',
    errorPass: 'كلمة المرور غير صحيحة',
    noResults: 'لا توجد أخبار تطابق بحثك.',
    footerRights: 'جميع الحقوق محفوظة',
    adminMode: 'وضع المدير',
    twitterUpdates: 'تحديثات',
    loginBtn: 'دخول / تسجيل',
    welcome: 'مرحباً',
  },
  en: {
    home: 'Home',
    all: 'All',
    searchPlaceholder: 'Search news...',
    readMore: 'Read More',
    mostRead: 'Trending',
    heroTitle: 'The Gaming World in Your Hands',
    heroSubtitle: 'Comprehensive live coverage of the latest releases and reviews.',
    adminPanel: 'Admin Panel',
    logout: 'Logout',
    loginTitle: 'Gamer Portal',
    loginSubtitle: 'Join the Pro Community',
    googleLogin: 'Sign in with Google',
    adminAccess: 'Admin Access',
    backToLogin: 'Back to Login',
    passwordPlaceholder: 'Access Code',
    enter: 'Enter',
    errorPass: 'Incorrect Password',
    noResults: 'No news found matching your search.',
    footerRights: 'All rights reserved',
    adminMode: 'Admin Mode',
    twitterUpdates: 'Updates',
    loginBtn: 'Login / Sign up',
    welcome: 'Welcome',
  }
};

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.USER);
  const [articles, setArticles] = useState<Article[]>(INITIAL_NEWS);
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [searchTerm, setSearchTerm] = useState('');
  const [language, setLanguage] = useState<Language>('ar');

  // User State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Login Modal State
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginMode, setLoginMode] = useState<'USER' | 'ADMIN'>('USER');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Read More Modal State
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const t = TRANSLATIONS[language];

  // Update HTML dir and lang attributes
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  // Check for admin access via URL param on mount
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('access') === 'admin') {
      setIsLoginOpen(true);
      setLoginMode('ADMIN');
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
    if (viewMode === ViewMode.ADMIN) {
        setViewMode(ViewMode.USER);
        const url = new URL(window.location.href);
        url.searchParams.delete('access');
        window.history.pushState({}, '', url);
    }
    setCurrentUser(null);
  };

  const submitAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginPassword === "admin123") {
      setViewMode(ViewMode.ADMIN);
      setIsLoginOpen(false);
      setLoginPassword('');
      setLoginError('');
    } else {
      setLoginError(t.errorPass);
    }
  };

  const handleGoogleLogin = () => {
    setIsLoggingIn(true);
    // Simulate API Call delay
    setTimeout(() => {
        setCurrentUser({
            name: language === 'ar' ? 'لاعب محترف' : 'Pro Gamer',
            email: 'gamer@example.com',
            avatar: 'https://image.pollinations.ai/prompt/gamer%20avatar%20neon%20cool?width=100&height=100&nologo=true',
            isAdmin: false
        });
        setIsLoggingIn(false);
        setIsLoginOpen(false);
    }, 1500);
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ar' ? 'en' : 'ar');
  };

  return (
    <div className="min-h-screen bg-gaming-bg font-sans selection:bg-gaming-accent selection:text-white pb-10">
      
      {/* Article Read More Modal */}
      {selectedArticle && (
        <ArticleView 
          article={selectedArticle} 
          onClose={() => setSelectedArticle(null)} 
          language={language}
        />
      )}

      {/* Unified Login Modal */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4">
          <div className="bg-gaming-card border border-gaming-surface rounded-2xl p-8 w-full max-w-sm shadow-2xl animate-fade-in relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-gaming-accent/20 blur-3xl rounded-full pointer-events-none"></div>
            
            <button 
              onClick={() => {
                  setIsLoginOpen(false);
                  setLoginMode('USER');
                  setLoginError('');
              }}
              className="absolute top-4 left-4 text-slate-400 hover:text-white z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {loginMode === 'USER' ? (
                // USER LOGIN VIEW
                <div className="text-center relative z-10 flex flex-col items-center">
                    <div className="inline-block p-4 rounded-full bg-gaming-surface mb-6 border border-gaming-accent/30 shadow-lg shadow-gaming-accent/10">
                        <svg className="h-10 w-10 text-gaming-accent" viewBox="0 0 24 24" fill="currentColor">
                           <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{t.loginTitle}</h3>
                    <p className="text-slate-400 text-sm mb-8">{t.loginSubtitle}</p>
                    
                    <button 
                        onClick={handleGoogleLogin}
                        disabled={isLoggingIn}
                        className="w-full bg-white hover:bg-slate-100 text-slate-900 font-bold py-3 px-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-3 mb-6 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {isLoggingIn ? (
                             <span className="animate-spin h-5 w-5 border-2 border-slate-900 border-t-transparent rounded-full"></span>
                        ) : (
                            <>
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                </svg>
                                {t.googleLogin}
                            </>
                        )}
                    </button>

                    <button 
                        onClick={() => setLoginMode('ADMIN')}
                        className="text-slate-500 text-xs hover:text-gaming-accent transition-colors border-b border-transparent hover:border-gaming-accent pb-0.5"
                    >
                        {t.adminAccess}
                    </button>
                </div>
            ) : (
                // ADMIN LOGIN VIEW
                <>
                    <div className="text-center mb-8 relative z-10">
                        <div className="inline-block p-4 rounded-full bg-gaming-surface mb-4 border border-gaming-accent/30 shadow-lg shadow-gaming-accent/10">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gaming-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white tracking-wider">{t.adminAccess}</h3>
                    </div>
                    
                    <form onSubmit={submitAdminLogin} className="space-y-5 relative z-10">
                        <div>
                            <input 
                            type="password"
                            autoFocus
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            className="w-full bg-gaming-bg border border-gaming-surface rounded-lg px-4 py-3 text-white focus:border-gaming-accent focus:ring-1 focus:ring-gaming-accent focus:outline-none text-center tracking-[0.3em] text-lg placeholder-slate-600 transition-all font-gaming"
                            placeholder="••••••"
                            />
                        </div>
                        
                        {loginError && (
                            <p className="text-gaming-hot text-sm text-center font-bold">{loginError}</p>
                        )}

                        <button 
                            type="submit"
                            className="w-full bg-gaming-accent hover:bg-violet-500 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-gaming-accent/20 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {t.enter}
                        </button>
                    </form>
                    
                    <div className="mt-6 text-center">
                         <button 
                            onClick={() => {
                                setLoginMode('USER');
                                setLoginError('');
                            }}
                            className="text-slate-500 text-xs hover:text-white transition-colors"
                        >
                            {t.backToLogin}
                        </button>
                    </div>
                </>
            )}
          </div>
        </div>
      )}

      {/* ADMIN HEADER */}
      {viewMode === ViewMode.ADMIN ? (
          <header className="bg-gaming-card border-b border-gaming-surface sticky top-0 z-50 shadow-lg">
              <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                       <div className="bg-red-500/10 text-red-500 px-3 py-1 rounded text-xs font-bold border border-red-500/20 animate-pulse-slow">{t.adminMode}</div>
                       <div dir="ltr" className="flex items-center gap-1 opacity-50">
                            <span className="text-xl font-gaming font-black text-gaming-accent">G</span>
                            <span className="text-xl font-gaming font-black text-white ml-[-2px]">S</span>
                       </div>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold bg-gaming-surface hover:bg-slate-700 px-4 py-2 rounded-lg border border-white/5"
                  >
                      <span>{t.logout}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${language === 'ar' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                  </button>
              </div>
          </header>
      ) : (
          /* USER NAVBAR */
          <nav className="sticky top-0 z-50 glass-panel border-b border-white/5 shadow-2xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-20">
                <div className="flex items-center gap-4">
                  <div dir="ltr" className="flex items-center justify-center transform -skew-x-12 select-none bg-black/40 px-3 py-1 rounded border border-gaming-accent/20 hover:border-gaming-accent transition-all cursor-pointer group">
                     <span className="text-4xl font-gaming font-black text-gaming-accent leading-none tracking-tighter group-hover:text-white transition-colors">G</span>
                     <span className="text-4xl font-gaming font-black text-white leading-none tracking-tighter ml-[-4px] group-hover:text-gaming-accent transition-colors">S</span>
                  </div>
                  <span className="hidden md:block text-2xl font-black font-gaming bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400 tracking-wide">
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
                      className={`text-sm font-bold uppercase tracking-wider transition-all relative group py-2 ${
                        selectedCategory === cat && viewMode === ViewMode.USER 
                        ? 'text-gaming-accent' 
                        : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {language === 'en' ? (CATEGORY_TRANSLATIONS[cat] || cat) : cat}
                      <span className={`absolute bottom-0 left-0 h-0.5 bg-gaming-accent transition-all duration-300 ${
                        selectedCategory === cat ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}></span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  {/* Language Toggle */}
                  <button 
                    onClick={toggleLanguage}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-gaming-surface hover:bg-gaming-accent/20 text-slate-300 hover:text-white border border-white/5 hover:border-gaming-accent/50 transition-all font-gaming font-bold"
                  >
                    {language === 'ar' ? 'EN' : 'AR'}
                  </button>

                  {/* Login / User Profile */}
                  {currentUser ? (
                      <div className="relative group">
                          <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 rounded-full pl-1 pr-3 py-1 border border-white/5 transition-colors">
                              <img src={currentUser.avatar} alt="User" className="w-8 h-8 rounded-full border border-gaming-accent" />
                              <span className="text-sm font-bold text-white max-w-[100px] truncate hidden sm:block">{currentUser.name}</span>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                          </button>
                          
                          {/* Dropdown */}
                          <div className="absolute top-full left-0 mt-2 w-48 bg-gaming-card border border-white/10 rounded-xl shadow-xl overflow-hidden hidden group-hover:block animate-fade-in">
                              <div className="px-4 py-3 border-b border-white/5">
                                  <p className="text-xs text-slate-400">{t.welcome}</p>
                                  <p className="text-sm font-bold text-white truncate">{currentUser.name}</p>
                              </div>
                              <button 
                                onClick={handleLogout}
                                className="w-full text-start px-4 py-2 text-sm text-red-400 hover:bg-white/5 flex items-center gap-2"
                              >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                  </svg>
                                  {t.logout}
                              </button>
                          </div>
                      </div>
                  ) : (
                    <button 
                        onClick={() => {
                            setIsLoginOpen(true);
                            setLoginMode('USER');
                        }}
                        className="bg-gaming-accent hover:bg-violet-600 text-white px-5 py-2 rounded-lg font-bold shadow-lg shadow-gaming-accent/20 transition-all text-sm whitespace-nowrap"
                    >
                        {t.loginBtn}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </nav>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {viewMode === ViewMode.ADMIN ? (
          <AdminPanel articles={articles} setArticles={setArticles} language={language} />
        ) : (
          <>
            {/* Hero Section */}
            <div className="relative rounded-3xl overflow-hidden bg-gaming-card mb-12 border border-white/10 shadow-2xl group min-h-[400px]">
              <div className="absolute inset-0 bg-gradient-to-r from-gaming-bg via-gaming-bg/90 to-transparent z-10"></div>
              
              <img 
                src="https://image.pollinations.ai/prompt/cyberpunk%20gaming%20setup%20neon%20city?width=1200&height=500&nologo=true" 
                alt="Hero" 
                className="w-full h-full object-cover absolute inset-0 opacity-50 group-hover:scale-105 transition-transform duration-1000"
              />
              
              <div className="absolute inset-0 z-20 p-8 md:p-16 flex flex-col justify-center max-w-3xl">
                <span className="bg-gaming-accent/20 border border-gaming-accent text-gaming-accent text-xs font-gaming font-bold px-3 py-1 rounded-full mb-6 w-fit backdrop-blur-md">
                  {language === 'ar' ? '#الأكثر_تداولاً' : '#TRENDING_NOW'}
                </span>
                <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight drop-shadow-2xl">
                  {t.heroTitle}
                </h1>
                <p className="text-slate-300 text-lg md:text-xl mb-8 leading-relaxed max-w-2xl border-l-4 border-gaming-accent pl-4">
                  {t.heroSubtitle}
                </p>
                
                <div className="flex gap-4">
                  <div className="relative w-full max-w-md group/search">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400 group-focus-within/search:text-gaming-accent transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input 
                      type="text" 
                      placeholder={t.searchPlaceholder} 
                      className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-12 py-4 text-white placeholder-slate-400 focus:outline-none focus:border-gaming-accent focus:bg-black/40 transition-all shadow-xl"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Split Layout: Content & Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              
              {/* Main Content Column */}
              <div className="lg:col-span-3">
                 {/* Categories Pills */}
                <div className="flex flex-wrap gap-3 mb-8 justify-center md:justify-start">
                  <button
                     onClick={() => setSelectedCategory('الكل')}
                     className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all border shadow-lg ${
                       selectedCategory === 'الكل' 
                       ? 'bg-gaming-accent border-gaming-accent text-white shadow-gaming-accent/25 scale-105' 
                       : 'bg-gaming-surface border-white/5 text-slate-400 hover:text-white hover:border-slate-500 hover:bg-slate-800'
                     }`}
                  >
                    {t.all}
                  </button>
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all border shadow-lg ${
                        selectedCategory === cat 
                        ? 'bg-gaming-accent border-gaming-accent text-white shadow-gaming-accent/25 scale-105' 
                        : 'bg-gaming-surface border-white/5 text-slate-400 hover:text-white hover:border-slate-500 hover:bg-slate-800'
                      }`}
                    >
                       {language === 'en' ? (CATEGORY_TRANSLATIONS[cat] || cat) : cat}
                    </button>
                  ))}
                </div>

                {/* News Grid */}
                {filteredArticles.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                    {filteredArticles.map(article => (
                      <NewsCard 
                        key={article.id} 
                        article={article} 
                        onReadMore={setSelectedArticle}
                        language={language}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-32 bg-gaming-surface/30 rounded-3xl border border-white/5 border-dashed">
                    <p className="text-slate-500 text-xl font-gaming">{t.noResults}</p>
                  </div>
                )}
              </div>

              {/* Sidebar Column (Community Ratings & Twitter Feed) */}
              <div className="lg:col-span-1 space-y-8">
                 <CommunityRatings language={language} />
                 <TwitterFeed language={language} />
              </div>

            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-auto py-12 bg-black/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
          <div dir="ltr" className="flex items-center gap-2 mb-6 opacity-75 hover:opacity-100 transition-opacity">
             <span className="text-3xl font-gaming font-black text-gaming-accent">G</span>
             <span className="text-3xl font-gaming font-black text-white ml-[-2px]">S</span>
          </div>
          <p className="text-slate-500 mb-6 font-gaming text-sm tracking-wider">© 2024 GAMES STATLON. {t.footerRights}.</p>
          <div className="flex gap-6">
             <a href="https://x.com/games_statlon" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white hover:scale-110 transition-all bg-white/5 p-2 rounded-full">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current"><g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></g></svg>
             </a>
             <a href="https://www.instagram.com/games_statlon?igsh=YmxoMTZ6NmV6dHpi&utm_source=qr" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white hover:scale-110 transition-all bg-white/5 p-2 rounded-full">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
             </a>
          </div>
        </div>
      </footer>
    </div>
  );
}