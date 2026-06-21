// Central Mock Data Store

// 1. Dashboard Metrics and Stats
export const dashboardMetrics = {
  totalDataPool: {
    value: "12,480",
    change: "+12%",
    subtext: "4,210 siap diproses",
  },
  callsToday: {
    value: "3,741",
    subtext: "312 sedang berlangsung",
  },
  conversionRate: {
    value: "18.4%",
    change: "+2.1%",
    subtext: "vs kemarin",
  },
  garbageTask: {
    value: "847",
    subtext: "234 perlu tindak lanjut",
  },
};

export const activeAgentsList = [
  { init: 'AR', bg: 'bg-blue-100 text-blue-700', name: 'Adi Rachmat', status: 'Sedang menelepon', statusColor: 'bg-emerald-500', time: '04:32', timeStyle: 'text-blue-600 bg-blue-50' },
  { init: 'SN', bg: 'bg-emerald-100 text-emerald-700', name: 'Siti Nur', status: 'Sedang menelepon', statusColor: 'bg-emerald-500', time: '01:17', timeStyle: 'text-blue-600 bg-blue-50' },
  { init: 'BW', bg: 'bg-purple-100 text-purple-700', name: 'Budi Wahyu', status: 'Istirahat', statusColor: 'bg-amber-500', time: '—', timeStyle: 'text-slate-400' },
  { init: 'RP', bg: 'bg-rose-100 text-rose-700', name: 'Rina Pratiwi', status: 'Wrap-up', statusColor: 'bg-blue-400', time: '—', timeStyle: 'text-slate-400' },
];

export const tlPerformanceList = [
  { name: 'TL Bima', pct: 87, color: '#2563eb' },
  { name: 'TL Dewi', pct: 74, color: '#60a5fa' },
  { name: 'TL Fajar', pct: 91, color: '#10b981' },
  { name: 'TL Hani', pct: 63, color: '#fbbf24' },
  { name: 'TL Irwan', pct: 79, color: '#a855f7' },
];


// 2. Data Ingestion & Cleansing Page Data
export const initialIngestedFiles = [
  {
    key: '1',
    name: 'prospek_batch_001.xlsx',
    type: 'excel',
    rows: '4,200',
    status: 'Lolos Validasi',
    time: 'Hari ini, 08:14',
  },
  {
    key: '2',
    name: 'data_kampanye_juni.csv',
    type: 'csv',
    rows: '1,850',
    status: 'Lolos Validasi',
    time: 'Hari ini, 09:32',
  },
  {
    key: '3',
    name: 'leads_referral_jkt.xlsx',
    type: 'excel',
    rows: '920',
    status: '5 Baris Error',
    time: 'Hari ini, 10:05',
  },
];


// 3. Distribusi & Alokasi Data Page Data
export const tlDistributionList = [
  { name: 'TL Bima', pct: 20, count: 842 },
  { name: 'TL Dewi', pct: 30, count: 1263 },
  { name: 'TL Fajar', pct: 25, count: 1052 },
  { name: 'TL Hani', pct: 25, count: 1053 },
];

export const agentDistributionList = [
  { name: 'Adi R.', avatar: 'https://ui-avatars.com/api/?name=Adi+Rachmat&background=random&size=24', pct: 22, count: 231 },
  { name: 'Siti N.', avatar: 'https://ui-avatars.com/api/?name=Siti+Nur&background=random&size=24', pct: 25, count: 263 },
  { name: 'Budi W.', avatar: 'https://ui-avatars.com/api/?name=Budi+W&background=random&size=24', pct: 28, count: 294 },
  { name: 'Rina P.', avatar: 'https://ui-avatars.com/api/?name=Rina+P&background=random&size=24', pct: 25, count: 264 },
];

export const readyPoolLeads = [
  {
    key: '1',
    id: '#4401',
    name: 'Ahmad Fauzi',
    phone: '0812-xxxx-1234',
    priority: 'Tinggi',
    status: { type: 'antre', text: 'Antre (Adi R)' },
  },
  {
    key: '2',
    id: '#4402',
    name: 'Lestari Wulan',
    phone: '0856-xxxx-5678',
    priority: 'Normal',
    status: { type: 'calling', text: 'Dipanggil' },
  },
  {
    key: '3',
    id: '#4403',
    name: 'Hendro Saputro',
    phone: '0821-xxxx-9012',
    priority: 'Normal',
    status: { type: 'antre', text: 'Antre (Siti N)' },
  },
];

