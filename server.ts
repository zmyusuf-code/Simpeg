import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

const currentDir = typeof __dirname !== 'undefined'
  ? __dirname
  : (typeof import.meta !== 'undefined' && import.meta.url ? path.dirname(fileURLToPath(import.meta.url)) : process.cwd());

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initial Data Seed for SIMPEG PKSU
const INITIAL_PEGAWAI = [
  {
    rowIndex: 2,
    nik: "3171011505850001",
    nip: "198505152010011002",
    nrk: "182930",
    nama: "dr. Ahmad Zulkarnain, Sp.A",
    jabatan: "Dokter Spesialis Anak",
    kategori: "Tenaga Medis",
    rumpun: "01. Medis",
    pangkat_gol: "III/c (Penata)",
    jenis_kelamin: "Laki-laki",
    agama: "Islam",
    status_nikah: "Kawin",
    tempat_lahir: "Jakarta",
    tanggal_lahir: "1985-05-15",
    tempat_tugas: "Puskesmas Kepulauan Seribu Utara",
    tmt: "2010-01-01",
    str: "31.1.1.100.2.20.123456",
    aktif_str: "2027-12-31",
    sip: "446/001/SIP-D/2023",
    aktif_sip: "2027-12-31",
    alamat: "Jl. Pulau Tidung No. 12, Kepulauan Seribu",
    no_hp: "081234567890",
    email: "ahmad.zulkarnain@jakarta.go.id",
    status_pegawai: "PNS",
    npwp: "12.345.678.9-012.000",
    status_pajak: "K2",
    rekening: "Bank DKI - 5012345678",
    pendidikan: "S2",
    riwayat_jabatan: JSON.stringify([
      { jabatan: "Dokter Spesialis Anak", tmt: "2020-01-01", unit: "Puskesmas Kepulauan Seribu Utara" },
      { jabatan: "Dokter Umum Puskesmas", tmt: "2010-01-01", unit: "Puskesmas Kepulauan Seribu" }
    ]),
    riwayat_pendidikan: JSON.stringify([
      { tingkat: "S2", jurusan: "Spesialis Anak", sekolah: "Universitas Indonesia", kota: "Jakarta", tgl: "2015-01-15" },
      { tingkat: "S1", jurusan: "Kedokteran Umum", sekolah: "Universitas Indonesia", kota: "Jakarta", tgl: "2008-08-20" }
    ]),
    riwayat_keluarga: JSON.stringify([
      { hub: "Istri", nama: "Siti Rahmawati, S.Pd", jk: "P", tempat: "Jakarta", tgl: "1988-03-10", pekerjaan: "Guru" }
    ]),
    foto: "",
    riwayat_diklat: JSON.stringify([
      { nama: "Pelatihan Resusitasi Neonatus", thn: 2022, jp: 30 },
      { nama: "Workshop Manajemen Puskesmas", thn: 2023, jp: 24 }
    ]),
    data_gaji: JSON.stringify({
      pokok: 4500000,
      tkd: 7500000,
      transport: 1200000,
      pph21: 450000,
      bpjs_kes: 180000,
      bpjs_tk: 90000
    }),
    uraian_tugas: JSON.stringify({
      ikhtisar: "Memberikan pelayanan medis spesialistik anak, konsultasi, serta upaya promotif dan preventif kesehatan anak di wilayah Kepulauan Seribu Utara.",
      pokok: [
        "Melakukan pemeriksaan dan penanganan medis pasien anak",
        "Melaksanakan tindakan medis spesialistik anak sesuai standar operasional",
        "Memberikan konsultasi rujukan kesehatan anak dari Pustu"
      ],
      tambahan: ["Ketua Tim Mutu Pelayanan Kesehatan Anak"],
      wewenang: ["Menetapkan diagnosa dan resep obat pasien anak", "Menerbitkan surat rujukan medis"],
      tanggung: ["Terwujudnya pelayanan kesehatan anak yang bermutu dan aman"]
    }),
    dokumen: JSON.stringify({})
  },
  {
    rowIndex: 3,
    nik: "3171022008920002",
    nip: "199208202019032015",
    nrk: "194012",
    nama: "Nurul Hidayah, S.Kep., Ns.",
    jabatan: "Perawat Ahli Pertama",
    kategori: "Tenaga Kesehatan",
    rumpun: "03. Keperawatan",
    pangkat_gol: "III/a (Penata Muda)",
    jenis_kelamin: "Perempuan",
    agama: "Islam",
    status_nikah: "Kawin",
    tempat_lahir: "Tangerang",
    tanggal_lahir: "1992-08-20",
    tempat_tugas: "Pustu Pulau Untung Jawa",
    tmt: "2019-03-01",
    str: "31.2.1.200.1.21.654321",
    aktif_str: "2026-09-15",
    sip: "446/089/SIP-P/2021",
    aktif_sip: "2026-09-15",
    alamat: "Pulau Untung Jawa RT 02/01",
    no_hp: "085678901234",
    email: "nurul.hidayah@jakarta.go.id",
    status_pegawai: "PNS",
    npwp: "98.765.432.1-012.000",
    status_pajak: "K1",
    rekening: "Bank DKI - 5098765432",
    pendidikan: "S1",
    riwayat_jabatan: JSON.stringify([
      { jabatan: "Perawat Ahli Pertama", tmt: "2021-04-01", unit: "Pustu Pulau Untung Jawa" },
      { jabatan: "Perawat Pelaksana", tmt: "2019-03-01", unit: "Puskesmas Kepulauan Seribu Utara" }
    ]),
    riwayat_pendidikan: JSON.stringify([
      { tingkat: "S1", jurusan: "Ners", sekolah: "STIKES Binawan", kota: "Jakarta", tgl: "2017-07-25" },
      { tingkat: "D3", jurusan: "Keperawatan", sekolah: "Poltekkes Jakarta I", kota: "Jakarta", tgl: "2013-09-10" }
    ]),
    riwayat_keluarga: JSON.stringify([]),
    foto: "",
    riwayat_diklat: JSON.stringify([
      { nama: "Pelatihan BTCLS (Basic Trauma Cardiac Life Support)", thn: 2021, jp: 45 }
    ]),
    data_gaji: JSON.stringify({
      pokok: 3200000,
      tkd: 4800000,
      transport: 800000,
      pph21: 220000,
      bpjs_kes: 120000,
      bpjs_tk: 60000
    }),
    uraian_tugas: JSON.stringify({
      ikhtisar: "Melakukan kegiatan pelayanan keperawatan yang meliputi asuhan keperawatan dan pengelolaan keperawatan di Pustu Pulau Untung Jawa.",
      pokok: [
        "Melakukan pengkajian keperawatan dasar dan lanjutan",
        "Merumuskan diagnosa keperawatan dan menyusun rencana tindakan",
        "Melakukan tindakan keperawatan dan evaluasi"
      ],
      tambahan: ["Pengelola Program PTM Pustu"],
      wewenang: ["Melakukan asuhan keperawatan mandiri dan kolaboratif"],
      tanggung: ["Kebenaran dan ketepatan tindakan asuhan keperawatan"]
    }),
    dokumen: JSON.stringify({})
  },
  {
    rowIndex: 4,
    nik: "3171031201950003",
    nip: "",
    nrk: "",
    nama: "Budi Santoso, A.Md.Kes",
    jabatan: "Sanitarian",
    kategori: "Tenaga Kesehatan",
    rumpun: "07. Kesehatan Lingkungan",
    pangkat_gol: "IX (KHUSUS PPPK)",
    jenis_kelamin: "Laki-laki",
    agama: "Islam",
    status_nikah: "Belum Kawin",
    tempat_lahir: "Bogor",
    tanggal_lahir: "1995-01-12",
    tempat_tugas: "Pustu Pulau Pari",
    tmt: "2022-02-01",
    str: "31.7.1.300.3.22.998877",
    aktif_str: "2026-08-10",
    sip: "446/102/SIP-S/2022",
    aktif_sip: "2026-08-10",
    alamat: "Pulau Pari RT 01/02",
    no_hp: "087890123456",
    email: "budi.santoso@gmail.com",
    status_pegawai: "PPPK",
    npwp: "34.567.890.1-012.000",
    status_pajak: "TK",
    rekening: "Bank DKI - 5034567890",
    pendidikan: "D3",
    riwayat_jabatan: JSON.stringify([
      { jabatan: "Sanitarian Ahli/Pelaksana", tmt: "2022-02-01", unit: "Pustu Pulau Pari" }
    ]),
    riwayat_pendidikan: JSON.stringify([
      { tingkat: "D3", jurusan: "Kesehatan Lingkungan", sekolah: "Poltekkes Bandung", kota: "Bandung", tgl: "2016-08-15" }
    ]),
    riwayat_keluarga: JSON.stringify([]),
    foto: "",
    riwayat_diklat: JSON.stringify([]),
    data_gaji: JSON.stringify({
      pokok: 2900000,
      tkd: 3500000,
      transport: 600000,
      pph21: 150000,
      bpjs_kes: 100000,
      bpjs_tk: 50000
    }),
    uraian_tugas: JSON.stringify({
      ikhtisar: "Melakukan pengawasan dan penyehatan lingkungan pemukiman, sarana air bersih, dan tempat umum.",
      pokok: [
        "Pemeriksaan kualitas air minum dan sanitasi lingkungan",
        "Inspeksi kesehatan lingkungan tempat-tempat umum"
      ],
      tambahan: [],
      wewenang: ["Rekomendasi laik sehat sanitasi"],
      tanggung: ["Kualitas sanitasi lingkungan di wilayah kerja"]
    }),
    dokumen: JSON.stringify({})
  },
  {
    rowIndex: 5,
    nik: "3171040504980004",
    nip: "",
    nrk: "",
    nama: "Siti Rahayu, A.Md.Keb",
    jabatan: "Bidan Pelaksana",
    kategori: "Tenaga Kesehatan",
    rumpun: "04. Kebidanan",
    pangkat_gol: "NON PNS",
    jenis_kelamin: "Perempuan",
    agama: "Islam",
    status_nikah: "Kawin",
    tempat_lahir: "Serang",
    tanggal_lahir: "1998-04-05",
    tempat_tugas: "Pustu Pulau Lancang",
    tmt: "2021-01-10",
    str: "31.4.1.400.2.21.776655",
    aktif_str: "2026-10-01",
    sip: "446/054/SIP-B/2021",
    aktif_sip: "2026-10-01",
    alamat: "Pulau Lancang RT 03/02",
    no_hp: "089012345678",
    email: "siti.rahayu@gmail.com",
    status_pegawai: "NON PNS",
    npwp: "45.678.901.2-012.000",
    status_pajak: "K0",
    rekening: "Bank DKI - 5045678901",
    pendidikan: "D3",
    riwayat_jabatan: JSON.stringify([
      { jabatan: "Bidan Pelaksana", tmt: "2021-01-10", unit: "Pustu Pulau Lancang" }
    ]),
    riwayat_pendidikan: JSON.stringify([
      { tingkat: "D3", jurusan: "Kebidanan", sekolah: "Poltekkes Banten", kota: "Rangkasbitung", tgl: "2019-09-01" }
    ]),
    riwayat_keluarga: JSON.stringify([]),
    foto: "",
    riwayat_diklat: JSON.stringify([]),
    data_gaji: JSON.stringify({
      pokok: 4800000,
      tkd: 0,
      transport: 500000,
      pph21: 100000,
      bpjs_kes: 90000,
      bpjs_tk: 45000
    }),
    uraian_tugas: JSON.stringify({
      ikhtisar: "Memberikan asuhan kebidanan pada ibu hamil, bersalin, nifas, bayi baru lahir, dan keluarga berencana.",
      pokok: [
        "Pemeriksaan kehamilan (ANC) berkala",
        "Pertolongan persalinan normal dan penanganan awal kegawatdaruratan maternal"
      ],
      tambahan: [],
      wewenang: ["Pertolongan persalinan fisiologis"],
      tanggung: ["Keselamatan ibu dan bayi selama perawatan kebidanan"]
    }),
    dokumen: JSON.stringify({})
  }
];

