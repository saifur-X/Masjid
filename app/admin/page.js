'use client'

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';

export default function AdminPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('entry'); // 'entry' or 'settings'
  const [message, setMessage] = useState({ type: '', text: '' });

  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Entry Form State
  const [type, setType] = useState('income');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  // Password Change State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Auto-login check (Simple Local Storage)
  useEffect(() => {
    const user = localStorage.getItem('mosjid_admin');
    if (user) {
      setIsLoggedIn(true);
      setEmail(user);
    }
  }, []);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  // Login Function
  const handleLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .single();

    if (data) {
      setIsLoggedIn(true);
      localStorage.setItem('mosjid_admin', email);
      showMessage('success', 'সফলভাবে লগইন হয়েছে!');
    } else {
      showMessage('error', 'ইমেইল বা পাসওয়ার্ড ভুল!');
    }
  };

  // Logout Function
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('mosjid_admin');
    setEmail('');
    setPassword('');
  };

  // Submit Transaction Function
  const handleEntrySubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from('transactions')
      .insert([{ type, amount: Number(amount), category, description }]);

    if (error) {
      showMessage('error', 'হিসাব যোগ করতে সমস্যা হয়েছে।');
    } else {
      showMessage('success', 'নতুন হিসাব সফলভাবে যোগ করা হয়েছে!');
      setAmount(''); setCategory(''); setDescription('');
    }
  };

  // Change Password Function
  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    // Check old password first
    const { data: checkData } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .eq('password', oldPassword)
      .single();

    if (!checkData) {
      showMessage('error', 'পুরোনো পাসওয়ার্ড ভুল হয়েছে!');
      return;
    }

    // Update new password
    const { error } = await supabase
      .from('admin_users')
      .update({ password: newPassword })
      .eq('email', email);

    if (error) {
      showMessage('error', 'পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে।');
    } else {
      showMessage('success', 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!');
      setOldPassword(''); setNewPassword('');
    }
  };

  // ---------------- LOGIN UI ----------------
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border-t-4 border-indigo-500"
        >
          <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">অ্যাডমিন লগইন</h2>
          {message.text && (
            <div className={`p-3 rounded-lg mb-4 text-center text-white ${message.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
              {message.text}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">ইমেইল</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition" 
                placeholder="admin@gmail.com" />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">পাসওয়ার্ড</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition" 
                placeholder="********" />
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3 rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition duration-300">
              লগইন করুন
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // ---------------- ADMIN DASHBOARD UI ----------------
  return (
    <div className="min-h-screen pb-10">
      <header className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-6 shadow-lg flex justify-between items-center rounded-b-[2rem]">
        <h1 className="text-2xl font-bold">অ্যাডমিন প্যানেল</h1>
        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-medium transition shadow-md">লগআউট</button>
      </header>

      <main className="max-w-3xl mx-auto p-4 mt-6">
        {message.text && (
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            className={`p-4 rounded-xl mb-6 text-center text-white font-medium shadow-md ${message.type === 'error' ? 'bg-rose-500' : 'bg-emerald-500'}`}>
            {message.text}
          </motion.div>
        )}

        {/* Tab Buttons */}
        <div className="flex space-x-2 mb-6 bg-white p-2 rounded-2xl shadow-sm">
          <button onClick={() => setActiveTab('entry')} className={`flex-1 py-3 font-bold rounded-xl transition ${activeTab === 'entry' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-50'}`}>নতুন হিসাব এন্ট্রি</button>
          <button onClick={() => setActiveTab('settings')} className={`flex-1 py-3 font-bold rounded-xl transition ${activeTab === 'settings' ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:bg-gray-50'}`}>পাসওয়ার্ড পরিবর্তন</button>
        </div>

        {/* Entry Form Tab */}
        {activeTab === 'entry' && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white p-6 rounded-3xl shadow-xl border-t-4 border-emerald-500">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">নতুন আয়/ব্যয় যুক্ত করুন</h2>
            <form onSubmit={handleEntrySubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div onClick={() => setType('income')} className={`cursor-pointer p-4 rounded-2xl text-center border-2 font-bold transition ${type === 'income' ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-gray-200 text-gray-400'}`}>
                  (+) জমা / আয়
                </div>
                <div onClick={() => setType('expense')} className={`cursor-pointer p-4 rounded-2xl text-center border-2 font-bold transition ${type === 'expense' ? 'border-rose-500 bg-rose-50 text-rose-600' : 'border-gray-200 text-gray-400'}`}>
                  (-) খরচ / ব্যয়
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-1">পরিমাণ (টাকা)</label>
                <input type="number" required value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full p-4 border border-gray-200 rounded-2xl text-xl font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition" placeholder="5000" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">খাত (Category)</label>
                <input type="text" required value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition" placeholder="যেমন: জুম্মার চাঁদা / বিদ্যুৎ বিল" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">বিস্তারিত (ঐচ্ছিক)</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition" placeholder="অতিরিক্ত কোনো তথ্য থাকলে লিখুন..." rows="2"></textarea>
              </div>
              
              <button type="submit" className={`w-full text-white font-bold py-4 rounded-2xl shadow-lg transform hover:-translate-y-1 transition duration-300 ${type === 'income' ? 'bg-gradient-to-r from-emerald-400 to-teal-500' : 'bg-gradient-to-r from-rose-400 to-red-500'}`}>
                হিসাব সংরক্ষণ করুন
              </button>
            </form>
          </motion.div>
        )}

        {/* Password Settings Tab */}
        {activeTab === 'settings' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white p-6 rounded-3xl shadow-xl border-t-4 border-purple-500">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">পাসওয়ার্ড পরিবর্তন করুন</h2>
            <form onSubmit={handleChangePassword} className="space-y-5">
              <div>
                <label className="block text-gray-700 font-medium mb-1">পুরোনো পাসওয়ার্ড</label>
                <input type="password" required value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none transition" placeholder="আপনার বর্তমান পাসওয়ার্ড" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">নতুন পাসওয়ার্ড</label>
                <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none transition" placeholder="নতুন পাসওয়ার্ড দিন" />
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg transform hover:-translate-y-1 transition duration-300">
                পাসওয়ার্ড আপডেট করুন
              </button>
            </form>
          </motion.div>
        )}
      </main>
    </div>
  );
                  }
