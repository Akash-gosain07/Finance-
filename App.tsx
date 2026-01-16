
import React, { useState, useEffect } from 'react';
import { Transaction } from './types';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import AIAdvisor from './components/AIAdvisor';

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('ledgerly_in_v2');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('ledgerly_in_v2', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (newTx: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newTx,
      id: crypto.randomUUID(),
    };
    setTransactions(prev => [transaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen text-slate-900 pb-24 transition-all duration-500">
      {/* Premium Header */}
      <header className="bg-white/70 backdrop-blur-2xl border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:rotate-6 transition-transform">
              <span className="text-white font-black text-2xl">₹</span>
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tighter text-slate-900 leading-none">
                Ledgerly<span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500 ml-1">India</span>
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1.5">Smart AI Ledger</p>
            </div>
          </div>
          
          <div className="flex items-center gap-5">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Active Account</span>
              <span className="text-sm font-bold text-slate-800">Primary Resident</span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-slate-100 to-white border-2 border-white shadow-sm flex items-center justify-center text-indigo-600 font-black text-sm ring-2 ring-slate-100/50">
              PR
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Dashboard & History */}
          <div className="lg:col-span-8 space-y-10 order-2 lg:order-1">
            <Dashboard transactions={transactions} />
            <AIAdvisor transactions={transactions} />
            <TransactionList 
              transactions={transactions} 
              onDelete={deleteTransaction} 
            />
          </div>

          {/* Quick Actions Panel */}
          <div className="lg:col-span-4 space-y-8 order-1 lg:order-2">
            <div className="lg:sticky lg:top-32 space-y-8">
              <TransactionForm onAdd={addTransaction} />
              
              <div className="p-8 bg-slate-900 rounded-[32px] text-white shadow-2xl relative overflow-hidden ring-1 ring-white/10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-full mb-4 border border-indigo-500/10">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"></span>
                    Gemini Intelligence
                  </div>
                  <h4 className="text-lg font-bold mb-3">India-First Insights</h4>
                  <p className="text-slate-400 text-xs leading-relaxed font-medium">
                    Our AI models are fine-tuned for Indian spending patterns, including UPI merchant tagging and GST-compliant categorization.
                  </p>
                  <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Trusted by 10k+ users</span>
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className={`w-7 h-7 rounded-full border-2 border-slate-900 bg-slate-${700 + i*100}`}></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;
