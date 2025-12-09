import React, { useState } from 'react';
import { CommunityGame, Language } from '../types';

const INITIAL_GAMES: CommunityGame[] = [
  {
    id: '1',
    title: 'Elden Ring',
    coverUrl: 'https://image.pollinations.ai/prompt/Elden%20Ring%20cover%20art%20minimal?width=200&height=200&nologo=true',
    communityScore: 96,
    totalVotes: 12500
  },
  {
    id: '2',
    title: 'Baldur\'s Gate 3',
    coverUrl: 'https://image.pollinations.ai/prompt/Baldurs%20Gate%203%20logo%20art?width=200&height=200&nologo=true',
    communityScore: 98,
    totalVotes: 15420
  },
  {
    id: '3',
    title: 'EA FC 24',
    coverUrl: 'https://image.pollinations.ai/prompt/soccer%20game%20cover%20art?width=200&height=200&nologo=true',
    communityScore: 72,
    totalVotes: 8900
  },
  {
    id: '4',
    title: 'Cyberpunk 2077',
    coverUrl: 'https://image.pollinations.ai/prompt/cyberpunk%202077%20character?width=200&height=200&nologo=true',
    communityScore: 88,
    totalVotes: 11200
  }
];

interface CommunityRatingsProps {
  language: Language;
}

export const CommunityRatings: React.FC<CommunityRatingsProps> = ({ language }) => {
  const [games, setGames] = useState<CommunityGame[]>(INITIAL_GAMES);

  const handleRate = (gameId: string, rating: number) => {
    setGames(prevGames => prevGames.map(game => {
      if (game.id === gameId) {
        // Simulate updating the score slightly based on user input
        const newVotes = game.totalVotes + 1;
        // Simple logic: if user rates high (4-5), score goes up slightly, else down.
        const impact = rating >= 4 ? 0.1 : rating <= 2 ? -0.1 : 0; 
        const newScore = Math.min(100, Math.max(0, game.communityScore + impact));
        
        return {
          ...game,
          userRating: rating,
          totalVotes: newVotes,
          communityScore: parseFloat(newScore.toFixed(1))
        };
      }
      return game;
    }));
  };

  return (
    <div className="bg-gaming-card rounded-2xl border border-white/5 p-6 shadow-2xl animate-fade-in relative overflow-hidden group">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 blur-[50px] rounded-full pointer-events-none"></div>

        <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="p-2 bg-yellow-500/10 rounded-full border border-yellow-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            </div>
            <div>
                <h3 className="text-white font-bold text-lg font-gaming uppercase tracking-wide leading-none">
                    {language === 'ar' ? 'ألعاب المجتمع' : 'Community Top Picks'}
                </h3>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    {language === 'ar' ? 'صوّت للعبتك المفضلة' : 'Vote for your favorite'}
                </span>
            </div>
        </div>

        <div className="space-y-6 relative z-10">
            {games.map(game => (
                <div key={game.id} className="bg-black/20 rounded-xl p-3 border border-white/5 hover:border-gaming-accent/30 transition-all group/item">
                    <div className="flex gap-4 items-center">
                        <img src={game.coverUrl} alt={game.title} className="w-16 h-16 rounded-lg object-cover border border-white/10 shadow-lg" />
                        <div className="flex-1 min-w-0">
                            <h4 className="text-white font-bold truncate mb-1">{game.title}</h4>
                            
                            {/* Progress Bar */}
                            <div className="relative w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2">
                                <div 
                                    className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ${
                                        game.communityScore >= 90 ? 'bg-gaming-highlight' : 
                                        game.communityScore >= 70 ? 'bg-yellow-400' : 'bg-red-500'
                                    }`}
                                    style={{ width: `${game.communityScore}%` }}
                                ></div>
                            </div>
                            
                            <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                                <span>{game.communityScore}% {language === 'ar' ? 'إعجاب' : 'Score'}</span>
                                <span>{game.totalVotes.toLocaleString()} {language === 'ar' ? 'صوت' : 'Votes'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Interactive Rating */}
                    <div className="mt-3 pt-3 border-t border-white/5 flex justify-between items-center">
                        <span className="text-[10px] text-slate-500 font-bold uppercase">
                            {language === 'ar' ? 'تقييمك:' : 'Your Rate:'}
                        </span>
                        <div className="flex gap-1" dir="ltr">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => handleRate(game.id, star)}
                                    className="focus:outline-none transition-transform active:scale-90 hover:scale-110"
                                >
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        className={`h-5 w-5 transition-colors ${
                                            (game.userRating || 0) >= star 
                                            ? 'text-yellow-400 fill-current' 
                                            : 'text-slate-700 hover:text-yellow-400/50'
                                        }`} 
                                        viewBox="0 0 20 20" 
                                        fill="currentColor"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};
