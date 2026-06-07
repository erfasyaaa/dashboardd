import React from 'react';

export default function TableView({ tableType, dataLogs, dataTabelBulanan, onBack, isMobile = false }) {
  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 bg-[#01798B] flex flex-col p-4 animate-in fade-in duration-200">
        <div className="flex flex-col gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-teal-400 rounded-full"></div>
            <h1 className="text-xl font-extrabold text-white font-['Poppins'] drop-shadow-md">
              Data Riwayat {tableType === 'mingguan' ? '30 Hari Terakhir' : 
                            tableType === 'realtime' ? 'Keseluruhan' : 
                            tableType === 'ketinggian' ? 'Ketinggian Air' :
                            tableType === 'debit' ? 'Debit Air' : 
                            'Curah Hujan'}
            </h1>
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
           <h1 className="text-5xl font-extrabold text-white font-['Poppins'] drop-shadow-md">
             Data Riwayat {tableType === 'mingguan' ? '30 Hari Terakhir' : 
                           tableType === 'realtime' ? 'Keseluruhan (Real-Time)' : 
                           tableType === 'ketinggian' ? 'Ketinggian Air' :
                           tableType === 'debit' ? 'Debit Air' : 
                           'Curah Hujan'}
           </h1>
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
}