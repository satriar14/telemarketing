import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sistem Manajemen Agent & Call",
  description: "Telemarketing System built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.className} h-full antialiased selection:bg-blue-100 selection:text-blue-900`}>
      <body className="h-screen flex overflow-hidden bg-slate-50 text-slate-800 font-sans m-0">
        <AntdRegistry>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#2563eb',
                colorSuccess: '#059669',
                colorWarning: '#d97706',
                colorError: '#dc2626',
                colorBgLayout: '#f8fafc',
                fontFamily: 'Inter, sans-serif',
              },
            }}
          >
            <Sidebar />
            <main className="flex-1 flex flex-col min-w-0 bg-slate-50/50">
              <Topbar />
              <div className="flex-1 overflow-y-auto p-8">
                <Breadcrumbs />
                {children}
              </div>
            </main>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
