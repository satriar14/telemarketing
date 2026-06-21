"use client";

import { usePathname } from "next/navigation";
import { IconBell } from "@tabler/icons-react";

export default function Topbar() {
  const pathname = usePathname();

  const getPageTitle = () => {
    switch (pathname) {
      case "/":
        return "Dashboard Utama";
      case "/data":
        return "Data Ingestion & Cleansing";
      case "/distrib":
        return "Distribusi & Alokasi Data";
      case "/call":
        return "Live Call Center";
      case "/ai":
        return "Analisis AI & NLP";
      case "/garbage":
        return "Recovery & Garbage Task";
      case "/archive":
        return "Pengarsipan Sistem";
      default:
        return "Dashboard";
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 h-16 px-8 flex items-center justify-between shrink-0 sticky top-0 z-10 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-800" id="page-title">{getPageTitle()}</h2>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-medium">Sistem Aktif</span>
        </div>
        <div className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-200 shadow-sm">
          10 TL · 97 Agent
        </div>
        <div className="h-6 w-px bg-slate-200 mx-2"></div>
        <button className="relative p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
          <IconBell size={24} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </div>
    </header>
  );
}
