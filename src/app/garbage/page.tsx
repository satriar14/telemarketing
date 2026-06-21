"use client";

import { useState } from "react";
import { Card, Row, Col, Progress, Tag, Button, Input, Select, Table, Slider, message, Form } from "antd";
import { 
  IconRecycle, 
  IconBrandWhatsapp, 
  IconClock, 
  IconSend, 
  IconSparkles,
  IconAlertTriangle,
  IconCheck
} from "@tabler/icons-react";

const { TextArea } = Input;
const { Option } = Select;

// Templates Mock Data
const templates = {
  promo: "Halo Bapak/Ibu {name},\n\nKami mengerti kesibukan Anda saat kami hubungi sebelumnya. Dapatkan penawaran eksklusif DISKON {discount}% dari Asuransi Prima khusus hari ini.\n\nBalas pesan ini untuk terhubung dengan agen kami.",
  reschedule: "Selamat siang Kak {name},\n\nKami dari tim telemarketing Asuransi Prima ingin mengonfirmasi jadwal panggilan ulang pada {datetime} untuk menjelaskan detail program proteksi kesehatan Anda.\n\nApakah waktu tersebut sesuai bagi Kakak?",
  survey: "Halo Kak {name},\n\nTerima kasih telah menerima panggilan singkat kami tadi. Untuk meningkatkan pelayanan kami, bolehkah kami tahu alasan utama Kakak menolak penawaran kami?\n\nBalas '1' jika sudah punya asuransi lain, '2' jika premi terlalu mahal."
};

