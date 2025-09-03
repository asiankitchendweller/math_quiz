
import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Trophy, RotateCcw, Clock, Target, Star, BarChart3, Download, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Timer from '@/components/ui/Timer'
import CategorySelector from '@/components/ui/CategorySelector'
import Leaderboard from '@/components/ui/Leaderboard'
import StreakCounter from '@/components/ui/StreakCounter'
import UserProfile from '@/components/ui/UserProfile'
import AchievementSystem from '@/components/ui/AchievementSystem'
import SoundEffects from '@/components/ui/SoundEffects'
import DarkModeToggle from '@/components/ui/DarkModeToggle'
import HintSystem from '@/components/ui/HintSystem'
import QuizReview from '@/components/ui/QuizReview'
import LevelingSystem from '@/components/ui/LevelingSystem'
import AnalyticsReport from '@/components/ui/AnalyticsReport'
import QuizExport from '@/components/ui/QuizExport'
import DailyChallenge from '@/components/ui/DailyChallenge'

/**
 * Interface untuk mendefinisikan struktur data soal quiz
 */
interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  timeLimit: number // dalam detik
  hints: string[] // Petunjuk untuk soal
}

/**
 * Interface untuk mendefinisikan state jawaban user
 */
interface UserAnswer {
  questionId: number
  selectedAnswer: string
  isCorrect: boolean
  timeSpent: number // dalam detik
}

/**
 * Interface untuk leaderboard entry
 */
interface LeaderboardEntry {
  id: string
  name: string
  score: number
  category: string
  time: string
}

/**
 * Komponen utama halaman quiz matematika
 */
