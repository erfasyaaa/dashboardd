import React, { useState, useEffect } from 'react'; 
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts'; 
import cctvImage from './assets/sungai code.png'; 
import { io } from 'socket.io-client';

// Base URL untuk backend (VITE_API_URL ini nanti diisi domain Render di Vercel)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Daftar dummy nama sungai beserta gambarnya untuk fitur sugesti pencarian
const daftarSungai = [
  { name: 'Sungai Code', image: cctvImage },
  { name: 'Sungai Winongo', image: 'https://img.antaranews.com/cache/1200x800/2024/03/30/IMG_20240330_141044.jpg.webp' },
  { name: 'Sungai Gajah Wong', image: 'https://media-cdn.tripadvisor.com/media/photo-s/07/31/75/3c/kebun-binatang-gembira.jpg' },
  { name: 'Sungai Progo', image: 'https://www.indonesia.travel/contentassets/0716e0a9c33740fdb8b63acf2a6ff7a2/sungai-progo2.jpg' },
  { name: 'Sungai Bedog', image: 'data:image/jpeg;base64,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' }
];

// Helper untuk menghasilkan 50 data awal seketika agar grafik tidak kosong saat render awal atau mode fallback
const generateInitialLogs = () => {
  const logs = [];
  const now = new Date();
  let tempTMA = 2.15;
  
  for (let i = 50; i > 0; i--) {
    const d = new Date(now.getTime() - i * 5000);
    
    if (tempTMA > 3.5) tempTMA -= (Math.random() * 0.5 + 0.1); 
    else tempTMA += (Math.random() * 0.4 - 0.2); 
    
    if (tempTMA < 2.0) tempTMA = 2.0 + Math.random() * 0.1;
    if (tempTMA > 5.0) tempTMA = 5.0;

    let tempDebit = (tempTMA * 22) + (Math.random() * 5 - 2.5);
    if (tempDebit < 5) tempDebit = 5 + Math.random() * 2;
    
    let tempHujan = (tempTMA * 12) + (Math.random() * 8 - 4);
    if (tempHujan < 0) tempHujan = 0;

    let status = 'Aman';
    if (tempTMA >= 5.00) status = 'Awas';
    else if (tempTMA >= 4.00) status = 'Siaga';
    else if (tempTMA >= 3.00) status = 'Waspada';

    logs.push({
      ketinggian_air: parseFloat(tempTMA.toFixed(2)),
      debit_air: parseFloat(tempDebit.toFixed(2)),
      curah_hujan: parseFloat(tempHujan.toFixed(2)),
      status: status,
      created_at: d.toISOString(),
      jam: d.toLocaleTimeString('id-ID', { hour12: false }),
      tanggal: d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    });
  }
  return logs;
};

const initialLogs = generateInitialLogs();

/* ====================================================================
   KOMPONEN WIDGET LATENSI 
   ==================================================================== */
