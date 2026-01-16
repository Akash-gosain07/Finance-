
export enum TransactionType {
  CREDIT = 'credit',
  DEBIT = 'debit'
}

export type Category = 
  | 'Kirana & Groceries' 
  | 'Rent & EMI' 
  | 'Fuel & Transport' 
  | 'Dining Out' 
  | 'Shopping' 
  | 'Salary/Income' 
  | 'Bills & Recharge' 
  | 'UPI/Transfers' 
  | 'Investments' 
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
