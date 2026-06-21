"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconHeadset,
  IconLayoutDashboard,
  IconDatabase,
  IconGitBranch,
  IconPhone,
  IconBrain,
  IconClipboardList,
  IconArchive,
  IconSettings,
} from "@tabler/icons-react";

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? "bg-blue-50 text-blue-700 font-medium border-r-4 border-blue-600" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900";
  };

  const isIconActive = (path: string) => {
    return pathname === path ? "text-blue-600" : "text-slate-400";
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 z-20 shadow-sm h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
            <IconHeadset size={20} />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 leading-tight">Agent & Call</h1>
            <p className="text-[11px] text-slate-500 font-medium tracking-wide uppercase mt-0.5">Telemarketing System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        <div>
          <h2 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Utama</h2>
          <div className="space-y-1">
            <Link href="/" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${isActive("/")}`}>
              <IconLayoutDashboard size={20} className={isIconActive("/")} /> Dashboard
            </Link>
            <Link href="/data" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${isActive("/data")}`}>
              <IconDatabase size={20} className={isIconActive("/data")} /> Data Ingestion
            </Link>
            <Link href="/distrib" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${isActive("/distrib")}`}>
              <IconGitBranch size={20} className={isIconActive("/distrib")} /> Distribusi Data
            </Link>
          </div>
        </div>

        <div>
          <h2 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Operasional</h2>
          <div className="space-y-1">
            <Link href="/call" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${isActive("/call")}`}>
              <IconPhone size={20} className={isIconActive("/call")} /> Call Center
            </Link>
            <Link href="/ai" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${isActive("/ai")}`}>
              <IconBrain size={20} className={isIconActive("/ai")} /> AI Analysis
            </Link>
            <Link href="/garbage" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${isActive("/garbage")}`}>
              <IconClipboardList size={20} className={isIconActive("/garbage")} /> Garbage Task
            </Link>
          </div>
        </div>

        <div>
          <h2 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Sistem</h2>
          <div className="space-y-1">
            <Link href="/archive" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${isActive("/archive")}`}>
              <IconArchive size={20} className={isIconActive("/archive")} /> Archiving
            </Link>
          </div>
        </div>
      </nav>
      
      {/* User Profile Mini */}
      <div className="p-4 border-t border-slate-100 flex items-center gap-3 hover:bg-slate-50 cursor-pointer transition-colors">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff" alt="Admin" className="w-9 h-9 rounded-full" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-900 truncate">System Admin</p>
          <p className="text-xs text-slate-500 truncate">admin@telemarketing.id</p>
        </div>
        <IconSettings size={20} className="text-slate-400" />
      </div>
    </aside>
  );
}