export const analyzedCalls = [
  {
    id: "ai-1",
    customer: "Denny Cagur",
    agent: "Adi Rachmat",
    time: "Hari ini, 10:05",
    sentiment: "positive",
    score: 92,
    transcript: [
      { speaker: "agent", text: "Selamat pagi Pak Denny, perkenalkan saya Adi dari Asuransi Prima. Apa kabar hari ini?", type: "compliance" },
      { speaker: "customer", text: "Pagi, ya baik. Ada apa ya mas?" },
      { speaker: "agent", text: "Ini Pak, terkait program baru perlindungan kesehatan rawat inap dengan biaya premi hemat mulai dari 100 ribu rupiah per bulan saja.", type: "pricing" },
      { speaker: "customer", text: "Wah, murah ya. Tapi saya sudah ada asuransi prudential dari kantor.", type: "competitor" },
      { speaker: "agent", text: "Betul Pak Denny, prudential memang bagus sekali. Namun program kami ini bersifat santunan tunai tambahan yang melengkapi asuransi kantor Bapak tanpa koordinasi manfaat.", type: "objection" },
      { speaker: "customer", text: "Ooh begitu. Boleh deh dikirimi dulu brosur lengkapnya ke WA saya di nomor ini." },
      { speaker: "agent", text: "Baik Pak, segera saya kirimkan detail penawaran ke nomor ini. Sesuai aturan, percakapan ini direkam ya Pak. Selamat pagi.", type: "compliance" }
    ],
    intents: [
      { name: "Interested", value: 40 },
      { name: "Objection Competitor", value: 35 },
      { name: "Inquire Info", value: 25 }
    ]
  },
  {
    id: "ai-2",
    customer: "Ayu Tingting",
    agent: "Rina Pratiwi",
    time: "Hari ini, 09:50",
    sentiment: "negative",
    score: 65,
    transcript: [
      { speaker: "agent", text: "Halo selamat pagi dengan Ibu Ayu? Saya Rina dari telemarketing Asuransi Prima.", type: "compliance" },
      { speaker: "customer", text: "Iya betul, ada apa ya?" },
      { speaker: "agent", text: "Kami menawarkan program kartu proteksi rawat inap premium bebas premi 3 bulan pertama Ibu.", type: "pricing" },
      { speaker: "customer", text: "Aduh maaf mas, eh mbak, saya sedang sibuk sekali ini lagi syuting. Lagian harganya pasti mahal setelah 3 bulan.", type: "objection" },
      { speaker: "agent", text: "Hanya 150 ribu per bulan kok setelah itu, Ibu Ayu.", type: "pricing" },
      { speaker: "customer", text: "Enggak dulu ya, saya tidak tertarik asuransi online begini. Terima kasih.", type: "objection" }
    ],
    intents: [
      { name: "Declined", value: 60 },
      { name: "Objection Price", value: 30 },
      { name: "Busy", value: 10 }
    ]
  },
  {
    id: "ai-3",
    customer: "Raffi Ahmad",
    agent: "Siti Nuraini",
    time: "Hari ini, 09:30",
    sentiment: "positive",
    score: 95,
    transcript: [
      { speaker: "agent", text: "Selamat pagi Pak Raffi, saya Siti dari Asuransi Prima. Izin meminta waktunya sebentar Pak.", type: "compliance" },
      { speaker: "customer", text: "Halo pagi mbak. Boleh, tapi jangan lama-lama ya." },
      { speaker: "agent", text: "Singkat saja Pak, kami memiliki program eksklusif perlindungan penyakit kritis dengan promo cashback kartu kredit sebesar 20 persen.", type: "pricing" },
      { speaker: "customer", text: "Menarik sih. Limit kartunya nanti kena debet berapa per bulan?" },
      { speaker: "agent", text: "Hanya didebet 200 ribu rupiah per bulan saja Pak Raffi, sangat ringan sekali.", type: "pricing" },
      { speaker: "customer", text: "Oke boleh deh, langsung daftarkan saja pakai kartu kredit BCA saya ya.", type: "competitor" },
      { speaker: "agent", text: "Luar biasa. Sesuai prosedur, pendaftaran ini akan kami verifikasi dan semua panggilan ini direkam demi kenyamanan bertransaksi ya Pak. Terima kasih.", type: "compliance" }
    ],
    intents: [
      { name: "Conversion", value: 70 },
      { name: "Inquire Pricing", value: 20 },
      { name: "Brand Trust", value: 10 }
    ]
  }
];

export const concernCloud = [
  { text: "Harga kemahalan", count: 48, category: "objection" },
  { text: "Sudah punya asuransi lain", count: 35, category: "competitor" },
  { text: "Minta hubungi lagi nanti", count: 28, category: "objection" },
  { text: "Tidak tertarik", count: 24, category: "objection" },
  { text: "Brosur via WhatsApp", count: 19, category: "compliance" },
  { text: "Kartu kredit", count: 14, category: "pricing" },
  { text: "Promo cashback", count: 12, category: "pricing" },
];

