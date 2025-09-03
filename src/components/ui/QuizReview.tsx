/**
 * Komponen untuk review hasil quiz
 * Menampilkan analisis detail performa user
 */
import { useState } from 'react'
import { CheckCircle, XCircle, Clock, Target, TrendingUp, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  timeLimit: number
}

interface UserAnswer {
  questionId: number
  selectedAnswer: string
  isCorrect: boolean
  timeSpent: number
}

interface QuizReviewProps {
  questions: QuizQuestion[]
  userAnswers: UserAnswer[]
  totalTime: number
  onRestart: () => void
  onBackToCategories: () => void
}

export default function QuizReview({ 
  questions, 
  userAnswers, 
  totalTime, 
  onRestart, 
  onBackToCategories 
}: QuizReviewProps) {
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0)
  
  const correctAnswers = userAnswers.filter(answer => answer.isCorrect).length
  const accuracy = Math.round((correctAnswers / questions.length) * 100)
  const averageTimePerQuestion = Math.round(totalTime / questions.length)
  
  const selectedQuestion = questions[selectedQuestionIndex]
  const userAnswer = userAnswers.find(answer => answer.questionId === selectedQuestion.id)

  /**
   * Menghitung performa berdasarkan difficulty
   */
  const getPerformanceByDifficulty = () => {
    const performance = {
      easy: { correct: 0, total: 0 },
      medium: { correct: 0, total: 0 },
      hard: { correct: 0, total: 0 }
    }

    questions.forEach(question => {
      const userAnswerForQuestion = userAnswers.find(answer => answer.questionId === question.id)
      if (userAnswerForQuestion) {
        performance[question.difficulty].total++
        if (userAnswerForQuestion.isCorrect) {
          performance[question.difficulty].correct++
        }
      }
    })

    return performance
  }

  const performanceByDifficulty = getPerformanceByDifficulty()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Review Quiz</h1>
          <p className="text-gray-600">Analisis detail performa kamu</p>
        </div>

        {/* Statistik Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl p-4 text-center">
            <div className="text-2xl font-bold">{accuracy}%</div>
            <div className="text-sm opacity-90">Akurasi</div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-4 text-center">
            <div className="text-2xl font-bold">{correctAnswers}/{questions.length}</div>
            <div className="text-sm opacity-90">Benar</div>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl p-4 text-center">
            <div className="text-2xl font-bold">{averageTimePerQuestion}s</div>
            <div className="text-sm opacity-90">Rata-rata Waktu</div>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl p-4 text-center">
            <div className="text-2xl font-bold">{Math.round(totalTime / 60)}m</div>
            <div className="text-sm opacity-90">Total Waktu</div>
          </div>
        </div>

        {/* Performa berdasarkan Difficulty */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Performa berdasarkan Tingkat Kesulitan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(performanceByDifficulty).map(([difficulty, data]) => {
              const percentage = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0
              const colorClass = difficulty === 'easy' ? 'from-green-500 to-emerald-600' : 
                               difficulty === 'medium' ? 'from-yellow-500 to-orange-600' : 
                               'from-red-500 to-pink-600'
              
              return (
                <div key={difficulty} className={`bg-gradient-to-r ${colorClass} text-white rounded-xl p-4`}>
                  <div className="text-xl font-bold capitalize">{difficulty}</div>
                  <div className="text-2xl font-bold">{percentage}%</div>
                  <div className="text-sm opacity-90">{data.correct}/{data.total} benar</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Navigasi Soal */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Navigasi Soal</h3>
          <div className="flex flex-wrap gap-2">
            {questions.map((question, index) => {
              const userAnswerForQuestion = userAnswers.find(answer => answer.questionId === question.id)
              const isSelected = selectedQuestionIndex === index
              const isCorrect = userAnswerForQuestion?.isCorrect
              
              let buttonClass = "w-10 h-10 rounded-lg border-2 flex items-center justify-center font-medium text-sm transition-all"
              
              if (isSelected) {
                buttonClass += " border-blue-500 bg-blue-100 text-blue-700"
              } else if (isCorrect) {
                buttonClass += " border-green-500 bg-green-100 text-green-700"
              } else {
                buttonClass += " border-red-500 bg-red-100 text-red-700"
              }
              
              return (
                <button
                  key={question.id}
                  onClick={() => setSelectedQuestionIndex(index)}
                  className={buttonClass}
                >
                  {index + 1}
                </button>
              )
            })}
          </div>
        </div>

        {/* Detail Soal */}
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Soal {selectedQuestionIndex + 1}
            </h3>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                selectedQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                selectedQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {selectedQuestion.difficulty}
              </span>
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>{userAnswer?.timeSpent}s</span>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-gray-800 font-medium mb-3">{selectedQuestion.question}</p>
            
            <div className="space-y-2">
              {selectedQuestion.options.map((option, index) => {
                const isSelected = option === userAnswer?.selectedAnswer
                const isCorrect = option === selectedQuestion.correctAnswer
                
                let optionClass = "p-3 rounded-lg border-2 transition-all"
                
                if (isCorrect) {
                  optionClass += " border-green-500 bg-green-50 text-green-700"
                } else if (isSelected && !isCorrect) {
                  optionClass += " border-red-500 bg-red-50 text-red-700"
                } else {
                  optionClass += " border-gray-200 bg-white text-gray-700"
                }
                
                return (
                  <div key={index} className={optionClass}>
                    <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
                    {isCorrect && <CheckCircle className="w-4 h-4 inline ml-2 text-green-500" />}
                    {isSelected && !isCorrect && <XCircle className="w-4 h-4 inline ml-2 text-red-500" />}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Penjelasan:</h4>
            <p className="text-blue-700">{selectedQuestion.explanation}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button 
            onClick={onRestart}
            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
          >
            Ulangi Quiz
          </Button>
          <Button 
            onClick={onBackToCategories}
            variant="outline"
            className="flex-1 bg-transparent border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Kategori
          </Button>
        </div>
      </div>
    </div>
  )
}
