# Kuis Matematika Dasar

Aplikasi web kuis matematika interaktif yang dirancang untuk membantu pengguna belajar dan mengasah kemampuan matematika dasar melalui pengalaman yang menyenangkan dan menantang.

## 🌟 Fitur Utama

### 📚 Kategori Quiz
- **Aljabar** - Persamaan linear, substitusi, dan operasi aljabar dasar
- **Persentase** - Perhitungan persentase, diskon, dan aplikasi praktis
- **Geometri** - Luas, volume, keliling bangun datar dan ruang
- **Statistika** - Rata-rata, median, modus, dan peluang dasar
- **Logika** - Penalaran logis, deret angka, dan problem solving
- **Akar** - Perhitungan akar kuadrat dan akar pangkat tiga

### 🎯 Fitur Interaktif
- **Timer System** - Setiap soal memiliki batas waktu yang disesuaikan dengan tingkat kesulitan
- **Streak Counter** - Lacak jawaban benar berturut-turut untuk motivasi
- **Hint System** - Bantuan bertahap untuk soal yang sulit (maksimal 3 hints per quiz)
- **Question Shuffling** - Urutan soal dan opsi jawaban diacak setiap kali
- **Difficulty Levels** - Soal diklasifikasikan sebagai Easy, Medium, dan Hard

### 📊 Analytics & Reporting
- **Performance Analytics** - Visualisasi performa dengan chart dan statistik detail
- **Category Performance** - Analisis per kategori untuk identifikasi area yang perlu diperbaiki
- **Progress Tracking** - Tracking kemajuan belajar dari waktu ke waktu
- **Weekly Progress** - Grafik performa mingguan untuk monitoring konsistensi
- **Export Results** - Export hasil quiz dalam format PDF, CSV, atau JSON

### 🏆 Gamification
- **Achievement System** - Unlock achievement untuk berbagai pencapaian
- **Leveling System** - Naik level berdasarkan performa dan konsistensi
- **Leaderboard** - Peringkat untuk kompetisi yang sehat
- **Daily Challenge** - Quiz harian dengan reward khusus dan streak system
- **XP Rewards** - Dapatkan experience points untuk setiap pencapaian

### 🎨 User Experience
- **Dark Mode** - Mode gelap untuk kenyamanan mata
- **Sound Effects** - Audio feedback untuk interaksi
- **Responsive Design** - Tampilan optimal di berbagai ukuran layar
- **User Profile** - Profil pengguna dengan statistik personal
- **Quiz Review** - Review jawaban dengan penjelasan detail

## 🚀 Teknologi

### Frontend
- **React 18** - Library JavaScript untuk membangun UI
- **TypeScript** - Superset JavaScript dengan static typing
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Komponen UI yang modern dan accessible
- **Lucide React** - Icon library yang komprehensif

### State Management
- **React Hooks** - useState, useEffect untuk state management lokal
- **Local Storage** - Penyimpanan data user dan progress
- **Context API** - State management global untuk theme dan user preferences

### Build Tools
- **esbuild** - JavaScript bundler yang cepat
- **PostCSS** - Tool untuk processing CSS
- **Autoprefixer** - Menambahkan vendor prefixes ke CSS

## 📦 Struktur Proyek

```
src/
├── components/
│   └── ui/                 # Komponen UI reusable
│       ├── AnalyticsReport.tsx
│       ├── AchievementSystem.tsx
