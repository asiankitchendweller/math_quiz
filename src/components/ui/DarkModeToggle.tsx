import { useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * Komponen untuk toggle dark mode
 */
export default function DarkModeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  /**
   * Mengecek preferensi dark mode dari localStorage dan system preference
   */
  useEffect(() => {
    // Cek preferensi dari localStorage
    const savedTheme = localStorage.getItem('mathQuizTheme')
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark')
    } else {
      // Cek system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setIsDarkMode(prefersDark)
    }
  }, [])

  /**
   * Menerapkan tema ke DOM
   */
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('mathQuizTheme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('mathQuizTheme', 'light')
    }
  }, [isDarkMode])

  /**
   * Toggle dark mode
   */
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    
    // Play sound effect if available
    if (typeof (window as any).playQuizSound === 'function') {
      ;(window as any).playQuizSound('click')
    }
  }

  return (
    <Button 
      onClick={toggleDarkMode}
      variant="outline"
      className="bg-transparent border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
      title={isDarkMode ? "Mode Terang" : "Mode Gelap"}
    >
      {isDarkMode ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </Button>
  )
}