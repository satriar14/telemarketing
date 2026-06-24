"use client";

import { useState, useEffect } from "react";
import { analyzedCalls } from "@/data/mockData";
import { Card, Table, Tag, Button, Tabs, Row, Col, Progress, message, Tooltip, List, Drawer } from "antd";
import { 
  IconHeadset, 
  IconPhoneCall, 
  IconVolume, 
  IconVolumeOff, 
  IconEar, 
  IconMessage2, 
  IconPlayerPlay, 
  IconPlayerPause, 
  IconClock, 
  IconTrendingUp, 
  IconUserCheck,
  IconPhoneOutgoing,
  IconLockOpen
} from "@tabler/icons-react";

export default function CallCenter() {
  const [messageApi, contextHolder] = message.useMessage();

  // Active Monitoring States
  const [monitoringAgent, setMonitoringAgent] = useState<any | null>(null);
  const [whispering, setWhispering] = useState(false);
  const [playingRecording, setPlayingRecording] = useState<any | null>(null);
  const [audioPlaying, setAudioPlaying] = useState(true);

  // Live Agent List State
  const [agents, setAgents] = useState([
    { key: '1', init: 'AR', bg: 'bg-blue-100 text-blue-700', name: 'Adi Rachmat', team: 'Tim Fajar', status: 'Menelepon', seconds: 272, statusColor: 'success' },
    { key: '2', init: 'SN', bg: 'bg-emerald-100 text-emerald-700', name: 'Siti Nuraini', team: 'Tim Fajar', status: 'Menelepon', seconds: 77, statusColor: 'success' },
    { key: '3', init: 'BW', bg: 'bg-purple-100 text-purple-700', name: 'Budi Wahyudi', team: 'Tim Bima', status: 'Istirahat', seconds: 0, statusColor: 'warning' },
    { key: '4', init: 'RP', bg: 'bg-rose-100 text-rose-700', name: 'Rina Pratiwi', team: 'Tim Dewi', status: 'Wrap-up', seconds: 0, statusColor: 'processing' },
    { key: '5', init: 'YA', bg: 'bg-amber-100 text-amber-700', name: 'Yusuf Agusta', team: 'Tim Bima', status: 'Ready', seconds: 0, statusColor: 'purple' },
    { key: '6', init: 'SK', bg: 'bg-cyan-100 text-cyan-700', name: 'Sarah Kirana', team: 'Tim Bima', status: 'Menelepon', seconds: 45, statusColor: 'success' },
  ]);

  // Live Call Queue State
  const [queue, setQueue] = useState([
    { key: 'q1', id: '#9012', name: 'Ronal Surapradja', phone: '0812-xxxx-8888', wait: 84 },
    { key: 'q2', id: '#9013', name: 'Mieke Amalia', phone: '0857-xxxx-1122', wait: 42 },
    { key: 'q3', id: '#9014', name: 'Soleh Solihun', phone: '0819-xxxx-3344', wait: 12 },
  ]);

  // Completed call records
  const recentCalls = [
    { key: 'c1', agent: 'Adi Rachmat', customer: 'Denny Cagur', phone: '0812-3344-5566', duration: '3m 45s', sentiment: 'positive', time: '10:05', transcript: 'Customer setuju untuk mengirimkan dokumen penawaran lanjutan. Sangat tertarik dengan program asuransi kesehatan.' },
    { key: 'c2', agent: 'Rina Pratiwi', customer: 'Ayu Tingting', phone: '0856-1122-3344', duration: '1m 12s', sentiment: 'negative', time: '09:50', transcript: 'Customer menolak secara halus karena sedang sibuk dan sudah memiliki proteksi serupa dari agen lain.' },
    { key: 'c3', agent: 'Siti Nuraini', customer: 'Raffi Ahmad', phone: '0821-9988-7766', duration: '5m 20s', sentiment: 'positive', time: '09:30', transcript: 'Customer melakukan registrasi paket premium secara langsung via telepon. Alokasi pembayaran kartu kredit berhasil.' },
  ];

  // Dynamic seconds counter for active calls
  useEffect(() => {
    const timer = setInterval(() => {
      setAgents(prev => prev.map(agent => {
        if (agent.status === 'Menelepon') {
          return {
            ...agent,
            seconds: agent.seconds + 1
          };
        }
        return agent;
      }));
      setQueue(prev => prev.map(q => ({
        ...q,
        wait: q.wait + 1
      })));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Speech to Text simulation state
  const [liveTranscriptLines, setLiveTranscriptLines] = useState<any[]>([]);

  // Simulation dialog sentences
  const liveDialogSimulation = [
    { speaker: "agent", text: "Selamat pagi Ibu Ayu, perkenalkan saya dengan agen telemarketing dari Asuransi Prima." },
    { speaker: "customer", text: "Selamat pagi. Oh ya, ada apa ya?" },
    { speaker: "agent", text: "Saya ingin membagikan info mengenai program perlindungan kesehatan terjangkau mulai dari Rp100.000 saja per bulan." },
    { speaker: "customer", text: "Mmm... menarik sih, tapi saya sudah punya asuransi lain dari kantor." },
    { speaker: "agent", text: "Sangat bagus Ibu Ayu, namun program kami bisa melakukan klaim ganda tanpa koordinasi manfaat." },
    { speaker: "customer", text: "Oh ya? Jadi saya bisa dapet double santunan ya kalau rawat inap?" },
    { speaker: "agent", text: "Betul sekali Ibu Ayu, proteksi tambahan ini melengkapi manfaat dari asuransi kantor Ibu." },
    { speaker: "customer", text: "Boleh deh, tolong kirimkan brosur detailnya ke WhatsApp saya dulu ya." },
    { speaker: "agent", text: "Baik Ibu Ayu, mohon ditunggu sebentar brosur akan segera dikirim oleh sistem." }
  ];

  // Speech to Text simulation effect
  useEffect(() => {
    if (!monitoringAgent) {
      setLiveTranscriptLines([]);
      return;
    }

    setLiveTranscriptLines([{ speaker: "system", text: `[System] Membuka streaming transkripsi percakapan ${monitoringAgent.name}...` }]);
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < liveDialogSimulation.length) {
        setLiveTranscriptLines(prev => [...prev, liveDialogSimulation[currentIndex]]);
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [monitoringAgent]);

  // Playback timer simulation state
  const [playbackSeconds, setPlaybackSeconds] = useState(0);

  // Playback timer simulation effect
  useEffect(() => {
    if (!playingRecording || !audioPlaying) return;

    const timer = setInterval(() => {
      setPlaybackSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [playingRecording, audioPlaying]);

  useEffect(() => {
    setPlaybackSeconds(0);
  }, [playingRecording]);

  const getPlaybackTranscript = () => {
    if (!playingRecording) return [];
    // Find matching analyzed call
    const match = analyzedCalls.find(c => c.customer === playingRecording.customer);
    if (!match) return [];
    
    // Reveal lines based on time: reveal one line every 3 seconds
    const linesToReveal = Math.min(Math.floor(playbackSeconds / 3) + 1, match.transcript.length);
    return match.transcript.slice(0, linesToReveal);
  };

  const getPlaybackTimeStr = () => {
    if (!playingRecording) return "00:00";
    const mins = Math.floor(playbackSeconds / 60);
    const secs = playbackSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getLiveSentiment = () => {
    const linesCount = Math.max(0, liveTranscriptLines.length - 1);
    if (linesCount === 0) return { type: "neutral", text: "MENUNGGU...", score: 50, color: "default" };
    if (linesCount <= 2) return { type: "neutral", text: "NETRAL", score: 62, color: "default" };
    if (linesCount <= 4) return { type: "negative", text: "NEGATIF (KEBERATAN)", score: 38, color: "error" };
    if (linesCount <= 7) return { type: "neutral", text: "NETRAL (HANDLING)", score: 58, color: "warning" };
    return { type: "positive", text: "POSITIF (TERTARIK)", score: 87, color: "success" };
  };

  const handleListen = (agent: any) => {
    setPlayingRecording(null);
    setMonitoringAgent(agent);
    setWhispering(false);
    messageApi.success(`Menghubungkan audio: Mendengarkan panggilan ${agent.name}...`);
  };

  const handleWhisper = () => {
    if (!monitoringAgent) return;
    setWhispering(!whispering);
    if (!whispering) {
      messageApi.info(`Fitur Bisik (Whisper) Aktif: Hanya ${monitoringAgent.name} yang mendengar suara Anda.`);
    } else {
      messageApi.success(`Bisik nonaktif. Kembali mendengarkan panggilan.`);
    }
  };

  const handleForceLogout = (name: string) => {
    messageApi.warning(`Instruksi logout paksa dikirim ke perangkat ${name}.`);
    setAgents(prev => prev.map(a => {
      if (a.name === name) {
        return { ...a, status: 'Offline', statusColor: 'default', seconds: 0 };
      }
      return a;
    }));
  };

  const handlePlayRecording = (record: any) => {
    setMonitoringAgent(null);
    setPlayingRecording(record);
    setAudioPlaying(true);
    messageApi.success(`Memuat rekaman audio: ${record.agent} vs ${record.customer}`);
  };

  const columnsAgents = [
    {
      title: 'Nama Agen',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${record.bg}`}>
            {record.init}
          </div>
          <div>
            <span className="font-semibold text-slate-800 text-sm block">{text}</span>
            <span className="text-[11px] text-slate-400 font-medium">{record.team}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: any) => {
        let color = record.statusColor;
        let text = status;
        if (status === 'Menelepon') {
          return (
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Tag color={color} className="font-semibold text-xs rounded border-0 m-0">{text.toUpperCase()}</Tag>
            </div>
          );
        }
        return <Tag color={color} className="font-semibold text-xs rounded border-0 m-0">{text.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Durasi Panggilan',
      dataIndex: 'seconds',
      key: 'seconds',
      render: (sec: number, record: any) => {
        if (record.status !== 'Menelepon') return <span className="text-slate-300 font-mono text-xs">—</span>;
        return <span className="font-mono font-medium text-slate-700 text-xs">{formatTime(sec)}</span>;
      },
    },
    {
      title: 'Aksi Supervisi',
      key: 'actions',
      render: (_: any, record: any) => {
        const isOffline = record.status === 'Offline';
        const isCalling = record.status === 'Menelepon';
        return (
          <div className="flex gap-2">
            <Tooltip title="Dengarkan Live Percakapan">
              <Button 
                size="small" 
                icon={<IconEar size={14} />} 
                onClick={() => handleListen(record)}
                disabled={!isCalling || isOffline}
                type={monitoringAgent?.key === record.key ? "primary" : "default"}
                className="text-xs flex items-center justify-center"
              >
                Listen
              </Button>
            </Tooltip>
            <Tooltip title="Logout Paksa Device Agen">
              <Button 
                size="small" 
                danger
                onClick={() => handleForceLogout(record.name)}
                disabled={isOffline}
                className="text-xs"
              >
                Kick
              </Button>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const columnsQueue = [
    {
      title: 'ID Prospek',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => <span className="font-mono text-xs text-slate-400">{text}</span>
    },
    {
      title: 'Nama Prospek',
      dataIndex: 'name',
      key: 'name',
      className: 'font-semibold text-slate-700 text-xs'
    },
    {
      title: 'Nomor Telepon',
      dataIndex: 'phone',
      key: 'phone',
      className: 'text-xs text-slate-600'
    },
    {
      title: 'Waktu Tunggu',
      dataIndex: 'wait',
      key: 'wait',
      render: (wait: number) => (
        <span className="text-amber-600 font-mono text-xs font-semibold flex items-center gap-1">
          <IconClock size={12} /> {formatTime(wait)}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6 flex flex-col min-h-0">
      {contextHolder}

      {/* Summary KPI Grid */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} xl={6}>
          <Card className="shadow-sm border-slate-200" styles={{ body: { padding: '16px 20px' } }}>
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Panggilan Live</span>
                <span className="text-2xl font-bold text-slate-800 block mt-1 flex items-center gap-2">
                  {agents.filter(a => a.status === 'Menelepon').length} Active
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                </span>
              </div>
              <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600">
                <IconPhoneCall size={22} />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} xl={6}>
          <Card className="shadow-sm border-slate-200" styles={{ body: { padding: '16px 20px' } }}>
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Agent Online</span>
                <span className="text-2xl font-bold text-slate-800 block mt-1">
                  {agents.filter(a => a.status !== 'Offline').length} / {agents.length}
                </span>
              </div>
              <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600">
                <IconUserCheck size={22} />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} xl={6}>
          <Card className="shadow-sm border-slate-200" styles={{ body: { padding: '16px 20px' } }}>
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Rata-rata Durasi</span>
                <span className="text-2xl font-bold text-slate-800 block mt-1">03m 15s</span>
              </div>
              <div className="p-2.5 bg-purple-50 rounded-xl text-purple-600">
                <IconClock size={22} />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} xl={6}>
          <Card className="shadow-sm border-slate-200" styles={{ body: { padding: '16px 20px' } }}>
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Answer Rate</span>
                <span className="text-2xl font-bold text-slate-800 block mt-1">94.8%</span>
              </div>
              <div className="p-2.5 bg-amber-50 rounded-xl text-amber-600">
                <IconTrendingUp size={22} />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Main Content Layout Split */}
      <Row gutter={[24, 24]}>
        {/* Agent Monitor */}
        <Col xs={24} xl={14}>
          <Card className="shadow-sm border-slate-200" title="Monitoring Agent Live">
            <Table columns={columnsAgents} dataSource={agents} pagination={false} className="custom-table" />
          </Card>
        </Col>

        {/* Queues & Logs */}
        <Col xs={24} xl={10}>
          <Card className="shadow-sm border-slate-200 h-full" styles={{ body: { padding: '8px 16px' } }}>
            <Tabs
              defaultActiveKey="1"
              items={[
                {
                  label: `Antrean Masuk (${queue.length})`,
                  key: '1',
                  children: <Table columns={columnsQueue} dataSource={queue} pagination={false} size="small" />
                },
                {
                  label: 'Riwayat Log Panggilan',
                  key: '2',
                  children: (
                    <List
                      itemLayout="horizontal"
                      dataSource={recentCalls}
                      renderItem={(item: any) => (
                        <List.Item
                          className="py-3.5"
                          actions={[
                            <Button 
                              key="play" 
                              size="small" 
                              icon={<IconPlayerPlay size={12} />}
                              onClick={() => handlePlayRecording(item)}
                              type={playingRecording?.key === item.key ? "primary" : "default"}
                              className="text-xs"
                            >
                              Rekaman
                            </Button>
                          ]}
                        >
                          <List.Item.Meta
                            title={
                              <div className="flex justify-between items-center">
                                <span className="font-semibold text-slate-800 text-sm">{item.agent} &rarr; {item.customer}</span>
                                <Tag color={item.sentiment === 'positive' ? 'success' : 'error'} className="rounded text-[10px] font-bold m-0 border-0">
                                  {item.sentiment.toUpperCase()}
                                </Tag>
                              </div>
                            }
                            description={
                              <div className="text-[11px] text-slate-400 mt-1 flex gap-2">
                                <span>Durasi: {item.duration}</span>
                                <span>•</span>
                                <span>Waktu: {item.time}</span>
                              </div>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  )
                }
              ]}
            />
          </Card>
        </Col>
      </Row>

      {/* Live Audio Monitoring Drawer */}
      <Drawer
        title="Live Monitoring Percakapan"
        placement="right"
        size={480}
        onClose={() => setMonitoringAgent(null)}
        open={!!monitoringAgent}
        className="custom-drawer"
        styles={{ body: { height: '100%', display: 'flex', flexDirection: 'column' } }}
      >
        {monitoringAgent && (
          <div className="flex flex-col gap-6 h-full">
            {/* Profil Percakapan */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${monitoringAgent.bg}`}>
                    {monitoringAgent.init}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-base m-0">{monitoringAgent.name}</h4>
                    <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1 mt-0.5">
                      <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span></span>
                      Sedang Menelepon
                    </span>
                  </div>
                </div>
                <Tag color="success" className="rounded font-bold border-0 text-xs py-0.5 px-2 m-0">
                  LIVE
                </Tag>
              </div>
              <hr className="border-slate-200/60 my-1" />
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Tim Pengendali</span>
                  <span className="font-semibold text-slate-700">{monitoringAgent.team}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Durasi Live</span>
                  <span className="font-mono font-semibold text-slate-700">{formatTime(monitoringAgent.seconds)}</span>
                </div>
              </div>
            </div>

            {/* Live Sentiment Analysis */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-2.5">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Live Sentiment Analysis (AI Model)</span>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                  <span className="text-xs font-semibold text-slate-400">Sentimen Prospek:</span>
                  <Tag color={getLiveSentiment().color} className="rounded font-bold border-0 text-xs py-0.5 px-2 m-0">
                    {getLiveSentiment().text}
                  </Tag>
                </div>
                <span className="text-xs font-bold text-slate-700">{getLiveSentiment().score}% Confidence</span>
              </div>
              <Progress 
                percent={getLiveSentiment().score} 
                showInfo={false} 
                strokeColor={
                  getLiveSentiment().type === "positive" 
                    ? "#10b981" 
                    : getLiveSentiment().type === "negative" 
                      ? "#ef4444" 
                      : "#f59e0b"
                } 
                size="small"
                className="m-0"
              />
            </div>

            {/* Kontrol & Visualizer Audio */}
            <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 flex flex-col gap-4">
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider block">Live Audio Stream</span>
              <div className="flex items-center justify-between gap-4">
                <Button 
                  type="text"
                  icon={audioPlaying ? <IconPlayerPause size={20} className="text-white" /> : <IconPlayerPlay size={20} className="text-white" />} 
                  onClick={() => setAudioPlaying(!audioPlaying)}
                  className="flex items-center justify-center hover:bg-slate-800 border-slate-700 shrink-0 p-2 h-10 w-10 rounded-full"
                />
                {/* Waveform visualizer */}
                <div className="flex items-center gap-1 h-8 justify-center flex-grow">
                  {[
                    { delay: '0.1s', dur: '0.8s', h: 'h-4' },
                    { delay: '0.3s', dur: '0.6s', h: 'h-6' },
                    { delay: '0.2s', dur: '0.9s', h: 'h-3' },
                    { delay: '0.4s', dur: '0.5s', h: 'h-8' },
                    { delay: '0.1s', dur: '0.7s', h: 'h-5' },
                    { delay: '0.5s', dur: '0.8s', h: 'h-3' },
                    { delay: '0.3s', dur: '0.6s', h: 'h-7' },
                    { delay: '0.2s', dur: '0.7s', h: 'h-4' },
                    { delay: '0.4s', dur: '0.9s', h: 'h-6' },
                    { delay: '0.1s', dur: '0.5s', h: 'h-2' },
                  ].map((bar, idx) => (
                    <div 
                      key={idx} 
                      className={`w-1 bg-emerald-500 rounded-full ${bar.h} ${audioPlaying ? 'animate-bounce' : ''}`}
                      style={{ animationDelay: bar.delay, animationDuration: bar.dur }}
                    />
                  ))}
                </div>
                <span className="text-xs font-mono text-slate-400 shrink-0">{formatTime(monitoringAgent.seconds)}</span>
              </div>
            </div>

            {/* Aksi Supervisi */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Aksi Supervisi</span>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  size="large" 
                  onClick={handleWhisper}
                  type={whispering ? "primary" : "default"}
                  icon={<IconMessage2 size={16} />}
                  className={`text-xs flex items-center justify-center gap-1.5 rounded-xl h-11 ${whispering ? '' : 'border-slate-300 text-slate-700'}`}
                >
                  {whispering ? "Whisper Active" : "Whisper to Agent"}
                </Button>
                <Button 
                  size="large"
                  danger
                  icon={<IconVolumeOff size={16} />}
                  onClick={() => setMonitoringAgent(null)}
                  className="text-xs flex items-center justify-center gap-1.5 rounded-xl h-11"
                >
                  Disconnect Live
                </Button>
              </div>
            </div>

            {/* AI Live Transcript Display */}
            <div className="flex flex-col gap-2 flex-grow min-h-0">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Live AI Transcript (Speech to Text)</span>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-y-auto flex flex-col gap-3 flex-grow min-h-0">
                {liveTranscriptLines.map((line, idx) => {
                  if (line.speaker === "system") {
                    return (
                      <p key={idx} className="text-xs text-slate-400 font-mono m-0 leading-relaxed">
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
                        {isAgent ? "Agen" : "Prospek"}
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
          </div>
        )}
      </Drawer>

      {/* Drawer for Playing Historical Call Recordings */}
      <Drawer
        title="Detail Rekaman Panggilan"
        placement="right"
        size={480}
        onClose={() => setPlayingRecording(null)}
        open={!!playingRecording}
        className="custom-drawer"
        styles={{ body: { height: '100%', display: 'flex', flexDirection: 'column' } }}
      >
        {playingRecording && (
          <div className="flex flex-col gap-6 h-full">
            {/* Profil Percakapan */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-800 text-lg m-0">{playingRecording.customer}</h4>
                  <span className="text-xs text-slate-500 font-mono block mt-0.5">{playingRecording.phone}</span>
                </div>
                <Tag color={playingRecording.sentiment === 'positive' ? 'success' : 'error'} className="rounded font-bold border-0 text-xs py-0.5 px-2 m-0">
                  {playingRecording.sentiment.toUpperCase()}
                </Tag>
              </div>
              <hr className="border-slate-200/60 my-1" />
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Agen Pengendali</span>
                  <span className="font-semibold text-slate-700">{playingRecording.agent}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Waktu Percakapan</span>
                  <span className="font-semibold text-slate-700">{playingRecording.time} (Hari Ini)</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Durasi Panggilan</span>
                  <span className="font-semibold text-slate-700">{playingRecording.duration}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Kategori AI</span>
                  <span className="font-semibold text-slate-700">Follow-up Terjadwal</span>
                </div>
              </div>
            </div>

            {/* Historical Sentiment Analysis */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-2.5">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">AI Sentiment Analysis (Post-Call)</span>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400">Sentimen Akhir:</span>
                  <Tag color={playingRecording.sentiment === 'positive' ? 'success' : 'error'} className="rounded font-bold border-0 text-xs py-0.5 px-2 m-0">
                    {playingRecording.sentiment === 'positive' ? 'POSITIF (TERTARIK)' : 'NEGATIF (MENOLAK)'}
                  </Tag>
                </div>
                <span className="text-xs font-bold text-slate-700">{playingRecording.sentiment === 'positive' ? '92%' : '65%'} Confidence</span>
              </div>
              <Progress 
                percent={playingRecording.sentiment === 'positive' ? 92 : 65} 
                showInfo={false} 
                strokeColor={playingRecording.sentiment === 'positive' ? "#10b981" : "#ef4444"} 
                size="small"
                className="m-0"
              />
            </div>

            {/* Kontrol & Visualizer Audio */}
            <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 flex flex-col gap-4">
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider block">Audio Playback Monitor</span>
              <div className="flex items-center justify-between gap-4">
                <Button 
                  type="primary"
                  shape="circle"
                  size="large"
                  icon={audioPlaying ? <IconPlayerPause size={20} /> : <IconPlayerPlay size={20} />} 
                  onClick={() => setAudioPlaying(!audioPlaying)}
                  className="flex items-center justify-center bg-blue-600 hover:bg-blue-500 border-0 shrink-0"
                />
                {/* Waveform visualizer */}
                <div className="flex items-center gap-1 h-8 justify-center flex-grow">
                  {[
                    { delay: '0.1s', dur: '0.8s', h: 'h-4' },
                    { delay: '0.3s', dur: '0.6s', h: 'h-6' },
                    { delay: '0.2s', dur: '0.9s', h: 'h-3' },
                    { delay: '0.4s', dur: '0.5s', h: 'h-8' },
                    { delay: '0.1s', dur: '0.7s', h: 'h-5' },
                    { delay: '0.5s', dur: '0.8s', h: 'h-3' },
                    { delay: '0.3s', dur: '0.6s', h: 'h-7' },
                    { delay: '0.2s', dur: '0.7s', h: 'h-4' },
                    { delay: '0.4s', dur: '0.9s', h: 'h-6' },
                    { delay: '0.1s', dur: '0.5s', h: 'h-2' },
                  ].map((bar, idx) => (
                    <div 
                      key={idx} 
                      className={`w-1 bg-blue-500 rounded-full ${bar.h} ${audioPlaying ? 'animate-bounce' : ''}`}
                      style={{ animationDelay: bar.delay, animationDuration: bar.dur }}
                    />
                  ))}
                </div>
                <span className="text-xs font-mono text-slate-400 shrink-0">{getPlaybackTimeStr()} / {playingRecording.duration}</span>
              </div>
            </div>

            {/* AI Transcript Display */}
            <div className="flex flex-col gap-2 flex-grow min-h-0">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Transkripsi Rekaman (Speech to Text)</span>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-y-auto flex flex-col gap-3 flex-grow min-h-0">
                {getPlaybackTranscript().length === 0 ? (
                  <p className="text-xs text-slate-400 font-mono m-0 leading-relaxed">
                    [System] Memulai pemutaran rekaman audio...
                  </p>
                ) : (
                  getPlaybackTranscript().map((line: any, idx: number) => {
                    const isAgent = line.speaker === "agent";
                    return (
                      <div 
                        key={idx} 
                        className={`flex flex-col max-w-[85%] ${isAgent ? "self-start" : "self-end items-end"}`}
                      >
                        <span className="text-[9px] text-slate-500 font-bold mb-0.5 uppercase tracking-wider">
                          {isAgent ? "Agen" : "Prospek"}
                        </span>
                        <p className={`text-xs m-0 leading-relaxed p-2 rounded-xl ${
                          isAgent ? "bg-slate-850 text-white rounded-tl-none border border-slate-800" : "bg-blue-950 text-blue-100 rounded-tr-none border border-blue-900"
                        }`}>
                          {line.text}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
