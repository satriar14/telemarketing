"use client";

import { Breadcrumb } from "antd";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { IconHome } from "@tabler/icons-react";

export default function Breadcrumbs() {
  const pathname = usePathname();

  const getBreadcrumbItems = () => {
    const baseItems = [
      {
        title: (
          <Link href="/" className="hover:text-blue-600 transition-colors" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <IconHome size={14} className="text-slate-400" style={{ display: 'inline-block', verticalAlign: 'middle' }} />
            <span>Home</span>
          </Link>
        ),
      },
    ];

    switch (pathname) {
      case "/":
        return [
          ...baseItems,
          {
            title: <span className="text-slate-400 font-normal">Utama</span>,
          },
          {
            title: <span className="text-slate-800 font-semibold">Dashboard</span>,
          },
        ];
      case "/data":
        return [
          ...baseItems,
          {
            title: <span className="text-slate-400 font-normal">Utama</span>,
          },
          {
            title: <span className="text-slate-800 font-semibold">Data Ingestion</span>,
          },
        ];
      case "/distrib":
        return [
          ...baseItems,
          {
            title: <span className="text-slate-400 font-normal">Utama</span>,
          },
          {
            title: <span className="text-slate-800 font-semibold">Distribusi Data</span>,
          },
        ];
      case "/call":
        return [
          ...baseItems,
          {
            title: <span className="text-slate-400 font-normal">Operasional</span>,
          },
          {
            title: <span className="text-slate-800 font-semibold">Call Center</span>,
          },
        ];
      case "/ai":
        return [
          ...baseItems,
          {
            title: <span className="text-slate-400 font-normal">Operasional</span>,
          },
          {
            title: <span className="text-slate-800 font-semibold">AI Analysis</span>,
          },
        ];
      case "/garbage":
        return [
          ...baseItems,
          {
            title: <span className="text-slate-400 font-normal">Operasional</span>,
          },
          {
            title: <span className="text-slate-800 font-semibold">Garbage Task</span>,
          },
        ];
      case "/archive":
        return [
          ...baseItems,
          {
            title: <span className="text-slate-400 font-normal">Sistem</span>,
          },
          {
            title: <span className="text-slate-800 font-semibold">Archiving</span>,
          },
        ];
      default:
        return baseItems;
    }
  };

  return (
    <Breadcrumb 
      items={getBreadcrumbItems()} 
      className="text-xs select-none mb-4"
    />
  );
}
