'use client'

import { usePathname } from 'next/navigation'

export default function Header() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <header className="glass-header">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <a href="/" className="flex items-center gap-2 md:gap-4">
          <div className="w-10 h-10 md:w-16 md:h-16 flex items-center justify-center">
            <img
              src="https://i.postimg.cc/rp3k0Sh7/albhrawy1.png"
              alt="البحراوي للدعاية والاعلان"
              className="w-full h-full object-contain"
              style={{ filter: 'brightness(0) invert(1) saturate(0)' }}
            />
          </div>
          <div className="text-right flex flex-col items-center">
            <h1 className="text-xl md:text-3xl font-black tracking-tight leading-tight flex flex-row gap-2" dir="ltr">
              <span className="text-white">ELBA</span> <span className="text-primary relative inline-block">7RAWY
                <span className="absolute -bottom-1 md:-bottom-2 left-0 w-full h-1 md:h-1.5 bg-primary rounded-full shadow-lg shadow-primary/40"></span>
              </span>
            </h1>
          </div>
        </a>

        <nav className="hidden md:flex items-center space-x-reverse space-x-8 font-bold text-sm">
          <a href="/" className={`${isActive('/') ? 'text-primary' : 'text-white hover:text-primary'} transition`}>الرئيسية</a>
          <a href="/products" className={`${isActive('/products') ? 'text-primary' : 'text-white hover:text-primary'} transition`}>المنتجات</a>
          <a href="/portfolio" className={`${isActive('/portfolio') ? 'text-primary' : 'text-white hover:text-primary'} transition`}>أعمالنا</a>
          <a href="/contact" className={`${isActive('/contact') ? 'text-primary' : 'text-white hover:text-primary'} transition`}>تواصل معنا</a>
        </nav>

        <div className="flex items-center gap-4">
          <a href="/login" className="btn-primary text-sm md:text-base px-6 py-3">
            تسجيل الدخول
          </a>
        </div>
      </div>
    </header>
  )
}