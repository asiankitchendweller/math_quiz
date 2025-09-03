import { useState, useEffect } from 'react'
import { Calendar, Clock, Target, Trophy, Star, CheckCircle, XCircle, ArrowLeft, Gift } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * Interface untuk daily challenge question
 */
interface DailyQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
  timeLimit: number
}

/**
 * Interface untuk props DailyChallenge
 */
interface DailyChallengeProps {
  onComplete: (score: number) => void
  onBack: () => void
}

/**
 * Komponen untuk Daily Challenge
 */
export default function DailyChallenge({ onComplete, onBack }: DailyChallengeProps) {
  const [questions, setQuestions] = useState<DailyQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [dailyStreak, setDailyStreak] = useState(0)
  const [rewards, setRewards] = useState<string[]>([])

  // Daily challenge questions - akan berubah setiap hari
  const dailyQuestions: DailyQuestion[] = [
    {
      id: 1,
      question: "Jika sebuah bilangan dibagi 5 bersisa 3, dan dibagi 3 bersisa 2, bilangan terkecil yang memenuhi adalah?",
      options: ["8", "13", "17", "23"],
      correctAnswer: "23",
      explanation: "Bilangan yang dibagi 5 bersisa 3: 3, 8, 13, 18, 23. Dibagi 3 bersisa 2: 2, 5, 8, 11, 14, 17, 20, 23. Bilangan terkecil yang memenuhi kedua syarat adalah 23.",
      difficulty: "hard",
      timeLimit: 60
    },
    {
      id: 2,
      question: "Sebuah pekerjaan dapat diselesaikan oleh A dalam 6 hari dan B dalam 4 hari. Jika mereka bekerja bersama, berapa hari pekerjaan selesai?",
      options: ["2.4 hari", "2.5 hari", "3 hari", "3.5 hari"],
      correctAnswer: "2.4 hari",
      explanation: "A: 1/6 pekerjaan/hari, B: 1/4 pekerjaan/hari. Bersama: 1/6 + 1/4 = 5/12 pekerjaan/hari. Waktu = 12/5 = 2.4 hari.",
      difficulty: "medium",
      timeLimit: 45
    },
    {
      id: 3,
      question: "Jika x + y = 10 dan x - y = 4, maka nilai x² + y² adalah?",
      options: ["52", "58", "64", "68"],
      correctAnswer: "58",
      explanation: "x + y = 10, x - y = 4. Jumlahkan: 2x = 14 → x = 7. y = 10 - 7 = 3. x² + y² = 49 + 9 = 58.",
      difficulty: "medium",
      timeLimit: 40
    },
    {
      id: 4,
      question: "Berapa nilai dari 15% × 200 + 25% × 80?",
      options: ["50", "55", "60", "65"],
      correctAnswer: "50",
      explanation: "15% × 200 = 30, 25% × 80 = 20. Total = 30 + 20 = 50.",
      difficulty: "easy",
      timeLimit: 30
    },
    {
      id: 5,
      question: "Dalam sebuah kotak ada 5 bola merah dan 3 bola biru. Peluang mengambil 2 bola dengan warna berbeda adalah?",
      options: ["15/28", "15/32", "30/56", "45/64"],
      correctAnswer: "15/28",
      explanation: "Total cara: C(8,2) = 28. Cara ambil 1 merah dan 1 biru: C(5,1) × C(3,1) = 15. Peluang = 15/28.",
      difficulty: "hard",
      timeLimit: 50
    }
  ]

  useEffect(() => {
    loadDailyChallenge()
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1)
      }, 1000)
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false)
      if (!showExplanation) {
        handleSubmitAnswer()
      }
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft, showExplanation])

  /**
   * Load daily challenge data
   */
  const loadDailyChallenge = () => {
    const today = new Date().toDateString()
    const savedChallenge = localStorage.getItem(`dailyChallenge_${today}`)
    
    if (savedChallenge) {
      const challenge = JSON.parse(savedChallenge)
      if (challenge.completed) {
        setCompleted(true)
        setScore(challenge.score)
        setRewards(challenge.rewards || [])
      }
    } else {
      // Generate seed based on date for consistent questions
      const seed = new Date().getDate()
      const shuffled = [...dailyQuestions].sort(() => 0.5 - Math.random())
      setQuestions(shuffled.slice(0, 3)) // 3 questions per day
      setCurrentQuestionIndex(0)
      setTimeLeft(shuffled[0]?.timeLimit || 30)
      setIsActive(true)
      
      // Load daily streak
      const savedUser = localStorage.getItem('mathQuizUser')
      if (savedUser) {
        const user = JSON.parse(savedUser)
        setDailyStreak(user.dailyStreak || 0)
      }
    }
  }

  /**
   * Handle answer selection
   */
  const handleAnswerSelect = (answer: string) => {
    if (showExplanation) return
    setSelectedAnswer(answer)
  }

  /**
   * Handle submit answer
   */
  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return

    const currentQuestion = questions[currentQuestionIndex]
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer
    
    if (isCorrect) {
      setScore(prev => prev + getPointsForDifficulty(currentQuestion.difficulty))
      setStreak(prev => prev + 1)
    } else {
      setStreak(0)
    }

    setShowExplanation(true)
    setIsActive(false)
  }

  /**
   * Get points based on difficulty
   */
  const getPointsForDifficulty = (difficulty: string): number => {
    switch (difficulty) {
      case 'easy': return 10
      case 'medium': return 20
      case 'hard': return 30
      default: return 10
    }
  }

  /**
   * Handle next question
   */
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
      setTimeLeft(questions[currentQuestionIndex + 1].timeLimit)
      setIsActive(true)
    } else {
      completeChallenge()
    }
  }

  /**
   * Complete daily challenge
   */
  const completeChallenge = () => {
    const today = new Date().toDateString()
    const newRewards = calculateRewards()
    
    // Save challenge completion
    localStorage.setItem(`dailyChallenge_${today}`, JSON.stringify({
      completed: true,
      score: score,
      rewards: newRewards,
      date: today
    }))
    
    // Update user stats
    const savedUser = localStorage.getItem('mathQuizUser')
    if (savedUser) {
      const user = JSON.parse(savedUser)
      user.dailyStreak = (user.dailyStreak || 0) + 1
      user.totalXP = (user.totalXP || 0) + score
      localStorage.setItem('mathQuizUser', JSON.stringify(user))
    }
    
    setCompleted(true)
    setRewards(newRewards)
    onComplete(score)
  }

  /**
   * Calculate rewards based on performance
   */
  const calculateRewards = (): string[] => {
    const newRewards: string[] = []
    
    if (score >= 80) {
      newRewards.push("🏆 Champion Badge")
    }
    if (streak >= 3) {
      newRewards.push("🔥 Streak Master")
    }
    if (dailyStreak >= 7) {
      newRewards.push("⭐ Weekly Warrior")
    }
    if (score === 100) {
      newRewards.push("💎 Perfect Score")
    }
    
    return newRewards
  }

  /**
   * Format time
   */
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Daily Challenge Selesai!</h1>
            <p className="text-gray-600">Anda telah menyelesaikan tantangan hari ini</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl p-4 text-center">
              <div className="text-2xl font-bold">{score} XP</div>
              <div className="text-sm opacity-90">Total Poin</div>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl p-4 text-center">
              <div className="text-2xl font-bold">{streak}</div>
              <div className="text-sm opacity-90">Current Streak</div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl p-4 text-center">
              <div className="text-2xl font-bold">{dailyStreak + 1}</div>
              <div className="text-sm opacity-90">Daily Streak</div>
            </div>
          </div>

          {rewards.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">🎁 Rewards Earned</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {rewards.map((reward, index) => (
                  <div key={index} className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-3 border border-yellow-200 flex items-center space-x-2">
                    <Gift className="w-5 h-5 text-orange-500" />
                    <span className="font-medium text-gray-700">{reward}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6 border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">💡 Tips for Tomorrow</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Kembali lagi besok untuk challenge baru</li>
              <li>• Pertahankan streak Anda untuk rewards lebih banyak</li>
              <li>• Pelajari topik yang sulit untuk improvement</li>
            </ul>
          </div>

          <div className="flex space-x-3">
            <Button 
              onClick={onBack}
              className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat daily challenge...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Button onClick={onBack} variant="outline" className="bg-transparent border-gray-300 text-gray-700 hover:bg-gray-50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">📅 Daily Challenge</h1>
              <p className="text-gray-600">{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-right">
              <div className="text-sm text-gray-500">Streak</div>
              <div className="font-bold text-orange-600">{dailyStreak} hari</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">XP</div>
              <div className="font-bold text-purple-600">{score}</div>
            </div>
          </div>
        </div>

        {/* Timer */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Waktu Tersisa</span>
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-500">{currentQuestion.difficulty}</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-1000 ${
                timeLeft > 10 ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-pink-500'
              }`}
              style={{ width: `${(timeLeft / currentQuestion.timeLimit) * 100}%` }}
            />
          </div>
          <div className="text-center mt-2">
            <span className={`text-2xl font-bold ${timeLeft > 10 ? 'text-green-600' : 'text-red-600'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Pertanyaan {currentQuestionIndex + 1} dari {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-6 border border-purple-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {currentQuestion.question}
          </h2>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              let buttonStyle = "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              
              if (showExplanation) {
                if (option === currentQuestion.correctAnswer) {
                  buttonStyle = "bg-green-100 border-green-500 text-green-700"
                } else if (option === selectedAnswer && option !== currentQuestion.correctAnswer) {
                  buttonStyle = "bg-red-100 border-red-500 text-red-700"
                }
              } else if (option === selectedAnswer) {
                buttonStyle = "bg-purple-100 border-purple-500 text-purple-700"
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

        {/* Explanation */}
        {showExplanation && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">Penjelasan:</h3>
            <p className="text-blue-700">{currentQuestion.explanation}</p>
            {selectedAnswer === currentQuestion.correctAnswer ? (
              <div className="flex items-center space-x-2 mt-2 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="font-medium">Benar! +{getPointsForDifficulty(currentQuestion.difficulty)} XP</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 mt-2 text-red-600">
                <XCircle className="w-4 h-4" />
                <span className="font-medium">Salah. Streak di-reset</span>
              </div>
            )}
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-center">
          {!showExplanation ? (
            <Button 
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswer}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-8"
            >
              Submit Jawaban
            </Button>
          ) : (
            <Button 
              onClick={handleNextQuestion}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-8"
            >
              {currentQuestionIndex < questions.length - 1 ? "Pertanyaan Berikutnya" : "Selesai"}
            </Button>
          )}
        </div>

        {/* Streak Info */}
        {streak > 0 && (
          <div className="mt-4 text-center">
            <div className="inline-flex items-center space-x-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
              <span>🔥</span>
              <span className="font-medium">{streak} Streak!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
