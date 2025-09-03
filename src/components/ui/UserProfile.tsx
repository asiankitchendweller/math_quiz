import { useState } from 'react'
import { User, LogOut, Trophy, Star, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'

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
 * Komponen untuk menampilkan profil user dan menu pengaturan
 */
export default function UserProfile() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [showProfile, setShowProfile] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [loginForm, setLoginForm] = useState({ name: '', email: '' })

  /**
   * Menangani login user
   */
  const handleLogin = () => {
    if (loginForm.name && loginForm.email) {
      const newUser: UserData = {
        id: Date.now().toString(),
        name: loginForm.name,
        email: loginForm.email,
        totalScore: 0,
        quizzesCompleted: 0,
        achievements: [],
        bestStreak: 0
      }
      setUserData(newUser)
      setShowLogin(false)
      setLoginForm({ name: '', email: '' })
      // Simpan ke localStorage
      localStorage.setItem('mathQuizUser', JSON.stringify(newUser))
    }
  }

  /**
   * Menangani logout user
   */
  const handleLogout = () => {
    setUserData(null)
    localStorage.removeItem('mathQuizUser')
    setShowProfile(false)
  }

  /**
   * Memuat data user dari localStorage saat komponen mount
   */
  useState(() => {
    const savedUser = localStorage.getItem('mathQuizUser')
    if (savedUser) {
      setUserData(JSON.parse(savedUser))
    }
  })

  // Jika user belum login
  if (!userData) {
    return (
      <div className="flex items-center space-x-2">
        <Button 
          onClick={() => setShowLogin(true)}
          variant="outline"
          className="bg-transparent border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          <User className="w-4 h-4 mr-2" />
          Login
        </Button>
        
        {/* Login Modal */}
        {showLogin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h3 className="text-lg font-semibold mb-4">Login untuk Menyimpan Progress</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                  <input
                    type="text"
                    value={loginForm.name}
                    onChange={(e) => setLoginForm({...loginForm, name: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan nama Anda"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan email Anda"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button 
                    onClick={handleLogin}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                    disabled={!loginForm.name || !loginForm.email}
                  >
                    Login
                  </Button>
                  <Button 
                    onClick={() => setShowLogin(false)}
                    variant="outline"
                    className="bg-transparent border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Batal
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative">
      <Button 
        onClick={() => setShowProfile(!showProfile)}
        variant="outline"
        className="bg-transparent border-gray-300 text-gray-700 hover:bg-gray-50"
      >
        <User className="w-4 h-4 mr-2" />
        {userData.name}
      </Button>

      {/* Profile Dropdown */}
      {showProfile && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                {userData.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold">{userData.name}</h3>
                <p className="text-sm text-gray-600">{userData.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-blue-600">{userData.totalScore}</div>
                <div className="text-xs text-blue-600">Total Skor</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-green-600">{userData.quizzesCompleted}</div>
                <div className="text-xs text-green-600">Quiz Selesai</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-purple-600">{userData.bestStreak}</div>
                <div className="text-xs text-purple-600">Streak Terbaik</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-orange-600">{userData.achievements.length}</div>
                <div className="text-xs text-orange-600">Achievement</div>
              </div>
            </div>

            <div className="space-y-2">
              <Button 
                variant="outline"
                className="w-full justify-start bg-transparent border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Trophy className="w-4 h-4 mr-2" />
                Achievement
              </Button>
              <Button 
                variant="outline"
                className="w-full justify-start bg-transparent border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Star className="w-4 h-4 mr-2" />
                Statistik
              </Button>
              <Button 
                variant="outline"
                className="w-full justify-start bg-transparent border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Settings className="w-4 h-4 mr-2" />
                Pengaturan
              </Button>
              <Button 
                onClick={handleLogout}
                variant="outline"
                className="w-full justify-start bg-transparent border-red-300 text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}