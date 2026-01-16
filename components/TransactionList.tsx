
import React from 'react';
import { Transaction, TransactionType } from '../types';
import { Icons, CATEGORIES, formatCurrency } from '../constants';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete }) => {
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const getIcon = (category: string) => {
    return CATEGORIES.find(c => c.name === category)?.icon || '📦';
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800">Recent Transactions</h3>
        <span className="text-xs font-bold text-slate-400 uppercase">{transactions.length} total</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <tbody className="divide-y divide-slate-50">
            {sortedTransactions.length > 0 ? (
              sortedTransactions.map((t) => (
                <tr key={t.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-xl shadow-sm group-hover:bg-white group-hover:shadow transition-all">
                        {getIcon(t.category)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-800 leading-tight">
                          {t.description}
                        </div>
                        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-tighter mt-1">
                          {t.category} • {new Date(t.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className={`text-sm font-black ${t.type === TransactionType.CREDIT ? 'text-emerald-600' : 'text-slate-900'}`}>
                      {t.type === TransactionType.CREDIT ? '+' : ''}{formatCurrency(t.amount)}
                    </div>
                    <button 
                      onClick={() => onDelete(t.id)}
                      className="text-slate-300 hover:text-rose-500 transition-colors mt-2 inline-block opacity-0 group-hover:opacity-100"
                      title="Delete entry"
                    >
                      <Icons.Trash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-8 py-20 text-center">
                  <div className="text-slate-300 text-4xl mb-4">📭</div>
                  <p className="text-slate-400 font-medium">Your ledger is empty. Time to add something!</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList;
