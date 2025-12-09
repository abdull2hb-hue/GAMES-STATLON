import React from 'react';
import { Article, Language, CATEGORY_TRANSLATIONS } from '../types';

interface ArticleViewProps {
  article: Article;
  onClose: () => void;
  language: Language;
}

export const ArticleView: React.FC<ArticleViewProps> = ({ article, onClose, language }) => {
  const displayCategory = language === 'en' ? (CATEGORY_TRANSLATIONS[article.category] || article.category) : article.category;
  
  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-gaming-bg/95 backdrop-blur-xl animate-fade-in custom-scrollbar">
      <div className="min-h-screen px-4 text-center">
        {/* Overlay background for closing */}
        <div 
          className="fixed inset-0 transition-opacity" 
          aria-hidden="true" 
          onClick={onClose}
        ></div>

        {/* Content Container */}
        <div className="inline-block w-full max-w-4xl my-8 text-start align-middle transition-all transform bg-gaming-card shadow-2xl rounded-3xl border border-white/5 overflow-hidden relative z-10">
          
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 left-4 z-20 bg-black/40 hover:bg-red-500 text-white p-2 rounded-full backdrop-blur-md transition-all border border-white/10 hover:border-red-500 hover:rotate-90 duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Hero Image */}
          <div className="relative h-72 md:h-[500px] w-full">
            <img 
              src={article.imageUrl} 
              alt={article.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gaming-card via-gaming-card/20 to-transparent"></div>
            
            <div className="absolute bottom-6 start-6 md:bottom-10 md:start-10 flex gap-4 items-end">
               <span className="bg-gaming-accent text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg shadow-gaming-accent/20 border border-white/10 uppercase tracking-wider">
                 {displayCategory}
               </span>
               {article.rating && (
                   <div className="bg-gaming-bg/80 backdrop-blur text-white px-5 py-2 rounded-xl border border-yellow-500/50 flex flex-col items-center leading-none shadow-xl">
                       <span className="text-3xl font-black font-gaming text-yellow-400">{article.rating}</span>
                       <span className="text-[10px] uppercase opacity-75 font-gaming tracking-wider">Score</span>
                   </div>
               )}
            </div>
          </div>

          {/* Article Body */}
          <div className="p-8 md:p-12">
            <div className="flex items-center gap-6 text-slate-400 text-sm mb-6 border-b border-white/5 pb-6 font-gaming uppercase tracking-wide">
              <span className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gaming-accent" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                {article.source}
              </span>
              <span className="opacity-20">|</span>
              <span className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gaming-accent" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                {article.date}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-white mb-8 leading-tight drop-shadow-lg">
              {article.title}
            </h1>

            <div className="prose prose-invert prose-lg max-w-none text-slate-300 leading-relaxed">
              <p className="first-letter:text-5xl first-letter:font-black first-letter:text-gaming-accent first-letter:mr-3 first-letter:float-right rtl:first-letter:float-right rtl:first-letter:ml-3">
                {article.summary}
              </p>
              
              {article.rating && (
                  <div className="my-10 bg-gaming-surface p-8 rounded-2xl border border-white/5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-2 h-full bg-yellow-500"></div>
                      <h4 className="text-white font-bold mb-3 text-xl">{language === 'ar' ? 'الخلاصة' : 'The Verdict'}</h4>
                      <p className="text-base text-slate-300">
                        {language === 'ar' 
                         ? `بناءً على التجربة الكاملة، تستحق هذه اللعبة تقييم ${article.rating}/10. ${article.rating >= 9 ? 'إنها تحفة فنية لا يجب تفويتها.' : article.rating >= 7 ? 'تجربة ممتعة وتستحق وقتك.' : 'قد لا تناسب الجميع.'}`
                         : `Based on the full experience, this game earns a ${article.rating}/10. ${article.rating >= 9 ? 'A masterpiece you should not miss.' : article.rating >= 7 ? 'A solid experience worth your time.' : 'Might not be for everyone.'}`
                        }
                      </p>
                  </div>
              )}

              <p className="mt-8 text-slate-400 text-base italic border-l-2 border-slate-700 pl-4 py-2">
                 {language === 'ar' 
                  ? 'تفاصيل إضافية: يواصل هذا العنوان جذب الانتباه بفضل الرسومات المذهلة وأسلوب اللعب المبتكر. يتوقع المحللون أن يحقق هذا الإصدار نجاحاً كبيراً في الأسواق العالمية والعربية على حد سواء.'
                  : 'Additional Details: This title continues to garner attention due to its stunning visuals and innovative gameplay. Analysts predict major success in global markets.'}
              </p>
            </div>

            <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-slate-500 text-sm font-gaming tracking-wide">© {new Date().getFullYear()} GAMES STATLON</p>
              {article.url && (
                <a 
                  href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gaming-accent hover:bg-violet-600 text-white px-8 py-3 rounded-xl transition-all font-bold shadow-lg hover:shadow-gaming-accent/40 hover:-translate-y-1"
                >
                  {language === 'ar' ? 'المصدر الأصلي' : 'Source Link'}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};