export default function GarbageTask() {
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedTemplateKey, setSelectedTemplateKey] = useState<"promo" | "reschedule" | "survey">("promo");
  
  // Custom template placeholders
  const [custName, setCustName] = useState("Ahmad");
  const [discountValue, setDiscountValue] = useState("20");
  const [scheduleTime, setScheduleTime] = useState("Besok jam 10:00");
  const [delayHours, setDelayHours] = useState(4);

  // Dynamic template string compiler
  const getCompiledMessage = () => {
    let msg = templates[selectedTemplateKey];
    msg = msg.replace(/{name}/g, custName);
    msg = msg.replace(/{discount}/g, discountValue);
    msg = msg.replace(/{datetime}/g, scheduleTime);
    return msg;
  };

  // State log recovery tasks
  const [recoveryTasks, setRecoveryTasks] = useState([
    { key: "1", id: "#GB-301", name: "Bambang Pamungkas", reason: "Tidak Diangkat", action: "WhatsApp Blast", time: "Hari ini, 15:30", status: "Scheduled" },
    { key: "2", id: "#GB-302", name: "Luna Maya", reason: "Sibuk / Meeting", action: "Reschedule Telepon", time: "Hari ini, 16:45", status: "Scheduled" },
    { key: "3", id: "#GB-303", name: "Deddy Corbuzier", reason: "Menolak (Harga)", action: "WhatsApp Promo", time: "Besok, 10:00", status: "Scheduled" },
    { key: "4", id: "#GB-304", name: "Sule Sutisna", reason: "Salah Sambung", action: "Hapus Lead", time: "Selesai", status: "Excluded" }
  ]);

  const [isSending, setIsSending] = useState(false);

  // Trigger Immediate Run for a scheduler row
  const handleRunNow = (key: string, name: string) => {
    messageApi.open({
      type: "loading",
      content: `Mengirimkan pesan pemulihan untuk ${name}...`,
      duration: 1.0
    });

    setTimeout(() => {
      setRecoveryTasks(prev => prev.map(task => {
        if (task.key === key) {
          return { ...task, status: "Sent", time: "Baru saja" };
        }
        return task;
      }));
      messageApi.success(`WhatsApp pemulihan sukses dikirimkan ke ${name}!`);
    }, 1000);
  };

  // Simulate Bulk WA Blast
  const handleBulkBlast = () => {
    setIsSending(true);
    messageApi.open({
      type: "loading",
      content: "Memproses WhatsApp Blast Ke Seluruh Kontak Gagal...",
      duration: 1.5
    });

    setTimeout(() => {
      setIsSending(false);
      setRecoveryTasks(prev => prev.map(t => t.status === "Scheduled" ? { ...t, status: "Sent", time: "Baru saja" } : t));
      messageApi.success("WhatsApp Blast sukses terkirim ke 14 leads gagal!");
    }, 1500);
  };

  // Table Columns
  const columns = [
    {
      title: 'Prospek ID',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => <span className="font-mono text-xs font-semibold text-slate-500">{text}</span>
    },
    {
      title: 'Nama Prospek',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span className="font-semibold text-slate-800 text-sm">{text}</span>
    },
    {
      title: 'Alasan Gagal',
      dataIndex: 'reason',
      key: 'reason',
      render: (text: string) => {
        let color = "orange";
        if (text.includes("Menolak")) color = "red";
        if (text.includes("Salah")) color = "default";
        return <Tag color={color} className="rounded border-0 text-xs font-medium">{text}</Tag>;
      }
    },
    {
      title: 'Rencana Solusi',
      dataIndex: 'action',
      key: 'action',
    },
    {
      title: 'Waktu Jadwal',
      dataIndex: 'time',
      key: 'time',
      render: (text: string) => <span className="text-xs text-slate-500 font-medium">{text}</span>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text: string) => {
        let color = "processing";
        if (text === "Sent") color = "success";
        if (text === "Excluded") color = "default";
        return <Tag color={color} className="rounded font-bold border-0 text-[10px]">{text.toUpperCase()}</Tag>;
      }
    },
    {
      title: 'Aksi',
      key: 'actions',
      render: (_: any, record: any) => {
        if (record.status !== "Scheduled") return <span className="text-slate-300">—</span>;
        return (
          <Button 
            size="small" 
            type="primary"
            icon={<IconCheck size={12} />}
            onClick={() => handleRunNow(record.key, record.name)}
            className="bg-emerald-600 hover:bg-emerald-500 border-0 text-xs flex items-center justify-center"
          >
            Jalankan
          </Button>
        );
      }
    }
  ];

  return (
    <div className="flex flex-col gap-6">
      {contextHolder}

      {/* Header Halaman */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 m-0">
            <IconRecycle className="text-amber-500 animate-spin" style={{ animationDuration: '6s' }} size={24} />
            Manajemen Garbage Task & Leads Recovery
          </h2>
          <p className="text-slate-500 text-xs mt-1 m-0">
            Penyaringan kembali leads gagal (tidak diangkat/menolak) untuk di-follow up otomatis menggunakan template WhatsApp dan penjadwalan pintar.
          </p>
        </div>
        <Button 
          icon={<IconSend size={16} />} 
          type="primary" 
          onClick={handleBulkBlast}
          loading={isSending}
          className="bg-amber-600 hover:bg-amber-500 border-0 flex items-center gap-1.5"
        >
          Blast WA Pemulihan
        </Button>
      </div>

      {/* Grid Metrik Pemulihan */}
      <Row gutter={[20, 20]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm border-slate-200" styles={{ body: { padding: '16px 20px' } }}>
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-1">Total Leads Gagal</span>
            <h3 className="text-2xl font-bold text-slate-800 m-0">1,248 Data</h3>
            <span className="text-[11px] text-red-500 font-semibold block mt-1">Perlu Tindak Lanjut</span>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm border-slate-200" styles={{ body: { padding: '16px 20px' } }}>
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-1">Dihubungi via WA</span>
            <h3 className="text-2xl font-bold text-slate-800 m-0">842 Blast</h3>
            <div className="mt-2">
              <Progress percent={67} size="small" strokeColor="#eab308" showInfo={false} />
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm border-slate-200" styles={{ body: { padding: '16px 20px' } }}>
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-1">Berhasil Di-recover</span>
            <h3 className="text-2xl font-bold text-slate-800 m-0">312 Leads</h3>
            <div className="mt-2">
              <Progress percent={25} size="small" strokeColor="#10b981" showInfo={false} />
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm border-slate-200" styles={{ body: { padding: '16px 20px' } }}>
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-1">Eskalasi Ditolak SOP</span>
            <h3 className="text-2xl font-bold text-slate-800 m-0">94 Leads</h3>
            <span className="text-[11px] text-slate-400 block mt-1">Dialihkan ke penawaran murah</span>
          </Card>
        </Col>
      </Row>

      {/* Content Layout Split */}
      <Row gutter={[24, 24]}>
        {/* Editor Template WhatsApp */}
        <Col xs={24} lg={14}>
          <Card className="shadow-sm border-slate-200 h-full" title="WhatsApp Follow-up Template Editor">
            <Form layout="vertical" className="flex flex-col gap-4">
              <Form.Item label="Pilih Jenis Template Respon" className="mb-0">
                <Select 
                  value={selectedTemplateKey} 
                  onChange={(val: any) => setSelectedTemplateKey(val)}
                  size="large"
                >
                  <Option value="promo">Penawaran Khusus (Discount Blast)</Option>
                  <Option value="reschedule">Penjadwalan Panggilan Ulang (Reschedule)</Option>
                  <Option value="survey">Kuesioner Alasan Penolakan (Survey)</Option>
                </Select>
              </Form.Item>

              {/* Dynamic Inputs depending on template */}
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Variabel Nama Prospek" className="mb-0">
                    <Input value={custName} onChange={e => setCustName(e.target.value)} />
                  </Form.Item>
                </Col>

                {selectedTemplateKey === "promo" && (
                  <Col span={12}>
                    <Form.Item label="Variabel Diskon (%)" className="mb-0">
                      <Input value={discountValue} onChange={e => setDiscountValue(e.target.value)} />
                    </Form.Item>
                  </Col>
                )}

                {selectedTemplateKey === "reschedule" && (
                  <Col span={12}>
                    <Form.Item label="Variabel Waktu & Tanggal" className="mb-0">
                      <Input value={scheduleTime} onChange={e => setScheduleTime(e.target.value)} />
                    </Form.Item>
                  </Col>
                )}
              </Row>

              <Form.Item label="Draf Isi Pesan WhatsApp" className="mb-0">
                <TextArea 
                  value={getCompiledMessage()} 
                  rows={6} 
                  disabled 
                  className="bg-slate-50 font-mono text-xs text-slate-600 border-slate-200 cursor-default"
                />
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {/* WhatsApp Mobile Device Mockup Simulator */}
        <Col xs={24} lg={10}>
          <Card className="shadow-sm border-slate-200 h-full" title="Visual Live Preview Chat (Simulasi)">
            <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200/80 flex flex-col items-center justify-center">
              {/* Mobile phone container */}
              <div className="w-full max-w-[280px] bg-slate-900 rounded-[36px] p-3 shadow-lg border-4 border-slate-800">
                {/* Screen area */}
                <div className="bg-[#efeae2] rounded-[24px] overflow-hidden min-h-[380px] flex flex-col justify-between">
                  {/* WhatsApp header */}
                  <div className="bg-[#075e54] text-white p-3 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-700 flex items-center justify-center text-[10px] font-bold">
                      AP
                    </div>
                    <div>
                      <span className="font-bold text-xs block leading-tight">Asuransi Prima</span>
                      <span className="text-[8px] text-slate-300 block">Online</span>
                    </div>
                  </div>

                  {/* WhatsApp message body */}
                  <div className="p-3 flex-grow flex flex-col justify-end">
                    <div className="bg-white text-slate-800 text-[11px] p-2.5 rounded-xl rounded-tr-none shadow-sm max-w-[90%] self-end leading-relaxed relative border border-slate-200">
                      <p className="m-0 whitespace-pre-wrap">{getCompiledMessage()}</p>
                      <span className="text-[8px] text-slate-400 block text-right mt-1 font-mono">14:02 ✓✓</span>
                    </div>
                  </div>

                  {/* WhatsApp bottom input */}
                  <div className="bg-white p-2 flex items-center justify-between border-t border-slate-200/60">
                    <span className="text-[10px] text-slate-400 pl-1">Balas pesan...</span>
                    <IconBrandWhatsapp size={16} className="text-emerald-500 mr-1" />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Recovery Scheduler Table */}
      <Card 
        className="shadow-sm border-slate-200" 
        title="Jadwal Otomasi Recovery & Eskalasi"
        extra={
          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-400 font-medium">Atur Jeda Pemulihan Blast:</span>
            <Slider 
              min={1} 
              max={24} 
              value={delayHours} 
              onChange={val => setDelayHours(val)}
              className="w-36 m-0" 
            />
            <span className="font-semibold text-slate-700">{delayHours} Jam</span>
          </div>
        }
      >
        <Table columns={columns} dataSource={recoveryTasks} pagination={false} size="middle" className="custom-table" />
      </Card>
    </div>
  );
}
