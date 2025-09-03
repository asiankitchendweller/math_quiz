import { useState, useEffect } from 'react'
import { Trophy, Star, Award, Zap, Target, Clock, Brain, Medal } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * Interface untuk achievement
 */
interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  color: string
  unlocked: boolean
  unlockedDate?: string
}

/**
 * Interface untuk data user
 */
interface UserData {
  id: string
  name: string
  email: string
  totalScore: number
  quizzesCompleted: number
  achievements: string[]
  bestStreak: number
}

/**
 * Komponen untuk sistem achievement
 */
export default function AchievementSystem() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [showAchievements, setShowAchievements] = useState(false)
  const [achievements, setAchievements] = useState<Achievement[]>([])

  /**
   * Daftar achievement yang tersedia
   */
  const allAchievements: Achievement[] = [
    {
      id: 'first_quiz',
      name: 'Pemula',
      description: 'Menyelesaikan quiz pertama',
      icon: 'star',
      color: 'text-yellow-500',
      unlocked: false
    },
    {
      id: 'perfect_score',
      name: 'Sempurna',
      description: 'Mendapatkan skor 100% dalam satu quiz',
      icon: 'trophy',
      color: 'text-yellow-500',
      unlocked: false
    },
    {
      id: 'streak_5',
      name: 'Beruntun',
      description: 'Mendapatkan streak 5 jawaban benar',
      icon: 'zap',
      color: 'text-orange-500',
      unlocked: false
    },
    {
      id: 'speed_demon',
      name: 'Kilat',
      description: 'Menyelesaikan quiz dalam waktu kurang dari 2 menit',
      icon: 'clock',
      color: 'text-blue-500',
      unlocked: false
    },
    {
      id: 'math_master',
      name: 'Master Matematika',
      description: 'Menyelesaikan 10 quiz dengan skor rata-rata di atas 80%',
      icon: 'brain',
      color: 'text-purple-500',
      unlocked: false
    },
    {
      id: 'category_expert',
      name: 'Ahli Kategori',
      description: 'Menyelesaikan semua kategori quiz',
      icon: 'target',
      color: 'text-green-500',
      unlocked: false
    },
    {
      id: 'quiz_warrior',
      name: 'Pebis Quiz',
      description: 'Menyelesaikan 25 quiz',
      icon: 'award',
      color: 'text-red-500',
      unlocked: false
    },
    {
      id: 'high_scorer',
      name: 'Pencetak Skor Tinggi',
      description: 'Mengumpulkan total skor 1000 poin',
      icon: 'medal',
      color: 'text-indigo-500',
      unlocked: false
    }
  ]

  /**
   * Memuat data user dari localStorage
   */
  useEffect(() => {
    const savedUser = localStorage.getItem('mathQuizUser')
    if (savedUser) {
      const user = JSON.parse(savedUser)
      setUserData(user)
      
      // Update achievement status berdasarkan data user
      const updatedAchievements = allAchievements.map(achievement => ({
        ...achievement,
        unlocked: user.achievements.includes(achievement.id)
      }))
      setAchievements(updatedAchievements)
    }
  }, [])

  /**
   * Mengecek dan unlock achievement baru
   */
  const checkAndUnlockAchievement = (achievementId: string) => {
    if (!userData || userData.achievements.includes(achievementId)) return

    const updatedUser = {
      ...userData,
      achievements: [...userData.achievements, achievementId]
    }

    setUserData(updatedUser)
    localStorage.setItem('mathQuizUser', JSON.stringify(updatedUser))

    // Update achievement status
    const updatedAchievements = achievements.map(achievement => 
      achievement.id === achievementId 
        ? { ...achievement, unlocked: true, unlockedDate: new Date().toISOString() }
        : achievement
    )
    setAchievements(updatedAchievements)

    // Show notification
    showAchievementNotification(achievementId)
  }

  /**
   * Menampilkan notifikasi achievement baru
   */
  const showAchievementNotification = (achievementId: string) => {
    const achievement = allAchievements.find(a => a.id === achievementId)
    if (!achievement) return

    // Create notification element
    const notification = document.createElement('div')
    notification.className = 'fixed top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-500'
    notification.innerHTML = `
      <div class="flex items-center space-x-3">
        <div class="text-2xl">🏆</div>
        <div>
          <div class="font-bold">Achievement Unlocked!</div>
          <div class="text-sm">${achievement.name}</div>
        </div>
      </div>
    `

    document.body.appendChild(notification)

    // Animate in
    setTimeout(() => {
      notification.classList.remove('translate-x-full')
    }, 100)

    // Remove after 3 seconds
    setTimeout(() => {
      notification.classList.add('translate-x-full')
      setTimeout(() => {
        document.body.removeChild(notification)
      }, 500)
    }, 3000)
  }

  /**
   * Render icon berdasarkan nama icon
   */
  const renderIcon = (iconName: string, color: string) => {
    const iconProps = { className: `w-6 h-6 ${color}` }
    
    switch (iconName) {
      case 'star':
        return <Star {...iconProps} />
      case 'trophy':
        return <Trophy {...iconProps} />
      case 'zap':
        return <Zap {...iconProps} />
      case 'clock':
        return <Clock {...iconProps} />
      case 'brain':
        return <Brain {...iconProps} />
      case 'target':
        return <Target {...iconProps} />
      case 'award':
        return <Award {...iconProps} />
      case 'medal':
        return <Medal {...iconProps} />
      default:
        return <Star {...iconProps} />
    }
  }

  return (
    <div className="relative">
      <Button 
        onClick={() => setShowAchievements(!showAchievements)}
        variant="outline"
        className="bg-transparent border-gray-300 text-gray-700 hover:bg-gray-50"
      >
        <Trophy className="w-4 h-4 mr-2" />
        Achievement
        {userData && userData.achievements.length > 0 && (
          <span className="ml-2 bg-orange-500 text-white text-xs rounded-full px-2 py-1">
            {userData.achievements.length}
          </span>
        )}
      </Button>

      {/* Achievement Modal */}
      {showAchievements && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">🏆 Achievement</h3>
              <Button 
                onClick={() => setShowAchievements(false)}
                variant="outline"
                className="bg-transparent border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                ✕
              </Button>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Progress</span>
                <span className="font-semibold">
                  {userData?.achievements.length || 0} / {allAchievements.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((userData?.achievements.length || 0) / allAchievements.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement) => (
                <div 
                  key={achievement.id}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    achievement.unlocked 
                      ? 'border-yellow-300 bg-yellow-50' 
                      : 'border-gray-200 bg-gray-50 opacity-60'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${
                      achievement.unlocked ? 'bg-yellow-100' : 'bg-gray-100'
                    }`}>
                      {renderIcon(achievement.icon, achievement.unlocked ? achievement.color : 'text-gray-400')}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-semibold ${
                        achievement.unlocked ? 'text-gray-800' : 'text-gray-500'
                      }`}>
                        {achievement.name}
                      </h4>
                      <p className={`text-sm ${
                        achievement.unlocked ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {achievement.description}
                      </p>
                      {achievement.unlocked && achievement.unlockedDate && (
                        <p className="text-xs text-gray-500 mt-1">
                          Unlocked: {new Date(achievement.unlockedDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div>
                      {achievement.unlocked ? (
                        <div className="text-yellow-500">✓</div>
                      ) : (
                        <div className="text-gray-400">🔒</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Button 
                onClick={() => setShowAchievements(false)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              >
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}