const LatencyWidget = ({ latencyMs, latencyDetail, onDownload, isMobile = false }) => {
  if (isMobile) {
    return (
      <div className="absolute top-6 left-6 flex flex-col gap-2 z-50">
        <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/20 shadow-sm backdrop-blur-md flex items-center gap-2">
          <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse shadow-[0_0_5px_#2dd4bf]"></div>
          <span className="text-white font-['Poppins'] text-[10px] font-semibold opacity-90">E2E:</span>
          <span className="text-teal-200 font-mono text-xs font-bold">{latencyMs !== null ? `${latencyMs}ms` : '...'}</span>
        </div>
        <div className="flex items-stretch gap-2">
          {latencyDetail && (
            <div className="bg-white/10 px-2 py-1.5 rounded border border-white/20 text-white font-mono text-[9px] flex flex-col gap-0.5 backdrop-blur-md shadow-lg w-max">
              <div className="flex items-center gap-1"><span className="text-teal-200 font-bold w-2">A</span><span className="text-white/80">:</span><span className="text-white">{latencyDetail.serverTime}</span></div>
              <div className="flex items-center gap-1"><span className="text-sky-200 font-bold w-2">B</span><span className="text-white/80">:</span><span className="text-white">{latencyDetail.webTime}</span></div>
            </div>
          )}
          <button onClick={onDownload} className="bg-teal-600/80 hover:bg-teal-500 px-3 rounded text-[9px] text-white font-bold border border-white/20 shadow flex items-center justify-center transition-colors">📥 Unduh CSV</button>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-10 left-[81px] flex items-stretch gap-3 z-50 transition-all h-[60px]">
      <div className="bg-white/10 px-5 rounded-2xl border border-white/20 shadow-lg backdrop-blur-md flex items-center gap-3 w-max">
        <div className="w-3 h-3 bg-teal-400 rounded-full animate-pulse shadow-[0_0_8px_#2dd4bf]"></div>
        <span className="text-white font-['Poppins'] text-base font-semibold opacity-90 tracking-wide">Response Time (E2E):</span>
        <span className="text-teal-200 font-mono text-xl font-bold drop-shadow-md">{latencyMs !== null ? `${latencyMs} ms` : 'Menghitung...'}</span>
      </div>
      {latencyDetail && (
        <div className="bg-white/10 px-4 rounded-xl border border-white/20 text-white font-mono text-xs flex flex-col justify-center gap-1.5 backdrop-blur-md shadow-xl w-max">
           <div className="flex items-center gap-2"><span className="text-teal-200 font-bold w-[165px]">Titik A (Server MySQL)</span><span className="text-white/80">:</span><span className="text-white">{latencyDetail.serverTime}</span></div>
           <div className="flex items-center gap-2"><span className="text-sky-200 font-bold w-[165px]">Titik B (Web Ter-render)</span><span className="text-white/80">:</span><span className="text-white">{latencyDetail.webTime}</span></div>
        </div>
      )}
      <button onClick={onDownload} className="bg-teal-600 hover:bg-teal-500 px-5 rounded-xl text-xs text-white font-bold border border-white/20 shadow-lg flex items-center justify-center gap-2 transition-colors">
        📥 Unduh Rekapan Excel (CSV)
      </button>
    </div>
  );
};

/* ====================================================================
   KOMPONEN TABEL VIEW
   ==================================================================== */
const TableView = ({ tableType, dataLogs, dataTabelBulanan, onBack, currentRiver, isMobile = false }) => {
  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 bg-[#01798B] flex flex-col p-4 animate-in fade-in duration-200">
        <div className="flex flex-col gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-teal-400 rounded-full"></div>
            <div>
              <h1 className="text-xl font-extrabold text-white font-['Poppins'] drop-shadow-md">
                Data Riwayat {tableType === 'mingguan' ? '30 Hari Terakhir' : 
                              tableType === 'realtime' ? 'Keseluruhan' : 
                              tableType === 'ketinggian' ? 'Ketinggian Air' :
                              tableType === 'debit' ? 'Debit Air' : 
                              'Curah Hujan'}
              </h1>
              <p className="text-teal-200 text-xs font-semibold mt-0.5">{currentRiver}</p>
            </div>
          </div>
          
          <button
            onClick={onBack}
            className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-bold font-['Poppins'] backdrop-blur border border-white/20 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Kembali ke Dashboard
          </button>
        </div>

        <div className="flex-1 bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden">
          <div className="overflow-x-auto overflow-y-auto flex-1 p-0">
            <table className="w-full text-left border-collapse font-['Poppins'] min-w-[600px]">
              <thead className="sticky top-0 bg-teal-600 shadow-md z-10">
                <tr className="text-white text-sm">
                  {tableType === 'mingguan' ? (
                    <>
                      <th className="p-3 font-semibold">Tanggal</th>
                      <th className="p-3 font-semibold">Ketinggian Rata-rata (m)</th>
                      <th className="p-3 font-semibold">Ketinggian Maks. (m)</th>
                      <th className="p-3 font-semibold">Debit Rata-rata (m³/s)</th>
                      <th className="p-3 font-semibold">Curah Hujan (mm)</th>
                      <th className="p-3 font-semibold">Status (Maks)</th>
                    </>
                  ) : (
                    <>
                      <th className="p-3 font-semibold">No</th>
                      <th className="p-3 font-semibold">Tanggal</th>
                      <th className="p-3 font-semibold">Jam</th>
                      {(tableType === 'realtime' || tableType === 'ketinggian') && <th className="p-3 font-semibold">Ketinggian (m)</th>}
                      {(tableType === 'realtime' || tableType === 'debit') && <th className="p-3 font-semibold">Debit Air (m³/s)</th>}
                      {(tableType === 'realtime' || tableType === 'curah_hujan') && <th className="p-3 font-semibold">Curah Hujan (mm)</th>}
                      <th className="p-3 font-semibold">Status</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {tableType === 'mingguan' ? (
                  dataTabelBulanan.map((row, idx) => (
                    <tr key={idx} className="border-b border-slate-200 hover:bg-teal-50 text-sm text-slate-700">
                      <td className="p-3 font-bold text-slate-600 whitespace-nowrap">{row.hari}</td>
                      <td className="p-3">{row.tinggi_rata2}</td>
                      <td className="p-3 font-semibold text-teal-600">{row.tinggi_maks}</td>
                      <td className="p-3 font-semibold text-violet-600">{row.debit_rata2}</td>
                      <td className="p-3 font-semibold text-sky-600">{row.curah_hujan}</td>
                      <td className="p-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm ${row.status === 'Awas' ? 'bg-red-500' : row.status === 'Siaga' ? 'bg-orange-500' : row.status === 'Waspada' ? 'bg-yellow-500' : 'bg-lime-500'}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  [...dataLogs].reverse().map((log, idx) => (
                    <tr key={idx} className="border-b border-slate-200 hover:bg-teal-50 text-sm text-slate-700">
                      <td className="p-3 font-bold text-slate-400">{idx + 1}</td>
                      <td className="p-3 font-bold whitespace-nowrap">{log.tanggal}</td>
                      <td className="p-3 whitespace-nowrap">{log.jam}</td>
                      {(tableType === 'realtime' || tableType === 'ketinggian') && <td className="p-3 font-semibold text-teal-600">{log.ketinggian_air}</td>}
                      {(tableType === 'realtime' || tableType === 'debit') && <td className="p-3 font-semibold text-violet-600">{log.debit_air}</td>}
                      {(tableType === 'realtime' || tableType === 'curah_hujan') && <td className="p-3 font-semibold text-sky-600">{log.curah_hujan}</td>}
                      <td className="p-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${log.status === 'Awas' ? 'bg-red-500' : log.status === 'Siaga' ? 'bg-orange-500' : log.status === 'Waspada' ? 'bg-yellow-500' : 'bg-lime-500'}`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-50 bg-[#01798B] flex flex-col p-16 animate-in fade-in duration-200">
      <div className="flex justify-between items-center mb-8">
         <div className="flex items-center gap-4">
           <div className="w-3 h-12 bg-teal-400 rounded-full"></div>
           <div>
             <h1 className="text-5xl font-extrabold text-white font-['Poppins'] drop-shadow-md">
               Data Riwayat {tableType === 'mingguan' ? '30 Hari Terakhir' : 
                             tableType === 'realtime' ? 'Keseluruhan (Real-Time)' : 
                             tableType === 'ketinggian' ? 'Ketinggian Air' :
                             tableType === 'debit' ? 'Debit Air' : 
                             'Curah Hujan'}
             </h1>
             <p className="text-teal-200 text-2xl font-semibold mt-2">{currentRiver}</p>
           </div>
         </div>
         
         <button
           onClick={onBack}
           className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-bold font-['Poppins'] backdrop-blur border border-white/20 transition-all shadow-lg flex items-center gap-2"
         >
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
           Kembali ke Dashboard
         </button>
      </div>

      <div className="flex-1 bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden">
         <div className="overflow-y-auto flex-1 p-0">
           <table className="w-full text-left border-collapse font-['Poppins']">
             <thead className="sticky top-0 bg-teal-600 shadow-md z-10">
               <tr className="text-white text-xl">
                 {tableType === 'mingguan' ? (
                   <>
                     <th className="p-6 font-semibold">Tanggal</th>
                     <th className="p-6 font-semibold">Ketinggian Rata-rata (m)</th>
                     <th className="p-6 font-semibold">Ketinggian Maks. (m)</th>
                     <th className="p-6 font-semibold">Debit Rata-rata (m³/s)</th>
                     <th className="p-6 font-semibold">Curah Hujan (mm)</th>
                     <th className="p-6 font-semibold">Status (Maks)</th>
                   </>
                 ) : (
                   <>
                     <th className="p-6 font-semibold">No</th>
                     <th className="p-6 font-semibold">Tanggal</th>
                     <th className="p-6 font-semibold">Jam</th>
                     {(tableType === 'realtime' || tableType === 'ketinggian') && <th className="p-6 font-semibold">Ketinggian (m)</th>}
                     {(tableType === 'realtime' || tableType === 'debit') && <th className="p-6 font-semibold">Debit Air (m³/s)</th>}
                     {(tableType === 'realtime' || tableType === 'curah_hujan') && <th className="p-6 font-semibold">Curah Hujan (mm)</th>}
                     <th className="p-6 font-semibold">Status</th>
                   </>
                 )}
               </tr>
             </thead>
             <tbody>
               {tableType === 'mingguan' ? (
                dataTabelBulanan.map((row, idx) => (
                   <tr key={idx} className="border-b border-slate-200 hover:bg-teal-50 transition-colors text-lg text-slate-700">
                     <td className="p-6 font-bold text-slate-600 whitespace-nowrap">{row.hari}</td>
                     <td className="p-6">{row.tinggi_rata2}</td>
                     <td className="p-6 font-semibold text-teal-600">{row.tinggi_maks}</td>
                     <td className="p-6 font-semibold text-violet-600">{row.debit_rata2}</td>
                     <td className="p-6 font-semibold text-sky-600">{row.curah_hujan}</td>
                     <td className="p-6">
                       <span className={`px-4 py-2 rounded-full text-sm font-bold text-white shadow-sm ${row.status === 'Awas' ? 'bg-red-500' : row.status === 'Siaga' ? 'bg-orange-500' : row.status === 'Waspada' ? 'bg-yellow-500' : 'bg-lime-500'}`}>
                         {row.status}
                       </span>
                     </td>
                   </tr>
                 ))
               ) : (
                 [...dataLogs].reverse().map((log, idx) => (
                   <tr key={idx} className="border-b border-slate-200 hover:bg-teal-50 transition-colors text-lg text-slate-700">
                     <td className="p-6 font-bold text-slate-400">{idx + 1}</td>
                     <td className="p-6 font-bold">{log.tanggal}</td>
                     <td className="p-6">{log.jam}</td>
                     {(tableType === 'realtime' || tableType === 'ketinggian') && <td className="p-6 font-semibold text-teal-600">{log.ketinggian_air}</td>}
                     {(tableType === 'realtime' || tableType === 'debit') && <td className="p-6 font-semibold text-violet-600">{log.debit_air}</td>}
                     {(tableType === 'realtime' || tableType === 'curah_hujan') && <td className="p-6 font-semibold text-sky-600">{log.curah_hujan}</td>}
                     <td className="p-6">
                       <span className={`px-4 py-2 rounded-full text-sm font-bold text-white ${log.status === 'Awas' ? 'bg-red-500' : log.status === 'Siaga' ? 'bg-orange-500' : log.status === 'Waspada' ? 'bg-yellow-500' : 'bg-lime-500'}`}>
                         {log.status}
                       </span>
                     </td>
                   </tr>
                 ))
               )}
             </tbody>
           </table>
         </div>
      </div>
    </div>
  );
};

/* ====================================================================
   KOMPONEN SIDEBAR NAVIGASI
   ==================================================================== */
const Sidebar = ({ isOpen, onClose, onNavigate, isMobile = false }) => {
  const navItems = [
    { type: 'realtime', label: 'Riwayat Keseluruhan' },
    { type: 'mingguan', label: 'Riwayat 30 Hari' },
    { type: 'ketinggian', label: 'Riwayat Ketinggian Air' },
    { type: 'debit', label: 'Riwayat Debit Air' },
    { type: 'curah_hujan', label: 'Riwayat Curah Hujan' },
  ];

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      ></div>
      
      {/* Sidebar Panel */}
      <div className={`fixed top-0 left-0 h-full bg-gradient-to-b from-cyan-800 to-teal-700 ${isMobile ? 'w-4/5 max-w-sm' : 'w-96'} z-[70] shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-white text-2xl font-bold font-['Poppins']">Menu Riwayat</h2>
            <button onClick={onClose} className="text-white p-2 rounded-full hover:bg-white/20 transition-colors">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          <nav className="flex flex-col gap-3">
            {navItems.map(item => (
              <button key={item.type} onClick={() => onNavigate(item.type)} className="text-left text-white text-lg font-semibold font-['Poppins'] p-4 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-4">
                <span className="w-2 h-2 bg-teal-300 rounded-full"></span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};


export default function App() { 
  const [dataLogs, setDataLogs] = useState(initialLogs); 
  const [latestData, setLatestData] = useState(initialLogs[initialLogs.length - 1]); 
  const [tableType, setTableType] = useState('realtime');
  const [activePage, setActivePage] = useState('dashboard'); 
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [scale, setScale] = useState({ x: 1, y: 1 });
  const [latencyMs, setLatencyMs] = useState(null); // Ubah dari 0 menjadi null
  const [latencyDetail, setLatencyDetail] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [latencyLogs, setLatencyLogs] = useState([]);
  const [currentRiver, setCurrentRiver] = useState('Sungai Code');
  const [currentImage, setCurrentImage] = useState(cctvImage);

  // State Grafik Mingguan (Fallback otomatis dipakai jika MySQL gagal / terputus)
  const [dataGrafikMingguan, setDataGrafikMingguan] = useState([ 
    { hari: 'Sen', tinggi_rata2: 2.2, tinggi_maks: 3.1 }, 
    { hari: 'Sel', tinggi_rata2: 2.1, tinggi_maks: 2.5 }, 
    { hari: 'Rab', tinggi_rata2: 2.5, tinggi_maks: 3.8 }, 
    { hari: 'Kam', tinggi_rata2: 3.2, tinggi_maks: 4.8 }, 
    { hari: 'Jum', tinggi_rata2: 2.8, tinggi_maks: 3.5 }, 
    { hari: 'Sab', tinggi_rata2: 2.3, tinggi_maks: 2.9 }, 
    { hari: 'Min', tinggi_rata2: 2.0, tinggi_maks: 2.4 }, 
  ]); 

  // State Tabel Bulanan
  const [dataTabelBulanan, setDataTabelBulanan] = useState(() => {
    const today = new Date();
    return Array.from({ length: 30 }, (_, i) => {
      let rata2 = Math.random() * 1.0 + 2.0; // Rata-rata normal 2.0 - 3.0 meter
      let maks = rata2 + Math.random() * 1.0;
      if (Math.random() < 0.10) maks += Math.random() * 2.0;
      if (maks > 5.0) maks = 5.0;
      let status = 'Aman';
      if (maks >= 5.00) status = 'Awas';
      else if (maks >= 4.00) status = 'Siaga';
      else if (maks >= 3.00) status = 'Waspada';

      let rataDebit = (rata2 * 22) + (Math.random() * 5 - 2.5);
      if (rataDebit < 5) rataDebit = 5 + Math.random() * 2;
      
      let rataHujan = (rata2 * 12) + (Math.random() * 8 - 4);
      if (rataHujan < 0) rataHujan = 0;

      const d = new Date(today);
      d.setDate(today.getDate() - (29 - i));
      const tanggalFormat = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

      return {
        hari: tanggalFormat,
        tinggi_rata2: parseFloat(rata2.toFixed(2)),
        tinggi_maks: parseFloat(maks.toFixed(2)),
        debit_rata2: parseFloat(rataDebit.toFixed(2)),
        curah_hujan: parseFloat(rataHujan.toFixed(2)),
        status: status
      };
    });
  });

  const fetchData = async () => { 
    try { 
      const response = await fetch(`${API_URL}/api/sensor-data?_t=${Date.now()}`); 
      const data = await response.json(); 
      if (data.length > 0) { 
        setDataLogs(data); 
        const lastRecord = data[data.length - 1]; 

        setLatestData({ 
          ketinggian_air: lastRecord.ketinggian_air || 2.15, 
          debit_air: lastRecord.debit_air || 30.8, 
          curah_hujan: lastRecord.curah_hujan || 43.2, 
          status: lastRecord.status || 'Aman' 
        }); 
      } 
        
        // Fetch Data Mingguan dari Database
        const resWeekly = await fetch(`${API_URL}/api/sensor-data/weekly?_t=${Date.now()}`); 
        const dataWeekly = await resWeekly.json(); 
        if (dataWeekly.length > 0) setDataGrafikMingguan(dataWeekly); 

        // Fetch Data Bulanan dari Database
        const resMonthly = await fetch(`${API_URL}/api/sensor-data/monthly?_t=${Date.now()}`); 
        const dataMonthly = await resMonthly.json(); 
        if (dataMonthly.length > 0) setDataTabelBulanan(dataMonthly); 
    } catch (error) { 
      console.warn('Backend tidak terhubung, menjalankan simulasi indikator lokal...'); 
      
      setLatestData(prev => {
        let newTMA = prev.ketinggian_air;
        
        // Logika fallback distabilkan agar banyak Aman & Waspada
        if (newTMA > 3.5) newTMA -= (Math.random() * 0.5 + 0.1); 
        else newTMA += (Math.random() * 0.4 - 0.2); 
        
        if (Math.random() < 0.15) newTMA += (Math.random() * 0.8);
        if (Math.random() < 0.02) newTMA += (Math.random() * 1.2);
        
        if (newTMA < 2.0) newTMA = 2.0 + Math.random() * 0.1; // Minimal 2
        if (newTMA > 5.0) newTMA = 5.0; // Maksimal batas 5

        let status = 'Aman';
        if (newTMA >= 5.00) status = 'Awas';
        else if (newTMA >= 4.00) status = 'Siaga';
        else if (newTMA >= 3.00) status = 'Waspada';

        let newDebit = (newTMA * 22) + (Math.random() * 5 - 2.5);
        if (newDebit < 5) newDebit = 5 + Math.random() * 2;
        
        let newHujan = (newTMA * 12) + (Math.random() * 8 - 4);
        if (newHujan < 0) newHujan = 0;

        const newData = {
          ketinggian_air: parseFloat(newTMA.toFixed(2)),
          debit_air: parseFloat(newDebit.toFixed(2)),
          curah_hujan: parseFloat(newHujan.toFixed(2)),
          status: status
        };

        setDataLogs(prevLogs => {
          const now = new Date();
          const jam = now.toLocaleTimeString('id-ID', { hour12: false });
          const newLog = { ...newData, jam, tanggal: now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) };
          const updatedLogs = [...prevLogs, newLog];
          return updatedLogs.length > 50 ? updatedLogs.slice(updatedLogs.length - 50) : updatedLogs;
        });

        return newData;
      });
    } 
  }; 

  const downloadCSV = () => {
    if (latencyLogs.length === 0) return alert("Belum ada data rekapan latensi!");
    
    // Gunakan Semicolon (;) standar Excel Indonesia dan format karakter BOM (Byte Order Mark) UTF-8
    const header = "No;Waktu Server (MySQL);Waktu Web (React);Latensi (ms)\n";
    const rows = latencyLogs.map(row => `${row.no};${row.waktu_server};${row.waktu_web};${row.latensi_ms}`).join("\n");
    
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + encodeURIComponent(header + rows);
    const link = document.createElement("a");
    link.href = csvContent;
    link.download = `Rekapan_Latensi_${new Date().getTime()}.csv`;
    link.click();
  };

  useEffect(() => { 
    // Panggil fetchData 1x di awal untuk mengisi data awal (riwayat tabel) dari MySQL API
    fetchData();

    // Setup koneksi WebSocket dengan backend
    const socket = io(API_URL);

    // Dengarkan event 'newData' dari backend
    socket.on('newData', (newRecord) => {
      // ---------------------------------------------------------
      // PENGUJIAN RESPONSE TIME (END-TO-END LATENCY)
      // Titik B: Waktu data diterima dan siap ditampilkan di antarmuka
      // ---------------------------------------------------------
      if (newRecord.waktu_akuisisi) {
        const waktu_tertampil = Date.now();
        // Jika saking cepatnya mencapai angka negatif/0, dibulatkan minimal 0 ms
        const selisih = Math.max(0, waktu_tertampil - newRecord.waktu_akuisisi);
        setLatencyMs(selisih);
        
        // Format waktu ke detail milidetik (contoh: 11:23:11.015)
        const formatTimeWithMs = (ts) => {
          const d = new Date(ts);
          return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}.${d.getMilliseconds().toString().padStart(3, '0')}`;
        };
        
        const serverTimeStr = formatTimeWithMs(newRecord.waktu_akuisisi);
        const webTimeStr = formatTimeWithMs(waktu_tertampil);
        
        setLatencyDetail({ serverTime: serverTimeStr, webTime: webTimeStr });
        setLatencyLogs(prev => [...prev, {
          no: prev.length + 1,
          waktu_server: serverTimeStr,
          waktu_web: webTimeStr,
          latensi_ms: selisih
        }]);
      }

      // Update State Data Terbaru
      setLatestData({ 
        ketinggian_air: newRecord.ketinggian_air || 2.15, 
        debit_air: newRecord.debit_air || 30.8, 
        curah_hujan: newRecord.curah_hujan || 43.2, 
        status: newRecord.status || 'Aman' 
      }); 

      // Tambahkan data baru ke grafik (maksimal 50 data)
      setDataLogs(prevLogs => {
        const updatedLogs = [...prevLogs, newRecord];
        return updatedLogs.length > 50 ? updatedLogs.slice(updatedLogs.length - 50) : updatedLogs;
      });
    });
    return () => socket.disconnect(); 
  }, []); 

  // Handler untuk kembali dari halaman tabel
  const handleBackToDashboard = () => {
    setActivePage('dashboard');
  };

  const handleNavigate = (type) => {
    setTableType(type);
    setActivePage('table');
    setIsSidebarOpen(false);
  };

  useEffect(() => { 
    const handleResize = () => { 
      const width = window.innerWidth;
      const height = window.innerHeight;
      setWindowSize({ width, height });
      
      const scaleX = width / 1920; 
      const scaleY = height / 1080; 
      setScale({ x: scaleX, y: scaleY }); 
    }; 
    handleResize(); 
    window.addEventListener('resize', handleResize); 
    return () => window.removeEventListener('resize', handleResize); 
  }, []); 

  const getStatusTheme = () => { 
    const status = latestData.status; 
    // Hitung angle secara dinamis (0-180 derajat) berdasarkan ketinggian air maksimal 6.0 meter
    const angle = Math.min(180, Math.max(0, (latestData.ketinggian_air / 6.0) * 180));
    if (status === 'Awas') { 
      return { color: '#ef4444', bg: 'bg-red-500', angle }; 
    } else if (status === 'Siaga') { 
      return { color: '#f97316', bg: 'bg-orange-500', angle }; 
    } else if (status === 'Waspada') { 
      return { color: '#eab308', bg: 'bg-yellow-500', angle }; 
    } 
    return { color: '#84cc16', bg: 'bg-lime-500', angle }; 
  }; 

  const filteredDataLogs = dataLogs.filter(log => 
    (log.tanggal && log.tanggal.toLowerCase().includes(searchQuery.toLowerCase())) || 
    (log.status && log.status.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (log.jam && log.jam.includes(searchQuery))
  );

  const filteredTabelBulanan = dataTabelBulanan.filter(row => 
    (row.hari && row.hari.toLowerCase().includes(searchQuery.toLowerCase())) || 
    (row.status && row.status.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const isMobile = windowSize.width <= 768;
  const currentTheme = getStatusTheme(); 
  
  const currentDateFormatted = new Date().toLocaleDateString('id-ID', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  const customTooltipStyle = { 
    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
    borderRadius: '8px', 
    border: '1px solid #e2e8f0', 
    padding: '6px' 
  }; 

  const CustomTooltip = ({ active, payload, label }) => { 
    if (active && payload && payload.length) { 
      return ( 
        <div style={customTooltipStyle} className="text-[10px] font-bold text-slate-700 shadow-md"> 
          <p className="text-slate-400 mb-0.5">{label}</p> 
          {payload.map((entry, index) => ( 
            <p key={index} style={{ color: entry.color }}> 
              {entry.name}: {entry.value} 
            </p> 
          ))} 
        </div> 
      ); 
    } 
    return null; 
  }; 

  // Fungsi untuk berpindah ke halaman tabel saat grafik diklik
  const handleChartClick = (e, type) => {
    setTableType(type);
    setActivePage('table');
  };

  // ================= TAMPILAN KHUSUS HP (MOBILE) =================
  if (isMobile) {
    return (
      <div className="min-h-screen w-full relative bg-gradient-to-b from-cyan-700 via-teal-400 via-[73%] to-green-200 overflow-x-hidden font-['Poppins'] pb-10">
        <style>
          {`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@400;700&display=swap');`}
        </style>

        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
          onNavigate={handleNavigate}
          isMobile={true}
        />

        {/* Header Mobile */}
        <header className="px-4 py-6 flex flex-col gap-4 relative">
          <LatencyWidget 
            latencyMs={latencyMs} 
            latencyDetail={latencyDetail} 
            onDownload={downloadCSV}
            isMobile={true}
          />
          <div className="flex flex-col gap-5 mt-24">
            <div className="flex items-center justify-center relative">
              <button onClick={() => setIsSidebarOpen(true)} className="absolute left-0 text-white p-2 z-10">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
              </button>
              <h1 className="text-center text-white text-5xl font-extrabold drop-shadow-lg tracking-wide">Hydroguard Interactive</h1>
            </div>
            
            {/* PENCARIAN MOBILE */}
            <div className="flex gap-2 w-full">
              <form onSubmit={(e) => { e.preventDefault(); setActivePage('search'); }} className="relative flex-1">
                <input 
                  type="text" 
                  placeholder="Cari nama sungai..." 
                  className="w-full h-12 pl-12 pr-20 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/60 backdrop-blur-md outline-none focus:bg-white/20 focus:border-white/40 transition-all font-['Poppins'] text-sm shadow-lg"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setActivePage('search'); }}
                  onFocus={() => setActivePage('search')}
                />
                <svg className="w-5 h-5 absolute left-4 top-3.5 text-white/60 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                <button type="submit" className="absolute right-1.5 top-1.5 bottom-1.5 bg-teal-500 hover:bg-teal-400 text-white px-4 rounded-full font-semibold transition-colors text-xs flex items-center justify-center shadow-md">
                  Cari
                </button>
              </form>
              {activePage === 'search' && (
                <button onClick={() => { setActivePage('dashboard'); setSearchQuery(''); }} className="bg-red-500 hover:bg-red-400 text-white px-4 rounded-full font-semibold transition-colors text-xs shadow-md">
                  Batal
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Mobile */}
        <main className="px-4 flex flex-col gap-6">
          
          {activePage === 'dashboard' ? (
            <>
          {/* CCTV & Gauge (Paling atas di HP) */}
          <div className="bg-gradient-to-b from-white to-sky-100 rounded-3xl shadow-xl p-4 flex flex-col gap-6">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-md">
              <img className="w-full h-full object-cover transition-all duration-500" src={currentImage} alt={currentRiver} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                <div className="text-white text-xl font-bold leading-tight">{currentRiver}</div>
                <div className="text-white text-sm font-semibold mt-1">{currentDateFormatted}</div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center cursor-pointer" onClick={() => handleChartClick(null, 'realtime')}>
              <div className="relative w-64 h-32 overflow-hidden flex items-end justify-center">
                <svg className="w-full h-full absolute top-0 left-0" viewBox="0 0 100 50">
                  <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="url(#conicGaugeGradientMob)" strokeWidth="10" strokeLinecap="round" />
                  <defs>
                    <linearGradient id="conicGaugeGradientMob" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#84cc16" />
                      <stop offset="50%" stopColor="#eab308" />
                      <stop offset="66%" stopColor="#f97316" />
                      <stop offset="83%" stopColor="#ef4444" />
                    </linearGradient>
                  </defs>
                </svg>
                {/* Jarum Pointer Baru - Tampilan HP */}
                <div className="absolute w-[90px] h-3 origin-right transition-transform duration-1000 flex items-center justify-start drop-shadow-md z-0" style={{ transform: `rotate(${currentTheme.angle}deg)`, right: '50%', bottom: '-6px' }}>
                  <svg viewBox="0 0 100 20" className="w-full h-full" preserveAspectRatio="none">
                    <polygon points="0,10 100,0 100,20" fill="#000000" />
                  </svg>
                </div>
                <div className="size-6 bg-black rounded-full absolute bottom-[-12px] left-1/2 -translate-x-1/2 z-10 border-[2px] border-white shadow-md flex items-center justify-center">
                  <div className="size-2 rounded-full" style={{ backgroundColor: currentTheme.color }}></div>
                </div>
              </div>
              <div className="w-64 flex justify-between text-xs font-semibold text-black mt-2 px-1">
                <span>0</span> <span>1.5</span> <span>3.0</span> <span>4.5</span> <span>6.0</span>
              </div>
              <div key={latestData.status} className={`w-full max-w-[300px] h-14 ${currentTheme.bg} rounded-xl flex items-center justify-center shadow-md mt-6 transition-colors duration-500`}>
                <span className="text-white text-xl font-bold tracking-wider drop-shadow-md">
                  {latestData.status === 'Mencari data...' ? 'Aman' : latestData.status}
                </span>
              </div>
            </div>

            {/* 3 Metrics Mini Cards */}
            <div className="grid grid-cols-3 gap-2 justify-items-center">
              <div className="w-full bg-white border border-slate-100 rounded-xl shadow-sm relative overflow-hidden flex flex-col p-2 cursor-pointer" onClick={() => handleChartClick(null, 'ketinggian')}>
                <div className="w-full h-2 bg-teal-400 absolute top-0 left-0"></div>
                <span className="text-black text-[10px] font-normal leading-tight opacity-60 mt-3 block">Ketinggian Air</span>
                <div className="w-full flex items-baseline justify-between mt-1 gap-1">
                  <span className="text-lg font-semibold text-black tracking-tighter truncate">{latestData.ketinggian_air.toString().replace('.', ',')}</span>
                  <span className="text-black text-[10px] font-semibold shrink-0">m</span>
                </div>
              </div>
              <div className="w-full bg-white border border-slate-100 rounded-xl shadow-sm relative overflow-hidden flex flex-col p-2 cursor-pointer" onClick={() => handleChartClick(null, 'debit')}>
                <div className="w-full h-2 bg-teal-600 absolute top-0 left-0"></div>
                <span className="text-black text-[10px] font-normal leading-tight opacity-60 mt-3 block">Debit Air</span>
                <div className="w-full flex items-baseline justify-between mt-1 gap-1">
                  <span className="text-lg font-semibold text-black tracking-tighter truncate">{latestData.debit_air.toString().replace('.', ',')}</span>
                  <span className="text-black text-[10px] font-semibold shrink-0">m³/s</span>
                </div>
              </div>
              <div className="w-full bg-white border border-slate-100 rounded-xl shadow-sm relative overflow-hidden flex flex-col p-2 cursor-pointer" onClick={() => handleChartClick(null, 'curah_hujan')}>
                <div className="w-full h-2 bg-cyan-700 absolute top-0 left-0"></div>
                <span className="text-black text-[10px] font-normal leading-tight opacity-60 mt-3 block">Curah Hujan</span>
                <div className="w-full flex items-baseline justify-between mt-1 gap-1">
                  <span className="text-lg font-semibold text-black tracking-tighter truncate">{latestData.curah_hujan.toString().replace('.', ',')}</span>
                  <span className="text-black text-[10px] font-semibold shrink-0">mm</span>
                </div>
              </div>
            </div>
          </div>

          {/* Graphic Container Mobile */}
          <div className="bg-white/20 p-4 rounded-3xl shadow-xl backdrop-blur-sm flex flex-col gap-6">
            
            {/* Hujan Card */}
            <div className="bg-gradient-to-b from-white via-white to-sky-100 rounded-xl shadow-lg overflow-hidden p-5 cursor-pointer" onClick={() => handleChartClick(null, 'curah_hujan')}>
              <div className="w-full h-3 left-0 top-0 absolute bg-teal-600"></div>
              <div className="text-black text-lg font-bold opacity-60">Intensitas Curah Hujan</div>
              <div className="text-black text-5xl font-bold mt-2">{latestData.curah_hujan.toString().replace('.', ',')}</div>
              <div className="text-black text-xs font-normal mt-6">Curah Hujan Perhari</div>
              <div className="w-full h-3 bg-teal-400 rounded-full overflow-hidden mt-2 relative">
                <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-red-400 to-orange-200 rounded-full transition-all" style={{ width: `${Math.min(100, (latestData.curah_hujan / 100) * 100)}%` }}></div>
              </div>
            </div>

            {/* Line Chart Realtime */}
            <div className="bg-gradient-to-b from-white to-sky-100 rounded-xl shadow-lg overflow-hidden p-5 cursor-pointer" onClick={() => handleChartClick(null, 'debit')}>
              <div className="w-full h-3 left-0 top-0 absolute bg-cyan-700"></div>
              <div className="text-black text-lg font-bold opacity-60 mb-2">Tren Debit Air Real-Time</div>
              <div className="w-full h-40 relative mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dataLogs} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="curveGradientMob" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#4c1d95" />
                        <stop offset="50%" stopColor="#f43f5e" />
                        <stop offset="100%" stopColor="#fdba74" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#000000" strokeWidth={1} horizontal={false} opacity={0.2} />
                    <XAxis dataKey="jam" tickLine={false} axisLine={false} stroke="#000" fontSize={8} fontStyle="bold" fontFamily="Inter" />
                    <YAxis hide domain={[0, 70]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="debit_air" stroke="url(#curveGradientMob)" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Analisis Mingguan */}
            <div className="bg-gradient-to-b from-white to-sky-100 rounded-xl shadow-lg overflow-hidden flex flex-col pb-4 cursor-pointer" onClick={() => handleChartClick(null, 'mingguan')}>
              <div className="w-full h-3 bg-teal-400"></div>
              <div className="px-4 pt-3">
                <div className="w-full text-black text-lg font-bold opacity-60 whitespace-nowrap tracking-tight truncate">Analisis Ketinggian & Debit Mingguan</div>
              </div>
              <div className="flex-1 px-2 mt-4 space-y-4">
                <div className="w-full h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dataGrafikMingguan} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                      <XAxis dataKey="hari" tickLine={false} axisLine={false} stroke="#000" fontSize={12} fontWeight="bold" fontFamily="Poppins" />
                      <YAxis hide />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="tinggi_rata2" stackId="a" fill="#2dd4bf" maxBarSize={30} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="tinggi_maks" stackId="a" fill="#7c3aed" maxBarSize={30} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dataGrafikMingguan} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                      <XAxis dataKey="hari" tickLine={false} axisLine={false} stroke="#000" fontSize={12} fontWeight="bold" fontFamily="Poppins" />
                      <YAxis hide />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="tinggi_rata2" stackId="b" fill="#2dd4bf" maxBarSize={30} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="tinggi_maks" stackId="b" fill="#f87171" maxBarSize={30} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

          </div>
          </>
        ) : activePage === 'search' ? (
          <div className="bg-white/20 p-4 rounded-3xl shadow-xl backdrop-blur-sm flex flex-col gap-4 mb-4">
            <h2 className="text-white text-lg font-bold font-['Poppins']">
              {searchQuery ? `Hasil Pencarian: "${searchQuery}"` : 'Pilih Sungai'}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {daftarSungai.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())).map((sungai, idx) => (
                <div 
                  key={idx} 
                  className="bg-white rounded-xl overflow-hidden shadow-lg cursor-pointer hover:scale-[1.02] transition-transform duration-300 flex flex-col"
                  onClick={() => { 
                    setCurrentRiver(sungai.name); 
                    setCurrentImage(sungai.image); 
                    setSearchQuery(''); 
                    setActivePage('dashboard'); 
                  }}
                >
                  <img src={sungai.image} alt={sungai.name} className="w-full h-24 object-cover" />
                  <div className="p-3 flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-800 font-['Poppins'] leading-tight">{sungai.name}</h3>
                  </div>
                </div>
              ))}
              {daftarSungai.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                <div className="col-span-2 py-8 text-center text-white/80 text-sm font-semibold italic">
                  Sungai tidak ditemukan.
                </div>
              )}
            </div>
          </div>
        ) : null}
        </main>
        
        {/* Bagian Tabel Detail juga di-handle khusus untuk HP supaya muat ke layar kecil */}
        {activePage === 'table' && (
          <TableView 
            tableType={tableType}
            dataLogs={filteredDataLogs}
            dataTabelBulanan={filteredTabelBulanan}
            onBack={handleBackToDashboard}
            currentRiver={currentRiver}
            isMobile={true}
          />
        )}
      </div>
    );
  }

  // ================= TAMPILAN KHUSUS DESKTOP (TIDAK ADA YANG DIUBAH / TETAP UTUH) =================
  return ( 
    <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-slate-900 overflow-hidden"> 
      <div 
        className="w-[1920px] h-[1080px] relative bg-gradient-to-b from-cyan-700 via-teal-400 via-[73%] to-green-200 overflow-hidden shadow-2xl shrink-0" 
        style={{ transform: `scale(${scale.x}, ${scale.y})`, transformOrigin: 'center' }} 
      > 
        <style> 
          {`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@400;700&display=swap');`} 
        </style> 

        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
          onNavigate={handleNavigate}
        />

        {/* ================= MAIN LAYOUT CONTAINER (FLEXBOX) ================= */}
        <main className="absolute inset-0 p-14 flex gap-8">
          
          {/* === LEFT COLUMN === */}
          <div className="flex-1 flex flex-col gap-8">
            
            {/* Header Section (Title & Search) */}
            <header className="flex flex-col items-center justify-center pt-2 pb-2">
              <div className="flex items-center justify-center gap-8 z-10">
                <button onClick={() => setIsSidebarOpen(true)} className="text-white p-3 rounded-full hover:bg-white/10 transition-colors">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </button>
                <h1 className="text-white text-7xl font-extrabold font-['Poppins'] [text-shadow:_0px_4px_4px_rgb(0_0_0_/_0.25)] select-none tracking-wide">Hydroguard Interactive</h1>
              </div>
              <div className="w-[1100px] h-24 mt-8 z-20 flex gap-4">
                <form onSubmit={(e) => { e.preventDefault(); setActivePage('search'); }} className="relative flex-1 h-full">
                  <input
                    type="text"
                    placeholder="Cari nama sungai..."
                    className="w-full h-full pl-24 pr-44 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/60 backdrop-blur-md outline-none focus:bg-white/20 focus:border-white/40 transition-all font-['Poppins'] text-2xl shadow-lg"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setActivePage('search'); }}
                    onFocus={() => setActivePage('search')}
                  />
                  <svg className="w-10 h-10 absolute left-8 top-7 text-white/60 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  <button type="submit" className="absolute right-4 top-4 bottom-4 bg-teal-500 hover:bg-teal-400 text-white px-12 rounded-full font-bold transition-colors text-xl flex items-center justify-center shadow-md cursor-pointer">
                    Cari
                  </button>
                </form>
                {activePage === 'search' && (
                  <button onClick={() => { setActivePage('dashboard'); setSearchQuery(''); }} className="bg-red-500 hover:bg-red-400 text-white px-10 rounded-full font-bold transition-colors text-2xl shadow-md cursor-pointer">
                    Batal
                  </button>
                )}
              </div>
            </header>

            {/* Charts Section (Grid) */}
            {activePage === 'dashboard' ? (
            <div className="flex-1 grid grid-cols-2 gap-8 p-6 bg-gradient-to-b from-white/20 to-sky-100/20 to-72% rounded-3xl shadow-lg backdrop-blur-sm">
              {/* 1. CARD BLOCK: ANALISIS MINGGUAN BAR CHART */}
              <div className="bg-gradient-to-b from-white to-sky-100 rounded-xl shadow-lg overflow-hidden flex flex-col justify-between">
                <div className="w-full h-5 bg-teal-400"></div>
                <div className="px-5 pt-3">
                  <h2 className="w-full text-black text-2xl font-bold font-['Poppins'] leading-tight opacity-60 whitespace-nowrap tracking-tight truncate">Analisis Ketinggian & Debit Mingguan</h2>
                </div>
                <div className="flex-1 px-6 mt-4 space-y-4 flex flex-col justify-center cursor-pointer hover:scale-[1.02] transition-transform" onClick={() => handleChartClick(null, 'mingguan')}>
                  <div className="w-full h-44">
                    <ResponsiveContainer width="100%" height="100%"><BarChart data={dataGrafikMingguan} barCategoryGap="20%" margin={{ top: 10, right: 15, left: -15, bottom: 0 }}><XAxis dataKey="hari" tickLine={false} axisLine={false} stroke="#000" fontSize={15} fontWeight="bold" fontFamily="Poppins" /><YAxis hide /><Tooltip content={<CustomTooltip />} /><Bar dataKey="tinggi_rata2" stackId="a" fill="#2dd4bf" maxBarSize={48} radius={[4, 4, 0, 0]} /><Bar dataKey="tinggi_maks" stackId="a" fill="#7c3aed" maxBarSize={48} radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer>
                  </div>
                  <div className="w-full h-44">
                    <ResponsiveContainer width="100%" height="100%"><BarChart data={dataGrafikMingguan} barCategoryGap="20%" margin={{ top: 10, right: 15, left: -15, bottom: 0 }}><XAxis dataKey="hari" tickLine={false} axisLine={false} stroke="#000" fontSize={15} fontWeight="bold" fontFamily="Poppins" /><YAxis hide /><Tooltip content={<CustomTooltip />} /><Bar dataKey="tinggi_rata2" stackId="b" fill="#2dd4bf" maxBarSize={48} radius={[4, 4, 0, 0]} /><Bar dataKey="tinggi_maks" stackId="b" fill="#f87171" maxBarSize={48} radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer>
                  </div>
                </div>
                <div className="px-5 py-4 flex gap-6 items-center">
                  <div className="flex items-center gap-1.5"><div className="w-5 h-4 bg-linear-221 from-red-400 to-orange-200 rounded-xs border border-black/10"></div><span className="text-black text-[8.25px] font-semibold font-['Poppins']">Ketinggian Air (m)</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-5 h-4 bg-linear-221 from-violet-900 to-fuchsia-700 rounded-xs border border-black/10"></div><span className="text-black text-[8.25px] font-semibold font-['Poppins']">Debit Air (m³/s)</span></div>
                </div>
              </div>

              {/* Stack of 2 cards on the right */}
              <div className="flex flex-col gap-8">
                {/* 2. CARD BLOCK: INTENSITAS CURAH HUJAN */}
                <div className="flex-1 bg-gradient-to-b from-white via-white to-sky-100 rounded-xl shadow-lg overflow-hidden p-6 cursor-pointer hover:scale-105 transition-transform flex flex-col" onClick={() => handleChartClick(null, 'curah_hujan')}>
                  <div className="w-full h-5 bg-teal-600 -m-6 mb-6"></div>
                  <h2 className="text-black text-2xl font-bold font-['Poppins'] leading-tight opacity-60">Intensitas Curah Hujan</h2>
                  <div className="text-black text-7xl font-bold font-['Poppins'] mt-4">{latestData.curah_hujan.toString().replace('.', ',')}</div>
                  <div className="text-black text-2xl font-bold font-['Inter'] mt-1 flex items-center gap-2">Naik 20%<div className="w-9 h-6 bg-red-400 rounded flex items-center justify-center text-white text-sm">▲</div></div>
                  <div className="flex-1"></div>
                  <h3 className="text-black text-lg font-normal font-['Inter']">Curah Hujan Perhari</h3>
                  <div className="w-full h-4 bg-teal-400 rounded-full overflow-hidden mt-2 relative"><div className="absolute left-0 top-0 h-full bg-gradient-to-r from-red-400 to-orange-200 rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (latestData.curah_hujan / 100) * 100)}%` }}></div></div>
                </div>

                {/* 3. CARD BLOCK: TREN DEBIT AIR REAL-TIME */}
                <div className="flex-1 bg-gradient-to-b from-white to-sky-100 rounded-xl shadow-lg overflow-hidden p-6 cursor-pointer hover:scale-105 transition-transform flex flex-col" onClick={() => handleChartClick(null, 'debit')}>
                  <div className="w-full h-5 bg-cyan-700 -m-6 mb-6"></div>
                  <h2 className="text-black text-2xl font-bold font-['Poppins'] leading-tight opacity-60 mb-2">Tren Debit Air Real-Time</h2>
                  <div className="flex-1 w-full relative">
                    <ResponsiveContainer width="100%" height="100%"><LineChart data={dataLogs} margin={{ top: 5, right: 15, left: -30, bottom: 5 }}><defs><linearGradient id="curveGradient" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#4c1d95" /><stop offset="40%" stopColor="#a855f7" /><stop offset="70%" stopColor="#f43f5e" /><stop offset="100%" stopColor="#fdba74" /></linearGradient></defs><CartesianGrid stroke="#000000" strokeWidth={1.5} horizontal={false} opacity={0.8} /><XAxis dataKey="jam" tickLine={false} axisLine={false} stroke="#000" fontSize={8.44} fontStyle="bold" fontFamily="Inter" /><YAxis hide domain={[0, 70]} /><Tooltip content={<CustomTooltip />} /><Line type="monotone" dataKey="debit_air" stroke="url(#curveGradient)" strokeWidth={3.5} dot={false} /></LineChart></ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
            ) : activePage === 'search' ? (
              <div className="flex-1 bg-white/20 rounded-3xl p-8 shadow-xl backdrop-blur-md border border-white/30 overflow-y-auto">
                <h2 className="text-white text-3xl font-bold mb-8 font-['Poppins']">
                  {searchQuery ? `Hasil Pencarian: "${searchQuery}"` : 'Pilih Sungai untuk Dipantau'}
                </h2>
                <div className="grid grid-cols-4 gap-8">
                  {daftarSungai.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())).map((sungai, idx) => (
                    <div 
                      key={idx} 
                      className="bg-white rounded-3xl overflow-hidden shadow-lg cursor-pointer hover:scale-[1.03] transition-transform duration-300 flex flex-col"
                      onClick={() => { 
                        setCurrentRiver(sungai.name); 
                        setCurrentImage(sungai.image); 
                        setSearchQuery(''); 
                        setActivePage('dashboard'); 
                      }}
                    >
                      <img src={sungai.image} alt={sungai.name} className="w-full h-56 object-cover" />
                      <div className="p-6 flex items-center justify-between">
                        <h3 className="text-2xl font-bold text-slate-800 font-['Poppins']">{sungai.name}</h3>
                        <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        </div>
                      </div>
                    </div>
                  ))}
                  {daftarSungai.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                    <div className="col-span-full py-20 text-center flex flex-col items-center justify-center gap-4">
                      <svg className="w-20 h-20 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      <span className="text-white/80 text-2xl font-semibold italic">Sungai "{searchQuery}" tidak ditemukan</span>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>

          {/* === RIGHT COLUMN === */}
          {activePage === 'dashboard' && (
          <div className="w-[572px] shrink-0 bg-gradient-to-b from-white to-sky-100 rounded-3xl shadow-2xl border border-white p-6 flex flex-col justify-between">
          {/* CONTAINER PREVIEW IMAGE SUNGAI */} 
          <div className="relative w-[498.77px] h-96 rounded-xl overflow-hidden shadow-md mx-auto"> 
            <img className="w-full h-full object-cover transition-all duration-500" src={currentImage} alt={currentRiver} /> 
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6"> 
              <div className="text-white text-3xl font-bold font-['Poppins'] leading-tight">{currentRiver}</div> 
              <div className="text-white text-xl font-semibold font-['Poppins'] mt-1">{currentDateFormatted}</div> 
            </div> 
          </div> 

          {/* AREA METER INDIKATOR GAUGE */} 
          <div 
            className="flex flex-col items-center justify-center flex-1 py-6 relative cursor-pointer hover:scale-105 transition-transform"
            onClick={() => handleChartClick(null, 'realtime')}
          > 
            <div className="relative w-80 h-40 overflow-hidden flex items-end justify-center"> 
              <svg className="w-full h-full absolute top-0 left-0" viewBox="0 0 100 50"> 
                <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="url(#conicGaugeGradient)" strokeWidth="10" strokeLinecap="round" /> 
                <defs> 
                  <linearGradient id="conicGaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%"> 
                    <stop offset="0%" stopColor="#84cc16" /> 
                    <stop offset="50%" stopColor="#eab308" /> 
                    <stop offset="66%" stopColor="#f97316" /> 
                    <stop offset="83%" stopColor="#ef4444" /> 
                  </linearGradient> 
                </defs> 
              </svg> 
              {/* Jarum Pointer Baru - Tampilan PC */} 
              <div 
                className="absolute w-[110px] h-4 origin-right transition-transform duration-1000 flex items-center justify-start drop-shadow-md z-0" 
                style={{ transform: `rotate(${currentTheme.angle}deg)`, right: '50%', bottom: '-8px' }} 
              >
                <svg viewBox="0 0 100 20" className="w-full h-full" preserveAspectRatio="none">
                  <polygon points="0,10 100,0 100,20" fill="#000000" />
                </svg>
              </div> 
              <div className="size-8 bg-black rounded-full absolute bottom-[-16px] left-1/2 -translate-x-1/2 z-10 border-[3px] border-white shadow-md flex items-center justify-center">
                <div className="size-2.5 rounded-full" style={{ backgroundColor: currentTheme.color }}></div>
              </div> 
            </div> 
            {/* Teks Range Skala Ukur */}
            <div className="w-80 flex justify-between text-base font-semibold font-['Poppins'] text-black mt-2 px-1"> 
              <span>0</span> <span>1.5</span> <span>3.0</span> <span>4.5</span> <span>6.0</span> 
            </div> 
            {/* Tombol Kotak Status Dinamis */} 
            <div key={latestData.status} className={`w-[384px] h-20 ${currentTheme.bg} rounded-xl flex items-center justify-center shadow-md mt-6 transition-colors duration-500 animate-in fade-in zoom-in duration-500`}> 
              <span className="text-white text-2xl font-bold font-['Poppins'] tracking-wider drop-shadow-md"> 
                {latestData.status === 'Mencari data...' ? 'Aman' : latestData.status} 
              </span> 
            </div> 
          </div> 
        
          {/* ================= 3 PANEL METRIK MINI DI BAGIAN BAWAH ================= */} 
          <div className="grid grid-cols-3 gap-4 px-2 justify-items-center"> 
            {/* Card Ketinggian */} 
            <div 
              className="w-36 h-32 bg-white border border-slate-100 rounded-xl shadow-sm relative overflow-hidden flex flex-col justify-between p-3 pb-2 text-left cursor-pointer hover:scale-105 transition-transform"
              onClick={() => handleChartClick(null, 'ketinggian')}
            > 
              <div className="w-36 h-5 bg-teal-400 absolute top-0 left-0"></div> 
              <span className="text-black text-lg font-normal font-['Poppins'] leading-tight opacity-60 mt-4 block">Ketinggian Air</span> 
              <div className="w-full flex items-baseline justify-between mt-1 gap-1">
                <span key={latestData.ketinggian_air} className="text-3xl font-semibold font-['Poppins'] text-black tracking-tighter truncate animate-in fade-in slide-in-from-bottom-2 duration-500">{latestData.ketinggian_air.toString().replace('.', ',')}</span> 
                <span className="text-black text-sm font-semibold font-['Poppins'] shrink-0">m</span> 
              </div>
            </div> 

            {/* Card Debit */} 
            <div 
              className="w-36 h-32 bg-white border border-slate-100 rounded-xl shadow-sm relative overflow-hidden flex flex-col justify-between p-3 pb-2 text-left cursor-pointer hover:scale-105 transition-transform"
              onClick={() => handleChartClick(null, 'debit')}
            > 
              <div className="w-36 h-5 bg-teal-600 absolute top-0 left-0"></div> 
              <span className="text-black text-base font-normal font-['Poppins'] leading-tight opacity-60 mt-4 block">Debit Air</span> 
              <div className="w-full flex items-baseline justify-between mt-1 gap-1">
                <span key={latestData.debit_air} className="text-3xl font-semibold font-['Poppins'] text-black tracking-tighter truncate animate-in fade-in slide-in-from-bottom-2 duration-500">{latestData.debit_air.toString().replace('.', ',')}</span> 
                <span className="text-black text-sm font-semibold font-['Poppins'] shrink-0">m³/s</span> 
              </div>
            </div> 

            {/* Card Hujan */} 
            <div 
              className="w-36 h-32 bg-white border border-slate-100 rounded-xl shadow-sm relative overflow-hidden flex flex-col justify-between p-3 pb-2 text-left cursor-pointer hover:scale-105 transition-transform"
              onClick={() => handleChartClick(null, 'curah_hujan')}
            > 
              <div className="w-36 h-5 bg-cyan-700 absolute top-0 left-0"></div> 
              <span className="text-black text-base font-normal font-['Poppins'] leading-tight opacity-60 mt-4 block">Curah Hujan</span> 
              <div className="w-full flex items-baseline justify-between mt-1 gap-1">
                <span key={latestData.curah_hujan} className="text-3xl font-semibold font-['Poppins'] text-black tracking-tighter truncate animate-in fade-in slide-in-from-bottom-2 duration-500">{latestData.curah_hujan.toString().replace('.', ',')}</span> 
                <span className="text-black text-sm font-semibold font-['Poppins'] shrink-0">mm</span> 
              </div>
            </div> 
          </div> 
        </div> 
          )}
</main>

        {/* ================= HALAMAN TABEL DETAIL ================= */} 
        {activePage === 'table' && (
          <TableView 
            tableType={tableType}
            dataLogs={filteredDataLogs}
            dataTabelBulanan={filteredTabelBulanan}
            onBack={handleBackToDashboard}
            currentRiver={currentRiver}
          />
        )}
      </div> 
    </div> 
  ); 
}