export default function Home() {
  // Data soal quiz dengan kategori dan difficulty
  const allQuizQuestions: QuizQuestion[] = [
    // Aljabar - 10 soal
    {
      id: 1,
      question: "Jika x = 5, maka berapa nilai dari 3x + 2?",
      options: ["15", "17", "20", "25"],
      correctAnswer: "17",
      explanation: "3x + 2 = 3(5) + 2 = 15 + 2 = 17",
      category: "aljabar",
      difficulty: "easy",
      timeLimit: 30,
      hints: [
        "Substitusikan nilai x = 5 ke dalam persamaan",
        "Hitung perkalian terlebih dahulu: 3 × 5",
        "Tambahkan hasilnya dengan 2"
      ]
    },
    {
      id: 2,
      question: "Jika 2x + 3 = 11, maka nilai x adalah?",
      options: ["3", "4", "5", "6"],
      correctAnswer: "4",
      explanation: "2x + 3 = 11 → 2x = 8 → x = 4",
      category: "aljabar",
      difficulty: "easy",
      timeLimit: 30,
      hints: [
        "Pindahkan konstanta ke sisi kanan persamaan",
        "Kurangi kedua sisi dengan 3",
        "Bagi kedua sisi dengan 2"
      ]
    },
    {
      id: 3,
      question: "Hasil dari (3 + 5) × 2 - 10 adalah?",
      options: ["4", "6", "8", "10"],
      correctAnswer: "6",
      explanation: "(3 + 5) × 2 - 10 = 8 × 2 - 10 = 16 - 10 = 6",
      category: "aljabar",
      difficulty: "easy",
      timeLimit: 25
    },
    {
      id: 4,
      question: "Jika y = 2x - 3 dan x = 4, maka nilai y adalah?",
      options: ["3", "5", "7", "9"],
      correctAnswer: "5",
      explanation: "y = 2(4) - 3 = 8 - 3 = 5",
      category: "aljabar",
      difficulty: "easy",
      timeLimit: 30
    },
    {
      id: 5,
      question: "Sederhanakan bentuk 3x + 2y - x + 4y",
      options: ["2x + 6y", "4x + 6y", "2x + 2y", "4x + 2y"],
      correctAnswer: "2x + 6y",
      explanation: "3x + 2y - x + 4y = (3x - x) + (2y + 4y) = 2x + 6y",
      category: "aljabar",
      difficulty: "medium",
      timeLimit: 35
    },
    {
      id: 6,
      question: "Jika a + b = 10 dan a - b = 4, maka nilai a adalah?",
      options: ["5", "6", "7", "8"],
      correctAnswer: "7",
      explanation: "a + b = 10 dan a - b = 4. Jika dijumlahkan: 2a = 14 → a = 7",
      category: "aljabar",
      difficulty: "medium",
      timeLimit: 40
    },
    {
      id: 7,
      question: "Hasil dari 2(x + 3) - 4(x - 1) adalah?",
      options: ["-2x + 10", "-2x + 2", "2x + 10", "2x + 2"],
      correctAnswer: "-2x + 10",
      explanation: "2(x + 3) - 4(x - 1) = 2x + 6 - 4x + 4 = -2x + 10",
      category: "aljabar",
      difficulty: "medium",
      timeLimit: 35
    },
    {
      id: 8,
      question: "Jika 3x - 5 = 16, maka nilai x adalah?",
      options: ["5", "6", "7", "8"],
      correctAnswer: "7",
      explanation: "3x - 5 = 16 → 3x = 21 → x = 7",
      category: "aljabar",
      difficulty: "easy",
      timeLimit: 30
    },
    {
      id: 9,
      question: "Sederhanakan bentuk (x²)³",
      options: ["x⁵", "x⁶", "x⁸", "x⁹"],
      correctAnswer: "x⁶",
      explanation: "(x²)³ = x^(2×3) = x⁶",
      category: "aljabar",
      difficulty: "medium",
      timeLimit: 25
    },
    {
      id: 10,
      question: "Jika x² - 5x + 6 = 0, maka nilai x yang memenuhi adalah?",
      options: ["x = 2 atau x = 3", "x = 1 atau x = 6", "x = -2 atau x = -3", "x = 0 atau x = 5"],
      correctAnswer: "x = 2 atau x = 3",
      explanation: "x² - 5x + 6 = (x - 2)(x - 3) = 0 → x = 2 atau x = 3",
      category: "aljabar",
      difficulty: "hard",
      timeLimit: 45
    },
    
    // Persentase - 10 soal
    {
      id: 11,
      question: "Berapa hasil dari 15% dari 200?",
      options: ["20", "25", "30", "35"],
      correctAnswer: "30",
      explanation: "15% dari 200 = (15/100) × 200 = 0.15 × 200 = 30",
      category: "persentase",
      difficulty: "easy",
      timeLimit: 25
    },
    {
      id: 12,
      question: "Jika sebuah barang harganya Rp 100.000 dan didiskon 20%, berapa harga setelah diskon?",
      options: ["Rp 70.000", "Rp 75.000", "Rp 80.000", "Rp 85.000"],
      correctAnswer: "Rp 80.000",
      explanation: "Diskon 20% dari Rp 100.000 = 0.2 × 100.000 = Rp 20.000. Harga setelah diskon = 100.000 - 20.000 = Rp 80.000",
      category: "persentase",
      difficulty: "easy",
      timeLimit: 30
    },
    {
      id: 13,
      question: "Sebuah tes diikuti 50 siswa, 80% siswa lulus. Berapa banyak siswa yang lulus?",
      options: ["35 siswa", "38 siswa", "40 siswa", "42 siswa"],
      correctAnswer: "40 siswa",
      explanation: "80% dari 50 siswa = 0.8 × 50 = 40 siswa",
      category: "persentase",
      difficulty: "easy",
      timeLimit: 25
    },
    {
      id: 14,
      question: "Jika gaji seseorang Rp 4.000.000 dan naik 15%, berapa gaji barunya?",
      options: ["Rp 4.400.000", "Rp 4.500.000", "Rp 4.600.000", "Rp 4.800.000"],
      correctAnswer: "Rp 4.600.000",
      explanation: "Kenaikan 15% = 0.15 × 4.000.000 = Rp 600.000. Gaji baru = 4.000.000 + 600.000 = Rp 4.600.000",
      category: "persentase",
      difficulty: "medium",
      timeLimit: 35
    },
    {
      id: 15,
      question: "Sebuah toko menjual barang dengan harga Rp 240.000 setelah diskon 25%. Berapa harga asli barang tersebut?",
      options: ["Rp 300.000", "Rp 310.000", "Rp 320.000", "Rp 330.000"],
      correctAnswer: "Rp 320.000",
      explanation: "Harga setelah diskon = 75% dari harga asli. Harga asli = 240.000 ÷ 0.75 = Rp 320.000",
      category: "persentase",
      difficulty: "medium",
      timeLimit: 40
    },
    {
      id: 16,
      question: "Jika 40% dari suatu bilangan adalah 24, berapa bilangan tersebut?",
      options: ["50", "55", "60", "65"],
      correctAnswer: "60",
      explanation: "40% × x = 24 → x = 24 ÷ 0.4 = 60",
      category: "persentase",
      difficulty: "medium",
      timeLimit: 30
    },
    {
      id: 17,
      question: "Sebuah populasi bakteri meningkat 10% setiap jam. Jika awalnya ada 1.000 bakteri, berapa banyak bakteri setelah 2 jam?",
      options: ["1.200", "1.210", "1.220", "1.230"],
      correctAnswer: "1.210",
      explanation: "Setelah 1 jam: 1.000 × 1.1 = 1.100. Setelah 2 jam: 1.100 × 1.1 = 1.210",
      category: "persentase",
      difficulty: "hard",
      timeLimit: 45
    },
    {
      id: 18,
      question: "Jika harga bensin naik 20%, kemudian turun 10%, berapa persentase perubahan totalnya?",
      options: ["Naik 8%", "Naik 10%", "Turun 2%", "Tidak berubah"],
      correctAnswer: "Naik 8%",
      explanation: "Misal harga awal 100. Naik 20% = 120. Turun 10% dari 120 = 12. Harga akhir = 120 - 12 = 108. Perubahan total = 8%",
      category: "persentase",
      difficulty: "hard",
      timeLimit: 50
    },
    {
      id: 19,
      question: "Dalam sebuah kelas, 60% siswa suka matematika, 45% suka fisika, dan 30% suka keduanya. Berapa persentase siswa yang tidak suka keduanya?",
      options: ["20%", "25%", "30%", "35%"],
      correctAnswer: "25%",
      explanation: "Yang suka matematika atau fisika = 60% + 45% - 30% = 75%. Yang tidak suka keduanya = 100% - 75% = 25%",
      category: "persentase",
      difficulty: "hard",
      timeLimit: 50
    },
    {
      id: 20,
      question: "Seorang pedagang membeli barang dengan harga Rp 500.000 dan menjualnya dengan keuntungan 25%. Berapa harga jualnya?",
      options: ["Rp 600.000", "Rp 625.000", "Rp 650.000", "Rp 675.000"],
      correctAnswer: "Rp 625.000",
      explanation: "Keuntungan 25% = 0.25 × 500.000 = Rp 125.000. Harga jual = 500.000 + 125.000 = Rp 625.000",
      category: "persentase",
      difficulty: "medium",
      timeLimit: 35
    },
    
    // Geometri - 10 soal
    {
      id: 21,
      question: "Jika luas sebuah persegi adalah 64 cm², berapa panjang sisi persegi tersebut?",
      options: ["6 cm", "7 cm", "8 cm", "9 cm"],
      correctAnswer: "8 cm",
      explanation: "s² = 64 → s = √64 = 8 cm",
      category: "geometri",
      difficulty: "medium",
      timeLimit: 40
    },
    {
      id: 22,
      question: "Keliling sebuah persegi panjang adalah 30 cm. Jika panjangnya 9 cm, berapa lebarnya?",
      options: ["5 cm", "6 cm", "7 cm", "8 cm"],
      correctAnswer: "6 cm",
      explanation: "Keliling = 2 × (panjang + lebar) → 30 = 2 × (9 + lebar) → 15 = 9 + lebar → lebar = 6 cm",
      category: "geometri",
      difficulty: "medium",
      timeLimit: 35
    },
    {
      id: 23,
      question: "Luas segitiga dengan alas 12 cm dan tinggi 8 cm adalah?",
      options: ["48 cm²", "56 cm²", "64 cm²", "72 cm²"],
      correctAnswer: "48 cm²",
      explanation: "Luas segitiga = ½ × alas × tinggi = ½ × 12 × 8 = 48 cm²",
      category: "geometri",
      difficulty: "easy",
      timeLimit: 30
    },
    {
      id: 24,
      question: "Jari-jari sebuah lingkaran adalah 7 cm. Berapa luas lingkaran tersebut? (π = 22/7)",
      options: ["140 cm²", "154 cm²", "160 cm²", "168 cm²"],
      correctAnswer: "154 cm²",
      explanation: "Luas lingkaran = π × r² = (22/7) × 7² = (22/7) × 49 = 22 × 7 = 154 cm²",
      category: "geometri",
      difficulty: "medium",
      timeLimit: 40
    },
    {
      id: 25,
      question: "Volume kubus dengan panjang sisi 5 cm adalah?",
      options: ["100 cm³", "125 cm³", "150 cm³", "175 cm³"],
      correctAnswer: "125 cm³",
      explanation: "Volume kubus = s³ = 5³ = 125 cm³",
      category: "geometri",
      difficulty: "easy",
      timeLimit: 25
    },
    {
      id: 26,
      question: "Sebuah balok memiliki panjang 8 cm, lebar 5 cm, dan tinggi 4 cm. Berapa volume balok tersebut?",
      options: ["140 cm³", "150 cm³", "160 cm³", "170 cm³"],
      correctAnswer: "160 cm³",
      explanation: "Volume balok = panjang × lebar × tinggi = 8 × 5 × 4 = 160 cm³",
      category: "geometri",
      difficulty: "easy",
      timeLimit: 30
    },
    {
      id: 27,
      question: "Keliling lingkaran dengan diameter 14 cm adalah? (π = 22/7)",
      options: ["40 cm", "42 cm", "44 cm", "46 cm"],
      correctAnswer: "44 cm",
      explanation: "Keliling lingkaran = π × d = (22/7) × 14 = 22 × 2 = 44 cm",
      category: "geometri",
      difficulty: "medium",
      timeLimit: 35
    },
    {
      id: 28,
      question: "Luas trapesium dengan sisi sejajar 10 cm dan 14 cm, serta tinggi 6 cm adalah?",
      options: ["60 cm²", "68 cm²", "72 cm²", "76 cm²"],
      correctAnswer: "72 cm²",
      explanation: "Luas trapesium = ½ × (a + b) × t = ½ × (10 + 14) × 6 = ½ × 24 × 6 = 12 × 6 = 72 cm²",
      category: "geometri",
      difficulty: "medium",
      timeLimit: 40
    },
    {
      id: 29,
      question: "Sebuah silinder memiliki jari-jari 7 cm dan tinggi 10 cm. Berapa volume silinder tersebut? (π = 22/7)",
      options: ["1.420 cm³", "1.540 cm³", "1.680 cm³", "1.750 cm³"],
      correctAnswer: "1.540 cm³",
      explanation: "Volume silinder = π × r² × t = (22/7) × 7² × 10 = (22/7) × 49 × 10 = 22 × 7 × 10 = 1.540 cm³",
      category: "geometri",
      difficulty: "hard",
      timeLimit: 50
    },
    {
      id: 30,
      question: "Pada segitiga siku-siku, jika panjang sisi tegak 8 cm dan sisi mendatar 6 cm, berapa panjang sisi miringnya?",
      options: ["9 cm", "10 cm", "11 cm", "12 cm"],
      correctAnswer: "10 cm",
      explanation: "Sisi miring = √(8² + 6²) = √(64 + 36) = √100 = 10 cm",
      category: "geometri",
      difficulty: "medium",
      timeLimit: 40
    },
    
    // Statistika - 10 soal
    {
      id: 31,
      question: "Dalam sebuah kelas, nilai rata-rata 5 siswa adalah 80. Jika ditambah satu siswa dengan nilai 90, berapa rata-rata baru?",
      options: ["81", "82", "83", "84"],
      correctAnswer: "82",
      explanation: "Total nilai awal = 5 × 80 = 400. Total baru = 400 + 90 = 490. Rata-rata baru = 490 ÷ 6 = 81.67 ≈ 82",
      category: "statistika",
      difficulty: "medium",
      timeLimit: 45,
      hints: [
        "Hitung total nilai semua siswa",
        "Tambahkan nilai siswa baru",
        "Bagi dengan jumlah siswa baru"
      ]
    },
    {
      id: 32,
      question: "Median dari data: 3, 7, 8, 12, 15 adalah?",
      options: ["7", "8", "12", "15"],
      correctAnswer: "8",
      explanation: "Data sudah terurut. Median adalah nilai tengah, yaitu 8",
      category: "statistika",
      difficulty: "easy",
      timeLimit: 30,
      hints: [
        "Urutkan data jika belum terurut",
        "Cari nilai tengah",
        "Jika jumlah data ganjil, median adalah nilai tengah"
      ]
    },
    {
      id: 33,
      question: "Modus dari data: 2, 3, 3, 4, 5, 5, 5, 6 adalah?",
      options: ["3", "4", "5", "6"],
      correctAnswer: "5",
      explanation: "Modus adalah nilai yang paling sering muncul. Angka 5 muncul 3 kali, paling sering",
      category: "statistika",
      difficulty: "easy",
      timeLimit: 25,
      hints: [
        "Hitung frekuensi setiap nilai",
        "Cari nilai dengan frekuensi tertinggi",
        "Modus adalah nilai yang paling sering muncul"
      ]
    },
    {
      id: 34,
      question: "Jangkauan dari data: 12, 15, 18, 22, 25, 30 adalah?",
      options: ["15", "16", "17", "18"],
      correctAnswer: "18",
      explanation: "Jangkauan = nilai maksimum - nilai minimum = 30 - 12 = 18",
      category: "statistika",
      difficulty: "easy",
      timeLimit: 20,
      hints: [
        "Cari nilai terbesar",
        "Cari nilai terkecil",
        "Kurangkan nilai terkecil dari nilai terbesar"
      ]
    },
    {
      id: 35,
      question: "Simpangan rata-rata dari data: 4, 6, 8, 10 adalah?",
      options: ["1", "2", "3", "4"],
      correctAnswer: "2",
      explanation: "Rata-rata = (4+6+8+10)/4 = 7. Simpangan = |4-7| + |6-7| + |8-7| + |10-7| = 3+1+1+3 = 8. Simpangan rata-rata = 8/4 = 2",
      category: "statistika",
      difficulty: "hard",
      timeLimit: 60,
      hints: [
        "Hitung rata-rata data terlebih dahulu",
        "Hitung selisih setiap data dengan rata-rata",
        "Rata-ratakan semua selisih mutlak"
      ]
    },
    {
      id: 36,
      question: "Jika variansi suatu data adalah 25, berapa standar deviasinya?",
      options: ["4", "5", "6", "7"],
      correctAnswer: "5",
      explanation: "Standar deviasi = √variansi = √25 = 5",
      category: "statistika",
      difficulty: "medium",
      timeLimit: 30,
      hints: [
        "Ingat hubungan antara variansi dan standar deviasi",
        "Standar deviasi adalah akar kuadrat dari variansi",
        "Hitung akar kuadrat dari 25"
      ]
    },
    {
      id: 37,
      question: "Dalam sebuah survei, 60% responden menyukai produk A dan 40% menyukai produk B. Jika 200 orang disurvei, berapa banyak yang menyukai produk A?",
      options: ["80", "100", "120", "140"],
      correctAnswer: "120",
      explanation: "60% dari 200 = 0.6 × 200 = 120 orang",
      category: "statistika",
      difficulty: "easy",
      timeLimit: 25,
      hints: [
        "Ubah persentase menjadi desimal",
        "Kalikan dengan total responden",
        "Hitung hasilnya"
      ]
    },
    {
      id: 38,
      question: "Kuartil ketiga (Q3) dari data: 3, 5, 7, 9, 11, 13, 15 adalah?",
      options: ["9", "11", "13", "15"],
      correctAnswer: "13",
      explanation: "Data sudah terurut. Q3 adalah nilai pada posisi 3/4. Posisi Q3 = (3/4) × (7+1) = 6. Jadi Q3 = 13",
      category: "statistika",
      difficulty: "medium",
      timeLimit: 40,
      hints: [
        "Pastikan data sudah terurut",
        "Hitung posisi kuartil ketiga",
        "Cari nilai pada posisi tersebut"
      ]
    },
    {
      id: 39,
      question: "Jika rata-rata 10 bilangan adalah 15 dan rata-rata 20 bilangan lainnya adalah 25, berapa rata-rata semua bilangan?",
      options: ["20", "21.67", "22.5", "23.33"],
      correctAnswer: "21.67",
      explanation: "Total 10 bilangan = 10 × 15 = 150. Total 20 bilangan = 20 × 25 = 500. Total semua = 650. Rata-rata = 650 ÷ 30 = 21.67",
      category: "statistika",
      difficulty: "hard",
      timeLimit: 50,
      hints: [
        "Hitung total masing-masing kelompok",
        "Jumlahkan semua total",
        "Bagi dengan jumlah semua bilangan"
      ]
    },
    {
      id: 40,
      question: "Peluang mendapatkan angka genap pada pelemparan dadu adalah?",
      options: ["1/2", "1/3", "1/4", "1/6"],
      correctAnswer: "1/2",
      explanation: "Angka genap pada dadu: 2, 4, 6 (3 angka). Total kemungkinan: 6. Peluang = 3/6 = 1/2",
      category: "statistika",
      difficulty: "easy",
      timeLimit: 20,
      hints: [
        "Identifikasi semua kemungkinan hasil",
        "Hitung hasil yang diinginkan",
        "Bagi hasil yang diinginkan dengan total kemungkinan"
      ]
    },
    
    // Logika - 10 soal
    {
      id: 41,
      question: "Jika semua kucing adalah hewan, dan semua hewan membutuhkan makanan, maka...",
      options: ["Semua kucing membutuhkan makanan", "Beberapa kucing tidak membutuhkan makanan", "Tidak ada kucing yang membutuhkan makanan", "Hanya beberapa kucing yang membutuhkan makanan"],
      correctAnswer: "Semua kucing membutuhkan makanan",
      explanation: "Jika A → B dan B → C, maka A → C. Jadi, semua kucing membutuhkan makanan",
      category: "logika",
      difficulty: "easy",
      timeLimit: 30,
      hints: [
        "Identifikasi hubungan antar pernyataan",
        "Gunakan aturan silogisme",
        "Tarik kesimpulan logis"
      ]
    },
    {
      id: 42,
      question: "Manakah yang merupakan kebalikan dari 'Jika hujan, maka saya bawa payung'?",
      options: ["Jika tidak hujan, maka saya tidak bawa payung", "Jika saya bawa payung, maka hujan", "Jika saya tidak bawa payung, maka tidak hujan", "Jika hujan, maka saya tidak bawa payung"],
      correctAnswer: "Jika tidak hujan, maka saya tidak bawa payung",
      explanation: "Kebalikan dari P → Q adalah ~P → ~Q",
      category: "logika",
      difficulty: "medium",
      timeLimit: 35,
      hints: [
        "Ingat bentuk implikasi P → Q",
        "Kebalikan adalah negasi P dan negasi Q",
        "Tulis dalam bentuk 'jika tidak P, maka tidak Q'"
      ]
    },
    {
      id: 43,
      question: "Dalam sebuah keluarga, Ayah lebih tua dari Ibu. Kakak lebih muda dari Ayah tapi lebih tua dari Adik. Siapa yang paling muda?",
      options: ["Ayah", "Ibu", "Kakak", "Adik"],
      correctAnswer: "Adik",
      explanation: "Ayah > Ibu, Ayah > Kakak > Adik. Jadi Adik paling muda",
      category: "logika",
      difficulty: "easy",
      timeLimit: 25,
      hints: [
        "Buat urutan usia dari yang tertua",
        "Bandingkan setiap pernyataan",
        "Tentukan posisi termuda"
      ]
    },
    {
      id: 44,
      question: "Jika 2 + 2 = 4, 4 + 4 = 8, maka 8 + 8 = ?",
      options: ["12", "14", "16", "18"],
      correctAnswer: "16",
      explanation: "Pola: setiap angka ditambah dengan dirinya sendiri. 8 + 8 = 16",
      category: "logika",
      difficulty: "easy",
      timeLimit: 20,
      hints: [
        "Amati pola operasi",
        "Setiap bilangan ditambah dengan dirinya",
        "Lakukan operasi yang sama"
      ]
    },
    {
      id: 45,
      question: "Semua siswa yang rajin akan lulus. Budi tidak lulus. Kesimpulan yang benar adalah?",
      options: ["Budi tidak rajin", "Budi rajin", "Semua yang tidak lulus tidak rajin", "Tidak ada kesimpulan yang pasti"],
      correctAnswer: "Budi tidak rajin",
      explanation: "Jika semua P → Q, dan ~Q, maka ~P (modus tollens)",
      category: "logika",
      difficulty: "medium",
      timeLimit: 30,
      hints: [
        "Identifikasi premis utama",
        "Gunakan aturan modus tollens",
        "Tarik kesimpulan yang valid"
      ]
    },
    {
      id: 46,
      question: "Dalam deret: 2, 5, 10, 17, 26, ... angka berikutnya adalah?",
      options: ["35", "37", "39", "41"],
      correctAnswer: "37",
      explanation: "Pola: +3, +5, +7, +9, ... jadi selanjutnya +11 → 26 + 11 = 37",
      category: "logika",
      difficulty: "medium",
      timeLimit: 35,
      hints: [
        "Hitung selisih antar angka",
        "Amati pola selisih",
        "Lanjutkan pola yang sama"
      ]
    },
    {
      id: 47,
      question: "Jika hari ini Selasa, 100 hari lagi adalah hari?",
      options: ["Kamis", "Jumat", "Sabtu", "Minggu"],
      correctAnswer: "Kamis",
      explanation: "100 ÷ 7 = 14 sisa 2. 100 hari = 14 minggu + 2 hari. Selasa + 2 hari = Kamis",
      category: "logika",
      difficulty: "medium",
      timeLimit: 40,
      hints: [
        "Hitung sisa pembagian dengan 7",
        "Tambahkan sisa hari ke hari sekarang",
        "Gunakan siklus 7 hari dalam seminggu"
      ]
    },
    {
      id: 48,
      question: "Manakah pernyataan yang ekuivalen dengan 'Jika belajar, maka pintar'?",
      options: ["Jika tidak pintar, maka tidak belajar", "Jika pintar, maka belajar", "Jika tidak belajar, maka pintar", "Jika tidak pintar, maka belajar"],
      correctAnswer: "Jika tidak pintar, maka tidak belajar",
      explanation: "Kontraposisi dari P → Q adalah ~Q → ~P",
      category: "logika",
      difficulty: "hard",
      timeLimit: 45,
      hints: [
        "Ingat konsep kontraposisi",
        "Balik dan negasikan kedua bagian",
        "Cari bentuk yang logis ekuivalen"
      ]
    },
    {
      id: 49,
      question: "Dalam sebuah kotak ada 3 bola merah dan 2 bola biru. Jika diambil 2 bola sekaligus, peluang kedua bola merah adalah?",
      options: ["1/10", "3/10", "1/5", "2/5"],
      correctAnswer: "3/10",
      explanation: "Cara ambil 2 merah: C(3,2) = 3. Total cara: C(5,2) = 10. Peluang = 3/10",
      category: "logika",
      difficulty: "hard",
      timeLimit: 50,
      hints: [
        "Hitung kombinasi mengambil 2 bola merah",
        "Hitung total kombinasi mengambil 2 bola",
        "Bagi kedua hasil"
      ]
    },
    {
      id: 50,
      question: "Jika semua A adalah B, beberapa B adalah C, dan tidak ada C yang A, maka pernyataan yang pasti benar adalah?",
      options: ["Beberapa B bukan A", "Semua B adalah A", "Beberapa A adalah C", "Tidak ada B yang C"],
      correctAnswer: "Beberapa B bukan A",
      explanation: "Karena ada B yang C dan tidak ada C yang A, maka ada B yang bukan A",
      category: "logika",
      difficulty: "hard",
      timeLimit: 60,
      hints: [
        "Gambar diagram Venn",
        "Analisis hubungan antar himpunan",
        "Cari pernyataan yang pasti benar"
      ]
    },
    
    // Akar - 10 soal
    {
      id: 51,
      question: "Apa nilai dari √144?",
      options: ["10", "11", "12", "13"],
      correctAnswer: "12",
      explanation: "√144 = 12",
      category: "akar",
      difficulty: "easy",
      timeLimit: 20,
      hints: [
        "Cari bilangan yang jika dikuadratkan hasilnya 144",
        "Ingat perkalian 12 × 12",
        "Gunakan kalkulator mental"
      ]
    },
    {
      id: 52,
      question: "Berapa nilai dari √81?",
      options: ["7", "8", "9", "10"],
      correctAnswer: "9",
      explanation: "√81 = 9",
      category: "akar",
      difficulty: "easy",
      timeLimit: 20,
      hints: [
        "Cari bilangan yang jika dikuadratkan hasilnya 81",
        "Ingat perkalian 9 × 9",
        "Gunakan kalkulator mental"
      ]
    },
    {
      id: 53,
      question: "Hasil dari √25 + √36 adalah?",
      options: ["9", "10", "11", "12"],
      correctAnswer: "11",
      explanation: "√25 + √36 = 5 + 6 = 11",
      category: "akar",
      difficulty: "easy",
      timeLimit: 25,
      hints: [
        "Hitung √25 terlebih dahulu",
        "Hitung √36",
        "Jumlahkan kedua hasil"
      ]
    },
    {
      id: 34,
      question: "Berapa nilai dari √(16 × 9)?",
      options: ["10", "11", "12", "13"],
      correctAnswer: "12",
      explanation: "√(16 × 9) = √16 × √9 = 4 × 3 = 12",
      category: "akar",
      difficulty: "medium",
      timeLimit: 30
    },
    {
      id: 35,
      question: "Sederhanakan bentuk √50",
      options: ["5√2", "2√5", "10√5", "5√10"],
      correctAnswer: "5√2",
      explanation: "√50 = √(25 × 2) = √25 × √2 = 5√2",
      category: "akar",
      difficulty: "medium",
      timeLimit: 35
    },
    {
      id: 36,
      question: "Berapa nilai dari ³√27?",
      options: ["2", "3", "4", "5"],
      correctAnswer: "3",
      explanation: "³√27 = 3, karena 3³ = 27",
      category: "akar",
      difficulty: "medium",
      timeLimit: 25
    },
    {
      id: 37,
      question: "Hasil dari √48 + √12 adalah?",
      options: ["4√3", "5√3", "6√3", "7√3"],
      correctAnswer: "6√3",
      explanation: "√48 + √12 = √(16×3) + √(4×3) = 4√3 + 2√3 = 6√3",
      category: "akar",
      difficulty: "hard",
      timeLimit: 40
    },
    {
      id: 38,
      question: "Jika √x = 5, maka nilai x adalah?",
      options: ["20", "25", "30", "35"],
      correctAnswer: "25",
      explanation: "√x = 5 → x = 5² = 25",
      category: "akar",
      difficulty: "easy",
      timeLimit: 20
    },
    {
      id: 39,
      question: "Berapa nilai dari √(2² + 3²)?",
      options: ["√5", "√13", "√15", "√17"],
      correctAnswer: "√13",
      explanation: "√(2² + 3²) = √(4 + 9) = √13",
      category: "akar",
      difficulty: "medium",
      timeLimit: 30
    },
    {
      id: 40,
      question: "Sederhanakan bentuk (√8 + √2)²",
      options: ["16", "18", "20", "22"],
      correctAnswer: "18",
      explanation: "(√8 + √2)² = (√8)² + 2×√8×√2 + (√2)² = 8 + 2×√16 + 2 = 8 + 2×4 + 2 = 8 + 8 + 2 = 18",
      category: "akar",
      difficulty: "hard",
      timeLimit: 45
    }
  ]

  // State untuk kategori yang dipilih
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([])
  const [shuffledOptions, setShuffledOptions] = useState<{[key: number]: string[]}>({})
  const [hintsUsed, setHintsUsed] = useState(0)
  const [showReview, setShowReview] = useState(false)
  const [maxHints] = useState(3) // Maksimal 3 hints per quiz
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [showDailyChallenge, setShowDailyChallenge] = useState(false)

  // State management
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [currentStreak, setCurrentStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [timeSpent, setTimeSpent] = useState(0)
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now())
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [showLeaderboard, setShowLeaderboard] = useState(false)

  const currentQuestion = quizQuestions[currentQuestionIndex]
  const progress = quizQuestions.length > 0 ? ((currentQuestionIndex + 1) / quizQuestions.length) * 100 : 0

  /**
   * Fungsi untuk mengacak array menggunakan Fisher-Yates shuffle algorithm
   */
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  /**
   * Mengacak opsi jawaban untuk setiap soal
   */
  const shuffleOptionsForQuestions = (questions: QuizQuestion[]) => {
    const newShuffledOptions: {[key: number]: string[]} = {}
    questions.forEach(question => {
      newShuffledOptions[question.id] = shuffleArray(question.options)
    })
    setShuffledOptions(newShuffledOptions)
  }

  /**
   * Menangani pemilihan kategori quiz
   */
  const handleCategorySelect = (categoryId: string) => {
    const filteredQuestions = allQuizQuestions.filter(q => q.category === categoryId)
    const shuffledQuestions = shuffleArray(filteredQuestions)
    setQuizQuestions(shuffledQuestions)
    shuffleOptionsForQuestions(shuffledQuestions)
    setSelectedCategory(categoryId)
    setCurrentQuestionIndex(0)
    setUserAnswers([])
    setSelectedAnswer(null)
    setShowExplanation(false)
    setQuizCompleted(false)
    setCurrentStreak(0)
    setTimeSpent(0)
    setHintsUsed(0)
    setShowReview(false)
    setQuestionStartTime(Date.now())
  }

  /**
   * Menangani waktu habis untuk pertanyaan
   */
  const handleTimeUp = () => {
    if (!showExplanation && selectedAnswer) {
      handleSubmitAnswer()
    } else if (!showExplanation && !selectedAnswer) {
      // Auto submit dengan jawaban kosong jika waktu habis
      handleSubmitAnswer()
    }
  }

  /**
   * Menangani pemilihan jawaban oleh user
   */
  const handleAnswerSelect = (answer: string) => {
    if (showExplanation) return // Prevent changing answer after explanation is shown
    
    setSelectedAnswer(answer)
  }

  /**
   * Menangani submit jawaban dan menampilkan penjelasan
   */
  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer
    const userAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      selectedAnswer,
      isCorrect
    }

    setUserAnswers([...userAnswers, userAnswer])
    setShowExplanation(true)
  }

  /**
   * Berpindah ke pertanyaan berikutnya
   */
  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
      setQuestionStartTime(Date.now())
    } else {
      setQuizCompleted(true)
      // Add to leaderboard
      addToLeaderboard()
      
      // Play completion sound
      if (typeof (window as any).playQuizSound === 'function') {
        ;(window as any).playQuizSound('complete')
      }
      
      // Check achievements
      checkQuizAchievements()
    }
  }

  /**
   * Menambahkan hasil ke leaderboard
   */
  const addToLeaderboard = () => {
    const score = calculateScore()
    const newEntry: LeaderboardEntry = {
      id: Date.now().toString(),
      name: `Player ${Math.floor(Math.random() * 1000)}`,
      score: score.percentage,
      category: selectedCategory || "Mixed",
      time: formatTime(timeSpent)
    }
    
    setLeaderboard(prev => [...prev, newEntry])
  }

  /**
   * Format waktu ke menit:detik
   */
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  /**
   * Mengulang quiz dari awal dengan urutan soal yang diacak kembali
   */
  const handleRestartQuiz = () => {
    const filteredQuestions = allQuizQuestions.filter(q => q.category === selectedCategory)
    const shuffledQuestions = shuffleArray(filteredQuestions)
    setQuizQuestions(shuffledQuestions)
    shuffleOptionsForQuestions(shuffledQuestions)
    setCurrentQuestionIndex(0)
    setUserAnswers([])
    setSelectedAnswer(null)
    setShowExplanation(false)
    setQuizCompleted(false)
    setCurrentStreak(0)
    setTimeSpent(0)
    setHintsUsed(0)
    setShowReview(false)
    setQuestionStartTime(Date.now())
  }

  /**
   * Kembali ke pemilihan kategori
   */
  const handleBackToCategories = () => {
    setSelectedCategory(null)
    setQuizQuestions([])
    setCurrentQuestionIndex(0)
    setUserAnswers([])
    setSelectedAnswer(null)
    setShowExplanation(false)
    setQuizCompleted(false)
    setCurrentStreak(0)
    setBestStreak(0)
    setTimeSpent(0)
  }

  /**
   * Menghitung skor akhir
   */
  const calculateScore = () => {
    const correctAnswers = userAnswers.filter(answer => answer.isCorrect).length
    return {
      correct: correctAnswers,
      total: quizQuestions.length,
      percentage: Math.round((correctAnswers / quizQuestions.length) * 100)
    }
  }

  /**
   * Mengecek achievement setelah quiz selesai
   */
  const checkQuizAchievements = () => {
    const score = calculateScore()
    
    // First quiz achievement
    checkAchievement('first_quiz')
    
    // Perfect score achievement
    if (score.percentage === 100) {
      checkAchievement('perfect_score')
    }
    
    // Speed demon achievement (completed in less than 2 minutes)
    if (timeSpent < 120) {
      checkAchievement('speed_demon')
    }
    
    // Update user statistics
    updateUserStats(score)
  }

  /**
   * Mengecek dan unlock achievement
   */
  const checkAchievement = (achievementId: string) => {
    // This will be handled by the AchievementSystem component
    // We trigger it via global function
    if (typeof (window as any).checkAndUnlockAchievement === 'function') {
      ;(window as any).checkAndUnlockAchievement(achievementId)
    }
  }

  /**
   * Update user statistics
   */
  const updateUserStats = (score: { correct: number; total: number; percentage: number }) => {
    const savedUser = localStorage.getItem('mathQuizUser')
    if (savedUser) {
      const user = JSON.parse(savedUser)
      const updatedUser = {
        ...user,
        totalScore: user.totalScore + score.percentage,
        quizzesCompleted: user.quizzesCompleted + 1,
        bestStreak: Math.max(user.bestStreak, bestStreak)
      }
      
      localStorage.setItem('mathQuizUser', JSON.stringify(updatedUser))
      
      // Check high scorer achievement
      if (updatedUser.totalScore >= 1000) {
        checkAchievement('high_scorer')
      }
      
      // Check quiz warrior achievement
      if (updatedUser.quizzesCompleted >= 25) {
        checkAchievement('quiz_warrior')
      }
    }
  }

  /**
   * Update best streak in user data
   */
  const updateUserBestStreak = (streak: number) => {
    const savedUser = localStorage.getItem('mathQuizUser')
    if (savedUser) {
      const user = JSON.parse(savedUser)
      if (streak > user.bestStreak) {
        user.bestStreak = streak
        localStorage.setItem('mathQuizUser', JSON.stringify(user))
      }
    }
  }

  // Jika belum memilih kategori, tampilkan pemilihan kategori
  if (!selectedCategory) {
    return <CategorySelector onSelectCategory={handleCategorySelect} />
  }

  // Jika ingin melihat leaderboard
  if (showLeaderboard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">🏆 Leaderboard</h1>
            <p className="text-gray-600">Lihat peringkat teratas</p>
          </div>
          
          <Leaderboard entries={leaderboard} />
          
          <div className="mt-6 text-center">
            <Button 
              onClick={() => setShowLeaderboard(false)}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
            >
              Kembali ke Quiz
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Jika ingin melihat review
  if (showReview) {
    return (
      <QuizReview
        questions={quizQuestions}
        userAnswers={userAnswers}
        totalTime={timeSpent}
        onRestart={handleRestartQuiz}
        onBackToCategories={handleBackToCategories}
      />
    )
  }

  // Jika ingin melihat analytics
  if (showAnalytics) {
    return (
      <AnalyticsReport
        onBack={() => setShowAnalytics(false)}
        onExport={() => setShowExport(true)}
      />
    )
  }

  // Jika ingin melihat export
  if (showExport) {
    return (
      <QuizExport
        quizData={{
          questions: quizQuestions,
          userAnswers: userAnswers,
          totalTime: timeSpent,
          category: selectedCategory || "",
          date: new Date().toISOString()
        }}
        onBack={() => setShowExport(false)}
      />
    )
  }

  // Jika ingin melihat daily challenge
  if (showDailyChallenge) {
    return (
      <DailyChallenge
        onComplete={(score) => {
          setShowDailyChallenge(false)
          // Update user stats with daily challenge score
          const savedUser = localStorage.getItem('mathQuizUser')
          if (savedUser) {
            const user = JSON.parse(savedUser)
            user.dailyChallengesCompleted = (user.dailyChallengesCompleted || 0) + 1
            user.dailyChallengeScore = (user.dailyChallengeScore || 0) + score
            localStorage.setItem('mathQuizUser', JSON.stringify(user))
            
            // Check daily challenge achievement
            if (user.dailyChallengesCompleted >= 7) {
              checkAchievement('daily_warrior')
            }
          }
        }}
        onBack={() => setShowDailyChallenge(false)}
      />
    )
  }

  // Jika quiz selesai, tampilkan hasil
  if (quizCompleted) {
    const score = calculateScore()
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
          <div className="text-center mb-6">
            <Trophy className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Quiz Selesai!</h1>
            <p className="text-gray-600">Berikut adalah hasil kamu:</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl p-4 text-center">
              <div className="text-2xl font-bold">{score.percentage}%</div>
              <div className="text-sm opacity-90">Skor</div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-4 text-center">
              <div className="text-2xl font-bold">{score.correct}/{score.total}</div>
              <div className="text-sm opacity-90">Benar</div>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl p-4 text-center">
              <div className="text-2xl font-bold">{formatTime(timeSpent)}</div>
              <div className="text-sm opacity-90">Waktu</div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Detail Jawaban:</h3>
            <div className="space-y-2">
              {userAnswers.map((answer, index) => (
                <div key={answer.questionId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium">Soal {index + 1}</span>
                    <span className="text-xs text-gray-500">({answer.timeSpent}s)</span>
                  </div>
                  {answer.isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Level & Progress:</h3>
            <LevelingSystem
              totalScore={calculateScore().percentage}
              quizzesCompleted={1}
              bestStreak={bestStreak}
            />
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Pencapaian:</h3>
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-orange-500" />
                  <span className="font-medium">Streak Terbaik:</span>
                </div>
                <span className="text-xl font-bold text-orange-600">{bestStreak}</span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button 
              onClick={handleRestartQuiz}
              className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Ulangi Quiz
            </Button>
            <Button 
              onClick={() => setShowReview(true)}
              variant="outline"
              className="flex-1 bg-transparent border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Target className="w-4 h-4 mr-2" />
              Review
            </Button>
            <Button 
              onClick={() => setShowExport(true)}
              variant="outline"
              className="flex-1 bg-transparent border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button 
              onClick={() => setShowLeaderboard(true)}
              variant="outline"
              className="flex-1 bg-transparent border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Trophy className="w-4 h-4 mr-2" />
              Leaderboard
            </Button>
            <Button 
              onClick={handleBackToCategories}
              variant="outline"
              className="bg-transparent border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Kategori
            </Button>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2 text-blue-700">
              <span className="text-sm">💡</span>
              <span className="text-sm">Setiap kali kamu mengulang quiz, urutan soal akan diacak kembali untuk pengalaman yang berbeda!</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Tampilan utama quiz
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Kuis Matematika</h1>
              <p className="text-gray-600 capitalize">{selectedCategory}</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span>Soal Diacak</span>
              </div>
              <SoundEffects />
              <DarkModeToggle />
              <AchievementSystem />
              <UserProfile />
              <Button 
                onClick={() => setShowDailyChallenge(true)}
                variant="outline"
                className="bg-transparent border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Calendar className="w-4 h-4 mr-1" />
                Daily Challenge
              </Button>
              <Button 
                onClick={() => setShowAnalytics(true)}
                variant="outline"
                className="bg-transparent border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <BarChart3 className="w-4 h-4 mr-1" />
                Analytics
              </Button>
              <Button 
                onClick={handleBackToCategories}
                variant="outline"
                className="bg-transparent border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Ganti Kategori
              </Button>
            </div>
          </div>
        </div>

        {/* Timer dan Streak */}
        <div className="mb-6">
          <Timer 
            initialTime={currentQuestion.timeLimit} 
            onTimeUp={handleTimeUp}
            isActive={!showExplanation}
          />
          <StreakCounter currentStreak={currentStreak} bestStreak={bestStreak} />
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Pertanyaan {currentQuestionIndex + 1} dari {quizQuestions.length}</span>
            <span className="flex items-center space-x-1">
              <Target className="w-4 h-4" />
              <span>{currentQuestion.difficulty}</span>
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {currentQuestion.question}
            </h2>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-500">{currentQuestion.timeLimit}s</span>
            </div>
          </div>
          
          <div className="space-y-3">
            {shuffledOptions[currentQuestion.id]?.map((option, index) => {
              let buttonStyle = "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              
              if (showExplanation) {
                if (option === currentQuestion.correctAnswer) {
                  buttonStyle = "bg-green-100 border-green-500 text-green-700"
                } else if (option === selectedAnswer && option !== currentQuestion.correctAnswer) {
                  buttonStyle = "bg-red-100 border-red-500 text-red-700"
                }
              } else if (option === selectedAnswer) {
                buttonStyle = "bg-blue-100 border-blue-500 text-blue-700"
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showExplanation}
                  className={`w-full p-4 text-left border-2 rounded-lg transition-all duration-200 ${buttonStyle} hover:shadow-md`}
                >
                  <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
                </button>
              )
            })}
          </div>
        </div>

        {/* Explanation Card */}
        {showExplanation && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">Penjelasan:</h3>
            <p className="text-blue-700">{currentQuestion.explanation}</p>
          </div>
        )}

        {/* Hint System */}
        {!showExplanation && currentQuestion.hints && (
          <HintSystem
            questionId={currentQuestion.id}
            hints={currentQuestion.hints}
            onHintUsed={() => setHintsUsed(prev => prev + 1)}
            hintsUsed={hintsUsed}
            maxHints={maxHints}
          />
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Total waktu: {formatTime(timeSpent)}
          </div>
          <div className="flex space-x-3">
            {!showExplanation ? (
              <Button 
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswer}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              >
                Submit Jawaban
              </Button>
            ) : (
              <Button 
                onClick={handleNextQuestion}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                {currentQuestionIndex < quizQuestions.length - 1 ? "Pertanyaan Berikutnya" : "Lihat Hasil"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
