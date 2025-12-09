import React from 'react';
import { Article } from '../types';

interface NewsCardProps {
  article: Article;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
  onReadMore?: (article: Article) => void;
}

export const NewsCard: React.FC<NewsCardProps> = ({ article, isAdmin, onDelete, onReadMore }) => {
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `اقرأ هذا الخبر: ${article.title} - ${article.summary}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-gaming-card rounded-xl overflow-hidden shadow-lg border border-slate-700 hover:border-gaming-accent transition-all duration-300 transform hover:-translate-y-1 group flex flex-col h-full relative">
      <div className="relative h-48 overflow-hidden shrink-0">
        <img 
          src={article.imageUrl} 
          alt={article.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-2 right-2 flex gap-2">
            <div className="bg-gaming-accent text-white text-xs font-bold px-2 py-1 rounded shadow-lg">
            {article.category}
            </div>
            {article.rating && (
                <div className="bg-yellow-500 text-black text-xs font-black px-2 py-1 rounded shadow-lg flex items-center gap-1">
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                    {article.rating}
                </div>
            )}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-2 text-slate-400 text-xs">
          <span>{article.source}</span>
          <span>{article.date}</span>
        </div>
        
        <h3 className="text-xl font-bold mb-3 text-white leading-tight group-hover:text-gaming-highlight transition-colors line-clamp-2">
          {article.title}
        </h3>
        
        <p className="text-slate-300 text-sm line-clamp-3 mb-4 flex-grow">
          {article.summary}
        </p>

        <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-700/50">
          <div className="flex gap-2">
            <button 
              onClick={() => onReadMore?.(article)}
              className="text-gaming-highlight text-sm font-bold hover:underline"
            >
              اقرأ المزيد
            </button>
            <button 
              onClick={handleShare}
              title="شارك على X"
              className="text-slate-400 hover:text-white transition-colors p-1"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current"><g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></g></svg>
            </button>
          </div>
          
          {isAdmin && (
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete?.(article.id); }}
              className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1 rounded-md text-sm transition-colors"
            >
              حذف
            </button>
          )}
        </div>
      </div>
    </div>
  );
};