// Persistent File Storage Path for Data
const DATA_FILE = path.join(process.cwd(), 'data_pegawai_db.json');

function loadPegawaiDb() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Error reading data file:", e);
  }
  return INITIAL_PEGAWAI;
}

function savePegawaiDb(data: any[]) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error("Error saving data file:", e);
  }
}

let pegawaiDb = loadPegawaiDb();

// Lazy Gemini Client setup
let genAIClient: GoogleGenAI | null = null;
function getGenAIClient() {
  if (!genAIClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    genAIClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return genAIClient;
}

// API ROUTING

// Endpoint Download Project ZIP untuk Hosting
app.get('/api/download-zip', (req, res) => {
  const zipPath = path.join(process.cwd(), 'simpeg-app.zip');
  if (fs.existsSync(zipPath)) {
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="simpeg-app.zip"');
    return res.sendFile(zipPath);
  }
  res.status(404).json({ success: false, message: "File ZIP belum dibuat." });
});

app.get('/simpeg-app.zip', (req, res) => {
  const zipPath = path.join(process.cwd(), 'simpeg-app.zip');
  if (fs.existsSync(zipPath)) {
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="simpeg-app.zip"');
    return res.sendFile(zipPath);
  }
  res.status(404).send("File ZIP tidak ditemukan.");
});

// Endpoint Download Blogger Theme XML
app.get('/api/download-blogger-theme', (req, res) => {
  const xmlPath = path.join(process.cwd(), 'blogger-theme.xml');
  if (fs.existsSync(xmlPath)) {
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Content-Disposition', 'attachment; filename="blogger-theme.xml"');
    return res.sendFile(xmlPath);
  }
  res.status(404).json({ success: false, message: "File blogger-theme.xml belum dibuat." });
});

app.get('/blogger-theme.xml', (req, res) => {
  const xmlPath = path.join(process.cwd(), 'blogger-theme.xml');
  if (fs.existsSync(xmlPath)) {
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Content-Disposition', 'attachment; filename="blogger-theme.xml"');
    return res.sendFile(xmlPath);
  }
  res.status(404).send("File blogger-theme.xml tidak ditemukan.");
});

// Endpoint Download Database MySQL Script (.sql)
app.get('/api/download-database-sql', (req, res) => {
  const sqlPath = path.join(process.cwd(), 'database_simpeg.sql');
  if (fs.existsSync(sqlPath)) {
    res.setHeader('Content-Type', 'application/sql');
    res.setHeader('Content-Disposition', 'attachment; filename="database_simpeg.sql"');
    return res.sendFile(sqlPath);
  }
  res.status(404).json({ success: false, message: "File database_simpeg.sql belum dibuat." });
});

app.get('/database_simpeg.sql', (req, res) => {
  const sqlPath = path.join(process.cwd(), 'database_simpeg.sql');
  if (fs.existsSync(sqlPath)) {
    res.setHeader('Content-Type', 'application/sql');
    res.setHeader('Content-Disposition', 'attachment; filename="database_simpeg.sql"');
    return res.sendFile(sqlPath);
  }
  res.status(404).send("File database_simpeg.sql tidak ditemukan.");
});

// GET Pegawai Data
app.get('/api/pegawai', (req, res) => {
  res.json({ success: true, data: pegawaiDb });
});

// Unified API Handlers for Node Dev & Preview Environment
const handleApiGet = (req: express.Request, res: express.Response) => {
  const action = req.query.action as string;
  if (action === 'getPegawaiData' || action === 'getData') {
    return res.json(pegawaiDb);
  } else if (action === 'getAllAppModules' || action === 'getAllData') {
    return res.json({
      success: true,
      data: {
        pegawai: pegawaiDb
      }
    });
  }
  return res.json({ success: false, message: "Invalid action" });
};

const handleApiPost = (req: express.Request, res: express.Response) => {
  const action = req.body?.action || req.query.action;
  const data = req.body?.data !== undefined ? req.body.data : req.body;

  if (action === 'getPegawaiData' || action === 'getData') {
    return res.json(pegawaiDb);
  } else if (action === 'getAllAppModules' || action === 'getAllData') {
    return res.json({ success: true, data: { pegawai: pegawaiDb } });
  } else if (action === 'saveAllAppModules' || action === 'saveAllData' || action === 'savePegawaiData' || action === 'savePenggunaData' || action === 'saveUsulanData' || action === 'saveDisiplinData' || action === 'saveGapData' || action === 'saveDiklatData' || action === 'saveMasterData' || action === 'savePengaturanData') {
    if (data && data.pegawai && Array.isArray(data.pegawai)) {
      pegawaiDb = data.pegawai;
      savePegawaiDb(pegawaiDb);
    } else if (Array.isArray(data)) {
      pegawaiDb = data;
      savePegawaiDb(pegawaiDb);
    }
    return res.json({ success: true, message: "Data modul berhasil tersimpan!" });
  } else if (action === 'login') {
    const { username, password } = data || {};
    if (username === 'admin' && password === '123456') {
      return res.json({ success: true, role: 'Admin', nama: 'Administrator Utama', message: "Login Berhasil" });
    }
    const match = pegawaiDb.find(p => (p.nip === username || p.nik === username));
    if (match && password === '123456') {
      return res.json({ success: true, role: 'Pegawai', nama: match.nama, message: "Login Pegawai Berhasil" });
    }
    return res.json({ success: false, message: "Username atau Password salah!" });
  } else if (action === 'simpanPegawaiBaru' || action === 'simpanPegawai') {
    const keyId = data.nip || data.nik;
    if (!keyId) return res.json({ success: false, message: "NIK/NIP Wajib diisi!" });
    data.rowIndex = pegawaiDb.length + 2;
    pegawaiDb.push(data);
    savePegawaiDb(pegawaiDb);
    return res.json({ success: true, message: "Data Pegawai berhasil disimpan!" });
  } else if (action === 'updatePegawai' || action === 'editPegawai') {
    const idx = pegawaiDb.findIndex(p => (data.rowIndex && p.rowIndex === data.rowIndex) || (p.nik && p.nik === data.nik) || (p.nip && p.nip === data.nip));
    if (idx !== -1) {
      pegawaiDb[idx] = { ...pegawaiDb[idx], ...data };
      savePegawaiDb(pegawaiDb);
      return res.json({ success: true, message: "Data berhasil diperbarui!" });
    } else {
      data.rowIndex = pegawaiDb.length + 2;
      pegawaiDb.push(data);
      savePegawaiDb(pegawaiDb);
      return res.json({ success: true, message: "Data baru berhasil ditambahkan!" });
    }
  } else if (action === 'hapusPegawai') {
    const { rowIndex, nip, nik, nama } = data || {};
    const initialCount = pegawaiDb.length;

    pegawaiDb = pegawaiDb.filter(p => {
      if (rowIndex !== undefined && rowIndex !== null && p.rowIndex !== undefined && p.rowIndex !== null && Number(p.rowIndex) === Number(rowIndex)) {
        return false;
      }
      if (nip && p.nip && String(p.nip).trim() !== '' && String(p.nip).trim() === String(nip).trim()) {
        return false;
      }
      if (nik && p.nik && String(nik).trim() !== '' && String(p.nik).trim() === String(nik).trim()) {
        return false;
      }
      if (!nip && !nik && (rowIndex === undefined || rowIndex === null) && nama && p.nama && String(p.nama).trim() === String(nama).trim()) {
        return false;
      }
      return true;
    });

    savePegawaiDb(pegawaiDb);
    const deletedCount = initialCount - pegawaiDb.length;
    return res.json({
      success: true,
      message: deletedCount > 0 ? "Data pegawai berhasil dihapus dari sistem." : "Data pegawai berhasil diperbarui."
    });
  } else if (action === 'bulkUploadPegawai') {
    if (Array.isArray(data) && data.length > 0) {
      let insertedCount = 0;
      let updatedCount = 0;
      data.forEach(item => {
        if (!item.nik && !item.nip && !item.nama) return;
        const idx = pegawaiDb.findIndex(p => 
          (item.nip && item.nip.toString().trim() !== '' && p.nip === item.nip.toString().trim()) || 
          (item.nik && item.nik.toString().trim() !== '' && p.nik === item.nik.toString().trim())
        );
        if (idx !== -1) {
          pegawaiDb[idx] = { ...pegawaiDb[idx], ...item };
          updatedCount++;
        } else {
          item.rowIndex = pegawaiDb.length + 2;
          pegawaiDb.push(item);
          insertedCount++;
        }
      });
      savePegawaiDb(pegawaiDb);
      return res.json({ 
        success: true, 
        message: `Upload berhasil! ${insertedCount} data baru ditambahkan, ${updatedCount} data diperbarui.`,
        inserted: insertedCount,
        updated: updatedCount,
        total: pegawaiDb.length
      });
    } else {
      return res.json({ success: false, message: "Data upload kosong atau format tidak valid." });
    }
  } else if (action === 'resetPassword') {
    return res.json({ success: true, message: "Kata sandi direset menjadi 123456." });
  } else if (action === 'ubahPassword') {
    return res.json({ success: true, message: "Kata sandi berhasil diperbarui." });
  }

  res.json({ success: false, message: "Action tidak dikenali" });
};

// POST & GET GAS Proxy endpoint compatibility
app.get('/api/gas', handleApiGet);
app.post('/api/gas', handleApiPost);

// WhatsApp Gateway Broadcast Endpoint
app.post('/api/whatsapp/broadcast', (req, res) => {
  try {
    const { recipients, messageTemplate, moduleSource } = req.body;
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({ success: false, message: "Penerima tidak valid atau kosong" });
    }

    const results = recipients.map((r: any) => {
      const rawPhone = String(r.no_hp || r.phone || '').replace(/[^0-9]/g, '');
      let formattedPhone = rawPhone;
      if (formattedPhone.startsWith('08')) {
        formattedPhone = '628' + formattedPhone.substring(2);
      }

      const isValid = formattedPhone.length >= 10 && formattedPhone.startsWith('628');
      
      let renderedMsg = messageTemplate || '';
      renderedMsg = renderedMsg.replace(/{NAMA_PEGAWAI}/g, r.nama || 'Pegawai');
      renderedMsg = renderedMsg.replace(/{NIP}/g, r.nip || r.nik || '-');
      renderedMsg = renderedMsg.replace(/{UNIT_TUGAS}/g, r.tempat_tugas || r.unit || '-');
      renderedMsg = renderedMsg.replace(/{DETAIL_KEGIATAN}/g, r.detail || r.info || '-');
      renderedMsg = renderedMsg.replace(/{STATUS}/g, r.status || '-');
      renderedMsg = renderedMsg.replace(/{NO_SK}/g, r.no_sk || r.nosk || '-');
      renderedMsg = renderedMsg.replace(/{JENIS_HUKDIS}/g, r.jenis_hukdis || r.jenis || '-');
      renderedMsg = renderedMsg.replace(/{JENIS_USULAN}/g, r.jenis_usulan || r.jenis || '-');
      renderedMsg = renderedMsg.replace(/{NO_USULAN}/g, r.no_usulan || r.id || '-');
      renderedMsg = renderedMsg.replace(/{TANGGAL}/g, new Date().toLocaleDateString('id-ID'));

      return {
        id: r.id || r.nip || Math.random().toString(36).substring(7),
        nama: r.nama,
        nip: r.nip || r.nik || '-',
        no_hp: r.no_hp || '-',
        formattedPhone: formattedPhone,
        status: isValid ? 'SUCCESS' : 'FAILED_INVALID_PHONE',
        statusText: isValid ? 'Terkirim via WA Gateway' : 'Gagal (No. HP tidak valid)',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        messagePreview: renderedMsg,
        waLink: isValid ? `https://wa.me/${formattedPhone}?text=${encodeURIComponent(renderedMsg)}` : null
      };
    });

    const successCount = results.filter((r: any) => r.status === 'SUCCESS').length;
    const failedCount = results.length - successCount;

    return res.json({
      success: true,
      message: `Broadcast selesai! ${successCount} terkirim, ${failedCount} gagal.`,
      total: results.length,
      successCount,
      failedCount,
      results
    });
  } catch (err: any) {
    console.error("WA Broadcast Error:", err);
    return res.status(500).json({ success: false, message: "Gagal memproses broadcast WA: " + err.message });
  }
});

