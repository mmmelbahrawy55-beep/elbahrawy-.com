'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Header() {
  const pathname = usePathname()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const user = localStorage.getItem('user')
    setIsLoggedIn(!!user)
  }, [pathname])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setIsLoggedIn(false)
    window.location.href = '/'
  }

  const isActive = (path: string) => pathname === path

  return (
    <header className="glass-header">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-4">
          <div className="w-16 h-16 flex items-center justify-center">
            <img
              src="https://i.postimg.cc/rp3k0Sh7/albhrawy1.png"
              alt="البحراوي للدعاية والاعلان"
              className="w-full h-full object-contain"
              style={{ filter: 'brightness(0) invert(1) saturate(0)' }}
            />
          </div>
          <div className="text-right flex flex-col items-center">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-tight flex flex-row gap-2" dir="ltr">
              <span className="text-white">ELBA</span> <span className="text-primary relative inline-block">7RAWY
                <span className="absolute -bottom-2 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-white/30 to-primary rounded-full shadow-lg shadow-primary/40"></span>
              </span>
            </h1>
          </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-reverse space-x-8 font-bold text-sm">
          <Link href="/" className={`${isActive('/') ? 'text-primary' : 'text-white hover:text-primary'} transition`}>الرئيسية</Link>
          <Link href="/products" className={`${isActive('/products') ? 'text-primary' : 'text-white hover:text-primary'} transition`}>المنتجات</Link>
          <Link href="/portfolio" className={`${isActive('/portfolio') ? 'text-primary' : 'text-white hover:text-primary'} transition`}>أعمالنا</Link>
          <Link href="/contact" className={`${isActive('/contact') ? 'text-primary' : 'text-white hover:text-primary'} transition`}>تواصل معنا</Link>
        </nav>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" className="btn-primary">
                لوحة التحكم
              </Link>
              <button
                onClick={handleLogout}
                className="px-6 py-3 rounded-xl font-bold text-white hover:bg-white/10 transition"
              >
                تسجيل الخروج
              </button>
            </>
          ) : (
            <Link href="/login" className="btn-primary">
              تسجيل الدخول
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}