'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Crown, Eye, EyeOff } from 'lucide-react';

// Fixed admin credentials
const ADMIN_EMAIL = 'admin@albahrawy.com';
const ADMIN_PASSWORD = 'admin123';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Admin login
      const adminUser = {
        id: '1',
        name: 'Admin',
        email: email,
        role: 'admin',
      };
      localStorage.setItem('token', 'admin-token-12345');
      localStorage.setItem('user', JSON.stringify(adminUser));
      
      setTimeout(() => {
        setLoading(false);
        router.push('/dashboard');
      }, 500);
    } else {
      // Customer login/signup
      const customerUser = {
        id: Date.now().toString(),
        name: isLogin ? 'عميل' : name,
        email: email,
        role: 'customer',
      };
      localStorage.setItem('token', 'customer-token-' + Date.now());
      localStorage.setItem('user', JSON.stringify(customerUser));
      
      setTimeout(() => {
        setLoading(false);
        router.push('/');
      }, 500);
    }
  };

  const handleGoogleLogin = () => {
    // Customer Google Login only (redirects to homepage)
    const mockGoogleUser = {
      id: Date.now(),
      name: 'مستخدم جوجل',
      email: 'user@gmail.com',
      provider: 'google',
      role: 'customer',
    };
    
    localStorage.setItem('token', 'google-token-' + Date.now());
    localStorage.setItem('user', JSON.stringify(mockGoogleUser));
    
    setTimeout(() => {
      router.push('/');
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4">
      <div className="max-w-md w-full bg-[#121212] border border-white/10 rounded-3xl p-10 animate-fade-in shadow-2xl">
        <div className="text-center mb-8">
          <div className="mb-6 flex flex-col items-center gap-3">
            <div className="w-24 h-24 flex items-center justify-center">
              <img
                src="https://i.postimg.cc/rp3k0Sh7/albhrawy1.png"
                alt="البحراوي للدعاية والاعلان"
                className="w-full h-full object-contain drop-shadow-xl"
                style={{ filter: 'brightness(0) invert(1) saturate(0)' }}
              />
            </div>
            <div className="flex flex-col items-center">
              <h1 className="text-3xl md:text-4xl font-black tracking-tighter leading-none flex flex-row gap-2" dir="ltr">
                <span className="text-white">ELBA</span> <span className="relative inline-block text-[#FFD700]">7RAWY</span>
              </h1>
              <div className="flex flex-col items-center mt-3" dir="ltr">
                <p className="text-white text-xl md:text-2xl font-bold tracking-[0.2em] leading-none">ADVERTISING</p>
                <div className="h-[3px] w-32 bg-[#FFD700] rounded-full mt-2"></div>
              </div>
            </div>
          </div>
          <p className="text-gray-400 text-lg">
            {isLogin ? 'مرحباً بعودتك' : 'أنشئ حسابك جديد'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-3">الاسم بالكامل</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-black/40 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-[#FFD700] transition-all"
                placeholder="أدخل اسمك"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-400 mb-3">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-black/40 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-[#FFD700] transition-all"
              placeholder="name@example.com"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-bold text-gray-400 mb-3">كلمة المرور</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-black/40 border border-white/10 rounded-xl px-6 py-4 pr-14 text-white focus:outline-none focus:border-[#FFD700] transition-all"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FFD700] transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FFD700] text-black font-black py-5 rounded-xl text-xl hover:scale-[1.02] transition-transform shadow-lg shadow-[#FFD700]/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {loading ? (
              <div className="w-6 h-6 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            ) : (
              isLogin ? 'تسجيل الدخول' : 'إنشاء الحساب'
            )}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-[#121212] px-4 text-sm text-gray-400 font-bold">أو</span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-white border border-gray-300 text-gray-800 font-bold py-4 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-4"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          تسجيل الدخول بجوجل
        </button>

        <p className="text-center text-gray-400 mt-8">
          {isLogin ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟'}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-[#FFD700] font-black hover:underline mr-2"
          >
            {isLogin ? 'إنشاء حساب' : 'تسجيل الدخول'}
          </button>
        </p>
      </div>
    </div>
  );
}