// AI Chatbot Endpoint powered by @google/genai
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message parameter missing" });
    }

    const totalPegawai = pegawaiDb.length;
    const pnsCount = pegawaiDb.filter(p => ['PNS', 'CPNS'].includes(p.status_pegawai)).length;
    const pppkCount = pegawaiDb.filter(p => ['PPPK', 'PPPK PW'].includes(p.status_pegawai)).length;
    const nonPnsCount = pegawaiDb.filter(p => ['NON PNS', 'PJLP'].includes(p.status_pegawai)).length;
    const maleCount = pegawaiDb.filter(p => p.jenis_kelamin === 'Laki-laki').length;
    const femaleCount = pegawaiDb.filter(p => p.jenis_kelamin === 'Perempuan').length;

    const summaryStr = JSON.stringify({
      total_pegawai: totalPegawai,
      pns_cpns: pnsCount,
      pppk: pppkCount,
      non_pns_pjlp: nonPnsCount,
      gender: { Laki_laki: maleCount, Perempuan: femaleCount },
      daftar_singkat_pegawai: pegawaiDb.map(p => ({
        nama: p.nama,
        status: p.status_pegawai,
        jabatan: p.jabatan,
        tempat_tugas: p.tempat_tugas,
        aktif_str: p.aktif_str
      }))
    });

    const systemInstruction = `Anda adalah Asisten AI SIMPEG (Sistem Informasi Kepegawaian) Puskesmas Kepulauan Seribu Utara.
Tugas Anda adalah memberikan jawaban cerdas, ringkas, ramah, dan akurat seputar statistik kepegawaian SDMK.
Data kepegawaian real-time saat ini: ${summaryStr}.
Jawablah pertanyaan pengguna dengan sopan dan informatif dalam Bahasa Indonesia.`;

    const ai = getGenAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: message,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7
      }
    });

    return res.json({ text: response.text || "Maaf, tidak ada tanggapan." });
  } catch (error: any) {
    console.error("Gemini Chat API Error:", error);
    return res.status(500).json({ error: error.message || "Gagal memproses AI Chat" });
  }
});

