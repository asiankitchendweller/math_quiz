import { useState, useEffect } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * Komponen untuk mengelola sound effects dalam aplikasi
 */
export default function SoundEffects() {
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)

  /**
   * Inisialisasi AudioContext
   */
  useEffect(() => {
    // Cek preferensi sound dari localStorage
    const savedSoundPreference = localStorage.getItem('mathQuizSound')
    if (savedSoundPreference !== null) {
      setSoundEnabled(savedSoundPreference === 'true')
    }

    // Inisialisasi AudioContext
    const initAudio = () => {
      try {
        const context = new (window.AudioContext || (window as any).webkitAudioContext)()
        setAudioContext(context)
      } catch (error) {
        console.error('AudioContext not supported:', error)
      }
    }

    initAudio()

    return () => {
      if (audioContext) {
        audioContext.close()
      }
    }
  }, [])

  /**
   * Toggle sound on/off
   */
  const toggleSound = () => {
    const newSoundState = !soundEnabled
    setSoundEnabled(newSoundState)
    localStorage.setItem('mathQuizSound', newSoundState.toString())
    
    // Play test sound when enabling
    if (newSoundState && audioContext) {
      playSound('click')
    }
  }

  /**
   * Memainkan sound effect
   */
  const playSound = (type: 'click' | 'correct' | 'wrong' | 'complete' | 'achievement') => {
    if (!soundEnabled || !audioContext) return

    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    // Set sound properties based on type
    switch (type) {
      case 'click':
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1)
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.1)
        break

      case 'correct':
        // Play ascending notes
        for (let i = 0; i < 3; i++) {
          const osc = audioContext.createOscillator()
          const gain = audioContext.createGain()
          
          osc.connect(gain)
          gain.connect(audioContext.destination)
          
          osc.frequency.setValueAtTime(523.25 + (i * 100), audioContext.currentTime + (i * 0.1))
          gain.gain.setValueAtTime(0.1, audioContext.currentTime + (i * 0.1))
          gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + (i * 0.1) + 0.2)
          
          osc.start(audioContext.currentTime + (i * 0.1))
          osc.stop(audioContext.currentTime + (i * 0.1) + 0.2)
        }
        break

      case 'wrong':
        oscillator.frequency.setValueAtTime(300, audioContext.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(150, audioContext.currentTime + 0.3)
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.3)
        break

      case 'complete':
        // Play victory fanfare
        const notes = [523.25, 659.25, 783.99, 1046.50]
        notes.forEach((freq, index) => {
          const osc = audioContext.createOscillator()
          const gain = audioContext.createGain()
          
          osc.connect(gain)
          gain.connect(audioContext.destination)
          
          osc.frequency.setValueAtTime(freq, audioContext.currentTime + (index * 0.15))
          gain.gain.setValueAtTime(0.1, audioContext.currentTime + (index * 0.15))
          gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + (index * 0.15) + 0.3)
          
          osc.start(audioContext.currentTime + (index * 0.15))
          osc.stop(audioContext.currentTime + (index * 0.15) + 0.3)
        })
        break

      case 'achievement':
        // Play achievement unlock sound
        const achievementNotes = [523.25, 659.25, 783.99, 1046.50, 1318.51]
        achievementNotes.forEach((freq, index) => {
          const osc = audioContext.createOscillator()
          const gain = audioContext.createGain()
          
          osc.connect(gain)
          gain.connect(audioContext.destination)
          
          osc.frequency.setValueAtTime(freq, audioContext.currentTime + (index * 0.1))
          gain.gain.setValueAtTime(0.08, audioContext.currentTime + (index * 0.1))
          gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + (index * 0.1) + 0.4)
          
          osc.start(audioContext.currentTime + (index * 0.1))
          osc.stop(audioContext.currentTime + (index * 0.1) + 0.4)
        })
        break
    }
  }

  /**
   * Public method untuk dipanggil dari komponen lain
   */
  useEffect(() => {
    // Expose playSound function globally for other components
    (window as any).playQuizSound = playSound
  }, [soundEnabled, audioContext])

  return (
    <Button 
      onClick={toggleSound}
      variant="outline"
      className="bg-transparent border-gray-300 text-gray-700 hover:bg-gray-50"
      title={soundEnabled ? "Matikan Suara" : "Hidupkan Suara"}
    >
      {soundEnabled ? (
        <Volume2 className="w-4 h-4" />
      ) : (
        <VolumeX className="w-4 h-4" />
      )}
    </Button>
  )
}