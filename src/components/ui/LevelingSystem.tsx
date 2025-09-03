/**
 * Komponen untuk sistem leveling berdasarkan skor
 * Menampilkan level, XP, dan progress bar
 */
import { useState, useEffect } from 'react'
import { Star, Trophy, Zap, Target } from 'lucide-react'

interface LevelingSystemProps {
  totalScore: number
  quizzesCompleted: number
  bestStreak: number
}

export default function LevelingSystem({ 
  totalScore, 
  quizzesCompleted, 
  bestStreak 
}: LevelingSystemProps) {
  const [currentLevel, setCurrentLevel] = useState(1)
  const [currentXP, setCurrentXP] = useState(0)
  const [xpToNextLevel, setXpToNextLevel] = useState(100)
  const [levelTitle, setLevelTitle] = useState('Pemula')

  /**
   * Menghitung level berdasarkan total skor
   */
  const calculateLevel = (score: number) => {
    // Level progression: 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200, 4000
    const levelThresholds = [0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200, 4000]
    const levelTitles = [
      'Pemula',
      'Pemahaman Dasar',
      'Pelajar Rajin',
      'Matematika Cerdas',
      'Ahli Matematika',
      'Master Matematika',
      'Jenius Matematika',
      'Sangat Jenius',
      'Legenda Matematika',
      'Dewa Matematika'
    ]

    for (let i = levelThresholds.length - 1; i >= 0; i--) {
      if (score >= levelThresholds[i]) {
        setCurrentLevel(i)
        setLevelTitle(levelTitles[i])
        
        if (i < levelThresholds.length - 1) {
          setCurrentXP(score - levelThresholds[i])
          setXpToNextLevel(levelThresholds[i + 1] - levelThresholds[i])
        } else {
          setCurrentXP(0)
          setXpToNextLevel(0) // Max level
        }
        break
      }
    }
  }

  /**
   * Menghitung persentase progress ke level berikutnya
   */
  const getProgressPercentage = () => {
    if (xpToNextLevel === 0) return 100
    return Math.round((currentXP / xpToNextLevel) * 100)
  }

  useEffect(() => {
    calculateLevel(totalScore)
  }, [totalScore])

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {currentLevel}
          </div>
          <div>
            <h3 className="font-bold text-gray-800">{levelTitle}</h3>
            <p className="text-sm text-gray-600">Level {currentLevel}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-1 text-purple-600">
            <Star className="w-4 h-4" />
            <span className="font-bold">{currentXP}/{xpToNextLevel} XP</span>
          </div>
          {xpToNextLevel === 0 && (
            <p className="text-xs text-purple-600 font-medium">MAX LEVEL!</p>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Level {currentLevel}</span>
          <span>{getProgressPercentage()}%</span>
          {xpToNextLevel > 0 && <span>Level {currentLevel + 1}</span>}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-white rounded-lg p-3">
          <div className="flex items-center justify-center space-x-1 text-blue-600 mb-1">
            <Trophy className="w-4 h-4" />
            <span className="font-bold">{totalScore}</span>
          </div>
          <p className="text-xs text-gray-600">Total Skor</p>
        </div>
        <div className="bg-white rounded-lg p-3">
          <div className="flex items-center justify-center space-x-1 text-green-600 mb-1">
            <Target className="w-4 h-4" />
            <span className="font-bold">{quizzesCompleted}</span>
          </div>
          <p className="text-xs text-gray-600">Quiz Selesai</p>
        </div>
        <div className="bg-white rounded-lg p-3">
          <div className="flex items-center justify-center space-x-1 text-orange-600 mb-1">
            <Zap className="w-4 h-4" />
            <span className="font-bold">{bestStreak}</span>
          </div>
          <p className="text-xs text-gray-600">Streak Terbaik</p>
        </div>
      </div>

      {/* Level Benefits */}
      <div className="mt-4 p-3 bg-purple-100 rounded-lg">
        <h4 className="font-semibold text-purple-800 mb-2 text-sm">Keuntungan Level {currentLevel}:</h4>
        <ul className="text-xs text-purple-700 space-y-1">
          {currentLevel >= 1 && <li>• Akses ke semua kategori dasar</li>}
          {currentLevel >= 3 && <li>• Bonus XP untuk jawaban benar berturut-turut</li>}
          {currentLevel >= 5 && <li>• Unlock kategori soal lanjutan</li>}
          {currentLevel >= 7 && <li>• Akses ke statistik detail</li>}
          {currentLevel >= 10 && <li>• Mode eksklusif dan badge khusus</li>}
        </ul>
      </div>
    </div>
  )
}
