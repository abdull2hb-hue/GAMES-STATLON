import React from 'react';
import { Article, Language, CATEGORY_TRANSLATIONS } from '../types';

interface NewsCardProps {
  article: Article;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
  onReadMore?: (article: Article) => void;
  language: Language;
}

export const NewsCard: React.FC<NewsCardProps> = ({ article, isAdmin, onDelete, onReadMore, language }) => {
  const displayCategory = language === 'en' ? (CATEGORY_TRANSLATIONS[article.category] || article.category) : article.category;
  
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `Check this out: ${article.title}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div 
      className="group bg-gaming-surface rounded-2xl overflow-hidden shadow-xl border border-white/5 hover:border-gaming-accent/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-gaming-accent/10 flex flex-col h-full relative cursor-pointer"
      onClick={() => onReadMore?.(article)}
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-gaming-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

      <div className="relative h-56 overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-slate-900 animate-pulse"></div>
        <img 
          src={article.imageUrl} 
          alt={article.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gaming-bg via-transparent to-transparent opacity-80"></div>
        
        <div className="absolute top-3 right-3 flex gap-2 z-10">
            <div className="bg-gaming-accent/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg border border-white/10 tracking-wider uppercase">
            {displayCategory}
            </div>
        </div>

        {article.rating && (
            <div className="absolute bottom-3 left-3 bg-gaming-bg/80 backdrop-blur-md text-white px-2 py-1 rounded-lg border border-yellow-500/50 flex items-center gap-1 shadow-lg transform group-hover:scale-110 transition-transform">
                <span className="text-yellow-400 text-lg font-black font-gaming">{article.rating}</span>
                <svg className="w-3 h-3 text-yellow-500 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
            </div>
        )}
      </div>
      
      <div className="p-6 flex flex-col flex-grow relative z-10">
        <div className="flex justify-between items-center mb-3 text-slate-500 text-xs font-gaming tracking-wide uppercase">
          <span className="flex items-center gap-1">
             <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
             {article.source}
          </span>
          <span>{article.date}</span>
        </div>
        
        <h3 className="text-xl font-bold mb-3 text-white leading-snug group-hover:text-gaming-accent transition-colors line-clamp-2">
          {article.title}
        </h3>
        
        <p className="text-slate-400 text-sm line-clamp-2 mb-6 flex-grow leading-relaxed">
          {article.summary}
        </p>

        <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/5">
          <button 
            className="text-white text-xs font-bold hover:text-gaming-accent flex items-center gap-1 group/btn transition-colors"
          >
            {language === 'ar' ? 'اقرأ المزيد' : 'READ MORE'}
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform group-hover/btn:translate-x-1 ${language === 'ar' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
          
          <div className="flex gap-2">
            <button 
                onClick={handleShare}
                title="Share"
                className="bg-white/5 hover:bg-gaming-accent hover:text-white text-slate-400 p-2 rounded-lg transition-all"
            >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current"><g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></g></svg>
            </button>
            {isAdmin && (
                <button 
                onClick={(e) => { e.stopPropagation(); onDelete?.(article.id); }}
                className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white p-2 rounded-lg transition-colors"
                >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};