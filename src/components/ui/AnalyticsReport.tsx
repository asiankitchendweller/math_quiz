import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Clock, Target, Award, Download, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * Interface untuk data performa user
 */
interface PerformanceData {
  totalQuizzes: number
  averageScore: number
  totalTimeSpent: number
  bestStreak: number
  categoryPerformance: { [key: string]: number }
  difficultyPerformance: { [key: string]: number }
  weeklyProgress: { date: string; score: number }[]
}

/**
 * Interface untuk props AnalyticsReport
 */
interface AnalyticsReportProps {
  onBack: () => void
  onExport: () => void
}

/**
 * Komponen untuk menampilkan laporan analitik performa user
 */
export default function AnalyticsReport({ onBack, onExport }: AnalyticsReportProps) {
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPerformanceData()
  }, [])

  /**
   * Memuat data performa dari localStorage
   */
  const loadPerformanceData = () => {
    try {
      const savedUser = localStorage.getItem('mathQuizUser')
      const savedResults = localStorage.getItem('quizResults')
      
      if (savedUser && savedResults) {
        const user = JSON.parse(savedUser)
        const results = JSON.parse(savedResults)
        
        // Calculate category performance
        const categoryPerformance: { [key: string]: number } = {}
        const difficultyPerformance: { [key: string]: number } = {}
        
        results.forEach((result: any) => {
          if (!categoryPerformance[result.category]) {
            categoryPerformance[result.category] = []
          }
          categoryPerformance[result.category].push(result.score)
          
          if (!difficultyPerformance[result.difficulty]) {
            difficultyPerformance[result.difficulty] = []
          }
          difficultyPerformance[result.difficulty].push(result.score)
        })
        
        // Calculate averages
        Object.keys(categoryPerformance).forEach(key => {
          const scores = categoryPerformance[key]
          categoryPerformance[key] = Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length)
        })
        
        Object.keys(difficultyPerformance).forEach(key => {
          const scores = difficultyPerformance[key]
          difficultyPerformance[key] = Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length)
        })
        
        // Generate weekly progress (mock data for now)
        const weeklyProgress = []
        for (let i = 6; i >= 0; i--) {
          const date = new Date()
          date.setDate(date.getDate() - i)
          weeklyProgress.push({
            date: date.toLocaleDateString('id-ID', { weekday: 'short' }),
            score: Math.floor(Math.random() * 40) + 60
          })
        }
        
        setPerformanceData({
          totalQuizzes: user.quizzesCompleted || 0,
          averageScore: user.totalScore > 0 ? Math.round(user.totalScore / (user.quizzesCompleted || 1)) : 0,
          totalTimeSpent: user.totalTimeSpent || 0,
          bestStreak: user.bestStreak || 0,
          categoryPerformance,
          difficultyPerformance,
          weeklyProgress
        })
      }
    } catch (error) {
      console.error('Error loading performance data:', error)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Format waktu ke menit:detik
   */
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    const hours = Math.floor(mins / 60)
    
    if (hours > 0) {
      return `${hours}j ${mins % 60}m ${secs}s`
    }
    return `${mins}m ${secs}s`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data analitik...</p>
        </div>
      </div>
    )
  }

  if (!performanceData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full text-center">
          <BarChart3 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Belum Ada Data</h2>
          <p className="text-gray-600 mb-6">Selesaikan beberapa quiz untuk melihat analitik performa Anda</p>
          <Button onClick={onBack} className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
            Kembali
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Button onClick={onBack} variant="outline" className="bg-transparent border-gray-300 text-gray-700 hover:bg-gray-50">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali
              </Button>
              <h1 className="text-3xl font-bold text-gray-800">📊 Analitik Performa</h1>
            </div>
            <Button onClick={onExport} className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
          <p className="text-gray-600">Analisis mendalam tentang performa quiz Anda</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="w-8 h-8 text-blue-500" />
              <span className="text-sm text-gray-500">Total</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">{performanceData.totalQuizzes}</div>
            <div className="text-sm text-gray-600">Quiz Diselesaikan</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8 text-green-500" />
              <span className="text-sm text-gray-500">Rata-rata</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">{performanceData.averageScore}%</div>
            <div className="text-sm text-gray-600">Skor</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-orange-500" />
              <span className="text-sm text-gray-500">Total</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">{formatTime(performanceData.totalTimeSpent)}</div>
            <div className="text-sm text-gray-600">Waktu Belajar</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-8 h-8 text-purple-500" />
              <span className="text-sm text-gray-500">Terbaik</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">{performanceData.bestStreak}</div>
            <div className="text-sm text-gray-600">Streak</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Performance */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Performa per Kategori</h3>
            <div className="space-y-3">
              {Object.entries(performanceData.categoryPerformance).map(([category, score]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="font-medium text-gray-700 capitalize">{category}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          score >= 80 ? 'bg-green-500' : 
                          score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-600">{score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Difficulty Performance */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Performa per Difficulty</h3>
            <div className="space-y-3">
              {Object.entries(performanceData.difficultyPerformance).map(([difficulty, score]) => (
                <div key={difficulty} className="flex items-center justify-between">
                  <span className="font-medium text-gray-700 capitalize">{difficulty}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          score >= 80 ? 'bg-green-500' : 
                          score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-600">{score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Progress */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Progress Mingguan</h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="flex items-end justify-between h-32">
            {performanceData.weeklyProgress.map((day, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="text-xs text-gray-500 mb-1">{day.date}</div>
                <div 
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-600 rounded-t transition-all duration-300 hover:from-blue-600 hover:to-blue-700"
                  style={{ height: `${(day.score - 60) * 2}%` }}
                />
                <div className="text-xs font-medium text-gray-700 mt-1">{day.score}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mt-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">💡 Insights & Rekomendasi</h3>
          <div className="space-y-2">
            {performanceData.averageScore < 70 && (
              <div className="flex items-start space-x-2">
                <span className="text-blue-600">•</span>
                <span className="text-blue-700">Fokus pada kategori dengan skor rendah untuk improvement</span>
              </div>
            )}
            {performanceData.bestStreak < 5 && (
              <div className="flex items-start space-x-2">
                <span className="text-blue-600">•</span>
                <span className="text-blue-700">Coba tingkatkan streak Anda dengan konsistensi harian</span>
              </div>
            )}
            {performanceData.totalQuizzes < 10 && (
              <div className="flex items-start space-x-2">
                <span className="text-blue-600">•</span>
                <span className="text-blue-700">Lakukan lebih banyak quiz untuk membangun fondasi yang kuat</span>
              </div>
            )}
            <div className="flex items-start space-x-2">
              <span className="text-blue-600">•</span>
              <span className="text-blue-700">Gunakan fitur hint untuk soal yang sulit dan pelajari penjelasannya</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
