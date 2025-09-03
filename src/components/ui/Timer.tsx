
/**
 * Komponen Timer untuk quiz dengan countdown
 */
import { useState, useEffect, useCallback } from 'react'
import { Clock } from 'lucide-react'

interface TimerProps {
  initialTime: number // dalam detik
  onTimeUp: () => void
  isActive: boolean
}

export default function Timer({ initialTime, onTimeUp, isActive }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime)
  const [isWarning, setIsWarning] = useState(false)

  // Reset timer ketika waktu awal berubah
  useEffect(() => {
    setTimeLeft(initialTime)
    setIsWarning(false)
  }, [initialTime])

  // Handle countdown
  useEffect(() => {
    if (!isActive || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1
        
        // Tampilkan warning ketika waktu tersisa 10 detik
        if (newTime <= 10 && !isWarning) {
          setIsWarning(true)
        }
        
        // Trigger callback ketika waktu habis
        if (newTime <= 0) {
          clearInterval(timer)
          onTimeUp()
          return 0
        }
        
        return newTime
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isActive, timeLeft, onTimeUp, isWarning])

  // Format waktu ke MM:SS
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }, [])

  // Hitung persentase waktu untuk progress bar
  const timePercentage = (timeLeft / initialTime) * 100

  return (
    <div className="flex items-center space-x-3 mb-4">
      <div className="flex items-center space-x-2">
        <Clock className={`w-5 h-5 ${isWarning ? 'text-red-500 animate-pulse' : 'text-gray-600'}`} />
        <span className={`font-medium ${isWarning ? 'text-red-500' : 'text-gray-700'}`}>
          Waktu Tersisa:
        </span>
      </div>
      
      <div className="flex items-center space-x-3">
        <span className={`text-lg font-bold ${isWarning ? 'text-red-500' : 'text-gray-800'}`}>
          {formatTime(timeLeft)}
        </span>
        
        <div className="w-24 bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-1000 ${
              timePercentage > 50 ? 'bg-green-500' : 
              timePercentage > 20 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${timePercentage}%` }}
          />
        </div>
      </div>
    </div>
  )
}
