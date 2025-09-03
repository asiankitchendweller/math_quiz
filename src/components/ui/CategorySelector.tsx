import { useState } from 'react'
import { Calculator, Square, Percent, Shapes } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * Interface untuk mendefinisikan struktur data kategori quiz
 */
interface Category {
  id: string
  name: string
  icon: JSX.Element
  description: string
  color: string
}

/**
 * Props untuk komponen CategorySelector
 */
interface CategorySelectorProps {
  onSelectCategory: (categoryId: string) => void
}

/**
 * Komponen untuk memilih kategori quiz
 */
export default function CategorySelector({ onSelectCategory }: CategorySelectorProps) {
  const categories: Category[] = [
    {
      id: 'aljabar',
      name: 'Aljabar',
      icon: <Calculator className="w-8 h-8" />,
      description: 'Soal tentang persamaan dan variabel',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'persentase',
      name: 'Persentase',
      icon: <Percent className="w-8 h-8" />,
      description: 'Soal tentang perhitungan persentase',
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'geometri',
      name: 'Geometri',
      icon: <Shapes className="w-8 h-8" />,
      description: 'Soal tentang bangun datar dan ruang',
      color: 'from-orange-500 to-red-600'
    },
    {
      id: 'akar',
      name: 'Akar & Pangkat',
      icon: <Square className="w-8 h-8" />,
      description: 'Soal tentang akar dan pangkat bilangan',
      color: 'from-purple-500 to-pink-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">🧮 Kuis Matematika Interaktif</h1>
          <p className="text-xl text-gray-600">Pilih kategori untuk memulai quiz</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group"
              onClick={() => onSelectCategory(category.id)}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${category.color} text-white group-hover:scale-110 transition-transform duration-300`}>
                  {category.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{category.name}</h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <Button 
                    className={`bg-gradient-to-r ${category.color} hover:opacity-90 transition-opacity duration-300`}
                  >
                    Mulai Quiz
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">🎯 Cara Bermain</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Pilih kategori yang diinginkan</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Jawab semua pertanyaan dengan teliti</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Dapatkan skor tertinggi di leaderboard</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}