const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());

// Buat HTTP server dari Express
const server = http.createServer(app);

// Inisialisasi Socket.io
const io = new Server(server, {
  cors: {
    origin: "*", // Mengizinkan akses dari frontend React Vite
    methods: ["GET", "POST"]
  }
});

const csvPath = path.join(__dirname, 'dummy_sensor_data.csv');
let sensorDataCache = [];

// 1. Fungsi Membaca Data dari CSV ke Memory
const loadCSV = () => {
  if (fs.existsSync(csvPath)) {
    const fileContent = fs.readFileSync(csvPath, 'utf8');
    const lines = fileContent.trim().split('\n');
    for (let i = 1; i < lines.length; i++) { // Lewati baris 0 (header)
      const values = lines[i].split(',');
      if (values.length >= 5) {
        const [ketinggian, debit, hujan, status, created_at] = values;
        const d = new Date(created_at);
        sensorDataCache.push({
          ketinggian_air: parseFloat(ketinggian),
          debit_air: parseFloat(debit),
          curah_hujan: parseFloat(hujan),
          status: status,
          created_at: created_at,
          jam: d.toLocaleTimeString('id-ID', { hour12: false }),
          tanggal: d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        });
      }
    }
    console.log(`✅ Berhasil memuat ${sensorDataCache.length} baris data dari CSV!`);
  } else {
    console.warn('⚠️ File dummy_sensor_data.csv tidak ditemukan. Jalankan node generate_csv.js dulu!');
  }
};
loadCSV();

// 2. API Endpoints untuk Initial Load Frontend
app.get('/api/sensor-data', (req, res) => {
  // Ambil 50 data TERBARU dari memory (cache CSV)
  res.json(sensorDataCache.slice(-50));
});

app.get('/api/sensor-data/weekly', (req, res) => {
  res.json([]); // Sementara dikosongkan agar React tidak error
});

app.get('/api/sensor-data/monthly', (req, res) => {
  res.json([]); // Sementara dikosongkan agar React tidak error
});

// 3. Koneksi Socket.io
io.on('connection', (socket) => {
  console.log('🔌 Klien baru terhubung via Socket.io');
  socket.on('disconnect', () => {
    console.log('🔌 Klien terputus');
  });
});

// 4. SIMULASI SENSOR: Tambah otomatis ke CSV & Broadcast via Socket.io tiap 15 detik
setInterval(() => {
  // ---------------------------------------------------------
  // PENGUJIAN RESPONSE TIME (END-TO-END LATENCY)
  // Titik A: Catat waktu persis saat akuisisi sensor (sebelum disimpan ke CSV)
  // ---------------------------------------------------------
  const waktu_akuisisi = Date.now();

  const ketinggian = parseFloat((Math.random() * 3 + 2).toFixed(2)); 
  let status = 'Aman';
  if (ketinggian >= 5.00) status = 'Awas';
  else if (ketinggian >= 4.00) status = 'Siaga';
  else if (ketinggian >= 3.00) status = 'Waspada';
  
  const debit = parseFloat((ketinggian * 22 + (Math.random() * 5 - 2.5)).toFixed(2));
  const hujan = parseFloat(Math.max(0, (ketinggian * 12 + (Math.random() * 8 - 4))).toFixed(2));
  
  const now = new Date();
  const jam = now.toLocaleTimeString('id-ID', { hour12: false });
  const tanggal = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const tzOffset = now.getTimezoneOffset() * 60000;
  const formattedDate = new Date(now.getTime() - tzOffset).toISOString().slice(0, 19).replace('T', ' ');

  const newRecord = {
    ketinggian_air: ketinggian,
    debit_air: debit,
    curah_hujan: hujan,
    status: status,
    created_at: formattedDate,
    jam: jam,
    tanggal: tanggal
  };

  // Simpan ke memory
  sensorDataCache.push(newRecord);

  // Simpan baris baru ke CSV secara langsung
  const csvLine = `\n${ketinggian.toFixed(2)},${debit.toFixed(2)},${hujan.toFixed(2)},${status},${formattedDate}`;
  fs.appendFile(csvPath, csvLine, (err) => {
    if (err) {
      console.error('❌ Gagal append CSV:', err);
    }
    
    // Tetap broadcast ke Frontend walaupun CSV gagal di-append (misal file sedang dibuka di Excel)
    const dataToBroadcast = { ...newRecord, waktu_akuisisi: waktu_akuisisi };
    io.emit('newData', dataToBroadcast);
  });
}, 5000); // Dipercepat dari 15 detik menjadi 5 detik

const PORT = 5000;
// CATATAN: Pastikan memanggil server.listen() bukan app.listen() jika pakai Socket.io
server.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});