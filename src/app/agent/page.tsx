"use client";

import { useState, useEffect } from "react";
import { Card, Row, Col, Progress, Tag, Button, Input, Select, message, Tabs, Space, Form } from "antd";
import { 
  IconPhone, 
  IconPhoneOff, 
  IconVolume, 
  IconVolumeOff, 
  IconPlayerPause, 
  IconPlayerPlay,
  IconUser, 
  IconNotes,
  IconCheck,
  IconX,
  IconTrendingUp,
  IconClock,
  IconEar,
  IconAlertCircle,
  IconCoffee
} from "@tabler/icons-react";

const { TextArea } = Input;
const { Option } = Select;

// Sample queue of leads allocated to this agent
const initialAgentQueue = [
  { key: "1", name: "Ronal Surapradja", phone: "0812-xxxx-8888", address: "Jakarta Selatan", product: "Proteksi Kesehatan Prima" },
  { key: "2", name: "Mieke Amalia", phone: "0857-xxxx-1122", address: "Bandung Kota", product: "Asuransi Penyakit Kritis" },
  { key: "3", name: "Soleh Solihun", phone: "0819-xxxx-3344", address: "Depok City", product: "Garda Pension Plan" },
  { key: "4", name: "Tora Sudiro", phone: "0822-xxxx-5566", address: "Tangerang", product: "Proteksi Kesehatan Prima" }
];

// Simulated dialogue matching the active customer
const agentDialogSimulation = [
  { speaker: "agent", text: "Selamat pagi Bapak Ronal, saya Adi dari Asuransi Prima. Apa kabar hari ini?" },
  { speaker: "customer", text: "Pagi, baik mas. Ada apa ya?" },
  { speaker: "agent", text: "Kami memiliki program Proteksi Kesehatan Prima dengan premi hemat 100 ribu per bulan Bapak." },
  { speaker: "customer", text: "Wah murah ya, tapi apa sudah bisa double claim dengan asuransi kantor?" },
  { speaker: "agent", text: "Sangat bisa Bapak Ronal, santunan tunai kami dibayarkan penuh tanpa koordinasi manfaat." },
  { speaker: "customer", text: "Bagus juga ya. Tolong kirimkan brosur detailnya ke WhatsApp saya di nomor ini ya." },
  { speaker: "agent", text: "Siap Bapak Ronal, brosur sedang meluncur via sistem. Terima kasih banyak." }
];

