/**
 * Komponen untuk sistem hint pada quiz
 * Memberikan petunjuk untuk pertanyaan sulit
 */
import { useState, useEffect } from 'react'
import { Lightbulb, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HintSystemProps {
  questionId: number
  hints: string[]
  onHintUsed: () => void
  hintsUsed: number
  maxHints: number
}

export default function HintSystem({ 
  questionId, 
  hints, 
  onHintUsed, 
  hintsUsed, 
  maxHints 
}: HintSystemProps) {
  const [showHint, setShowHint] = useState(false)
  const [currentHintIndex, setCurrentHintIndex] = useState(0)

  /**
   * Reset state saat ganti pertanyaan
   */
  useEffect(() => {
    setShowHint(false)
    setCurrentHintIndex(0)
  }, [questionId])

  /**
   * Menampilkan hint berikutnya
   */
  const handleShowHint = () => {
    if (currentHintIndex < hints.length && hintsUsed < maxHints) {
      setShowHint(true)
      if (currentHintIndex === 0) {
        onHintUsed()
      }
      setCurrentHintIndex(prev => prev + 1)
    }
  }

  /**
   * Menyembunyikan hint
   */
  const handleHideHint = () => {
    setShowHint(false)
  }

  const remainingHints = maxHints - hintsUsed
  const canShowHint = currentHintIndex < hints.length && remainingHints > 0

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between">
        <Button
          onClick={handleShowHint}
          disabled={!canShowHint}
          variant="outline"
          className="bg-transparent border-amber-300 text-amber-700 hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Lightbulb className="w-4 h-4 mr-2" />
          Petunjuk ({remainingHints} tersisa)
        </Button>
        
        {showHint && (
          <Button
            onClick={handleHideHint}
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
          >
            Sembunyikan
          </Button>
        )}
      </div>

      {showHint && (
        <div className="mt-3 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-lg">
          <div className="flex items-start space-x-3">
            <HelpCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-amber-800 mb-2">Petunjuk:</h4>
              <div className="space-y-2">
                {hints.slice(0, currentHintIndex).map((hint, index) => (
                  <p key={index} className="text-amber-700 text-sm">
                    {index + 1}. {hint}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {!canShowHint && hintsUsed >= maxHints && (
        <div className="mt-2 text-sm text-gray-500 text-center">
          💡 Kamu sudah menggunakan semua petunjuk untuk quiz ini
        </div>
      )}
    </div>
  )
}
