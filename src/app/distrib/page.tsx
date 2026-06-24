"use client";

import { useState, useEffect } from "react";
import { Card, Select, Button, Input, Progress, Table, Tag, message, Alert } from "antd";
import { IconPlayerPlay, IconSearch, IconPhoneCalling } from "@tabler/icons-react";
import { tlDistributionList, agentDistributionList, readyPoolLeads } from "@/data/mockData";

export default function DistribusiData() {
  const [messageApi, contextHolder] = message.useMessage();
  const [distMethod, setDistMethod] = useState<'proporsional' | 'rata' | 'manual'>('proporsional');
  const [selectedTeam, setSelectedTeam] = useState<'fajar' | 'bima' | 'dewi'>('fajar');
  const [searchQuery, setSearchQuery] = useState('');
  const [executing, setExecuting] = useState(false);

  // Role support
  const [role, setRole] = useState<"Supervisor" | "Team Leader" | "Agent">("Supervisor");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedRole = localStorage.getItem("user_role");
    if (savedRole === "Agent" || savedRole === "Supervisor" || savedRole === "Team Leader") {
      setRole(savedRole as "Supervisor" | "Team Leader" | "Agent");
    }
  }, []);

  useEffect(() => {
    if (role === "Team Leader") {
      setSelectedTeam("fajar");
    }
  }, [role]);

  // Level 1: TL Distribution State
  const [tlData, setTlData] = useState(tlDistributionList);

  // Level 3: Ready Pool State
  const [poolData, setPoolData] = useState(readyPoolLeads);

  // Level 2 Distribution State
  const [agentDistMethod, setAgentDistMethod] = useState<'proporsional' | 'rata' | 'manual'>('proporsional');
  const [agentExecuting, setAgentExecuting] = useState(false);

  // Level 2: Agents Mock Database per Team
  const [teamAgents, setTeamAgents] = useState({
    fajar: [
      { name: 'Adi R.', avatar: 'https://ui-avatars.com/api/?name=Adi+Rachmat&background=3b82f6&color=fff&size=24', pct: 22, count: 231 },
      { name: 'Siti N.', avatar: 'https://ui-avatars.com/api/?name=Siti+Nur&background=10b981&color=fff&size=24', pct: 25, count: 263 },
      { name: 'Budi W.', avatar: 'https://ui-avatars.com/api/?name=Budi+W&background=8b5cf6&color=fff&size=24', pct: 28, count: 294 },
      { name: 'Rina P.', avatar: 'https://ui-avatars.com/api/?name=Rina+P&background=ec4899&color=fff&size=24', pct: 25, count: 264 },
    ],
    bima: [
      { name: 'Yusuf A.', avatar: 'https://ui-avatars.com/api/?name=Yusuf+A&background=f59e0b&color=fff&size=24', pct: 20, count: 180 },
      { name: 'Sarah K.', avatar: 'https://ui-avatars.com/api/?name=Sarah+K&background=ef4444&color=fff&size=24', pct: 25, count: 220 },
      { name: 'Rio D.', avatar: 'https://ui-avatars.com/api/?name=Rio+D&background=06b6d4&color=fff&size=24', pct: 23, count: 190 },
      { name: 'Mega W.', avatar: 'https://ui-avatars.com/api/?name=Mega+W&background=14b8a6&color=fff&size=24', pct: 32, count: 252 },
    ],
    dewi: [
      { name: 'Hendra S.', avatar: 'https://ui-avatars.com/api/?name=Hendra+S&background=6366f1&color=fff&size=24', pct: 27, count: 320 },
      { name: 'Kartika P.', avatar: 'https://ui-avatars.com/api/?name=Kartika+P&background=ec4899&color=fff&size=24', pct: 24, count: 280 },
      { name: 'Doni L.', avatar: 'https://ui-avatars.com/api/?name=Doni+L&background=10b981&color=fff&size=24', pct: 26, count: 310 },
      { name: 'Anita R.', avatar: 'https://ui-avatars.com/api/?name=Anita+R&background=f59e0b&color=fff&size=24', pct: 23, count: 263 },
    ],
  });

  const agentData = teamAgents[selectedTeam];

  // Calculate sum of Level 1 percentages for validation
  const totalAllocationPct = tlData.reduce((sum, item) => sum + item.pct, 0);
  const isValidAllocation = totalAllocationPct === 100;

  // Level 2 validation
  const totalAgentAllocationPct = agentData.reduce((sum, item) => sum + item.pct, 0);
  const isValidAgentAllocation = totalAgentAllocationPct === 100;

  // Handle Level 1 method swap
  const handleMethodChange = (value: 'proporsional' | 'rata' | 'manual') => {
    setDistMethod(value);
    if (value === 'rata') {
      setTlData([
        { name: 'TL Bima', pct: 25, count: 1052 },
        { name: 'TL Dewi', pct: 25, count: 1052 },
        { name: 'TL Fajar', pct: 25, count: 1053 },
        { name: 'TL Hani', pct: 25, count: 1053 },
      ]);
    } else if (value === 'proporsional') {
      setTlData(tlDistributionList);
    }
  };

  // Handle Level 2 method swap
  const handleAgentMethodChange = (value: 'proporsional' | 'rata' | 'manual') => {
    setAgentDistMethod(value);
    
    const teamTl = tlData.find(item => 
      (selectedTeam === 'fajar' && item.name.includes('Fajar')) ||
      (selectedTeam === 'bima' && item.name.includes('Bima')) ||
      (selectedTeam === 'dewi' && item.name.includes('Dewi'))
    );
    const totalTeamData = teamTl ? teamTl.count : 1052;

    if (value === 'rata') {
      const perAgentCount = Math.floor(totalTeamData / 4);
      const remainder = totalTeamData % 4;
      setTeamAgents(prev => ({
        ...prev,
        [selectedTeam]: prev[selectedTeam].map((agent, idx) => ({
          ...agent,
          pct: 25,
          count: idx === 0 ? perAgentCount + remainder : perAgentCount,
        }))
      }));
    } else if (value === 'proporsional') {
      const baseMapping = {
        fajar: [22, 25, 28, 25],
        bima: [20, 25, 23, 32],
        dewi: [27, 24, 26, 23]
      };
      const pcts = baseMapping[selectedTeam];
      setTeamAgents(prev => ({
        ...prev,
        [selectedTeam]: prev[selectedTeam].map((agent, idx) => ({
          ...agent,
          pct: pcts[idx],
          count: Math.round((pcts[idx] / 100) * totalTeamData)
        }))
      }));
    }
  };

  // Handle manual input in Level 1
  const handleManualPctChange = (index: number, valStr: string) => {
    const rawVal = valStr.replace('%', '');
    const numericVal = parseInt(rawVal) || 0;
    const clampedVal = Math.max(0, Math.min(100, numericVal));

    setTlData(prev => prev.map((item, idx) => {
      if (idx === index) {
        const totalData = 4210;
        const newCount = Math.round((clampedVal / 100) * totalData);
        return {
          ...item,
          pct: clampedVal,
          count: newCount,
        };
      }
      return item;
    }));
  };

  // Handle manual input in Level 2
  const handleAgentManualPctChange = (index: number, valStr: string) => {
    const rawVal = valStr.replace('%', '');
    const numericVal = parseInt(rawVal) || 0;
    const clampedVal = Math.max(0, Math.min(100, numericVal));

    const teamTl = tlData.find(item => 
      (selectedTeam === 'fajar' && item.name.includes('Fajar')) ||
      (selectedTeam === 'bima' && item.name.includes('Bima')) ||
      (selectedTeam === 'dewi' && item.name.includes('Dewi'))
    );
    const totalTeamData = teamTl ? teamTl.count : 1052;

    setTeamAgents(prev => ({
      ...prev,
      [selectedTeam]: prev[selectedTeam].map((agent, idx) => {
        if (idx === index) {
          return {
            ...agent,
            pct: clampedVal,
            count: Math.round((clampedVal / 100) * totalTeamData),
          };
        }
        return agent;
      })
    }));
  };

  // Trigger allocation execution simulation
  const handleExecuteAllocation = () => {
    if (!isValidAllocation) return;
    setExecuting(true);
    messageApi.open({
      type: 'loading',
      content: 'Mendistribusikan data ke masing-masing Team Leader...',
      duration: 1.2,
    });

    setTimeout(() => {
      setExecuting(false);
      messageApi.success(`Distribusi sukses! 4.210 data berhasil didistribusikan berdasarkan skema ${distMethod.toUpperCase()}.`);
    }, 1200);
  };

  // Trigger Level 2 allocation execution simulation
  const handleExecuteAgentAllocation = () => {
    if (!isValidAgentAllocation) return;
    setAgentExecuting(true);
    messageApi.open({
      type: 'loading',
      content: 'Mendistribusikan data ke masing-masing Agen...',
      duration: 1.2,
    });

    setTimeout(() => {
      setAgentExecuting(false);
      const teamTl = tlData.find(item => 
        (selectedTeam === 'fajar' && item.name.includes('Fajar')) ||
        (selectedTeam === 'bima' && item.name.includes('Bima')) ||
        (selectedTeam === 'dewi' && item.name.includes('Dewi'))
      );
      const totalTeamData = teamTl ? teamTl.count : 1052;
      messageApi.success(`Distribusi sukses! ${totalTeamData.toLocaleString('id-ID')} data berhasil didistribusikan ke tim agen.`);
    }, 1200);
  };

  // Filter Pool Data based on search query
  const filteredPoolData = poolData.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.phone.includes(searchQuery)
  );

  const poolColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => <span className="font-mono text-xs text-slate-400">{text}</span>,
    },
    {
      title: 'Nama Prospek',
      dataIndex: 'name',
      key: 'name',
      className: 'font-medium text-slate-800',
    },
    {
      title: 'Nomor Telepon',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Prioritas',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => {
        let color = priority === 'Tinggi' ? 'error' : 'processing';
        return <Tag color={color} className="uppercase tracking-wide font-bold text-[11px] m-0">{priority}</Tag>;
      },
    },
    {
      title: 'Status Assign',
      dataIndex: 'status',
      key: 'status',
      render: (status: any) => {
        if (status.type === 'antre') {
          return (
            <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium border border-amber-200 inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span> {status.text}
            </span>
          );
        }
        return (
          <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium border border-emerald-200 inline-flex items-center gap-1">
            <IconPhoneCalling size={10} /> {status.text}
          </span>
        );
      },
    },
    {
      title: 'Ubah Alokasi',
      key: 'action',
      render: (_: any, record: any) => {
        return (
          <Select
            size="small"
            style={{ width: 140 }}
            placeholder="Assign Agen"
            value={record.status.type === 'antre' ? record.status.text.replace('Antre (', '').replace(')', '') : undefined}
            onChange={(agentName: string) => {
              setPoolData(prev => prev.map(item => {
                if (item.key === record.key) {
                  return {
                    ...item,
                    status: { type: 'antre', text: `Antre (${agentName})` }
                  };
                }
                return item;
              }));
              messageApi.success(`Prospek ${record.name} dialokasikan ke ${agentName}.`);
            }}
            options={agentData.map(a => ({ value: a.name, label: a.name }))}
          />
        );
      }
    }
  ];

  if (!mounted) {
    return <div className="h-96 flex items-center justify-center"><Progress type="circle" percent={30} status="active" /></div>;
  }

  return (
    <div className="space-y-6">
      {contextHolder}
      
      {role === "Team Leader" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* TL Status / Info Panel */}
          <Card className="shadow-sm border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col justify-between h-full" styles={{ body: { display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', padding: '24px' } }}>
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Akses Team Leader</span>
                  <h3 className="text-lg font-bold text-slate-800 mt-2">Tim Budi Santoso</h3>
                  <p className="text-xs text-slate-500">Ringkasan alokasi data tim Anda</p>
                </div>
                <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-semibold border border-amber-200">Level 2</span>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                  <span className="text-xs text-slate-400 block font-medium">Data Diterima dari Supervisor</span>
                  <span className="text-2xl font-bold text-slate-800">1,052 <span className="text-xs font-semibold text-slate-500">data</span></span>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                  <span className="text-xs text-slate-400 block font-medium">Status Distribusi Agen</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                    <span className="text-xs font-bold text-slate-700">Belum Didistribusikan</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200/60 mt-6">
              <p className="text-xs text-slate-500 leading-relaxed">
                Sebagai Team Leader, Anda dapat mengatur metode pembagian data ke masing-masing agen di sebelah kanan. Pastikan total persentase pembagian mencapai 100% sebelum mengeksekusi distribusi data kerja.
              </p>
            </div>
          </Card>

          {/* Level 2 Panel for Team Leader */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm border-slate-200 flex flex-col h-full" styles={{ body: { padding: 0, flex: 1, display: 'flex', flexDirection: 'column' } }}>
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h3 className="text-base font-semibold text-slate-800">Alokasi Data ke Agen (TL &rarr; Agent)</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Atur porsi pembagian data kerja agen Anda</p>
                </div>
              </div>
              
              <div className="p-5 border-b border-slate-100 flex flex-col gap-3">
                <div className="flex flex-wrap gap-3 items-end w-full">
                  <div className="flex-1 min-w-[120px]">
                    <label className="block text-xs font-medium text-slate-500 mb-1">Metode Distribusi</label>
                    <Select
                      value={agentDistMethod}
                      onChange={handleAgentMethodChange}
                      className="w-full"
                      options={[
                        { value: 'proporsional', label: 'Distribusi Proporsional' },
                        { value: 'rata', label: 'Sama Rata' },
                        { value: 'manual', label: 'Manual Input' },
                      ]}
                    />
                  </div>
                  <Button
                    type="primary"
                    icon={<IconPlayerPlay size={16} />}
                    className="shadow-sm flex items-center bg-emerald-600 hover:bg-emerald-700 border-0 text-white"
                    onClick={handleExecuteAgentAllocation}
                    loading={agentExecuting}
                    disabled={!isValidAgentAllocation}
                  >
                    Eksekusi
                  </Button>
                </div>
                {!isValidAgentAllocation && (
                  <Alert
                    message={`Peringatan: Total alokasi saat ini ${totalAgentAllocationPct}%. Total alokasi harus tepat 100% untuk dieksekusi.`}
                    type="warning"
                    showIcon
                    className="text-xs p-2"
                  />
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-center space-y-5">
                {agentData.map((agent, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-28 text-sm font-medium text-slate-800 flex items-center gap-2">
                      <img src={agent.avatar} className="rounded-full w-6 h-6 object-cover" alt={agent.name} />
                      {agent.name}
                    </div>
                    <Input
                      value={`${agent.pct}%`}
                      onChange={(e) => handleAgentManualPctChange(i, e.target.value)}
                      disabled={agentDistMethod !== 'manual'}
                      className="w-16 text-center text-sm"
                    />
                    <div className="flex-1">
                      <Progress percent={agent.pct} strokeColor="#10b981" showInfo={false} size="small" />
                    </div>
                    <div className="w-16 text-right text-xs font-semibold text-slate-500">{agent.count} data</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      ) : (
        /* Original Supervisor layout with interactive Level 2 */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Level 1 */}
          <Card className="shadow-sm border-slate-200 flex flex-col h-full" styles={{ body: { padding: 0, flex: 1, display: 'flex', flexDirection: 'column' } }}>
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-base font-semibold text-slate-800">Distribusi Utama (Admin &rarr; TL)</h3>
                <p className="text-xs text-slate-500 mt-0.5">Alokasi pool data yang sudah valid</p>
              </div>
              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-semibold border border-purple-200">Level 1</span>
            </div>
            
            <div className="p-5 border-b border-slate-100 flex flex-col gap-3">
              <div className="flex flex-wrap gap-3 items-end w-full">
                <div className="flex-1 min-w-[120px]">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Metode</label>
                  <Select
                    value={distMethod}
                    onChange={handleMethodChange}
                    className="w-full"
                    options={[
                      { value: 'proporsional', label: 'Distribusi Proporsional' },
                      { value: 'rata', label: 'Sama Rata' },
                      { value: 'manual', label: 'Manual Input' },
                    ]}
                  />
                </div>
                <Button
                  type="primary"
                  icon={<IconPlayerPlay size={16} />}
                  className="shadow-sm flex items-center"
                  onClick={handleExecuteAllocation}
                  loading={executing}
                  disabled={!isValidAllocation}
                >
                  Eksekusi
                </Button>
              </div>
              {!isValidAllocation && (
                <Alert
                  message={`Peringatan: Total alokasi saat ini ${totalAllocationPct}%. Total alokasi harus tepat 100% untuk dieksekusi.`}
                  type="warning"
                  showIcon
                  className="text-xs p-2"
                />
              )}
            </div>

            <div className="p-5 flex-1 flex flex-col justify-center space-y-5">
              {tlData.map((tl, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-20 text-sm font-medium text-slate-800">{tl.name}</div>
                  <Input
                    value={`${tl.pct}%`}
                    onChange={(e) => handleManualPctChange(i, e.target.value)}
                    disabled={distMethod !== 'manual'}
                    className="w-16 text-center text-sm"
                  />
                  <div className="flex-1">
                    <Progress percent={tl.pct} showInfo={false} size="small" />
                  </div>
                  <div className="w-16 text-right text-xs font-semibold text-slate-500">{tl.count} data</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Level 2 */}
          <Card className="shadow-sm border-slate-200 flex flex-col h-full" styles={{ body: { padding: 0, flex: 1, display: 'flex', flexDirection: 'column' } }}>
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-base font-semibold text-slate-800">Distribusi Mikro (TL &rarr; Agent)</h3>
                <p className="text-xs text-slate-500 mt-0.5">Atur pembagian kerja agen per tim</p>
              </div>
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-semibold border border-emerald-200">Level 2</span>
            </div>
            
            <div className="p-5 border-b border-slate-100 flex flex-col gap-3">
              <div className="flex flex-wrap gap-3 items-end w-full">
                <div className="flex-1 min-w-[120px]">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Pilih Tim</label>
                  <Select
                    value={selectedTeam}
                    onChange={(val: any) => setSelectedTeam(val)}
                    className="w-full mb-2"
                    options={[
                      { value: 'fajar', label: 'Tim Fajar' },
                      { value: 'bima', label: 'Tim Bima' },
                      { value: 'dewi', label: 'Tim Dewi' },
                    ]}
                  />
                </div>
                <div className="flex-1 min-w-[120px]">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Metode</label>
                  <Select
                    value={agentDistMethod}
                    onChange={handleAgentMethodChange}
                    className="w-full"
                    options={[
                      { value: 'proporsional', label: 'Distribusi Proporsional' },
                      { value: 'rata', label: 'Sama Rata' },
                      { value: 'manual', label: 'Manual Input' },
                    ]}
                  />
                </div>
                <Button
                  type="primary"
                  icon={<IconPlayerPlay size={16} />}
                  className="shadow-sm flex items-center bg-emerald-600 hover:bg-emerald-700 border-0 text-white"
                  onClick={handleExecuteAgentAllocation}
                  loading={agentExecuting}
                  disabled={!isValidAgentAllocation}
                >
                  Eksekusi
                </Button>
              </div>
              {!isValidAgentAllocation && (
                <Alert
                  message={`Peringatan: Total alokasi saat ini ${totalAgentAllocationPct}%. Total alokasi harus tepat 100% untuk dieksekusi.`}
                  type="warning"
                  showIcon
                  className="text-xs p-2"
                />
              )}
            </div>

            <div className="p-5 flex-1 flex flex-col justify-center space-y-5">
              {agentData.map((agent, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-28 text-sm font-medium text-slate-800 flex items-center gap-2">
                    <img src={agent.avatar} className="rounded-full w-6 h-6 object-cover" alt={agent.name} />
                    {agent.name}
                  </div>
                  <Input
                    value={`${agent.pct}%`}
                    onChange={(e) => handleAgentManualPctChange(i, e.target.value)}
                    disabled={agentDistMethod !== 'manual'}
                    className="w-16 text-center text-sm"
                  />
                  <div className="flex-1">
                    <Progress percent={agent.pct} strokeColor="#10b981" showInfo={false} size="small" />
                  </div>
                  <div className="w-16 text-right text-xs font-semibold text-slate-500">{agent.count} data</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Ready Pool Table */}
      <Card className="shadow-sm border-slate-200" styles={{ body: { padding: 0 } }}>
        <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <div className="flex w-full">
            <h3 className="text-base font-semibold text-slate-800">
              {role === "Team Leader" ? "Daftar Antrean Tim (Ready Pool)" : "Antrean Utama (Ready Pool)"}
            </h3>
          </div>
          <Input
            prefix={<IconSearch size={16} className="text-slate-400" />}
            placeholder="Cari prospek..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
        </div>
        <Table columns={poolColumns} dataSource={filteredPoolData} pagination={false} />
      </Card>
    </div>
  );
}
