
/**
 * Komponen StreakCounter untuk menampilkan streak jawaban benar
 */
import { Flame, Zap } from 'lucide-react'

interface StreakCounterProps {
  currentStreak: number
  bestStreak: number
}

export default function StreakCounter({ currentStreak, bestStreak }: StreakCounterProps) {
  const getStreakMessage = (streak: number): string => {
    if (streak === 0) return "Mulai jawab dengan benar!"
    if (streak < 3) return "Lanjutkan!"
    if (streak < 5) return "Bagus!"
    if (streak < 10) return "Hebat!"
    return "Luar Biasa! 🔥"
  }

  const getStreakColor = (streak: number): string => {
    if (streak === 0) return "text-gray-400"
    if (streak < 3) return "text-orange-400"
    if (streak < 5) return "text-orange-500"
    if (streak < 10) return "text-red-500"
    return "text-red-600"
  }

  return (
    <div className="flex items-center justify-between bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <Flame className={`w-8 h-8 ${getStreakColor(currentStreak)}`} />
          {currentStreak >= 5 && (
            <Zap className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
          )}
        </div>
        
        <div>
          <div className="text-sm text-gray-600 font-medium">Streak Saat Ini</div>
          <div className={`text-2xl font-bold ${getStreakColor(currentStreak)}`}>
            {currentStreak}
          </div>
        </div>
      </div>
      
      <div className="text-right">
        <div className="text-sm text-gray-600 font-medium">Terbaik</div>
        <div className="text-lg font-bold text-gray-800">
          {bestStreak}
        </div>
      </div>
      
      <div className="flex-1 ml-4">
        <div className="text-sm font-medium text-gray-700 mb-1">
          {getStreakMessage(currentStreak)}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${Math.min((currentStreak / Math.max(bestStreak, 1)) * 100, 100)}%` }}
          />
        </div>
      </div>
    </div>
  )
}
