"use client";

import { useState } from "react";
import { Card, Steps, Progress, Button, Tag, Tooltip, Row, Col } from "antd";
import {
  IconDatabase,
  IconPhoneCalling,
  IconChartArrows,
  IconTrash,
  IconArrowUpRight,
  IconCheck,
  IconPhone,
  IconHeadset,
  IconBrain,
  IconArchive,
  IconChartBar,
  IconActivity,
  IconServer,
  IconHistory,
  IconCircleCheck,
  IconTrendingUp
} from "@tabler/icons-react";
import Link from "next/link";
import { dashboardMetrics, activeAgentsList, tlPerformanceList } from "@/data/mockData";

export default function Dashboard() {
  const [hoveredDataPoint, setHoveredDataPoint] = useState<number | null>(null);

  // Hourly Call Data for SVG Line Chart
  const hourlyData = [
    { hour: "08:00", count: 180, rate: "12%" },
    { hour: "10:00", count: 480, rate: "16%" },
    { hour: "12:00", count: 320, rate: "15%" },
    { hour: "14:00", count: 650, rate: "19%" },
    { hour: "16:00", count: 590, rate: "18%" },
    { hour: "18:00", count: 210, rate: "14%" },
  ];

  // SVG Chart Dimensions
  const chartHeight = 120;
  const chartWidth = 500;
  const padding = 20;

  // Map data to SVG coordinates
  const maxCount = Math.max(...hourlyData.map(d => d.count));
  const points = hourlyData.map((d, index) => {
    const x = padding + (index * (chartWidth - padding * 2)) / (hourlyData.length - 1);
    const y = chartHeight - padding - (d.count * (chartHeight - padding * 2)) / maxCount;
    return { x, y, ...d, index };
  });

  // Create path string for SVG line
  const linePath = points.map((p, index) => `${index === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  // Create path string for the gradient area under the line
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z`;

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card className="shadow-sm hover:shadow-md transition-shadow border-slate-200" styles={{ body: { padding: '20px' } }}>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-slate-500">Total Data Pool</h3>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><IconDatabase size={20} /></div>
          </div>
          <div className="text-3xl font-bold text-slate-800 mb-1">{dashboardMetrics.totalDataPool.value}</div>
          <div className="flex items-center text-xs text-slate-500">
            <span className="flex items-center text-emerald-600 font-medium mr-2">
              <IconArrowUpRight size={14} className="mr-1" /> {dashboardMetrics.totalDataPool.change}
            </span>
            <span>{dashboardMetrics.totalDataPool.subtext}</span>
          </div>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow border-slate-200" styles={{ body: { padding: '20px' } }}>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-slate-500">Panggilan Hari Ini</h3>
            <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><IconPhoneCalling size={20} /></div>
          </div>
          <div className="text-3xl font-bold text-slate-800 mb-1">{dashboardMetrics.callsToday.value}</div>
          <div className="flex items-center text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
            <span>{dashboardMetrics.callsToday.subtext}</span>
          </div>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow border-slate-200" styles={{ body: { padding: '20px' } }}>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-slate-500">Tingkat Konversi</h3>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><IconChartArrows size={20} /></div>
          </div>
          <div className="text-3xl font-bold text-slate-800 mb-1">{dashboardMetrics.conversionRate.value}</div>
          <div className="flex items-center text-xs text-slate-500">
            <span className="flex items-center text-emerald-600 font-medium mr-2">
              <IconArrowUpRight size={14} className="mr-1" /> {dashboardMetrics.conversionRate.change}
            </span>
            <span>{dashboardMetrics.conversionRate.subtext}</span>
          </div>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow border-slate-200" styles={{ body: { padding: '20px' } }}>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-slate-500">Garbage Task</h3>
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600"><IconTrash size={20} /></div>
          </div>
          <div className="text-3xl font-bold text-slate-800 mb-1">{dashboardMetrics.garbageTask.value}</div>
          <div className="flex items-center text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
            <span>{dashboardMetrics.garbageTask.subtext}</span>
          </div>
        </Card>
      </div>



      {/* Row 3: Call Trend Chart & Gateway Health */}
      <Row gutter={[24, 24]}>
        {/* Call Volume Trend Line Chart */}
        <Col xs={24} lg={16}>
          <Card
            className="shadow-sm border-slate-200 h-full"
            title={
              <div className="flex items-center justify-between py-0.5">
                <span className="flex items-center gap-2">
                  <IconActivity size={18} className="text-blue-600" />
                  Tren Volume Panggilan Hari Ini
                </span>
                <span className="text-xs font-semibold text-slate-400 font-sans">
                  Total Hari Ini: 3,741
                </span>
              </div>
            }
          >
            <div className="flex flex-col justify-between h-full min-h-[180px]">
              {/* Premium SVG Curve Chart */}
              <div className="relative w-full">
                <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Grid Lines */}
                  {[0, 25, 50, 75, 100].map((pct) => {
                    const y = padding + (pct * (chartHeight - padding * 2)) / 100;
                    return (
                      <line
                        key={pct}
                        x1={padding}
                        y1={y}
                        x2={chartWidth - padding}
                        y2={y}
                        stroke="#f1f5f9"
                        strokeWidth="1"
                      />
                    );
                  })}

                  {/* Gradient Area */}
                  <path d={areaPath} fill="url(#chartGradient)" />

                  {/* Curved Main Line */}
                  <path
                    d={linePath}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />

                  {/* Data Points */}
                  {points.map((p) => (
                    <g key={p.index} className="cursor-pointer">
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={hoveredDataPoint === p.index ? "5" : "3.5"}
                        fill="#ffffff"
                        stroke="#3b82f6"
                        strokeWidth="2"
                        onMouseEnter={() => setHoveredDataPoint(p.index)}
                        onMouseLeave={() => setHoveredDataPoint(null)}
                      />
                      {/* Active tooltip text showing call count */}
                      {hoveredDataPoint === p.index && (
                        <g>
                          <rect
                            x={p.x - 35}
                            y={p.y - 30}
                            width="70"
                            height="20"
                            rx="4"
                            fill="#1e293b"
                          />
                          <text
                            x={p.x}
                            y={p.y - 17}
                            fill="#ffffff"
                            fontSize="9"
                            fontWeight="bold"
                            textAnchor="middle"
                          >
                            {p.count} Panggilan
                          </text>
                        </g>
                      )}
                    </g>
                  ))}
                </svg>
              </div>

              {/* X-Axis labels */}
              <div className="flex justify-between items-center px-4 mt-2 border-t border-slate-100 pt-3 text-[11px] text-slate-400 font-semibold font-mono">
                {hourlyData.map((d, idx) => (
                  <span key={idx}>{d.hour}</span>
                ))}
              </div>
            </div>
          </Card>
        </Col>

        {/* System Health / Connectivity Gateway Panel */}
        <Col xs={24} lg={8}>
          <Card
            className="shadow-sm border-slate-200 h-full"
            title={
              <span className="flex items-center gap-2">
                <IconServer size={18} className="text-emerald-600" />
                Status Konektivitas Gateway
              </span>
            }
          >
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <span className="font-semibold text-slate-700 text-xs block leading-tight">API Ingestion Gateway</span>
                  <span className="text-[10px] text-slate-400">Endpoint file sync</span>
                </div>
                <Tag color="success" className="rounded font-bold border-0 text-[9px] py-0.5 px-2">CONNECTED (8ms)</Tag>
              </div>

              <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <span className="font-semibold text-slate-700 text-xs block leading-tight">SIP VoIP / Call Router</span>
                  <span className="text-[10px] text-slate-400">Dialer telemarketing</span>
                </div>
                <Tag color="success" className="rounded font-bold border-0 text-[9px] py-0.5 px-2">ACTIVE (14ms)</Tag>
              </div>

              <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <span className="font-semibold text-slate-700 text-xs block leading-tight">AI Transcription Engine</span>
                  <span className="text-[10px] text-slate-400">Ekstraksi NLP</span>
                </div>
                <Tag color="processing" className="rounded font-bold border-0 text-[9px] py-0.5 px-2">PROCESSING</Tag>
              </div>

              <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <span className="font-semibold text-slate-700 text-xs block leading-tight">WhatsApp Blast Gateway</span>
                  <span className="text-[10px] text-slate-400">Sistem recovery</span>
                </div>
                <Tag color="success" className="rounded font-bold border-0 text-[9px] py-0.5 px-2">READY</Tag>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Row 4: 3-column Layout for Agent Monitor, TL Performance, & Audit Log */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Agent Aktif Monitor */}
        <Card className="shadow-sm border-slate-200 flex flex-col h-full" styles={{ body: { padding: 0, flex: 1, display: 'flex', flexDirection: 'column' } }}>
          <div className="p-5 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-base font-semibold text-slate-800 m-0">Monitoring Agent Aktif</h3>
            <Link href="/call" className="text-xs font-semibold text-blue-600 hover:text-blue-700">Lihat Semua &rarr;</Link>
          </div>
          <div className="p-2.5 flex-1">
            {activeAgentsList.map((agent, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 hover:bg-slate-50 rounded-xl transition-colors">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${agent.bg}`}>{agent.init}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate m-0 leading-tight">{agent.name}</p>
                  <p className="text-[11px] text-slate-500 flex items-center mt-1 m-0 leading-none">
                    <span className={`w-1.5 h-1.5 rounded-full mr-1 ${agent.statusColor} animate-pulse`}></span>
                    {agent.status}
                  </p>
                </div>
                <div className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded shrink-0 ${agent.timeStyle}`}>{agent.time}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Performa TL */}
        <Card className="shadow-sm border-slate-200 flex flex-col h-full" styles={{ body: { padding: 0, flex: 1, display: 'flex', flexDirection: 'column' } }}>
          <div className="p-5 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-base font-semibold text-slate-800 m-0">Distribusi per Team Leader</h3>
            <IconChartBar size={20} className="text-slate-400" />
          </div>
          <div className="p-5 flex-1 flex flex-col justify-center space-y-4">
            {tlPerformanceList.map((tl, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-16 text-xs font-semibold text-slate-600 truncate">{tl.name}</div>
                <div className="flex-grow">
                  <Progress percent={tl.pct} strokeColor={tl.color} showInfo={false} size="small" className="m-0" />
                </div>
                <div className="w-8 text-right text-xs font-bold text-slate-700 shrink-0">{tl.pct}%</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Live Activity Feed / System Audit Log */}
        <Card className="shadow-sm border-slate-200 flex flex-col h-full" styles={{ body: { padding: 0, flex: 1, display: 'flex', flexDirection: 'column' } }}>
          <div className="p-5 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-base font-semibold text-slate-800 m-0">Log Aktivitas Terbaru</h3>
            <IconHistory size={20} className="text-slate-400" />
          </div>
          <div className="p-5 flex-1">
            <div className="relative border-l border-slate-100 pl-4 space-y-4">
              <div className="relative">
                <div className="absolute -left-[21px] top-1 bg-blue-50 text-blue-600 rounded-full p-0.5 border border-white">
                  <IconCircleCheck size={10} />
                </div>
                <span className="text-[10px] font-bold text-slate-400 block font-mono">1 MENIT YANG LALU</span>
                <span className="text-xs text-slate-700 font-medium">TL Fajar mendistribusikan 250 data prospek baru ke tim.</span>
              </div>

              <div className="relative">
                <div className="absolute -left-[21px] top-1 bg-emerald-50 text-emerald-600 rounded-full p-0.5 border border-white">
                  <IconCircleCheck size={10} />
                </div>
                <span className="text-[10px] font-bold text-slate-400 block font-mono">12 MENIT YANG LALU</span>
                <span className="text-xs text-slate-700 font-medium">Prospek Denny Cagur berhasil dianalisis AI dengan sentimen POSITIF.</span>
              </div>

              <div className="relative">
                <div className="absolute -left-[21px] top-1 bg-amber-50 text-amber-600 rounded-full p-0.5 border border-white">
                  <IconCircleCheck size={10} />
                </div>
                <span className="text-[10px] font-bold text-slate-400 block font-mono">30 MENIT YANG LALU</span>
                <span className="text-xs text-slate-700 font-medium">1 lead gagal dipindahkan ke antrean Garbage Task pemulihan WA.</span>
              </div>

              <div className="relative">
                <div className="absolute -left-[21px] top-1 bg-slate-50 text-slate-500 rounded-full p-0.5 border border-white">
                  <IconCircleCheck size={10} />
                </div>
                <span className="text-[10px] font-bold text-slate-400 block font-mono">04:00 AM</span>
                <span className="text-xs text-slate-700 font-medium">Backup harian sukses disinkronkan ke AWS S3 Storage.</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
