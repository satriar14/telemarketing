"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  IconArrowsExchange,
  IconUserCircle,
  IconShield,
  IconUsers,
  IconChevronDown,
  IconCheck
} from "@tabler/icons-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<"Supervisor" | "Team Leader" | "Agent">("Supervisor");
  const [mounted, setMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedRole = localStorage.getItem("user_role");
    if (savedRole === "Agent" || savedRole === "Supervisor" || savedRole === "Team Leader") {
      setRole(savedRole as "Supervisor" | "Team Leader" | "Agent");
    }
  }, []);

  const handleRoleChange = (newRole: "Supervisor" | "Team Leader" | "Agent") => {
    localStorage.setItem("user_role", newRole);
    setRole(newRole);
    if (newRole === "Agent" && pathname !== "/agent") {
      router.push("/agent");
    } else if ((newRole === "Supervisor" || newRole === "Team Leader") && pathname === "/agent") {
      router.push("/");
    }
  };

  const isActive = (path: string) => {
    return pathname === path ? "bg-blue-50 text-blue-700 font-medium border-r-4 border-blue-600" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900";
  };

  const isIconActive = (path: string) => {
    return pathname === path ? "text-blue-600" : "text-slate-400";
  };

  if (!mounted) {
    return (
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 z-20 shadow-sm h-full animate-pulse">
        <div className="px-6 py-5 border-b border-slate-100 h-16"></div>
        <div className="flex-1"></div>
      </aside>
    );
  }

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
        {role === "Supervisor" ? (
          <>
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
          </>
        ) : role === "Team Leader" ? (
          <>
            <div>
              <h2 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Utama</h2>
              <div className="space-y-1">
                <Link href="/" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${isActive("/")}`}>
                  <IconLayoutDashboard size={20} className={isIconActive("/")} /> Dashboard
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
              </div>
            </div>
          </>
        ) : (
          <div>
            <h2 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Workspace Agen</h2>
            <div className="space-y-1">
              <Link href="/agent" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${isActive("/agent")}`}>
                <IconPhone size={20} className={isIconActive("/agent")} /> Dialer Workspace
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Role Switcher */}
      <div className="px-3 mb-2 relative">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider px-1 block mb-1">Pilih Akses Role</span>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 transition-all text-xs font-semibold shadow-sm"
        >
          <div className="flex items-center gap-2">
            {role === "Supervisor" ? (
              <span className="p-1 rounded-md bg-blue-50 text-blue-600"><IconShield size={16} /></span>
            ) : role === "Team Leader" ? (
              <span className="p-1 rounded-md bg-amber-50 text-amber-600"><IconUsers size={16} /></span>
            ) : (
              <span className="p-1 rounded-md bg-emerald-50 text-emerald-600"><IconUserCircle size={16} /></span>
            )}
            <span className="text-slate-800">{role}</span>
          </div>
          <IconChevronDown size={14} className={`text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {isDropdownOpen && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setIsDropdownOpen(false)} />
            <div className="absolute left-3 right-3 bottom-full mb-2 bg-white border border-slate-200 rounded-xl shadow-lg z-40 p-1.5 space-y-0.5">
              <button
                onClick={() => {
                  handleRoleChange("Supervisor");
                  setIsDropdownOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors ${role === "Supervisor" ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
              >
                <div className="flex items-center gap-2">
                  <IconShield size={15} className={role === "Supervisor" ? "text-blue-600" : "text-slate-400"} />
                  <span>Supervisor</span>
                </div>
                {role === "Supervisor" && <IconCheck size={14} className="text-blue-600" />}
              </button>
              
              <button
                onClick={() => {
                  handleRoleChange("Team Leader");
                  setIsDropdownOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors ${role === "Team Leader" ? "bg-amber-50 text-amber-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
              >
                <div className="flex items-center gap-2">
                  <IconUsers size={15} className={role === "Team Leader" ? "text-amber-600" : "text-slate-400"} />
                  <span>Team Leader</span>
                </div>
                {role === "Team Leader" && <IconCheck size={14} className="text-amber-600" />}
              </button>
              
              <button
                onClick={() => {
                  handleRoleChange("Agent");
                  setIsDropdownOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors ${role === "Agent" ? "bg-emerald-50 text-emerald-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
              >
                <div className="flex items-center gap-2">
                  <IconUserCircle size={15} className={role === "Agent" ? "text-emerald-600" : "text-slate-400"} />
                  <span>Agent</span>
                </div>
                {role === "Agent" && <IconCheck size={14} className="text-emerald-600" />}
              </button>
            </div>
          </>
        )}
      </div>

      <div className="p-4 border-t border-slate-100 flex items-center gap-3 hover:bg-slate-50 cursor-pointer transition-colors">
        <img 
          src={role === "Supervisor" 
            ? "https://ui-avatars.com/api/?name=Admin+Supervisor&background=2563EB&color=fff"
            : role === "Team Leader"
              ? "https://ui-avatars.com/api/?name=Budi+Leader&background=F59E0B&color=fff"
              : "https://ui-avatars.com/api/?name=Adi+Agent&background=10B981&color=fff"
          } 
          alt="Avatar" 
          className="w-9 h-9 rounded-full" 
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-900 truncate">
            {role === "Supervisor" ? "System Supervisor" : role === "Team Leader" ? "Budi Santoso" : "Adi Rachmat"}
          </p>
          <p className="text-xs text-slate-500 truncate">
            {role === "Supervisor" ? "supervisor@telemarketing.id" : role === "Team Leader" ? "teamleader@telemarketing.id" : "adi.rachmat@telemarketing.id"}
          </p>
        </div>
        <IconSettings size={20} className="text-slate-400" />
      </div>
    </aside>
  );
}
