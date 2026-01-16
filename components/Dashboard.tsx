
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Transaction, TransactionType } from '../types';
import { Icons, formatCurrency } from '../constants';

interface DashboardProps {
  transactions: Transaction[];
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#475569', '#f97316', '#14b8a6'];

const Dashboard: React.FC<DashboardProps> = ({ transactions }) => {
  const summary = useMemo(() => {
    return transactions.reduce(
      (acc, t) => {
        if (t.type === TransactionType.CREDIT) acc.credit += t.amount;
        else acc.debit += t.amount;
        return acc;
      },
      { credit: 0, debit: 0 }
    );
  }, [transactions]);

  const balance = summary.credit - summary.debit;

  const categoryData = useMemo(() => {
    const data: Record<string, number> = {};
    transactions.filter(t => t.type === TransactionType.DEBIT).forEach((t) => {
      data[t.category] = (data[t.category] || 0) + t.amount;
    });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  return (
    <div className="space-y-6">
      {/* Premium Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 p-6 rounded-3xl shadow-xl shadow-slate-200 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
          <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Available Balance</span>
          <div className="mt-3">
            <span className="text-4xl font-extrabold tracking-tight">
              {formatCurrency(balance)}
            </span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Total Credit</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><Icons.TrendUp /></div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold text-emerald-600">
              {formatCurrency(summary.credit)}
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Total Spending</span>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl"><Icons.TrendDown /></div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold text-rose-600">
              {formatCurrency(summary.debit)}
            </span>
          </div>
        </div>
      </div>

      {/* Spending Insights Section */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="w-full md:w-1/2">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Spending Mix</h3>
            <p className="text-sm text-slate-500 mb-6">Understand where your money is flowing this month.</p>
            <div className="grid grid-cols-2 gap-4">
              {categoryData.slice(0, 4).map((item, idx) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                  <span className="text-xs font-medium text-slate-600 truncate">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="w-full md:w-1/2 h-[220px]">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-300 text-sm font-medium">
                No spending recorded yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
