import { useState } from 'react'
import { Download, FileText, FileSpreadsheet, Code, CheckCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * Interface untuk data quiz yang akan diekspor
 */
interface QuizData {
  questions: any[]
  userAnswers: any[]
  totalTime: number
  category: string
  date: string
}

/**
 * Interface untuk props QuizExport
 */
interface QuizExportProps {
  quizData: QuizData
  onBack: () => void
}

/**
 * Komponen untuk mengekspor hasil quiz dalam berbagai format
 */
export default function QuizExport({ quizData, onBack }: QuizExportProps) {
  const [exportFormat, setExportFormat] = useState<'pdf' | 'csv' | 'json'>('pdf')
  const [isExporting, setIsExporting] = useState(false)
  const [exportSuccess, setExportSuccess] = useState(false)

  /**
   * Menghitung skor quiz
   */
  const calculateScore = () => {
    const correctAnswers = quizData.userAnswers.filter(answer => answer.isCorrect).length
    return {
      correct: correctAnswers,
      total: quizData.questions.length,
      percentage: Math.round((correctAnswers / quizData.questions.length) * 100)
    }
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
   * Generate CSV content
   */
  const generateCSV = (): string => {
    const score = calculateScore()
    const headers = ['Question ID', 'Question', 'Correct Answer', 'User Answer', 'Is Correct', 'Time Spent']
    const rows = quizData.userAnswers.map(answer => {
      const question = quizData.questions.find(q => q.id === answer.questionId)
      return [
        answer.questionId,
        question?.question || '',
        question?.correctAnswer || '',
        answer.selectedAnswer,
        answer.isCorrect ? 'Yes' : 'No',
        answer.timeSpent || 0
      ]
    })

    const csvContent = [
      `Quiz Results - ${quizData.category}`,
      `Date: ${new Date(quizData.date).toLocaleDateString()}`,
      `Score: ${score.correct}/${score.total} (${score.percentage}%)`,
      `Total Time: ${formatTime(quizData.totalTime)}`,
      '',
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    return csvContent
  }

  /**
   * Generate JSON content
   */
  const generateJSON = (): string => {
    const score = calculateScore()
    return JSON.stringify({
      metadata: {
        category: quizData.category,
        date: quizData.date,
        totalQuestions: quizData.questions.length,
        totalTime: quizData.totalTime,
        score: score
      },
      questions: quizData.questions,
      userAnswers: quizData.userAnswers
    }, null, 2)
  }

  /**
   * Generate PDF content (simplified HTML format)
   */
  const generatePDF = (): string => {
    const score = calculateScore()
    const date = new Date(quizData.date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    return `
<!DOCTYPE html>
<html>
<head>
    <title>Quiz Results - ${quizData.category}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .score { background: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .question { margin-bottom: 20px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; }
        .correct { background: #f0fdf4; border-color: #22c55e; }
        .incorrect { background: #fef2f2; border-color: #ef4444; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #e5e7eb; }
        th { background: #f9fafb; }
    </style>
</head>
<body>
    <div class="header">
        <h1>📊 Quiz Results</h1>
        <p><strong>Kategori:</strong> ${quizData.category}</p>
        <p><strong>Tanggal:</strong> ${date}</p>
        <p><strong>Total Waktu:</strong> ${formatTime(quizData.totalTime)}</p>
    </div>

    <div class="score">
        <h2>📈 Skor Akhir</h2>
        <p><strong>${score.correct} / ${score.total} (${score.percentage}%)</strong></p>
    </div>

    <h3>📝 Detail Jawaban</h3>
    ${quizData.userAnswers.map((answer, index) => {
      const question = quizData.questions.find(q => q.id === answer.questionId)
      const isCorrect = answer.isCorrect
      return `
        <div class="question ${isCorrect ? 'correct' : 'incorrect'}">
            <h4>Soal ${index + 1}</h4>
            <p><strong>Pertanyaan:</strong> ${question?.question}</p>
            <p><strong>Jawaban Benar:</strong> ${question?.correctAnswer}</p>
            <p><strong>Jawaban Anda:</strong> ${answer.selectedAnswer}</p>
            <p><strong>Status:</strong> ${isCorrect ? '✅ Benar' : '❌ Salah'}</p>
            <p><strong>Waktu:</strong> ${answer.timeSpent || 0} detik</p>
            ${!isCorrect ? `<p><strong>Penjelasan:</strong> ${question?.explanation}</p>` : ''}
        </div>
      `
    }).join('')}

    <table>
        <thead>
            <tr>
                <th>Soal</th>
                <th>Status</th>
                <th>Waktu</th>
            </tr>
        </thead>
        <tbody>
            ${quizData.userAnswers.map((answer, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td>${answer.isCorrect ? '✅ Benar' : '❌ Salah'}</td>
                    <td>${answer.timeSpent || 0}s</td>
                </tr>
            `).join('')}
        </tbody>
    </table>
</body>
</html>
    `
  }

  /**
   * Handle export action
   */
  const handleExport = async () => {
    setIsExporting(true)
    
    try {
      let content: string
      let filename: string
      let mimeType: string

      switch (exportFormat) {
        case 'csv':
          content = generateCSV()
          filename = `quiz-results-${quizData.category}-${Date.now()}.csv`
          mimeType = 'text/csv'
          break
        case 'json':
          content = generateJSON()
          filename = `quiz-results-${quizData.category}-${Date.now()}.json`
          mimeType = 'application/json'
          break
        case 'pdf':
          content = generatePDF()
          filename = `quiz-results-${quizData.category}-${Date.now()}.html`
          mimeType = 'text/html'
          break
      }

      // Create blob and download
      const blob = new Blob([content], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setExportSuccess(true)
      setTimeout(() => setExportSuccess(false), 3000)
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const score = calculateScore()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Button onClick={onBack} variant="outline" className="bg-transparent border-gray-300 text-gray-700 hover:bg-gray-50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
            <h1 className="text-3xl font-bold text-gray-800">📤 Export Hasil Quiz</h1>
          </div>
        </div>

        {/* Quiz Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">📊 Ringkasan Quiz</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-gray-600">Kategori</div>
              <div className="font-semibold text-gray-800 capitalize">{quizData.category}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Skor</div>
              <div className="font-semibold text-gray-800">{score.correct}/{score.total} ({score.percentage}%)</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Waktu</div>
              <div className="font-semibold text-gray-800">{formatTime(quizData.totalTime)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Tanggal</div>
              <div className="font-semibold text-gray-800">{new Date(quizData.date).toLocaleDateString('id-ID')}</div>
            </div>
          </div>
        </div>

        {/* Format Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Pilih Format Export</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setExportFormat('pdf')}
              className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                exportFormat === 'pdf'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              <FileText className="w-8 h-8 mx-auto mb-2 text-red-500" />
              <div className="font-medium text-gray-800">PDF Report</div>
              <div className="text-sm text-gray-600">Laporan lengkap dengan formatting</div>
            </button>

            <button
              onClick={() => setExportFormat('csv')}
              className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                exportFormat === 'csv'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              <FileSpreadsheet className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <div className="font-medium text-gray-800">CSV Data</div>
              <div className="text-sm text-gray-600">Data untuk analisis di Excel</div>
            </button>

            <button
              onClick={() => setExportFormat('json')}
              className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                exportFormat === 'json'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              <Code className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <div className="font-medium text-gray-800">JSON Data</div>
              <div className="text-sm text-gray-600">Data terstruktur untuk developer</div>
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Preview Data</h3>
          <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
              {exportFormat === 'json' ? generateJSON().substring(0, 500) + '...' : 
               exportFormat === 'csv' ? generateCSV().substring(0, 500) + '...' :
               'HTML report dengan formatting lengkap...'}
            </pre>
          </div>
        </div>

        {/* Export Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleExport}
            disabled={isExporting}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-8"
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Mengekspor...
              </>
            ) : exportSuccess ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Berhasil Diekspor!
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export {exportFormat.toUpperCase()}
              </>
            )}
          </Button>
        </div>

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-2">
            <span className="text-blue-600">ℹ️</span>
            <div className="text-blue-700 text-sm">
              <p className="font-medium mb-1">Informasi Export:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>PDF: Laporan lengkap dengan formatting dan visualisasi</li>
                <li>CSV: Data mentah untuk analisis di spreadsheet</li>
                <li>JSON: Data terstruktur untuk integrasi sistem</li>
                <li>Semua format termasuk jawaban, penjelasan, dan waktu pengerjaan</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
