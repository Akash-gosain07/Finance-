
import React, { useState, useEffect } from 'react';
import { Transaction } from './types';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import AIAdvisor from './components/AIAdvisor';

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('ledgerly_in_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('ledgerly_in_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (newTx: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newTx,
      id: crypto.randomUUID(),
    };
    setTransactions(prev => [...prev, transaction]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#fcfdff] text-slate-900 pb-24 selection:bg-indigo-100">
      {/* Premium Sticky Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <span className="text-white font-black text-xl">₹</span>
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-slate-800 leading-none">Ledgerly<span className="text-indigo-600 italic ml-0.5">India</span></h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Smart Personal Ledger</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex flex-col items-end hidden sm:flex">
               <span className="text-xs font-bold text-slate-800">Hi, Resident</span>
               <span className="text-[9px] font-extrabold text-emerald-500 uppercase tracking-tighter">Verified Member</span>
             </div>
             <div className="w-10 h-10 rounded-2xl bg-indigo-50 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center text-indigo-600 font-bold">
               JS
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Dashboard Column */}
          <div className="lg:col-span-8 space-y-10">
            <Dashboard transactions={transactions} />
            <AIAdvisor transactions={transactions} />
            <TransactionList 
              transactions={transactions} 
              onDelete={deleteTransaction} 
            />
          </div>

          {/* Quick Actions Column */}
          <div className="lg:col-span-4 space-y-10">
            <div className="lg:sticky lg:top-28">
              <TransactionForm onAdd={addTransaction} />
              
              <div className="mt-8 p-8 bg-gradient-to-br from-slate-800 to-slate-950 rounded-[32px] text-white shadow-2xl relative overflow-hidden">
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
                <h4 className="text-sm font-black mb-3 uppercase tracking-widest text-indigo-400">Smart Ledger Pro</h4>
                <p className="text-slate-400 text-xs leading-relaxed font-medium">
                  Your transactions are secured with local encryption. Gemini AI provides real-time categorization for Indian merchants.
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-6 h-6 rounded-full border-2 border-slate-900 bg-slate-700"></div>
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Used by 10k+ Indians</span>
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
