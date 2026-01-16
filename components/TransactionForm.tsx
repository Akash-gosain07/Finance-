
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
    if (!description || description.length < 3) return;
    setIsCategorizing(true);
    const suggested = await categorizeTransaction(description);
    if (suggested) {
      setCategory(suggested as Category);
    }
    setIsCategorizing(false);
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
      <h2 className="text-xl font-extrabold mb-8 text-slate-800">Add Entry</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl">
          <button
            type="button"
            onClick={() => setType(TransactionType.DEBIT)}
            className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-widest rounded-xl transition-all ${
              type === TransactionType.DEBIT ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Spends
          </button>
          <button
            type="button"
            onClick={() => setType(TransactionType.CREDIT)}
            className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-widest rounded-xl transition-all ${
              type === TransactionType.CREDIT ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Income
          </button>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">What for?</label>
          <div className="relative">
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleAutoCategorize}
              placeholder="e.g. Jio Recharge, Grocery"
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all text-slate-800 placeholder-slate-300 font-medium"
            />
            {isCategorizing && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] text-indigo-500 font-bold animate-pulse uppercase">
                AI Magic...
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">How much? (₹)</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all text-slate-800 font-bold text-lg"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Category</label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all appearance-none text-slate-700 font-medium"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={!amount || !description}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 transition-all disabled:opacity-30 disabled:shadow-none active:scale-[0.98] uppercase tracking-widest text-xs"
        >
          Confirm {type === TransactionType.DEBIT ? 'Spend' : 'Income'}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
