import React, { useEffect } from 'react';
import { Language } from '../types';

interface TwitterFeedProps {
    language?: Language;
}

export const TwitterFeed: React.FC<TwitterFeedProps> = ({ language = 'ar' }) => {
  useEffect(() => {
    // Load Twitter widget script dynamically
    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    script.charset = "utf-8";
    document.body.appendChild(script);

    return () => {
      // Cleanup if necessary
    };
  }, []);

  return (
    <div className="bg-gaming-card rounded-2xl border border-white/5 p-4 sticky top-24 shadow-2xl h-fit animate-fade-in group">
        <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-4">
            <div className="p-2 bg-[#1DA1F2]/10 rounded-full">
                <svg className="w-5 h-5 text-[#1DA1F2] fill-current" viewBox="0 0 24 24"><g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></g></svg>
            </div>
            <h3 className="text-white font-bold text-lg font-gaming uppercase tracking-wide">
                {language === 'ar' ? 'تحديثات @games_statlon' : 'Updates'}
            </h3>
        </div>
        <div className="min-h-[400px] max-h-[800px] overflow-y-auto custom-scrollbar">
            <a 
                className="twitter-timeline" 
                data-theme="dark"
                data-height="800"
                data-lang={language}
                data-chrome="transparent noheader nofooter"
                href="https://twitter.com/games_statlon?ref_src=twsrc%5Etfw"
            >
                {language === 'ar' ? 'جاري تحميل التغريدات...' : 'Loading Tweets...'}
            </a>
        </div>
    </div>
  );
};