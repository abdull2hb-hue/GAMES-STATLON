import React from 'react';
import { Article } from '../types';

interface ArticleViewProps {
  article: Article;
  onClose: () => void;
}

export const ArticleView: React.FC<ArticleViewProps> = ({ article, onClose }) => {
  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-gaming-dark/95 backdrop-blur-md animate-fade-in">
      <div className="min-h-screen px-4 text-center">
        {/* Overlay background for closing */}
        <div 
          className="fixed inset-0 transition-opacity" 
          aria-hidden="true" 
          onClick={onClose}
        ></div>

        {/* Content Container */}
        <div className="inline-block w-full max-w-4xl my-8 text-right align-middle transition-all transform bg-gaming-card shadow-2xl rounded-2xl border border-slate-700 overflow-hidden relative z-10">
          
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 left-4 z-20 bg-black/50 hover:bg-red-500 text-white p-2 rounded-full backdrop-blur transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Hero Image */}
          <div className="relative h-64 md:h-96 w-full">
            <img 
              src={article.imageUrl} 
              alt={article.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gaming-card via-transparent to-transparent"></div>
            
            <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 flex gap-3 items-end">
               <span className="bg-gaming-accent text-white px-3 py-1 rounded text-sm font-bold shadow-lg">
                 {article.category}
               </span>
               {article.rating && (
                   <div className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-black shadow-lg flex flex-col items-center leading-none border-2 border-white/20">
                       <span className="text-2xl md:text-3xl">{article.rating}</span>
                       <span className="text-[10px] uppercase opacity-75">من 10</span>
                   </div>
               )}
            </div>
          </div>

          {/* Article Body */}
          <div className="p-6 md:p-10">
            <div className="flex items-center gap-4 text-slate-400 text-sm mb-4 border-b border-slate-700 pb-4">
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                {article.source}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                {article.date}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">
              {article.title}
            </h1>

            <div className="prose prose-invert prose-lg max-w-none text-slate-300 leading-relaxed">
              <p>{article.summary}</p>
              
              {article.rating && (
                  <div className="my-8 bg-slate-800/50 p-6 rounded-xl border-r-4 border-yellow-500">
                      <h4 className="text-white font-bold mb-2">الخلاصة والتقييم</h4>
                      <p className="text-sm">بناءً على التجربة الكاملة، تستحق هذه اللعبة تقييم <strong>{article.rating}/10</strong>. {article.rating >= 9 ? 'إنها تحفة فنية لا يجب تفويتها.' : article.rating >= 7 ? 'تجربة ممتعة وتستحق وقتك.' : 'قد لا تناسب الجميع.'}</p>
                  </div>
              )}

              <p className="mt-4 text-slate-400 text-base">
                تفاصيل إضافية: يواصل هذا العنوان جذب الانتباه بفضل الرسومات المذهلة وأسلوب اللعب المبتكر. يتوقع المحللون أن يحقق هذا الإصدار نجاحاً كبيراً في الأسواق العالمية والعربية على حد سواء. تابعونا للمزيد من التحديثات المستمرة حول هذا الموضوع.
              </p>
            </div>

            <div className="mt-10 pt-6 border-t border-slate-700 flex justify-between items-center">
              <p className="text-slate-500 text-sm">حقوق النشر محفوظة © {new Date().getFullYear()} GAMES STATLON</p>
              {article.url && (
                <a 
                  href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg transition-colors font-bold"
                >
                  المصدر الأصلي
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};