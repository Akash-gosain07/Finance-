
export enum TransactionType {
  CREDIT = 'credit',
  DEBIT = 'debit'
}

export type Category = 
  | 'Food & Drinks' 
  | 'Shopping' 
  | 'Transport' 
  | 'Housing' 
  | 'Entertainment' 
  | 'Income' 
  | 'Health' 
  | 'Investment'
  | 'Other';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: Category;
  description: string;
  date: string;
}

export interface FinancialSummary {
  totalBalance: number;
  totalCredit: number;
  totalDebit: number;
  transactionCount: number;
}