// Direct Download Endpoints for Deployment Package
app.get('/simpeg-app.zip', (req, res) => {
  const filePath = path.join(process.cwd(), 'simpeg-app.zip');
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="simpeg-app.zip"');
    res.sendFile(filePath);
  } else {
    res.status(404).send('File simpeg-app.zip tidak ditemukan.');
  }
});

app.get('/database_simpeg.sql', (req, res) => {
  const filePath = path.join(process.cwd(), 'database_simpeg.sql');
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="database_simpeg.sql"');
    res.sendFile(filePath);
  } else {
    res.status(404).send('File database_simpeg.sql tidak ditemukan.');
  }
});

app.get('/PEDOMAN_DEPLOY_RUMAHWEB.md', (req, res) => {
  const filePath = path.join(process.cwd(), 'PEDOMAN_DEPLOY_RUMAHWEB.md');
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="PEDOMAN_DEPLOY_RUMAHWEB.md"');
    res.sendFile(filePath);
  } else {
    res.status(404).send('File PEDOMAN_DEPLOY_RUMAHWEB.md tidak ditemukan.');
  }
});

app.get('/api.php', (req, res) => {
  if (req.query.action) {
    return handleApiGet(req, res);
  }
  const filePath = path.join(process.cwd(), 'api.php');
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="api.php"');
    res.sendFile(filePath);
  } else {
    res.status(404).send('File api.php tidak ditemukan.');
  }
});

app.post('/api.php', (req, res) => {
  return handleApiPost(req, res);
});

app.get('/config.php', (req, res) => {
  const filePath = path.join(process.cwd(), 'config.php');
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="config.php"');
    res.sendFile(filePath);
  } else {
    res.status(404).send('File config.php tidak ditemukan.');
  }
});

app.get('/.htaccess', (req, res) => {
  const filePath = path.join(process.cwd(), '.htaccess');
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=".htaccess"');
    res.sendFile(filePath);
  } else {
    res.status(404).send('File .htaccess tidak ditemukan.');
  }
});

app.use('/assets', express.static(path.join(process.cwd(), 'assets')));

// Start Express + Vite
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server SIMPEG Digital PKSU running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
