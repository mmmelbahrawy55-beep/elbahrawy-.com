'use client'

import { siteData as defaultSiteData } from '../../lib/site-data'
import { useState, useEffect } from 'react'

export default function Products() {
  const [siteData, setSiteData] = useState(defaultSiteData)
  const [activeCategory, setActiveCategory] = useState('all')

  useEffect(() => {
    const storedData = localStorage.getItem('albahrawy_site_data')
    if (storedData) {
      setSiteData(JSON.parse(storedData))
    }

    const fetchFreshData = async () => {
      try {
        const response = await fetch('/api/site-data')
        if (response.ok) {
          const freshData = await response.json()
          setSiteData(freshData)
          localStorage.setItem('albahrawy_site_data', JSON.stringify(freshData))
        }
      } catch (error) {
        console.error('Failed to fetch fresh site data:', error)
      }
    }

    fetchFreshData()

    const handleStorageChange = () => {
      const updatedData = localStorage.getItem('albahrawy_site_data')
      if (updatedData) {
        setSiteData(JSON.parse(updatedData))
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const filteredProducts = activeCategory === 'all' 
    ? siteData.products 
    : siteData.products.filter(p => p.category === activeCategory)

  return (
    <div className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black mb-4">منتجاتنا</h1>
          <p className="text-muted-foreground text-lg">إختار ما يناسب احتياجاتك التجارية</p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 mb-12">
          {siteData.categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-8 py-3 rounded-2xl font-bold transition-all ${
                activeCategory === cat.id 
                  ? 'bg-primary text-primary-foreground shadow-glow' 
                  : 'bg-muted text-muted-foreground hover:bg-card'
              }`}
            >
              <i className={`fas ${cat.icon} ml-2`}></i>
              {cat.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map(product => (
            <div key={product.id} className="luxury-card overflow-hidden p-0 cursor-pointer group">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                  loading="lazy" 
                />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-black mb-3">{product.name}</h3>
                <p className="text-muted-foreground text-sm mb-6">{product.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-muted-foreground">ج.م / {product.pricingType === 'piece' ? 'القطعة' : product.pricingType === 'meter' ? 'المتر' : 'الحرف'}</span>
                    <span className="text-3xl font-black text-primary">{product.price}</span>
                  </div>
                  <button onClick={() => window.location.href = `/products/${product.id}`} className="btn-primary">
                    طلب عرض
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}