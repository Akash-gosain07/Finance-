
import { GoogleGenAI } from "@google/genai";
import { Transaction } from "../types";

export const getFinancialAdvice = async (transactions: Transaction[]): Promise<string> => {
  if (transactions.length === 0) return "Start tracking your spends to get smart AI insights!";

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `
    You are a smart Indian financial advisor. Analyze these transactions (amounts in INR): 
    ${JSON.stringify(transactions)}
    
    Provide 3 concise bullet points with insights. 
    Focus on:
    1. Spending patterns (e.g., high Kirana or UPI transfers).
    2. Savings opportunities for the Indian middle class.
    3. A encouraging 'Pro-tip' for financial health.
    
    Use a friendly tone. Format with clear bullet points.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Insights are being calculated. Check back in a moment!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI Advisor is currently unavailable. Please check back later.";
  }
};

export const categorizeTransaction = async (description: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Categorize this Indian transaction: "${description}". Options: Kirana & Groceries, Rent & EMI, Fuel & Transport, Dining Out, Shopping, Salary/Income, Bills & Recharge, UPI/Transfers, Investments, Other. Respond with JUST the category name.`,
    });
    return response.text.trim();
  } catch (error) {
    return "Other";
  }
};
