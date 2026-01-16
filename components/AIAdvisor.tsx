
import React, { useState, useEffect } from 'react';
import { Transaction } from '../types';
import { getFinancialAdvice } from '../services/geminiService';
import { Icons } from '../constants';

interface AIAdvisorProps {
  transactions: Transaction[];
}

const AIAdvisor: React.FC<AIAdvisorProps> = ({ transactions }) => {
  const [advice, setAdvice] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const fetchAdvice = async () => {
    if (transactions.length === 0) return;
    setLoading(true);
    const result = await getFinancialAdvice(transactions);
    setAdvice(result);
    setLoading(false);
  };

  useEffect(() => {
    if (transactions.length > 0 && advice === '') {
      fetchAdvice();
    }
  }, [transactions]);

  return (
    <div className="bg-gradient-to-br from-indigo-700 via-indigo-800 to-slate-900 p-8 rounded-[32px] shadow-2xl shadow-indigo-200/50 text-white relative overflow-hidden group">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-white/10 transition-colors"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-white/10 rounded-2xl border border-white/10">
            <Icons.Brain />
          </div>
          <div>
            <h3 className="text-lg font-black tracking-tight leading-none">Smart Insights</h3>
            <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mt-1">Powered by Gemini AI</p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="w-10 h-10 border-[3px] border-white/20 border-t-indigo-400 rounded-full animate-spin"></div>
            <p className="text-indigo-200 text-[11px] font-bold uppercase tracking-widest">Generating Local Advice...</p>
          </div>
        ) : advice ? (
          <div className="space-y-4">
             <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-inner">
               <div className="prose prose-sm prose-invert max-w-none">
                 {advice.split('\n').filter(l => l.trim()).map((line, i) => (
                   <p key={i} className="text-indigo-50 font-medium mb-3 last:mb-0 leading-relaxed">
                     {line.startsWith('-') || line.startsWith('•') ? (
                       <span className="flex gap-2">
                         <span className="text-indigo-400">✦</span>
                         <span>{line.replace(/^[-•]\s*/, '')}</span>
                       </span>
                     ) : line}
                   </p>
                 ))}
               </div>
             </div>
             <div className="flex justify-end">
               <button 
                 onClick={fetchAdvice}
                 className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-400 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95"
               >
                 Refresh Analysis
               </button>
             </div>
          </div>
        ) : (
          <div className="py-8 text-center bg-white/5 rounded-2xl border border-white/5">
            <p className="text-indigo-200 text-sm font-semibold italic">
              Record 3 or more spends to unlock AI coaching.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAdvisor;
