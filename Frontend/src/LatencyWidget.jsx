import React from 'react';

export default function LatencyWidget({ latencyMs, latencyDetail, onDownload, isMobile = false }) {
  if (isMobile) {
    return (
      <div className="absolute top-6 left-6 flex flex-col gap-2 z-50">
        <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/20 shadow-sm backdrop-blur-md flex items-center gap-2">
          <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse shadow-[0_0_5px_#2dd4bf]"></div>
          <span className="text-white font-['Poppins'] text-[10px] font-semibold opacity-90">E2E:</span>
          <span className="text-teal-200 font-mono text-xs font-bold">{latencyMs !== null ? `${latencyMs}ms` : '...'}</span>
        </div>
        {latencyDetail && (
          <div className="bg-black/50 px-2 py-1.5 rounded border border-white/10 text-white font-mono text-[9px] flex flex-col gap-0.5 backdrop-blur-md shadow-lg w-max">
            <div className="text-teal-200">A: {latencyDetail.serverTime}</div>
            <div className="text-sky-200">B: {latencyDetail.webTime}</div>
          </div>
        )}
        <button onClick={onDownload} className="bg-teal-600/80 hover:bg-teal-500 px-2 py-1 rounded text-[9px] text-white font-bold border border-white/20 shadow w-max transition-colors">📥 Unduh CSV</button>
      </div>
    );
  }

  return (
    <div className="absolute top-10 left-[81px] flex flex-col gap-2 z-50 transition-all">
      <div className="bg-white/10 px-5 py-2.5 rounded-2xl border border-white/20 shadow-lg backdrop-blur-md flex items-center gap-3 w-max">
        <div className="w-3 h-3 bg-teal-400 rounded-full animate-pulse shadow-[0_0_8px_#2dd4bf]"></div>
        <span className="text-white font-['Poppins'] text-base font-semibold opacity-90 tracking-wide">Response Time (E2E):</span>
        <span className="text-teal-200 font-mono text-xl font-bold drop-shadow-md">{latencyMs !== null ? `${latencyMs} ms` : 'Menghitung...'}</span>
      </div>
      {latencyDetail && (
        <div className="bg-black/50 px-4 py-2.5 rounded-xl border border-white/10 text-white font-mono text-xs flex flex-col gap-1 backdrop-blur-md shadow-xl w-max">
           <div className="text-teal-200">Titik A (Server Backend) : {latencyDetail.serverTime}</div>
           <div className="text-sky-200">Titik B (Web Ter-render): {latencyDetail.webTime}</div>
        </div>
      )}
      <button onClick={onDownload} className="bg-teal-600 hover:bg-teal-500 px-4 py-2 rounded-xl text-xs text-white font-bold border border-white/20 shadow-lg w-max flex items-center gap-2 transition-colors">
        📥 Unduh Rekapan Excel (CSV)
      </button>
    </div>
  );
}