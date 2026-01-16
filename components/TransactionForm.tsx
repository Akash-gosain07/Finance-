
import React, { useState } from 'react';
import { Transaction, TransactionType, Category } from '../types';
import { CATEGORIES, Icons } from '../constants';
import { categorizeTransaction } from '../services/geminiService';

interface TransactionFormProps {
  onAdd: (transaction: Omit<Transaction, 'id'>) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onAdd }) => {
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [type, setType] = useState<TransactionType>(TransactionType.DEBIT);
  const [category, setCategory] = useState<Category>('Other');
  const [isCategorizing, setIsCategorizing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    onAdd({
      amount: parseFloat(amount),
      description,
      type,
      category,
      date: new Date().toISOString(),
    });

    setAmount('');
    setDescription('');
    setCategory('Other');
  };

  const handleAutoCategorize = async () => {
    if (!description || description.trim().length < 3) return;
    setIsCategorizing(true);
    try {
      const suggested = await categorizeTransaction(description);
      if (suggested && CATEGORIES.some(c => c.name === suggested)) {
        setCategory(suggested as Category);
      }
    } finally {
      setIsCategorizing(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[32px] shadow-sm border border-slate-100 ring-1 ring-slate-100">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">New Entry</h2>
        <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
          <Icons.Plus />
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex gap-2 p-1.5 bg-slate-100/50 rounded-2xl">
          <button
            type="button"
            onClick={() => setType(TransactionType.DEBIT)}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${
              type === TransactionType.DEBIT 
                ? 'bg-white text-rose-600 shadow-md shadow-rose-100' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Spending
          </button>
          <button
            type="button"
            onClick={() => setType(TransactionType.CREDIT)}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${
              type === TransactionType.CREDIT 
                ? 'bg-white text-emerald-600 shadow-md shadow-emerald-100' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Income
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Description</label>
          <div className="relative">
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleAutoCategorize}
              placeholder="Zomato order, Rent, etc."
              className="w-full px-5 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-500/20 transition-all text-sm font-bold placeholder-slate-300"
            />
            {isCategorizing && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-[9px] text-indigo-500 font-black uppercase tracking-widest">AI Categorizing</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Amount (₹)</label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">₹</span>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-10 pr-5 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-500/20 transition-all text-slate-900 font-black text-xl"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Category</label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-5 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-500/20 transition-all appearance-none text-slate-700 font-bold text-sm"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.icon} &nbsp; {cat.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={!amount || !description}
          className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 disabled:hover:scale-100 disabled:shadow-none uppercase tracking-[0.2em] text-[10px]"
        >
          Confirm Entry
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
