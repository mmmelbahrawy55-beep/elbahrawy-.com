'use client'

import { siteData as defaultSiteData } from '../../lib/site-data'
import { useState, useEffect } from 'react'
import { db } from '../../lib/firebaseConfig'
import { doc, getDoc, onSnapshot } from 'firebase/firestore'

export default function Portfolio() {
  const [siteData, setSiteData] = useState(defaultSiteData)
  const [activeCategory, setActiveCategory] = useState('all')

  useEffect(() => {
    const storedData = localStorage.getItem('albahrawy_site_data')
    if (storedData) {
      setSiteData(JSON.parse(storedData))
    }

    const docRef = doc(db, 'siteData', 'main')
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data()
        if (data?.data) {
          setSiteData(data.data)
          localStorage.setItem('albahrawy_site_data', JSON.stringify(data.data))
        }
      }
    }, (error) => {
      console.error('Firestore sync error:', error)
    })

    const handleStorageChange = () => {
      const updatedData = localStorage.getItem('albahrawy_site_data')
      if (updatedData) {
        setSiteData(JSON.parse(updatedData))
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => {
      unsubscribe()
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const filteredItems = activeCategory === 'all' 
    ? siteData.portfolio 
    : siteData.portfolio.filter(item => item.category === activeCategory)

  const categories = ['all', ...Array.from(new Set(siteData.portfolio.map(item => item.category)))]

  return (
    <div className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black mb-4">معرض أعمالنا</h1>
          <p className="text-muted-foreground text-lg">اطلع على نماذج من أعمالنا الاحترافية</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-3 rounded-2xl font-bold transition-all ${
                activeCategory === cat 
                  ? 'bg-primary text-primary-foreground shadow-glow' 
                  : 'bg-muted text-muted-foreground hover:bg-card'
              }`}
            >
              {cat === 'all' ? 'الكل' : cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {siteData.portfolio.map(item => (
            <div key={item.id} className="luxury-card overflow-hidden p-0 cursor-pointer group relative h-80">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
              <div className="absolute bottom-0 right-0 p-8 w-full">
                <h3 className="text-2xl font-black text-white">{item.title}</h3>
                <p className="text-primary font-bold text-sm">{item.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}