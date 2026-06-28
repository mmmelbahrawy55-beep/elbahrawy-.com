'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, User, Lock } from 'lucide-react'
import { siteData as defaultSiteData } from '../../lib/site-data'
import { db } from '../../lib/firebaseConfig'
import { doc, getDoc, onSnapshot } from 'firebase/firestore'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [siteData, setSiteData] = useState(defaultSiteData)
  const router = useRouter()

  // Load data from Firestore in real-time
  useEffect(() => {
    const docRef = doc(db, 'siteData', 'main');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data?.data) {
          setSiteData(data.data);
        }
      }
    }, (error) => {
      console.error('Firestore sync error:', error);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (email === siteData.credentials.owner.email && 
          password === siteData.credentials.owner.password) {
        
        const user = {
          email: siteData.credentials.owner.email,
          role: 'admin',
          name: siteData.ownerName
        }
        
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('token', 'demo-token-' + Date.now())
        
        router.push('/dashboard')
        return
      }

      const customer = siteData.credentials.customers.find(
        c => c.email === email && c.password === password
      )
      
      if (customer) {
        const user = {
          email: customer.email,
          role: 'customer',
          name: customer.name
        }
        
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('token', 'demo-token-' + Date.now())
        
        router.push('/')
        return
      }

      setError('البريد الالكتروني أو كلمة المرور غير صحيحة')
    } catch (err) {
      setError('حدث خطأ، حاول مرة أخرى')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050505] via-[#1a1a1a] to-[#050505] flex items-center justify-center p-4 font-cairo overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#FFD700]/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FFD700]/5 rounded-full blur-3xl animate-pulse"></div>

      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-[#FFD700]/20 to-[#FFD700]/5 border border-[#FFD700]/30 rounded-full flex items-center justify-center">
              <img
                src="https://i.postimg.cc/rp3k0Sh7/albhrawy1.png"
                alt="البحراوي للدعاية"
                className="w-16 h-16 object-contain"
                style={{ filter: 'brightness(0) invert(1) saturate(0)' }}
              />
            </div>
          </div>
          <div className="text-white text-2xl font-bold">البحراوي للدعاية والإعلان</div>
        </div>

        <div className="bg-[#0F0F0F] border border-white/10 rounded-3xl p-12 backdrop-blur-xl shadow-2xl shadow-[#FFD700]/10">
          <h2 className="text-4xl font-black text-white mb-4 text-center">تسجيل الدخول</h2>
          <p className="text-gray-400 text-center mb-10">أدخل بياناتك للوصول إلى حسابك</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl p-4 mb-8 text-center">
              خطأ: {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-300">البريد الالكتروني</label>
              <div className="relative group">
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#FFD700]">
                  <User size={24} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0F0F0F] border border-white/20 rounded-2xl px-14 py-5 text-white placeholder-gray-600 focus:outline-none focus:border-[#FFD700] transition-all focus:ring-2 focus:ring-[#FFD700]/20"
                  placeholder="أدخل بريدك الإلكتروني"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-300">كلمة المرور</label>
              <div className="relative group">
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#FFD700]">
                  <Lock size={24} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0F0F0F] border border-white/20 rounded-2xl px-14 py-5 text-white placeholder-gray-600 focus:outline-none focus:border-[#FFD700] transition-all pr-16"
                  placeholder="••••••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#FFD700] transition-colors"
                >
                  {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#FFD700] via-[#FFC700] to-[#FFA500] hover:from-[#FFE55C] hover:via-[#FFD700] hover:to-[#FFB347] disabled:opacity-70 disabled:cursor-not-allowed text-black font-black py-6 rounded-2xl transition-all shadow-lg shadow-[#FFD700]/30 hover:shadow-[#FFD700]/50 hover:scale-105 transition-all duration-300 transform active:scale-95"
            >
              {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول الآن'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
