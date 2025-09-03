
/**
 * Komponen Leaderboard untuk menampilkan peringkat pengguna
 */
import { Trophy, Medal, Award } from 'lucide-react'

interface LeaderboardEntry {
  id: string
  name: string
  score: number
  category: string
  time: string
}

interface LeaderboardProps {
  entries: LeaderboardEntry[]
}

export default function Leaderboard({ entries }: LeaderboardProps) {
  // Sort entries by score descending
  const sortedEntries = [...entries].sort((a, b) => b.score - a.score)

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Award className="w-6 h-6 text-orange-600" />
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-600">{rank}</span>
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300'
      case 2:
        return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300'
      case 3:
        return 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-300'
      default:
        return 'bg-white border-gray-200'
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">🏆 Peringkat Teratas</h2>
        <span className="text-sm text-gray-500">Update real-time</span>
      </div>
      
      <div className="space-y-3">
        {sortedEntries.slice(0, 10).map((entry, index) => (
          <div
            key={entry.id}
            className={`flex items-center justify-between p-4 rounded-lg border-2 ${getRankColor(index + 1)} transition-all duration-300 hover:shadow-md`}
          >
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-8 h-8">
                {getRankIcon(index + 1)}
              </div>
              
              <div>
                <div className="font-semibold text-gray-800">{entry.name}</div>
                <div className="text-sm text-gray-500">{entry.category}</div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="font-bold text-lg text-gray-800">{entry.score}%</div>
              <div className="text-sm text-gray-500">{entry.time}</div>
            </div>
          </div>
        ))}
      </div>
      
      {sortedEntries.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Belum ada data peringkat</p>
          <p className="text-sm">Jadilah yang pertama!</p>
        </div>
      )}
    </div>
  )
}
