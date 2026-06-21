"use client";

import { useState } from "react";
import { Card, Row, Col, Progress, Tag, Button, Checkbox, Slider, Table, message, Spin } from "antd";
import { 
  IconArchive, 
  IconCloudUpload, 
  IconDatabase, 
  IconShieldCheck, 
  IconDownload,
  IconRefresh,
  IconCheck,
  IconCpu
} from "@tabler/icons-react";

export default function Archiving() {
  const [messageApi, contextHolder] = message.useMessage();

  // Settings states
  const [dbRetention, setDbRetention] = useState(90);
  const [audioRetention, setAudioRetention] = useState(30);
  const [backupDestinations, setBackupDestinations] = useState<string[]>(["s3", "nas"]);

  // Archiving progress simulation states
  const [isArchiving, setIsArchiving] = useState(false);
  const [archiveProgress, setArchiveProgress] = useState(0);

  // Verification loading states mapped by row key
  const [verifyingKeys, setVerifyingKeys] = useState<{ [key: string]: boolean }>({});

  // Archive Logs Mock Data State
  const [archiveLogs, setArchiveLogs] = useState([
    { key: "1", id: "ARC-2026-001", period: "01 Mei 2026 - 31 Mei 2026", size: "342.5 GB", target: "AWS S3, NAS Lokal", status: "Archived" },
    { key: "2", id: "ARC-2026-002", period: "01 Apr 2026 - 30 Apr 2026", size: "298.1 GB", target: "AWS S3, NAS Lokal", status: "Archived" },
    { key: "3", id: "ARC-2026-003", period: "01 Mar 2026 - 31 Mar 2026", size: "412.0 GB", target: "AWS S3, NAS Lokal", status: "Archived" },
    { key: "4", id: "ARC-2026-004", period: "01 Feb 2026 - 28 Feb 2026", size: "389.4 GB", target: "AWS S3", status: "Archived" }
  ]);

  // Trigger manual archiving with progress bar
  const handleStartArchiving = () => {
    if (isArchiving) return;
    setIsArchiving(true);
    setArchiveProgress(0);

    const interval = setInterval(() => {
      setArchiveProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsArchiving(false);
            // Append new archive log
            const newArchive = {
              key: (archiveLogs.length + 1).toString(),
              id: `ARC-2026-00${archiveLogs.length + 1}`,
              period: "01 Jun 2026 - 15 Jun 2026 (Kini)",
              size: "142.8 GB",
              target: backupDestinations.map(d => d === "s3" ? "AWS S3" : d === "gcs" ? "Google Cloud" : d === "nas" ? "NAS Lokal" : "FTP Server").join(", "),
              status: "Archived"
            };
            setArchiveLogs([newArchive, ...archiveLogs]);
            messageApi.success("Proses pengarsipan log & audio selesai! Backup sukses terkirim ke penyimpanan tujuan.");
          }, 500);
          return 100;
        }
        return prev + 20;
      });
    }, 300);
  };

  // Integrity Check simulation per row
  const handleVerifyIntegrity = (key: string, id: string) => {
    setVerifyingKeys(prev => ({ ...prev, [key]: true }));

    setTimeout(() => {
      setVerifyingKeys(prev => ({ ...prev, [key]: false }));
      setArchiveLogs(prev => prev.map(log => {
        if (log.key === key) {
          return { ...log, status: "Integrity Verified" };
        }
        return log;
      }));
      messageApi.success(`Integritas Checksum SHA-256 OK untuk berkas ${id}. File utuh tanpa kerusakan.`);
    }, 1200);
  };

  const handleDownload = (id: string) => {
    messageApi.info(`Mengunduh index file arsip ${id}...`);
  };

  const columns = [
    {
      title: 'ID Arsip',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => <span className="font-mono text-xs font-semibold text-slate-500">{text}</span>
    },
    {
      title: 'Periode Log',
      dataIndex: 'period',
      key: 'period',
    },
    {
      title: 'Ukuran Kompresi',
      dataIndex: 'size',
      key: 'size',
      render: (text: string) => <span className="font-semibold text-slate-700 text-xs">{text}</span>
    },
    {
      title: 'Penyimpanan Tujuan',
      dataIndex: 'target',
      key: 'target',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = "blue";
        if (status === "Integrity Verified") color = "success";
        return <Tag color={color} className="rounded font-bold border-0 text-[10px]">{status.toUpperCase()}</Tag>;
      }
    },
    {
      title: 'Aksi',
      key: 'actions',
      render: (_: any, record: any) => {
        const isVerifying = verifyingKeys[record.key];
        return (
          <div className="flex gap-2">
            <Button
              size="small"
              icon={<IconDownload size={12} />}
              onClick={() => handleDownload(record.id)}
              className="text-xs border-slate-200 text-slate-600 hover:text-slate-800"
            >
              Unduh
            </Button>
            <Button
              size="small"
              type={record.status === "Integrity Verified" ? "default" : "primary"}
              icon={isVerifying ? <Spin size="small" /> : <IconShieldCheck size={12} />}
              onClick={() => handleVerifyIntegrity(record.key, record.id)}
              disabled={isVerifying}
              className={`text-xs flex items-center justify-center ${record.status === "Integrity Verified" ? "text-emerald-600 border-emerald-200" : "bg-blue-600 hover:bg-blue-500 border-0"}`}
            >
              {isVerifying ? "Verifying..." : record.status === "Integrity Verified" ? "Terverifikasi" : "Verifikasi"}
            </Button>
          </div>
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
            <IconArchive className="text-slate-600" size={24} />
            Sistem Pengarsipan Log & Audio Recorder
          </h2>
          <p className="text-slate-500 text-xs mt-1 m-0">
            Kelola retensi penyimpanan database, kompresi rekaman suara panggilan agen, serta sinkronisasi backup ke server cloud eksternal.
          </p>
        </div>
      </div>

      {/* Grid Metrik Pengarsipan */}
      <Row gutter={[20, 20]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm border-slate-200" styles={{ body: { padding: '16px 20px' } }}>
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-1">Total Penyimpanan Hemat</span>
            <h3 className="text-2xl font-bold text-emerald-600 m-0">1.44 TB Saved</h3>
            <span className="text-[11px] text-slate-400 block mt-1">Menggunakan kompresi codec Opus</span>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm border-slate-200" styles={{ body: { padding: '16px 20px' } }}>
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-1">Last Backup Sync</span>
            <h3 className="text-2xl font-bold text-slate-800 m-0">Hari ini, 04:00</h3>
            <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-0.5 mt-1">
              <IconCheck size={12} /> Sync Otomatis Sukses
            </span>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm border-slate-200" styles={{ body: { padding: '16px 20px' } }}>
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-1">File Audio Terkompresi</span>
            <h3 className="text-2xl font-bold text-slate-800 m-0">14,204 Berkas</h3>
            <div className="mt-2">
              <Progress percent={92} size="small" strokeColor="#475569" showInfo={false} />
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm border-slate-200" styles={{ body: { padding: '16px 20px' } }}>
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-1">Status Keamanan Arsip</span>
            <h3 className="text-2xl font-bold text-slate-800 m-0">Enkripsi AES-256</h3>
            <span className="text-[11px] text-slate-400 block mt-1">Standard industri telekomunikasi</span>
          </Card>
        </Col>
      </Row>

      {/* Retention Config and Target Storage Card */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card className="shadow-sm border-slate-200 h-full" title="Konfigurasi Aturan Retensi Data">
            <div className="flex flex-col gap-6">
              {/* Database retention */}
              <div>
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <IconDatabase size={16} className="text-blue-500" />
                    Batas Retensi Log Database
                  </span>
                  <span className="font-bold text-blue-600">{dbRetention} Hari</span>
                </div>
                <p className="text-[11px] text-slate-400 mb-2">Semua riwayat data log telemarketing akan otomatis dihapus jika melebihi batas waktu ini.</p>
                <Slider 
                  min={30} 
                  max={365} 
                  step={30}
                  value={dbRetention} 
                  onChange={val => setDbRetention(val)} 
                />
              </div>

              {/* Audio retention */}
              <div>
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <IconCpu size={16} className="text-purple-500" />
                    Batas Retensi Rekaman Suara (Audio)
                  </span>
                  <span className="font-bold text-purple-600">{audioRetention} Hari</span>
                </div>
                <p className="text-[11px] text-slate-400 mb-2">Berkas suara asli panggilan telepon agen akan dihapus, menyisakan transkripsi teks demi hemat ruang disk.</p>
                <Slider 
                  min={7} 
                  max={180} 
                  step={7}
                  value={audioRetention} 
                  onChange={val => setAudioRetention(val)} 
                />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card className="shadow-sm border-slate-200 h-full" title="Tujuan & Trigger Backup">
            <div className="flex flex-col gap-5">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Pilih Cloud Storage Tujuan</span>
                <Checkbox.Group 
                  value={backupDestinations} 
                  onChange={checkedValues => setBackupDestinations(checkedValues as string[])}
                  className="flex flex-col gap-2 text-xs font-medium text-slate-700"
                >
                  <Checkbox value="s3">Amazon AWS S3 Bucket (Primary Cloud)</Checkbox>
                  <Checkbox value="gcs">Google Cloud Storage Bucket (Secondary Cloud)</Checkbox>
                  <Checkbox value="nas">NAS Network Storage (Internal Corporate Server)</Checkbox>
                </Checkbox.Group>
              </div>

              <hr className="border-slate-100 my-1" />

              <div className="flex flex-col gap-3">
                <Button 
                  size="large" 
                  type="primary"
                  icon={<IconCloudUpload size={18} />}
                  onClick={handleStartArchiving}
                  disabled={isArchiving || backupDestinations.length === 0}
                  className="bg-slate-800 hover:bg-slate-700 border-0 flex items-center justify-center rounded-xl h-12"
                >
                  {isArchiving ? "Sedang Mengompres & Backup..." : "Mulai Pengarsipan Manual"}
                </Button>

                {isArchiving && (
                  <div className="flex flex-col gap-1.5 mt-1">
                    <div className="flex justify-between items-center text-xs font-medium text-slate-500">
                      <span>Proses Pengarsipan Kompresi File...</span>
                      <span>{archiveProgress}%</span>
                    </div>
                    <Progress percent={archiveProgress} showInfo={false} strokeColor="#1e293b" className="m-0" />
                  </div>
                )}
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Historical Archiving Logs */}
      <Card className="shadow-sm border-slate-200" title="Log Historis Pengarsipan Berkala">
        <Table columns={columns} dataSource={archiveLogs} pagination={false} size="middle" className="custom-table" />
      </Card>
    </div>
  );
}
