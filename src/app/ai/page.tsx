"use client";

import { useState } from "react";
import { Card, Row, Col, Progress, Tag, Switch, Button, Input, message, Spin, Empty } from "antd";
import { 
  IconBrain, 
  IconMessage2, 
  IconSearch, 
  IconPlayerPlay, 
  IconAlertTriangle, 
  IconChecks, 
  IconCalendar,
  IconSparkles,
  IconDownload
} from "@tabler/icons-react";
import { analyzedCalls, concernCloud } from "@/data/mockData";

export default function AIAnalysis() {
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedCallId, setSelectedCallId] = useState("ai-1");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchText, setSearchText] = useState("");

  // Toggle Highlight Categories
  const [highlightObjection, setHighlightObjection] = useState(true);
  const [highlightPricing, setHighlightPricing] = useState(true);
  const [highlightCompetitor, setHighlightCompetitor] = useState(true);
  const [highlightCompliance, setHighlightCompliance] = useState(true);

  // Active Selected Call Data
  const currentCall = analyzedCalls.find(c => c.id === selectedCallId) || analyzedCalls[0];

  // Simulated Batch Run
  const handleBatchAnalysis = () => {
    setIsAnalyzing(true);
    messageApi.open({
      type: "loading",
      content: "Menghubungkan ke Mesin NLP & Melakukan Analisis Batch Suara...",
      duration: 1.5
    });

    setTimeout(() => {
      setIsAnalyzing(false);
      messageApi.success("Analisis Batch AI NLP Selesai! 12 File baru terproses.");
    }, 1500);
  };

  const handleDownloadReport = () => {
    messageApi.success("Laporan Analisis NLP berhasil diekspor ke CSV.");
  };

  // Function to determine text highlighting
  const renderHighlightedText = (text: string, type?: string) => {
    if (!type) return text;
    
    let isHighlighted = false;
    let colorClass = "";

    if (type === "objection" && highlightObjection) {
      isHighlighted = true;
      colorClass = "bg-amber-100 border-b-2 border-amber-400 text-slate-800 font-medium px-1 rounded";
    } else if (type === "pricing" && highlightPricing) {
      isHighlighted = true;
      colorClass = "bg-blue-100 border-b-2 border-blue-400 text-slate-800 font-medium px-1 rounded";
    } else if (type === "competitor" && highlightCompetitor) {
      isHighlighted = true;
      colorClass = "bg-purple-100 border-b-2 border-purple-400 text-slate-800 font-medium px-1 rounded";
    } else if (type === "compliance" && highlightCompliance) {
      isHighlighted = true;
      colorClass = "bg-emerald-100 border-b-2 border-emerald-400 text-slate-800 font-medium px-1 rounded";
    }

    if (isHighlighted) {
      return <span className={colorClass}>{text}</span>;
    }
    
    return text;
  };

  // Filtered List based on Search
  const filteredCalls = analyzedCalls.filter(call => 
    call.customer.toLowerCase().includes(searchText.toLowerCase()) ||
    call.agent.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      {contextHolder}

      {/* Header Halaman */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 m-0">
            <IconBrain className="text-purple-600 animate-pulse" size={24} />
            AI Natural Language & NLP Analysis
          </h2>
          <p className="text-slate-500 text-xs mt-1 m-0">
            Hasil ekstraksi suara, sentimen prospek, kepatuhan kalimat pembuka/penutup agen, serta kecenderungan penolakan.
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            icon={<IconSparkles size={16} />} 
            type="primary" 
            onClick={handleBatchAnalysis}
            loading={isAnalyzing}
            className="bg-purple-600 hover:bg-purple-500 border-0 flex items-center gap-1.5"
          >
            Jalankan NLP Batch
          </Button>
          <Button 
            icon={<IconDownload size={16} />}
            onClick={handleDownloadReport}
            className="flex items-center gap-1.5 border-slate-200 text-slate-600 hover:text-slate-800"
          >
            Ekspor Laporan
          </Button>
        </div>
      </div>

      {/* Grid Metrik Overview */}
      <Row gutter={[20, 20]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm border-slate-200" styles={{ body: { padding: '16px 20px' } }}>
            <div className="flex justify-between items-start mb-2">
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Panggilan Diproses</span>
              <Tag color="purple" className="m-0 border-0 rounded font-bold text-[10px]">NLP ENGINE</Tag>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 m-0">432 Panggilan</h3>
            <span className="text-[11px] text-slate-400 block mt-1">Akurasi Audio ke Teks: 94.2%</span>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm border-slate-200" styles={{ body: { padding: '16px 20px' } }}>
            <div className="flex justify-between items-start mb-2">
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Sentimen Positif</span>
              <IconSparkles size={16} className="text-emerald-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 m-0">68.4%</h3>
            <div className="mt-2">
              <Progress percent={68.4} size="small" strokeColor="#10b981" showInfo={false} />
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm border-slate-200" styles={{ body: { padding: '16px 20px' } }}>
            <div className="flex justify-between items-start mb-2">
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Agen Compliance SOP</span>
              <IconChecks size={16} className="text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 m-0">87.5%</h3>
            <div className="mt-2">
              <Progress percent={87.5} size="small" strokeColor="#3b82f6" showInfo={false} />
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm border-slate-200" styles={{ body: { padding: '16px 20px' } }}>
            <div className="flex justify-between items-start mb-2">
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Keberatan Teratas</span>
              <IconAlertTriangle size={16} className="text-amber-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 m-0">Harga & Biaya</h3>
            <span className="text-[11px] text-amber-500 font-semibold block mt-1">Terjadi di 42% Panggilan</span>
          </Card>
        </Col>
      </Row>

      {/* Main Split Layout */}
      <Row gutter={[24, 24]}>
        {/* Panel Kiri: List Rekaman Teranalisis */}
        <Col xs={24} lg={8}>
          <Card 
            className="shadow-sm border-slate-200 h-full" 
            title="Panggilan Teranalisis"
            extra={
              <Input
                placeholder="Cari prospek/agen..."
                prefix={<IconSearch size={14} className="text-slate-400" />}
                className="w-44 rounded-lg text-xs"
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                allowClear
              />
            }
          >
            <div className="flex flex-col gap-3 overflow-y-auto max-h-[500px]">
              {filteredCalls.length === 0 ? (
                <Empty description="Tidak ada rekaman ditemukan" className="my-8" />
              ) : (
                filteredCalls.map((call) => (
                  <div
                    key={call.id}
                    onClick={() => setSelectedCallId(call.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      selectedCallId === call.id
                        ? "bg-purple-50 border-purple-200 shadow-sm"
                        : "bg-white border-slate-200/60 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-bold text-slate-800 text-sm block leading-tight">{call.customer}</span>
                        <span className="text-[11px] text-slate-400 mt-1 block">Agen: {call.agent}</span>
                      </div>
                      <Tag 
                        color={call.sentiment === "positive" ? "success" : "error"} 
                        className="rounded font-bold border-0 text-[9px] m-0 py-0 px-1.5"
                      >
                        {call.sentiment.toUpperCase()}
                      </Tag>
                    </div>

                    <div className="flex justify-between items-center text-xs mt-3 bg-slate-50 p-2 rounded-lg">
                      <span className="text-slate-400 flex items-center gap-1">
                        <IconCalendar size={11} /> {call.time}
                      </span>
                      <span className="font-semibold text-slate-700">
                        Skor: <span className={call.score >= 80 ? "text-emerald-600" : "text-amber-500"}>{call.score}</span>
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </Col>

        {/* Panel Kanan: Transkrip Detail & Visualisasi Highlights */}
        <Col xs={24} lg={16}>
          <div className="flex flex-col gap-6">
            <Card 
              className="shadow-sm border-slate-200" 
              title="Transkrip Percakapan & Sorotan NLP"
            >
              <div className="flex flex-col gap-4">
                {/* Switch Toggles Penyorot */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                  <span className="font-bold text-slate-500 uppercase tracking-wider block">Sorotan Kategori:</span>
                  <div className="flex items-center gap-1.5">
                    <Switch size="small" checked={highlightObjection} onChange={setHighlightObjection} />
                    <span className="text-slate-600 flex items-center gap-1 font-medium">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span> Keberatan Prospek
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Switch size="small" checked={highlightPricing} onChange={setHighlightPricing} />
                    <span className="text-slate-600 flex items-center gap-1 font-medium">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-400 inline-block"></span> Harga/Premi
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Switch size="small" checked={highlightCompetitor} onChange={setHighlightCompetitor} />
                    <span className="text-slate-600 flex items-center gap-1 font-medium">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-400 inline-block"></span> Pesaing/Bank
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Switch size="small" checked={highlightCompliance} onChange={setHighlightCompliance} />
                    <span className="text-slate-600 flex items-center gap-1 font-medium">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"></span> Kepatuhan Agen
                    </span>
                  </div>
                </div>

                {/* Percakapan Bubble Chat */}
                <div className="border border-slate-200/60 rounded-xl p-4 min-h-[300px] max-h-[360px] overflow-y-auto flex flex-col gap-3.5 bg-slate-50/50">
                  {currentCall.transcript.map((line, idx) => {
                    const isAgent = line.speaker === "agent";
                    return (
                      <div 
                        key={idx} 
                        className={`flex flex-col max-w-[75%] ${isAgent ? "self-start" : "self-end items-end"}`}
                      >
                        <span className="text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-wider">
                          {isAgent ? `Agen: ${currentCall.agent}` : `Prospek: ${currentCall.customer}`}
                        </span>
                        <div 
                          className={`p-3 rounded-2xl text-xs leading-relaxed ${
                            isAgent 
                              ? "bg-white text-slate-700 rounded-tl-none border border-slate-100 shadow-sm"
                              : "bg-slate-800 text-white rounded-tr-none shadow-sm"
                          }`}
                        >
                          {renderHighlightedText(line.text, line.type)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>

            {/* Bagian Bawah: Deteksi Intent & Word Cloud */}
            <Row gutter={[20, 20]}>
              <Col xs={24} md={12}>
                <Card className="shadow-sm border-slate-200 h-full" title="Deteksi Intent Prospek">
                  <div className="flex flex-col gap-4">
                    {currentCall.intents.map((intent, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between items-center text-xs mb-1.5">
                          <span className="font-semibold text-slate-600">{intent.name}</span>
                          <span className="font-bold text-slate-700">{intent.value}%</span>
                        </div>
                        <Progress 
                          percent={intent.value} 
                          showInfo={false} 
                          strokeColor={idx === 0 ? "#8b5cf6" : idx === 1 ? "#3b82f6" : "#cbd5e1"} 
                          className="m-0"
                        />
                      </div>
                    ))}
                  </div>
                </Card>
              </Col>

              <Col xs={24} md={12}>
                <Card className="shadow-sm border-slate-200 h-full" title="Top Customer Concerns Cloud">
                  <div className="flex flex-wrap gap-2.5 justify-center py-2.5">
                    {concernCloud.map((tag, idx) => {
                      let color = "default";
                      if (tag.category === "objection") color = "warning";
                      if (tag.category === "competitor") color = "purple";
                      if (tag.category === "pricing") color = "processing";
                      if (tag.category === "compliance") color = "success";

                      return (
                        <Tag 
                          key={idx} 
                          color={color} 
                          className="rounded-lg cursor-pointer hover:opacity-85 font-medium px-2.5 py-1 m-0 text-xs flex items-center gap-1.5"
                          onClick={() => {
                            setSearchText(tag.text);
                            messageApi.info(`Memfilter data berdasarkan kata kunci: "${tag.text}"`);
                          }}
                        >
                          {tag.text}
                          <span className="bg-white/50 text-[10px] px-1 rounded-full">{tag.count}</span>
                        </Tag>
                      );
                    })}
                  </div>
                  <div className="text-center mt-4">
                    <span className="text-[10px] text-slate-400 block font-medium">Klik pada kata kunci di atas untuk memfilter transkrip percakapan.</span>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  );
}