export default function AgentWorkspace() {
  const [messageApi, contextHolder] = message.useMessage();
  const [agentStatus, setAgentStatus] = useState<"Ready" | "Break" | "Calling">("Ready");
  
  // Call Session States
  const [activeCall, setActiveCall] = useState<any | null>(null);
  const [callTimer, setCallTimer] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isOnHold, setIsOnHold] = useState(false);

  // Form logs states
  const [outcome, setOutcome] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<string>("Proteksi Kesehatan Prima");

  // Lead Queue state
  const [leadQueue, setLeadQueue] = useState(initialAgentQueue);

  // Agent Daily Scoreboard State
  const [stats, setStats] = useState({
    completed: 12,
    target: 30,
    conversions: 3,
    talkTime: "02:45"
  });

  // Call timer ticking effect
  useEffect(() => {
    let timerId: any;
    if (activeCall && !isOnHold) {
      timerId = setInterval(() => {
        setCallTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timerId);
  }, [activeCall, isOnHold]);

  // Break timer ticking effect
  const [breakTimer, setBreakTimer] = useState(0);
  useEffect(() => {
    let timerId: any;
    if (agentStatus === "Break") {
      timerId = setInterval(() => {
        setBreakTimer(prev => prev + 1);
      }, 1000);
    } else {
      setBreakTimer(0);
    }
    return () => clearInterval(timerId);
  }, [agentStatus]);

  // Speech to Text simulation state
  const [liveTranscriptLines, setLiveTranscriptLines] = useState<any[]>([]);

  // STT simulation effect
  useEffect(() => {
    if (!activeCall) {
      setLiveTranscriptLines([]);
      return;
    }

    setLiveTranscriptLines([{ speaker: "system", text: `[System] Panggilan tersambung ke nomor ${activeCall.phone}...` }]);
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < agentDialogSimulation.length) {
        const nextLine = agentDialogSimulation[currentIndex];
        if (nextLine) {
          setLiveTranscriptLines(prev => [...prev, nextLine]);
        }
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [activeCall]);

  // Formatter for ticking timer (MM:SS)
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Dial Next Lead action
  const handleDialNext = () => {
    if (leadQueue.length === 0) {
      messageApi.warning("Antrean panggilan kosong! Silakan minta data baru ke supervisor.");
      return;
    }
    
    // Pull the first lead in the list
    const nextLead = leadQueue[0];
    setActiveCall(nextLead);
    setAgentStatus("Calling");
    setCallTimer(0);
    setIsMuted(false);
    setIsOnHold(false);
    setOutcome("");
    setNotes("");

    messageApi.success(`Melakukan panggilan ke ${nextLead.name}...`);
  };

  // Mute action
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted) {
      messageApi.info("Mikrofon dimatikan (Muted).");
    } else {
      messageApi.success("Mikrofon dinyalakan kembali.");
    }
  };

  // Hold action
  const toggleHold = () => {
    setIsOnHold(!isOnHold);
    if (!isOnHold) {
      messageApi.info("Panggilan ditangguhkan (On Hold).");
    } else {
      messageApi.success("Panggilan dilanjutkan.");
    }
  };

  // TTS States
  const [ttsText, setTtsText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Quick speech templates
  const ttsTemplates = {
    greeting: `Selamat pagi Bapak atau Ibu ${activeCall ? activeCall.name : "Klien"}, perkenalkan saya Adi dari Asuransi Prima. Apa kabar hari ini?`,
    pitch: `Saya ingin menginfokan program Proteksi Kesehatan Prima dengan manfaat santunan rawat inap harian hingga 1 juta rupiah per hari dengan premi sangat hemat mulai dari 100 ribu per bulan.`,
    closing: `Baik Bapak atau Ibu, verifikasi penutupan polis asuransi Anda telah selesai. Terima kasih atas kepercayaan Anda menggunakan layanan Asuransi Prima.`
  };

  const handleSelectTtsTemplate = (type: "greeting" | "pitch" | "closing") => {
    setTtsText(ttsTemplates[type]);
  };

  // Speak text using Web Speech API
  const handlePlayTts = () => {
    if (!ttsText) {
      messageApi.warning("Silakan tulis atau pilih teks TTS terlebih dahulu!");
      return;
    }

    // Cancel current speaking if any
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(ttsText);
      utterance.lang = "id-ID"; // Indonesian Voice
      
      // Attempt to set a natural Indonesian voice if available
      const voices = window.speechSynthesis.getVoices();
      const idVoice = voices.find(v => v.lang.includes("id-ID") || v.lang.includes("id"));
      if (idVoice) utterance.voice = idVoice;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
      messageApi.success("Menjalankan suara sintesis Text-to-Speech...");
    } else {
      messageApi.error("Browser Anda tidak mendukung fitur Web Speech API / TTS.");
    }
  };

  const handleStopTts = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      messageApi.info("Pemutaran suara TTS dihentikan.");
    }
  };

  // Hangup/End call action
  const handleHangup = () => {
    if (!activeCall) return;

    messageApi.open({
      type: "loading",
      content: "Mengakhiri panggilan & menyimpan log...",
      duration: 0.8
    });

    setTimeout(() => {
      // Update stats: Increment completed calls
      setStats(prev => ({
        ...prev,
        completed: prev.completed + 1,
        // 30% chance of random conversion for simulation realism
        conversions: Math.random() > 0.7 ? prev.conversions + 1 : prev.conversions
      }));

      // Remove the dialed lead from queue
      setLeadQueue(prev => prev.slice(1));

      // Reset state
      setActiveCall(null);
      setAgentStatus("Ready");
      
      messageApi.success("Panggilan selesai dan log berhasil diperbarui.");
    }, 800);
  };

  // Submit outcome and load next
  const handleSubmitOutcome = () => {
    if (!outcome) {
      messageApi.error("Silakan pilih status hasil panggilan terlebih dahulu!");
      return;
    }

    messageApi.open({
      type: "loading",
      content: "Menyimpan hasil catatan panggilan...",
      duration: 1.0
    });

    setTimeout(() => {
      // Update statistics
      setStats(prev => ({
        ...prev,
        completed: prev.completed + 1,
        conversions: outcome === "success" ? prev.conversions + 1 : prev.conversions
      }));

      // Remove the dialed lead from queue
      setLeadQueue(prev => prev.slice(1));
      
      // Clear call session
      setActiveCall(null);
      setAgentStatus("Ready");
      setOutcome("");
      setNotes("");

      messageApi.success("Data hasil panggilan berhasil disimpan ke log!");
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-6">
      {contextHolder}

      {/* Header Panel Dashboard Agen */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 m-0">
            <IconEar className="text-blue-600 animate-pulse" size={24} />
            Dialer Workspace Agen
          </h2>
          <p className="text-slate-500 text-xs mt-1 m-0">
            Area operasional agen untuk melakukan panggilan keluar, panduan skrip interaktif, dan pencatatan hasil disposisi data prospek.
          </p>
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-medium">Status Anda saat ini:</span>
          <Select 
            value={agentStatus === "Calling" ? "Calling" : agentStatus} 
            onChange={(val: any) => setAgentStatus(val)}
            disabled={agentStatus === "Calling"}
            className="w-36 font-semibold"
            size="large"
          >
            <Option value="Ready">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span> Ready (Idle)</span>
            </Option>
            <Option value="Break">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span> Break (Istirahat)</span>
            </Option>
            {agentStatus === "Calling" && (
              <Option value="Calling">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block animate-ping"></span> On Call</span>
              </Option>
            )}
          </Select>
        </div>
      </div>

      {/* Main Grid Workspace */}
      {/* Main Grid Workspace */}
      <Row gutter={[24, 24]}>
        
        {/* Active Caller Console (Left on active, Full on idle) */}
        <Col xs={24} lg={activeCall ? 8 : 24}>
          <Card className="shadow-sm border-slate-200 h-full flex flex-col justify-between" title={agentStatus === "Break" ? "Rest Break Session" : "Active Caller Console"}>
            {agentStatus === "Break" ? (
              <div className="flex flex-col items-center justify-center text-center py-12 gap-5 flex-grow">
                <div className="w-20 h-20 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center shadow-inner relative">
                  <IconCoffee size={40} className="animate-bounce" style={{ animationDuration: '2s' }} />
                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500"></span>
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg m-0">Sesi Istirahat Aktif</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-[280px] mx-auto">
                    Anda sedang berada dalam mode istirahat. Panggilan keluar & antrean ditangguhkan sementara.
                  </p>
                </div>
                
                {/* Break Timer Ticking Counter */}
                <div className="text-center px-8 py-3 bg-amber-50 border border-amber-200 rounded-2xl">
                  <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider block mb-1">Durasi Istirahat</span>
                  <h2 className="text-3xl font-mono font-bold text-slate-800 m-0">{formatTimer(breakTimer)}</h2>
                </div>

                <Button 
                  type="primary"
                  size="large"
                  icon={<IconCheck size={18} />}
                  onClick={() => setAgentStatus("Ready")}
                  className="bg-emerald-600 hover:bg-emerald-500 border-0 flex items-center gap-2 rounded-xl"
                >
                  Selesai Istirahat (Ready)
                </Button>
              </div>
            ) : activeCall ? (
              <div className="flex flex-col gap-6 flex-grow justify-between">
                {/* Caller Profile Card */}
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center mb-3 text-2xl font-bold shadow-md">
                    <IconUser size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 m-0">{activeCall.name}</h3>
                  <span className="text-xs font-mono text-slate-400 mt-1">{activeCall.phone}</span>
                  <span className="text-xs font-semibold text-slate-500 mt-1 bg-white px-2 py-0.5 rounded-full border border-slate-200">{activeCall.address}</span>
                </div>

                {/* Call Timer Counter */}
                <div className="text-center py-4 bg-slate-900 text-white rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 tracking-widest uppercase block mb-1">Durasi Panggilan</span>
                  <h2 className="text-4xl font-mono font-bold text-emerald-400 m-0">{formatTimer(callTimer)}</h2>
                  <span className="text-[10px] text-blue-400 block mt-2 font-medium">SIP LINE CONNECTED</span>
                </div>

                {/* Call Control Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    type={isMuted ? "primary" : "default"} 
                    danger={isMuted}
                    icon={isMuted ? <IconVolumeOff size={16} /> : <IconVolume size={16} />}
                    onClick={toggleMute}
                    className="flex items-center justify-center gap-1.5 h-11 text-xs rounded-xl"
                  >
                    {isMuted ? "Unmute" : "Mute Mic"}
                  </Button>
                  <Button 
                    type={isOnHold ? "primary" : "default"} 
                    icon={isOnHold ? <IconPlayerPlay size={16} /> : <IconPlayerPause size={16} />}
                    onClick={toggleHold}
                    className="flex items-center justify-center gap-1.5 h-11 text-xs rounded-xl"
                  >
                    {isOnHold ? "Resume" : "Hold"}
                  </Button>
                </div>

                {/* End Call Button */}
                <Button 
                  type="primary" 
                  danger 
                  icon={<IconPhoneOff size={18} />} 
                  onClick={handleHangup}
                  disabled={agentStatus !== "Calling"}
                  className="w-full flex items-center justify-center gap-2 h-12 text-sm font-bold rounded-xl bg-red-600 hover:bg-red-500 border-0 mt-2"
                >
                  End Call (Tutup Telepon)
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-16 gap-4 flex-grow">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <IconPhoneOff size={32} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-base m-0">Dialer Idle</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-[200px] mx-auto">Klik tombol di bawah untuk memanggil prospek berikutnya di antrean Anda.</p>
                </div>
                <Button 
                  type="primary"
                  size="large"
                  icon={<IconPhone size={18} />}
                  onClick={handleDialNext}
                  className="bg-blue-600 hover:bg-blue-500 border-0 flex items-center gap-2 rounded-xl"
                >
                  Panggil Prospek Berikutnya
                </Button>
              </div>
            )}
          </Card>
        </Col>

        {/* Live Speech to Text Transcript for Active Call (Right Column when active) */}
        {activeCall && (
          <Col xs={24} lg={16}>
            <div className="flex flex-col gap-4">
              {/* Live Sentiment Analysis (AI Model) */}
              <Card className="shadow-sm border-slate-200" styles={{ body: { padding: '16px' } }}>
                <div className="flex flex-col gap-2.5">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Live Sentiment Analysis (AI Model)</span>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                      </span>
                      <span className="text-xs font-semibold text-slate-400">Sentimen Prospek:</span>
                      <Tag color={
                        (() => {
                          const linesCount = Math.max(0, liveTranscriptLines.length - 1);
                          if (linesCount === 0) return "default";
                          if (linesCount <= 2) return "default";
                          if (linesCount <= 4) return "error";
                          if (linesCount <= 7) return "warning";
                          return "success";
                        })()
                      } className="rounded font-bold border-0 text-xs py-0.5 px-2 m-0">
                        {(() => {
                          const linesCount = Math.max(0, liveTranscriptLines.length - 1);
                          if (linesCount === 0) return "MENUNGGU...";
                          if (linesCount <= 2) return "NETRAL";
                          if (linesCount <= 4) return "NEGATIF (KEBERATAN)";
                          if (linesCount <= 7) return "NETRAL (HANDLING)";
                          return "POSITIF (TERTARIK)";
                        })()}
                      </Tag>
                    </div>
                    <span className="text-xs font-bold text-slate-700">
                      {(() => {
                        const linesCount = Math.max(0, liveTranscriptLines.length - 1);
                        if (linesCount === 0) return 50;
                        if (linesCount <= 2) return 62;
                        if (linesCount <= 4) return 38;
                        if (linesCount <= 7) return 58;
                        return 87;
                      })()}% Confidence
                    </span>
                  </div>
                  <Progress 
                    percent={(() => {
                      const linesCount = Math.max(0, liveTranscriptLines.length - 1);
                      if (linesCount === 0) return 50;
                      if (linesCount <= 2) return 62;
                      if (linesCount <= 4) return 38;
                      if (linesCount <= 7) return 58;
                      return 87;
                    })()} 
                    showInfo={false} 
                    strokeColor={
                      (() => {
                        const linesCount = Math.max(0, liveTranscriptLines.length - 1);
                        if (linesCount === 0) return "#f59e0b";
                        if (linesCount <= 2) return "#f59e0b";
                        if (linesCount <= 4) return "#ef4444";
                        if (linesCount <= 7) return "#f59e0b";
                        return "#10b981";
                      })()
                    } 
                    size="small"
                    className="m-0"
                  />
                </div>
              </Card>

              {/* Speech to Text transcript and Visualizer */}
              <Card 
                className="shadow-sm border-slate-200" 
                title="Transkripsi Live & Stream Audio (Speech to Text)"
              >
                <div className="flex flex-col gap-4">
                  {/* Bouncing Audio Waveform */}
                  <div className="bg-slate-900 text-white p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
                    <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Live Stream</span>
                    <div className="flex items-center gap-1 h-6 justify-center flex-grow">
                      {[
                        { delay: '0.1s', dur: '0.8s', h: 'h-3' },
                        { delay: '0.3s', dur: '0.6s', h: 'h-5' },
                        { delay: '0.2s', dur: '0.9s', h: 'h-2' },
                        { delay: '0.4s', dur: '0.5s', h: 'h-6' },
                        { delay: '0.1s', dur: '0.7s', h: 'h-4' },
                        { delay: '0.5s', dur: '0.8s', h: 'h-2' },
                        { delay: '0.3s', dur: '0.6s', h: 'h-5' },
                        { delay: '0.2s', dur: '0.7s', h: 'h-3' },
                      ].map((bar, idx) => (
                        <div 
                          key={idx} 
                          className={`w-1 bg-emerald-500 rounded-full ${bar.h} ${!isOnHold ? 'animate-bounce' : ''}`}
                          style={{ animationDelay: bar.delay, animationDuration: bar.dur }}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-mono text-slate-400">{formatTimer(callTimer)}</span>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-y-auto flex flex-col gap-3 max-h-[240px]">
                    {liveTranscriptLines.map((line, idx) => {
                      if (!line) return null;
                      if (line.speaker === "system") {
                        return (
                          <p key={idx} className="text-xs text-slate-400 font-mono m-0 leading-relaxed animate-pulse">
                            {line.text}
                          </p>
                        );
                      }
                      const isAgent = line.speaker === "agent";
                      return (
                        <div 
                          key={idx} 
                          className={`flex flex-col max-w-[85%] ${isAgent ? "self-start" : "self-end items-end"}`}
                        >
                          <span className="text-[9px] text-slate-500 font-bold mb-0.5 uppercase tracking-wider">
                            {isAgent ? "Anda" : "Prospek"}
                          </span>
                          <p className={`text-xs m-0 leading-relaxed p-2 rounded-xl ${
                            isAgent ? "bg-slate-800 text-white rounded-tl-none" : "bg-emerald-950 text-emerald-100 rounded-tr-none border border-emerald-900"
                          }`}>
                            {line.text}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>
            </div>
          </Col>
        )}
      </Row>

      {/* Row Bawah: Performa Harian & Antrean Prospek */}
      <Row gutter={[24, 24]}>
        {/* Target Harian Progress */}
        <Col xs={24} lg={8}>
          <Card className="shadow-sm border-slate-200 h-full" title="Target & Performa Harian Anda">
            <div className="flex flex-col gap-4">
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-semibold text-slate-500 uppercase tracking-wider">Telepon Selesai (Target)</span>
                  <span className="font-bold text-slate-700">{stats.completed} / {stats.target}</span>
                </div>
                <Progress percent={Math.round((stats.completed / stats.target) * 100)} strokeColor="#3b82f6" />
              </div>

              <div className="flex justify-between items-center pt-2.5 border-t border-slate-100">
                <span className="text-xs text-slate-400 font-medium">Berhasil Closing</span>
                <Tag color="success" className="rounded font-bold border-0 text-xs py-0.5 px-2.5 m-0">
                  {stats.conversions} Closing
                </Tag>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <span className="text-xs text-slate-400 font-medium">Rata-rata Durasi Bicara</span>
                <span className="text-xs font-mono font-bold text-slate-700">{stats.talkTime}</span>
              </div>
            </div>
          </Card>
        </Col>

        {/* Antrean Leads Tersisa */}
        <Col xs={24} lg={16}>
          <Card className="shadow-sm border-slate-200 h-full" title="Antrean Prospek Anda Berikutnya">
            <div className="flex flex-col gap-2.5 max-h-[140px] overflow-y-auto">
              {leadQueue.slice(activeCall ? 1 : 0).map((lead, idx) => (
                <div key={idx} className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs">
                      {idx + 1}
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 text-sm block leading-none">{lead.name}</span>
                      <span className="text-[10px] text-slate-400 block mt-1 font-mono">{lead.phone}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                    <span>Wilayah: {lead.address}</span>
                    <Tag color="blue" className="rounded border-0 text-[10px] m-0 font-bold">{lead.product}</Tag>
                  </div>
                </div>
              ))}
              {leadQueue.length === 0 && (
                <span className="text-xs text-slate-400 italic block py-4 text-center">Antrean prospek habis. Silakan ambil dari ready pool.</span>
              )}
            </div>
          </Card>
        </Col>
      </Row>

    </div>
  );
}
