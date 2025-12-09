import React, { useState } from 'react';
import { Article, CATEGORIES, Language } from '../types';
import { generateGamingNews, searchLatestNews, fetchTweetsAsNews, structureReviewWithAI } from '../services/geminiService';

interface AdminPanelProps {
  articles: Article[];
  setArticles: React.Dispatch<React.SetStateAction<Article[]>>;
  language?: Language;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ articles, setArticles, language = 'ar' }) => {
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState('');
  const [searchResult, setSearchResult] = useState<{text: string, sources: any[]} | null>(null);
  
  // Image Source Mode for AI: 'AI' or 'MANUAL'
  const [imageMode, setImageMode] = useState<'AI' | 'MANUAL'>('MANUAL');

  // Manual Entry State
  const [manualTitle, setManualTitle] = useState('');
  const [manualSummary, setManualSummary] = useState('');
  const [manualCategory, setManualCategory] = useState(CATEGORIES[0]);
  const [manualRating, setManualRating] = useState<string>(''); // string to handle decimals easily
  const [manualImage, setManualImage] = useState<string>('');
  
  // AI Assist State
  const [aiAssistLoading, setAiAssistLoading] = useState(false);

  // Edit Mode State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Article>>({});

  // Stats
  const stats = {
    total: articles.length,
    categories: new Set(articles.map(a => a.category)).size,
    manualPending: articles.filter(a => a.imageUrl.includes('placehold.co')).length
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 9) return 'text-gaming-highlight'; // Emerald/Green
    if (rating >= 7) return 'text-yellow-400';
    if (rating >= 5) return 'text-orange-400';
    return 'text-red-500';
  };

  const getRatingBg = (rating: number) => {
    if (rating >= 9) return 'bg-gaming-highlight'; 
    if (rating >= 7) return 'bg-yellow-400';
    if (rating >= 5) return 'bg-orange-400';
    return 'bg-red-500';
  };

  const handleGenerate = async () => {
    setLoading(true);
    setSearchResult(null);
    const newArticles = await generateGamingNews(topic || "أخبار الألعاب");
    
    // Process images based on selection
    const processedArticles = newArticles.map(article => ({
        ...article,
        imageUrl: imageMode === 'AI' ? article.imageUrl : 'https://placehold.co/800x600/1e293b/FFF?text=Needs+Image'
    }));

    setArticles(prev => [...processedArticles, ...prev]);
    setLoading(false);
  };

  const handleSearch = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      const result = await searchLatestNews(topic);
      const sources = result.groundingChunks?.map((chunk: any) => chunk.web).filter(Boolean) || [];
      setSearchResult({
        text: result.text || "لا توجد نتائج نصية.",
        sources: sources
      });
    } catch (e) {
      alert("فشل البحث");
    }
    setLoading(false);
  };

  const handleSyncTweets = async () => {
    setLoading(true);
    try {
      const tweets = await fetchTweetsAsNews("games_statlon");
      if (tweets.length > 0) {
        setArticles(prev => {
          const existingTitles = new Set(prev.map(p => p.title));
          const uniqueNew = tweets.filter(t => !existingTitles.has(t.title));
          return [...uniqueNew, ...prev];
        });
        alert(`تم استيراد ${tweets.length} تغريدات جديدة كأخبار!`);
      } else {
        alert("لم يتم العثور على تغريدات جديدة أو تعذر الوصول.");
      }
    } catch (e) {
      alert("حدث خطأ أثناء المزامنة");
    }
    setLoading(false);
  };

  const handleAiReviewAssist = async () => {
    if (!manualTitle) {
        alert("الرجاء كتابة اسم اللعبة أو العنوان أولاً.");
        return;
    }
    setAiAssistLoading(true);
    try {
        const result = await structureReviewWithAI(manualTitle, manualSummary);
        setManualTitle(result.title);
        setManualSummary(result.summary);
        setManualRating(result.rating.toString());
    } catch (e) {
        alert("حدث خطأ أثناء معالجة المراجعة.");
    }
    setAiAssistLoading(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isEdit) {
            setEditForm(prev => ({ ...prev, imageUrl: reader.result as string }));
        } else {
            setManualImage(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTitle || !manualSummary) return;

    const newArticle: Article = {
      id: Math.random().toString(36).substr(2, 9),
      title: manualTitle,
      summary: manualSummary,
      category: manualCategory,
      source: 'GAMES STATLON',
      date: new Date().toLocaleDateString('ar-SA'),
      imageUrl: manualImage || 'https://image.pollinations.ai/prompt/gaming?width=800&height=600',
      rating: (manualCategory === 'مراجعات' && manualRating) ? parseFloat(manualRating) : undefined
    };

    setArticles(prev => [newArticle, ...prev]);
    
    setManualTitle('');
    setManualSummary('');
    setManualImage('');
    setManualRating('');
    alert('تم إضافة الخبر بنجاح');
  };

  const openGoogleImageSearch = (query: string) => {
      if (!query) return;
      window.open(`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query + ' gaming wallpaper')}`, '_blank');
  };

  // Edit Functions
  const startEditing = (article: Article) => {
      setEditingId(article.id);
      setEditForm(article);
  };

  const saveEdit = () => {
      setArticles(prev => prev.map(a => a.id === editingId ? { ...a, ...editForm } as Article : a));
      setEditingId(null);
      setEditForm({});
  };

  const cancelEdit = () => {
      setEditingId(null);
      setEditForm({});
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col items-center">
            <span className="text-slate-400 text-sm">إجمالي المقالات</span>
            <span className="text-3xl font-bold text-white mt-1">{stats.total}</span>
        </div>
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col items-center">
            <span className="text-slate-400 text-sm">التصنيفات النشطة</span>
            <span className="text-3xl font-bold text-gaming-highlight mt-1">{stats.categories}</span>
        </div>
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col items-center">
            <span className="text-slate-400 text-sm">صور تحتاج لمراجعة</span>
            <span className={`text-3xl font-bold mt-1 ${stats.manualPending > 0 ? 'text-red-500' : 'text-green-500'}`}>{stats.manualPending}</span>
        </div>
      </div>

      {/* AI Section */}
      <div className="bg-gaming-card p-6 rounded-2xl border border-gaming-accent/30 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-gaming-accent"></div>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gaming-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          مركز قيادة الذكاء الاصطناعي
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                
                {/* Image Preference Selection */}
                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700">
                    <label className="block text-sm font-bold text-slate-300 mb-3">تفضيلات الصور للمقالات المولدة:</label>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${imageMode === 'MANUAL' ? 'bg-gaming-accent/20 border-gaming-accent' : 'bg-slate-800 border-slate-700 hover:bg-slate-700'}`}>
                            <input 
                                type="radio" 
                                name="imgMode" 
                                checked={imageMode === 'MANUAL'} 
                                onChange={() => setImageMode('MANUAL')}
                                className="w-5 h-5 accent-gaming-accent"
                            />
                            <div>
                                <span className="block text-white font-bold">اختيار الصور يدوياً (موصى به)</span>
                                <span className="text-xs text-slate-400">سيتم إنشاء الخبر بصورة مؤقتة لتختار أنت الصورة المناسبة لاحقاً.</span>
                            </div>
                        </label>
                        <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${imageMode === 'AI' ? 'bg-gaming-accent/20 border-gaming-accent' : 'bg-slate-800 border-slate-700 hover:bg-slate-700'}`}>
                            <input 
                                type="radio" 
                                name="imgMode" 
                                checked={imageMode === 'AI'} 
                                onChange={() => setImageMode('AI')}
                                className="w-5 h-5 accent-gaming-accent"
                            />
                            <div>
                                <span className="block text-white font-bold">توليد تلقائي (AI)</span>
                                <span className="text-xs text-slate-400">سيقوم الذكاء الاصطناعي برسم صورة تخيلية لكل خبر.</span>
                            </div>
                        </label>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-300">موضوع الأخبار</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="مثال: مراجعات ألعاب RPG حديثة، أخبار Elden Ring..."
                            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-gaming-accent text-white"
                        />
                         <button
                            onClick={handleGenerate}
                            disabled={loading}
                            className="bg-gaming-accent hover:bg-violet-700 text-white font-bold py-2 px-6 rounded-lg transition-all disabled:opacity-50 flex justify-center items-center gap-2 whitespace-nowrap shadow-lg shadow-violet-900/20"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    جاري المعالجة...
                                </>
                            ) : (
                                'توليد الأخبار'
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-1 flex flex-col justify-end">
                 <button
                    onClick={handleSyncTweets}
                    disabled={loading}
                    className="w-full bg-black hover:bg-slate-900 text-white border border-slate-700 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg group h-full"
                >
                    <div className="bg-white text-black p-2 rounded-full group-hover:scale-110 transition-transform">
                       <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-black"><g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></g></svg>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-slate-400 font-normal">استيراد سريع</div>
                        <div>مزامنة من X (@games_statlon)</div>
                    </div>
                </button>
            </div>
        </div>
      </div>

      {/* Manual Entry Section */}
      <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gaming-highlight" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          إضافة خبر يدوياً
        </h2>
        
        <form onSubmit={handleManualSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">عنوان الخبر</label>
              <div className="flex gap-2">
                  <input 
                    type="text" 
                    required 
                    value={manualTitle}
                    onChange={(e) => setManualTitle(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-gaming-highlight focus:outline-none"
                    placeholder="اكتب عنواناً جذاباً..."
                  />
                  {manualTitle && (
                      <button 
                        type="button"
                        onClick={() => openGoogleImageSearch(manualTitle)}
                        title="ابحث عن صورة في Google"
                        className="bg-slate-700 hover:bg-slate-600 text-white px-3 rounded-lg transition-colors border border-slate-600"
                      >
                          🔍 صور
                      </button>
                  )}
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm text-slate-400">ملخص الخبر / المراجعة</label>
                  {manualCategory === 'مراجعات' && (
                      <button 
                        type="button"
                        onClick={handleAiReviewAssist}
                        disabled={aiAssistLoading}
                        className="text-xs bg-gaming-accent/20 hover:bg-gaming-accent text-gaming-accent hover:text-white px-2 py-1 rounded transition-colors flex items-center gap-1 border border-gaming-accent/50"
                      >
                          {aiAssistLoading ? (
                             <span className="animate-spin h-3 w-3 border-2 border-current border-t-transparent rounded-full"></span>
                          ) : (
                             <span>✨ تنسيق بالذكاء الاصطناعي</span>
                          )}
                      </button>
                  )}
              </div>
              <textarea 
                required
                rows={4}
                value={manualSummary}
                onChange={(e) => setManualSummary(e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-gaming-highlight focus:outline-none"
                placeholder={manualCategory === 'مراجعات' ? "اكتب ملاحظاتك هنا (رؤوس أقلام، إيجابيات، سلبيات) وسنقوم بصياغتها..." : "اكتب تفاصيل الخبر هنا..."}
              ></textarea>
            </div>
          </div>

          <div className="space-y-4 flex flex-col">
            <div>
              <label className="block text-sm text-slate-400 mb-1">التصنيف</label>
              <div className="relative">
                  <select 
                    value={manualCategory}
                    onChange={(e) => setManualCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-gaming-highlight focus:outline-none appearance-none"
                  >
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                  <div className="absolute left-3 top-3 pointer-events-none text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
              </div>

              {manualCategory === 'مراجعات' && (
                  <div className="mt-4 bg-black/40 p-5 rounded-2xl border border-slate-600/50 shadow-inner">
                      <div className="flex justify-between items-end mb-4">
                        <div className="flex flex-col">
                           <label className="text-white font-bold mb-1">التقييم النهائي</label>
                           <span className="text-xs text-slate-400">حرّك المؤشر لتحديد الدرجة</span>
                        </div>
                        <div className={`text-4xl font-black font-gaming tracking-tighter ${getRatingColor(parseFloat(manualRating || '0'))}`}>
                           {manualRating || '0'} <span className="text-base text-slate-500 font-sans font-normal opacity-60">/ 10</span>
                        </div>
                      </div>
                      
                      <div className="relative h-6 flex items-center">
                         <div className="absolute w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div 
                                className={`h-full transition-all duration-300 ${getRatingBg(parseFloat(manualRating || '0'))}`} 
                                style={{ width: `${(parseFloat(manualRating || '0') / 10) * 100}%` }}
                            ></div>
                         </div>
                         <input 
                           type="range" 
                           min="0" 
                           max="10" 
                           step="0.1"
                           value={manualRating || 0}
                           onChange={(e) => setManualRating(e.target.value)}
                           className="absolute w-full h-6 opacity-0 cursor-pointer z-10"
                         />
                         <div 
                            className="absolute w-4 h-4 bg-white rounded-full shadow-lg border-2 border-slate-900 pointer-events-none transition-all duration-75"
                            style={{ left: `calc(${(parseFloat(manualRating || '0') / 10) * 100}% - 8px)` }}
                         ></div>
                      </div>
                      
                      <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-gaming uppercase tracking-widest px-1">
                          <span>سيء</span>
                          <span>متوسط</span>
                          <span>جيد</span>
                          <span>ممتاز</span>
                          <span>أسطوري</span>
                      </div>
                  </div>
              )}
            </div>
            
            <div className="mt-2">
              <label className="block text-[10px] text-slate-500 mb-1 font-bold uppercase tracking-wider">صورة الخبر</label>
              
              <div className="space-y-2">
                {/* Image Preview if exists */}
                {manualImage && (
                    <div className="relative w-full h-32 bg-slate-900 rounded-lg overflow-hidden border border-slate-600 mb-2 group">
                        <img src={manualImage} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button 
                                type="button"
                                onClick={() => setManualImage('')}
                                className="bg-red-500 text-white rounded-full px-3 py-1 text-sm font-bold shadow-md hover:bg-red-600"
                            >
                                إزالة الصورة
                            </button>
                        </div>
                    </div>
                )}

                {/* Ultra Compact Upload Area */}
                {!manualImage && (
                   <div className="flex gap-2 items-center bg-slate-900 p-2 rounded border border-slate-600">
                        <label className="cursor-pointer bg-slate-700 hover:bg-slate-600 text-white text-[10px] px-3 py-2 rounded flex items-center gap-2 border border-slate-600 transition-colors shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            <span>رفع صورة</span>
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e)} />
                        </label>
                        <span className="text-slate-600 text-[10px]">أو</span>
                        <input 
                            type="text" 
                            placeholder="رابط صورة مباشر..."
                            value={manualImage}
                            onChange={(e) => setManualImage(e.target.value)}
                            className="flex-1 bg-transparent border-none text-xs text-white focus:ring-0 placeholder-slate-600 px-2"
                        />
                   </div>
                )}
              </div>
            </div>

            <button type="submit" className="w-full bg-gaming-highlight hover:bg-emerald-600 text-slate-900 font-bold py-3 rounded-lg transition-colors mt-auto shadow-lg shadow-emerald-900/20">
              نشر الخبر فوراً
            </button>
          </div>
        </form>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4 text-slate-200 border-b border-slate-700 pb-2">إدارة المحتوى</h3>
        <div className="overflow-x-auto rounded-xl border border-slate-700">
          <table className="w-full text-sm text-right text-slate-400">
            <thead className="text-xs text-slate-200 uppercase bg-slate-800">
              <tr>
                <th scope="col" className="px-6 py-4">الخبر</th>
                <th scope="col" className="px-6 py-4">التصنيف / التاريخ</th>
                <th scope="col" className="px-6 py-4">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => {
                 const needsImage = article.imageUrl.includes('placehold.co') || article.imageUrl.includes('Needs+Image');
                 return (
                <tr key={article.id} className={`bg-slate-900 border-b border-slate-800 hover:bg-slate-800/50 transition-colors ${editingId === article.id ? 'bg-slate-800' : ''} ${needsImage ? 'bg-red-900/10' : ''}`}>
                  {editingId === article.id ? (
                      // Edit Mode Row
                      <>
                        <td className="px-6 py-4">
                           <div className="space-y-3">
                               <input 
                                 type="text" 
                                 value={editForm.title} 
                                 onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                                 className="w-full bg-black border border-slate-600 p-2 rounded text-white font-bold"
                                 placeholder="العنوان"
                               />
                               <textarea
                                 value={editForm.summary} 
                                 onChange={(e) => setEditForm({...editForm, summary: e.target.value})}
                                 className="w-full bg-black border border-slate-600 p-2 rounded text-white text-xs"
                                 rows={3}
                                 placeholder="الملخص"
                               />
                           </div>
                        </td>
                        <td className="px-6 py-4 align-top">
                            <div className="flex flex-col gap-2 mb-2">
                                <select 
                                    value={editForm.category}
                                    onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                                    className="w-full bg-black border border-slate-600 p-2 rounded text-white text-xs"
                                >
                                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                                {editForm.category === 'مراجعات' && (
                                    <div className="flex items-center gap-2 bg-black border border-slate-600 p-1 rounded">
                                        <input 
                                            type="range"
                                            min="0" max="10" step="0.1"
                                            value={editForm.rating || 0}
                                            onChange={(e) => setEditForm({...editForm, rating: parseFloat(e.target.value)})}
                                            className="flex-1 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                                        />
                                        <span className={`text-xs font-bold w-8 text-center ${getRatingColor(editForm.rating || 0)}`}>
                                            {editForm.rating || 0}
                                        </span>
                                    </div>
                                )}
                            </div>
                            
                            <div className="bg-black/30 p-2 rounded border border-slate-700">
                                <div className="text-xs text-slate-400 mb-1 text-center">تعديل الصورة</div>
                                <div className="flex flex-col gap-2 items-center">
                                    <img src={editForm.imageUrl || article.imageUrl} className="h-20 w-32 object-cover rounded border border-slate-600" />
                                    
                                    <div className="flex gap-1 w-full">
                                        <label className="flex-1 cursor-pointer text-center text-[10px] bg-slate-700 px-2 py-1.5 rounded hover:bg-slate-600 text-white transition-colors">
                                            رفع
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, true)} />
                                        </label>
                                        <button 
                                            type="button"
                                            onClick={() => openGoogleImageSearch(editForm.title || '')}
                                            className="flex-1 text-[10px] bg-blue-900/50 text-blue-200 hover:bg-blue-900 border border-blue-800 rounded px-2 py-1.5 transition-colors"
                                        >
                                            بحث Google
                                        </button>
                                    </div>
                                    <input 
                                        type="text" 
                                        value={editForm.imageUrl} 
                                        onChange={(e) => setEditForm({...editForm, imageUrl: e.target.value})}
                                        className="w-full bg-black border border-slate-600 p-1.5 rounded text-white text-[10px]"
                                        placeholder="أو رابط صورة مباشر..."
                                    />
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-4 align-top">
                            <div className="flex flex-col gap-2">
                                <button onClick={saveEdit} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors">حفظ التغييرات</button>
                                <button onClick={cancelEdit} className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded text-xs transition-colors">إلغاء</button>
                            </div>
                        </td>
                      </>
                  ) : (
                      // Display Mode Row
                      <>
                        <td className="px-6 py-4 font-medium text-white max-w-sm">
                            <div className="flex items-start gap-4">
                                <div className="relative shrink-0">
                                    <img src={article.imageUrl} className={`h-16 w-24 object-cover rounded-lg border ${needsImage ? 'border-red-500 opacity-50' : 'border-slate-700'}`} />
                                    {needsImage && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="bg-red-600 text-white text-[10px] px-1 py-0.5 rounded shadow">تحتاج صورة</span>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <div className="font-bold line-clamp-2 leading-tight mb-1">{article.title}</div>
                                    <div className="text-xs text-slate-500 line-clamp-2">{article.summary}</div>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <span className="inline-block bg-slate-800 border border-slate-700 text-slate-300 px-2 py-1 rounded text-xs font-bold mb-1">{article.category}</span>
                            {article.rating && (
                                <span className="mr-2 inline-block bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 px-2 py-1 rounded text-xs font-bold">
                                    ★ {article.rating}
                                </span>
                            )}
                            <div className="text-xs text-slate-500 font-mono mt-1">{article.date}</div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex flex-col gap-2">
                                <button 
                                onClick={() => startEditing(article)}
                                className={`text-xs font-bold px-3 py-1.5 rounded transition-colors flex items-center justify-center gap-1 ${needsImage ? 'bg-red-500 text-white hover:bg-red-600 animate-pulse' : 'bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white'}`}
                                >
                                {needsImage ? 'أضف صورة الآن' : 'تعديل'}
                                </button>
                                <button 
                                onClick={() => setArticles(prev => prev.filter(a => a.id !== article.id))}
                                className="bg-slate-800 text-slate-400 hover:bg-red-900/30 hover:text-red-500 border border-slate-700 hover:border-red-900 px-3 py-1.5 rounded text-xs transition-colors"
                                >
                                حذف
                                </button>
                            </div>
                        </td>
                      </>
                  )}
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};