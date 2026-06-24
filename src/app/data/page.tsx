"use client";

import { useState } from "react";
import { 
  Card, 
  Tabs, 
  Upload, 
  Table, 
  Tag, 
  Button, 
  message, 
  Row, 
  Col, 
  List,
  Select
} from "antd";
import { 
  IconCloudUpload, 
  IconFileSpreadsheet, 
  IconFileText, 
  IconFilter, 
  IconRefresh 
} from "@tabler/icons-react";
import { initialIngestedFiles } from "@/data/mockData";

const { Dragger } = Upload;

export default function DataIngestion() {
  const [messageApi, contextHolder] = message.useMessage();
  const [syncing, setSyncing] = useState(false);
  const [checkingKeys, setCheckingKeys] = useState<string[]>([]);
  const [bulkChecking, setBulkChecking] = useState(false);
  const [logFilter, setLogFilter] = useState<'all' | 'Aktif' | 'Tidak Aktif'>('all');
  
  const [tableData, setTableData] = useState(initialIngestedFiles);

  // Phone active validation logs state
  const [validationLogs, setValidationLogs] = useState([
    { key: '1', timestamp: '10:05:12', name: 'Ahmad Fauzi', phone: '0812-3456-7890', provider: 'Telkomsel', status: 'Aktif', detail: 'WA Terdaftar & Jaringan Aktif (HLR Success)' },
    { key: '2', timestamp: '10:05:10', name: 'Lestari Wulan', phone: '0856-9876-5432', provider: 'Indosat', status: 'Aktif', detail: 'WA Terdaftar & Jaringan Aktif (HLR Success)' },
    { key: '3', timestamp: '10:05:08', name: 'Hendro Saputro', phone: '0819-1122-3344', provider: 'XL Axiata', status: 'Tidak Aktif', detail: 'HLR Unreachable (Sinyal Mati/Tidak Aktif)' },
    { key: '4', timestamp: '09:32:44', name: 'Siti Nuraini', phone: '0821-2233-4455', provider: 'Telkomsel', status: 'Aktif', detail: 'WA Terdaftar & Jaringan Aktif (HLR Success)' },
    { key: '5', timestamp: '09:32:40', name: 'Budi Wahyudi', phone: '0813-9988-7766', provider: 'Telkomsel', status: 'Tidak Aktif', detail: 'Nomor Tidak Terdaftar (HLR Lookup Failed)' },
  ]);

  // Single row status check simulation
  const handleSingleCheck = (record: any) => {
    setCheckingKeys(prev => [...prev, record.key]);
    messageApi.open({
      type: 'loading',
      content: `Memeriksa status nomor ${record.name}...`,
      duration: 1.0,
    });

    setTimeout(() => {
      setCheckingKeys(prev => prev.filter(k => k !== record.key));
      
      setValidationLogs(prev => prev.map(item => {
        if (item.key === record.key) {
          const newStatus = Math.random() > 0.2 ? 'Aktif' : 'Tidak Aktif';
          const newDetail = newStatus === 'Aktif' 
            ? 'WA Terdaftar & Jaringan Aktif (Manual Verification Success)' 
            : 'HLR Unreachable (Manual Verification: Sinyal Mati)';
          
          messageApi.open({
            type: newStatus === 'Aktif' ? 'success' : 'error',
            content: `Hasil cek ${record.name}: Nomor ${newStatus.toUpperCase()}`,
          });

          return {
            ...item,
            status: newStatus,
            detail: newDetail,
          };
        }
        return item;
      }));
    }, 1000);
  };

  // Bulk check all numbers simulation
  const handleBulkCheck = () => {
    setBulkChecking(true);
    messageApi.open({
      type: 'loading',
      content: 'Melakukan ping keaktifan seluruh nomor prospek...',
      duration: 1.5,
    });

    setTimeout(() => {
      setBulkChecking(false);
      
      setValidationLogs(prev => prev.map(item => {
        const checkedStatus = Math.random() > 0.15 ? 'Aktif' : 'Tidak Aktif';
        return {
          ...item,
          status: checkedStatus,
          detail: checkedStatus === 'Aktif' 
            ? 'WA Terdaftar & Jaringan Aktif (Bulk Verification)' 
            : 'Nomor Inaktif / HLR mati (Bulk Verification)'
        };
      }));

      messageApi.success('Verifikasi massal selesai! Seluruh nomor prospek telah diperiksa.');
    }, 1500);
  };

  // Custom File Uploader logic to simulate pipeline ingestion & phone check
  const handleCustomUpload = ({ file, onSuccess, onProgress }: any) => {
    let percent = 0;
    const interval = setInterval(() => {
      percent += 25;
      onProgress({ percent });
      if (percent >= 100) {
        clearInterval(interval);
        onSuccess("ok");
        
        const fileType = file.name.endsWith('.csv') ? 'csv' : 'excel';
        const randomRows = Math.floor(Math.random() * 2500) + 150;
        const errorLines = Math.floor(Math.random() * 8) + 1;
        const hasError = Math.random() > 0.7;
        const status = !hasError ? 'Lolos Validasi' : `${errorLines} Baris Error`;

        setTableData(prev => [
          {
            key: String(prev.length + 1),
            name: file.name,
            type: fileType,
            rows: randomRows.toLocaleString('id-ID'),
            status: status,
            time: 'Hari ini, Baru saja',
          },
          ...prev,
        ]);

        // Dynamically add phone verification logs from the uploaded file
        const currentTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const uploadedLogs = [
          {
            key: `u1-${Date.now()}`,
            timestamp: currentTime,
            name: 'Dian Sastrowardoyo',
            phone: '0811-7788-9900',
            provider: 'Telkomsel',
            status: 'Aktif',
            detail: `Terverifikasi dari upload ${file.name}`
          },
          {
            key: `u2-${Date.now()}`,
            timestamp: currentTime,
            name: 'Tora Sudiro',
            phone: '0878-1122-3344',
            provider: 'XL Axiata',
            status: 'Tidak Aktif',
            detail: `Nomor tidak aktif / HLR mati (${file.name})`
          }
        ];
        
        setValidationLogs(prev => [...uploadedLogs, ...prev]);

        if (!hasError) {
          messageApi.success(`File ${file.name} berhasil diunggah! Terbaca ${randomRows} nomor prospek.`);
        } else {
          messageApi.warning(`File ${file.name} diunggah. Terdapat nomor tidak aktif terdeteksi (cek Log Validasi).`);
        }
      }
    }, 200);
  };

  const uploadProps = {
    name: 'file',
    multiple: false,
    customRequest: handleCustomUpload,
    showUploadList: true,
  };

  const columns = [
    {
      title: 'Nama File',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <div className="flex items-center gap-2 font-medium text-slate-800">
          {record.type === 'excel' ? <IconFileSpreadsheet className="text-emerald-500" size={18} /> : <IconFileText className="text-blue-500" size={18} />}
          {text}
        </div>
      ),
    },
    {
      title: 'Jumlah Baris',
      dataIndex: 'rows',
      key: 'rows',
    },
    {
      title: 'Status Validasi',
      key: 'status',
      dataIndex: 'status',
      render: (status: string) => {
        let color = status === 'Lolos Validasi' ? 'success' : 'warning';
        return <Tag color={color} className="rounded font-medium">{status}</Tag>;
      },
    },
    {
      title: 'Waktu Upload',
      dataIndex: 'time',
      key: 'time',
    },
  ];

  const handleSync = () => {
    setSyncing(true);
    messageApi.open({
      type: 'loading',
      content: 'Sinkronisasi data prospek dengan server sedang berlangsung...',
      duration: 1.5,
    });

    setTimeout(() => {
      setSyncing(false);
      
      const alreadySynced = tableData.some(item => item.key === '4');
      if (!alreadySynced) {
        setTableData(prev => [
          {
            key: '4',
            name: 'api_sync_prospek_auto.xlsx',
            type: 'excel',
            rows: '1,250',
            status: 'Lolos Validasi',
            time: 'Hari ini, Baru saja',
          },
          ...prev,
        ]);

        // Dynamically add phone verification logs from the API Sync
        const currentTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const syncedLogs = [
          {
            key: `s1-${Date.now()}`,
            timestamp: currentTime,
            name: 'Gading Marten',
            phone: '0812-4455-6677',
            provider: 'Telkomsel',
            status: 'Aktif',
            detail: 'Sync API Sukses: WA Terdaftar & Ping Sukses'
          },
          {
            key: `s2-${Date.now()}`,
            timestamp: currentTime,
            name: 'Luna Maya',
            phone: '0857-9988-1122',
            provider: 'Indosat',
            status: 'Aktif',
            detail: 'Sync API Sukses: WA Terdaftar & Ping Sukses'
          }
        ];

        setValidationLogs(prev => [...syncedLogs, ...prev]);
        messageApi.success('Sinkronisasi selesai! 1.250 prospek baru berhasil di-sync & divalidasi keaktifannya.');
      } else {
        messageApi.success('Sinkronisasi selesai! Semua data prospek sudah mutakhir.');
      }
    }, 1500);
  };

  const uploadTab = (
    <div className="space-y-6">
      <Card className="shadow-sm border-slate-200">
        <h3 className="text-base font-semibold text-slate-800 mb-4">Unggah Data Prospek Baru</h3>
        <Dragger {...uploadProps} className="bg-slate-50 hover:bg-slate-100 p-8 rounded-xl border-dashed">
          <div className="ant-upload-drag-icon flex justify-center mb-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
              <IconCloudUpload className="text-blue-500" size={32} />
            </div>
          </div>
          <p className="ant-upload-text text-slate-800 font-medium mb-1">Seret dan lepas file ke area ini, atau klik untuk menelusuri</p>
          <p className="ant-upload-hint text-sm text-slate-500 mb-6">
            Mendukung file .xlsx, .csv, .xls (Maksimal 50MB)
          </p>
        </Dragger>
      </Card>

      <Card className="shadow-sm border-slate-200" styles={{ body: { padding: 0 } }}>
        <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-base font-semibold text-slate-800">Riwayat File Terunggah</h3>
          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-md text-xs font-semibold">
            {tableData.length} file hari ini
          </span>
        </div>
        <Table columns={columns} dataSource={tableData} pagination={false} className="custom-table" />
      </Card>
    </div>
  );

  const displayedLogs = validationLogs.filter(item => {
    if (logFilter === 'all') return true;
    return item.status === logFilter;
  });

  const validasiTab = (
    <Row gutter={[24, 24]}>
      <Col xs={24} lg={8}>
        <Card className="shadow-sm border-slate-200" title="Aturan Validasi Keaktifan Nomor">
          <List
            dataSource={[
              { title: 'Format HLR Telekomunikasi', desc: 'Memeriksa keaktifan nomor pada jaringan HLR provider.', active: true },
              { title: 'WhatsApp API Check', desc: 'Verifikasi kepemilikan akun WhatsApp aktif.', active: true },
              { title: 'Ping Jaringan SMS/Call', desc: 'Deteksi sinyal HP aktif real-time.', active: true },
              { title: 'Duplikasi Nomor Telepon', desc: 'Menolak otomatis nomor ganda yang sama.', active: true },
              { title: 'Validasi Region Code', desc: 'Memastikan format prefix provider lokal (+62/08).', active: true },
            ]}
            renderItem={(item) => (
              <List.Item className="px-0 py-3 border-b border-slate-100 last:border-0">
                <List.Item.Meta
                  title={
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-800 text-sm">{item.title}</span>
                      <Tag color="success" className="rounded font-semibold text-[10px]">AKTIF</Tag>
                    </div>
                  }
                  description={<span className="text-xs text-slate-500">{item.desc}</span>}
                />
              </List.Item>
            )}
          />
        </Card>
      </Col>

      <Col xs={24} lg={16}>
        <Card 
          className="shadow-sm border-slate-200" 
          title="Log Validasi & Keaktifan Nomor Prospek"
          extra={
            <div className="flex items-center gap-3">
              <Select 
                defaultValue="all" 
                size="small"
                style={{ width: 140 }}
                onChange={(val: any) => setLogFilter(val)}
                options={[
                  { value: 'all', label: 'Semua Status' },
                  { value: 'Aktif', label: 'Hanya Aktif' },
                  { value: 'Tidak Aktif', label: 'Hanya Tidak Aktif' },
                ]}
              />
              <Button 
                type="default" 
                size="small"
                onClick={handleBulkCheck} 
                loading={bulkChecking}
                className="text-xs"
              >
                Cek Semua Nomor
              </Button>
            </div>
          }
        >
          <Table
            pagination={{ pageSize: 5 }}
            columns={[
              {
                title: 'Waktu',
                dataIndex: 'timestamp',
                key: 'timestamp',
                width: 90,
                render: (text: any) => <span className="text-xs font-mono text-slate-500">{text}</span>
              },
              {
                title: 'Nama Prospek',
                dataIndex: 'name',
                key: 'name',
                width: 130,
                render: (text: any) => <span className="font-semibold text-slate-800 text-xs">{text}</span>
              },
              {
                title: 'Nomor Telepon',
                dataIndex: 'phone',
                key: 'phone',
                width: 120,
                render: (text: any) => <span className="font-mono text-slate-600 text-xs">{text}</span>
              },
              {
                title: 'Provider',
                dataIndex: 'provider',
                key: 'provider',
                width: 90,
                render: (text: any) => <span className="text-slate-500 text-xs">{text}</span>
              },
              {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                width: 90,
                render: (status: any) => {
                  const color = status === 'Aktif' ? 'success' : 'error';
                  return <Tag color={color} className="rounded font-semibold text-[10px] m-0">{status.toUpperCase()}</Tag>;
                }
              },
              {
                title: 'Detail Hasil',
                dataIndex: 'detail',
                key: 'detail',
                render: (text: any) => <span className="text-slate-600 text-xs">{text}</span>
              },
              {
                title: 'Aksi',
                key: 'action',
                width: 110,
                render: (_: any, record: any) => (
                  <Button 
                    size="small" 
                    onClick={() => handleSingleCheck(record)} 
                    loading={checkingKeys.includes(record.key)}
                    className="text-[11px] px-2"
                  >
                    Cek Status
                  </Button>
                )
              }
            ]}
            dataSource={displayedLogs}
            className="custom-table text-xs"
          />
        </Card>
      </Col>
    </Row>
  );

  return (
    <div className="space-y-6">
      {contextHolder}
      <Tabs
        defaultActiveKey="1"
        tabBarExtraContent={
          <Button
            type="primary"
            icon={<IconRefresh size={16} className={syncing ? "animate-spin" : ""} />}
            loading={syncing}
            onClick={handleSync}
            className="flex items-center gap-1.5 font-medium shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            Sync Data
          </Button>
        }
        items={[
          {
            label: 'Upload File Manual',
            key: '1',
            children: uploadTab,
          },
          {
            label: 'Log Validasi & Cleansing',
            key: '2',
            children: validasiTab,
          },
        ]}
      />
    </div>
  );
}
