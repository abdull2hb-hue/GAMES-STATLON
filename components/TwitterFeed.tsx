import React, { useEffect } from 'react';

export const TwitterFeed: React.FC = () => {
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
    <div className="bg-gaming-card rounded-xl border border-slate-700 p-4 sticky top-24 shadow-lg h-fit animate-fade-in">
        <div className="flex items-center gap-2 mb-4 border-b border-slate-700 pb-3">
            <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24"><g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></g></svg>
            <h3 className="text-white font-bold text-lg">تحديثات @games_statlon</h3>
        </div>
        <div className="min-h-[400px] max-h-[800px] overflow-y-auto scrollbar-thin">
            <a 
                className="twitter-timeline" 
                data-theme="dark"
                data-height="800"
                data-lang="ar"
                data-chrome="transparent noheader nofooter"
                href="https://twitter.com/games_statlon?ref_src=twsrc%5Etfw"
            >
                جاري تحميل التغريدات...
            </a>
        </div>
    </div>
  );
};