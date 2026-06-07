const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mysql = require('mysql2');
const cors = require('cors');

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

// 1. Konfigurasi Database MySQL (XAMPP)
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',      // Default XAMPP username
  password: '',      // Default XAMPP password (kosong)
  database: 'hydro_db' 
});

db.connect((err) => {
  if (err) {
    console.error('❌ Gagal koneksi ke MySQL:', err);
  } else {
    console.log('✅ Berhasil terkoneksi ke Database MySQL XAMPP!');

    // AUTO-SEEDER: Cek apakah data kurang dari 50, kalau iya isi otomatis!
    db.query('SELECT COUNT(*) AS total FROM sensor_logs', (err, results) => {
      if (!err && results[0].total < 50) {
        console.log('🔄 Database masih kosong. Memasukkan 50 data dummy otomatis...');
        
        const values = [];
        const now = new Date();
        let tempTMA = 2.15;
        
        for (let i = 50; i > 0; i--) {
          const d = new Date(now.getTime() - i * 15000); // Mundur 15 detik per data
          
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
          
          const jam = d.toLocaleTimeString('id-ID', { hour12: false });
          const tanggal = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
          // Format waktu (created_at) ke standar MySQL YYYY-MM-DD HH:MM:SS
          const localDate = new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().slice(0, 19).replace('T', ' ');

          values.push([parseFloat(tempTMA.toFixed(2)), parseFloat(tempDebit.toFixed(2)), parseFloat(tempHujan.toFixed(2)), status, jam, tanggal, localDate]);
        }
        
        const query = 'INSERT INTO sensor_logs (ketinggian_air, debit_air, curah_hujan, status, jam, tanggal, created_at) VALUES ?';
        db.query(query, [values], (err) => {
          if (err) console.error('❌ Gagal auto-insert:', err);
          else console.log('✅ 50 Data awal berhasil ditambahkan! Silakan refresh browser kamu.');
        });
      }
    });
  }
});

// 2. API Endpoints untuk Initial Load Frontend
app.get('/api/sensor-data', (req, res) => {
  // Ambil 50 data TERBARU, lalu urutkan kembali dari lama ke baru agar grafik berjalan maju
  const query = 'SELECT * FROM (SELECT * FROM sensor_logs ORDER BY created_at DESC LIMIT 50) sub ORDER BY created_at ASC';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
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

// 4. SIMULASI SENSOR: Insert otomatis ke MySQL & Broadcast via Socket.io tiap 15 detik
setInterval(() => {
  // ---------------------------------------------------------
  // PENGUJIAN RESPONSE TIME (END-TO-END LATENCY)
  // Titik A: Catat waktu persis saat akuisisi sensor (sebelum disimpan)
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

  const query = 'INSERT INTO sensor_logs (ketinggian_air, debit_air, curah_hujan, status, jam, tanggal) VALUES (?, ?, ?, ?, ?, ?)';
  
  // Simpan data baru ke MySQL
  db.query(query, [ketinggian, debit, hujan, status, jam, tanggal], (err, results) => {
    if (!err) {
      // Ambil data yang baru saja disimpan beserta timestamp (created_at) dari MySQL
      db.query('SELECT * FROM sensor_logs WHERE id = ?', [results.insertId], (err, rows) => {
        if (!err && rows.length > 0) {
          // Copy objek dari MySQL dan sisipkan Titik A agar aman dikirim ke Frontend
          const dataToBroadcast = { ...rows[0], waktu_akuisisi: waktu_akuisisi };
          
          // Broadcast ke Frontend secara Real-Time agar Latency bisa diukur!
          io.emit('newData', dataToBroadcast);
        }
      });
    }
  });
}, 15000);

const PORT = 5000;
// CATATAN: Pastikan memanggil server.listen() bukan app.listen() jika pakai Socket.io
server.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});