'use client'

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  useEffect(() => {
    fetchTransactions();
  }, []);

  async function fetchTransactions() {
    const { data } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });
    
    setTransactions(data || []);
    
    let inc = 0, exp = 0;
    data?.forEach(t => {
      if (t.type === 'income') inc += Number(t.amount);
      if (t.type === 'expense') exp += Number(t.amount);
    });
    setTotalIncome(inc);
    setTotalExpense(exp);
  }

  const balance = totalIncome - totalExpense;

  return (
    <div className="min-h-screen pb-10">
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-8 shadow-lg text-center rounded-b-[2rem]"
      >
        <h1 className="text-4xl font-extrabold tracking-tight">গ্রামের জামে মসজিদ</h1>
        <p className="mt-2 text-emerald-100 font-medium">স্বচ্ছ হিসাব ও ব্যবস্থাপনা পোর্টাল</p>
      </motion.header>

      <main className="max-w-4xl mx-auto p-4 mt-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
        >
          {/* Income Card */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border-t-4 border-emerald-500 transform hover:-translate-y-1 transition duration-300">
            <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">মোট জমা</h3>
            <p className="text-3xl font-black text-emerald-600 mt-2">৳ {totalIncome}</p>
          </div>
          
          {/* Expense Card */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border-t-4 border-rose-500 transform hover:-translate-y-1 transition duration-300">
            <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">মোট খরচ</h3>
            <p className="text-3xl font-black text-rose-600 mt-2">৳ {totalExpense}</p>
          </div>

          {/* Balance Card */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border-t-4 border-indigo-500 transform hover:-translate-y-1 transition duration-300">
            <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">বর্তমান ফান্ড</h3>
            <p className="text-3xl font-black text-indigo-600 mt-2">৳ {balance}</p>
          </div>
        </motion.div>

        {/* Transactions List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="bg-gray-50 px-6 py-5 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800">সাম্প্রতিক হিসাব সমূহ</h2>
          </div>
          
          <ul className="divide-y divide-gray-100">
            {transactions?.length > 0 ? (
              transactions.map((tx, index) => (
                <motion.li 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  key={tx.id} 
                  className="p-6 flex justify-between items-center hover:bg-gray-50 transition duration-150"
                >
                  <div>
                    <p className="font-bold text-gray-800 text-lg">{tx.category}</p>
                    <p className="text-sm text-gray-500 mt-1">{tx.description} • {new Date(tx.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className={`font-black text-xl ${tx.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {tx.type === 'income' ? '+' : '-'} ৳{tx.amount}
                  </div>
                </motion.li>
              ))
            ) : (
              <li className="p-8 text-center text-gray-400 font-medium">এখনও কোনো হিসাব যোগ করা হয়নি।</li>
            )}
          </ul>
        </motion.div>
      </main>
    </div>
  )
                    }
