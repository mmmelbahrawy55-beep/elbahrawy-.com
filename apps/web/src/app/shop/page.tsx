'use client';

import { useState, useEffect } from 'react';
import {
  Menu,
  X,
  ShoppingCart,
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Twitter,
  Send,
  Layout,
  Package,
  Palette,
  Printer,
  Truck,
  Smartphone,
  Monitor,
  Gift,
  Star,
  Zap
} from 'lucide-react';

// Same icons as admin panel
const categoryIcons = [
  { id: 'Layout', icon: Layout, name: 'تصميم' },
  { id: 'Package', icon: Package, name: 'طباعة' },
  { id: 'Palette', icon: Palette, name: 'دعاية' },
  { id: 'Printer', icon: Printer, name: 'مطبوعات' },
  { id: 'Truck', icon: Truck, name: 'لوجستيات' },
  { id: 'Smartphone', icon: Smartphone, name: 'موبايل' },
  { id: 'Monitor', icon: Monitor, name: 'ديجتال' },
  { id: 'Gift', icon: Gift, name: 'هدايا' },
  { id: 'Star', icon: Star, name: 'مميز' },
  { id: 'Zap', icon: Zap, name: 'سريع' }
];

// Format currency
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: 'EGP',
  }).format(amount);

export default function ShopPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'bot', text: 'مرحبًا بك في البحراوي للدعاية! كيف يمكننا مساعدتك اليوم؟' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<any[]>([]);

  // Load data from localStorage
  useEffect(() => {
    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, []);

  const loadData = () => {
    const storedProducts = localStorage.getItem('admin_products');
    const storedPortfolio = localStorage.getItem('admin_portfolio');
    
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      setProducts([
        { id: '1', name: 'بطاقة شخصية فاخرة', price: 50, category: 'تصميم', description: 'بطاقة شخصية عالية الجودة', image: 'https://picsum.photos/seed/card/300/300' },
        { id: '2', name: 'كتيب تعريفي', price: 300, category: 'طباعة', description: 'كتيب تعريفي للشركات', image: 'https://picsum.photos/seed/book/300/300' },
      ]);
    }

    if (storedPortfolio) {
      setPortfolioItems(JSON.parse(storedPortfolio));
    } else {
      setPortfolioItems([
        { id: '1', title: 'هوية بصرية لشركة XYZ', category: 'تصميم', description: 'تصميم هوية بصرية كاملة', image: 'https://picsum.photos/seed/portfolio1/400/300' },
        { id: '2', title: 'حملة تبليغية جديدة', category: 'تسويق', description: 'حملة تسويقية متكاملة', image: 'https://picsum.photos/seed/portfolio2/400/300' },
      ]);
    }
  };

  // Extract categories from products
  const categories = Array.from(new Set(products.map(p => p.category))).map((category, index) => ({
    id: index + 1,
    name: category,
    description: 'منتجات ' + category,
    icon: 'Layout'
  }));

  const filteredProducts = selectedCategory
    ? products.filter(p => p.category === selectedCategory)
    : products;

  const sendMessage = () => {
    if (!chatInput.trim()) return;

    setChatMessages(prev => [...prev, { role: 'user', text: chatInput }]);
    setChatInput('');

    // Simulate bot response
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        role: 'bot',
        text: 'شكرًا لرسالتك! سوف يتم الرد عليك في أقرب وقت.'
      }]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src="https://i.postimg.cc/rp3k0Sh7/albhrawy1.png"
              alt="البحراوي للدعاية"
              className="w-12 h-12 object-contain"
              style={{ filter: 'brightness(0) invert(1) saturate(0)' }}
            />
            <div>
              <h1 className="text-2xl font-black leading-tight flex flex-row gap-2" dir="ltr">
                <span className="text-white">ELBA</span> <span className="text-[#FFD700]">7RAWY</span>
              </h1>
              <p className="text-gray-400 text-xs font-bold tracking-[0.2em]" dir="ltr">ADVERTISING</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-white font-bold hover:text-[#FFD700] transition-colors">الرئيسية</a>
            <a href="#categories" className="text-gray-400 font-bold hover:text-[#FFD700] transition-colors">الأقسام</a>
            <a href="#products" className="text-gray-400 font-bold hover:text-[#FFD700] transition-colors">المنتجات</a>
            <a href="#portfolio" className="text-gray-400 font-bold hover:text-[#FFD700] transition-colors">معرض الأعمال</a>
            <a href="#contact" className="text-gray-400 font-bold hover:text-[#FFD700] transition-colors">تواصل معنا</a>
          </nav>

          <div className="flex items-center gap-4">
            <a href="tel:+201234567890" className="hidden md:flex items-center gap-2 bg-[#FFD700] text-black px-6 py-3 rounded-xl font-black hover:bg-[#e6c200] transition-all">
              <Phone size={20} />
              اتصل بنا
            </a>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2"
            >
              <Menu className="text-white" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-6 left-6 p-2"
          >
            <X className="text-white" />
          </button>
          <nav className="flex flex-col items-center gap-8">
            <a href="#home" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-black text-white hover:text-[#FFD700] transition-colors">الرئيسية</a>
            <a href="#categories" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-black text-gray-400 hover:text-[#FFD700] transition-colors">الأقسام</a>
            <a href="#products" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-black text-gray-400 hover:text-[#FFD700] transition-colors">المنتجات</a>
            <a href="#portfolio" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-black text-gray-400 hover:text-[#FFD700] transition-colors">معرض الأعمال</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-black text-gray-400 hover:text-[#FFD700] transition-colors">تواصل معنا</a>
          </nav>
        </div>
      )}

      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                رحلتك في عالم <span className="text-[#FFD700]">الدعاية والإعلان</span> تبدأ هنا
              </h2>
              <p className="text-gray-400 text-xl mb-8 leading-relaxed">
                نقدم حلولًا إبداعية في تصميم وطباعة وتسويق لتعزيز هويتك التجارية والوصول إلى جمهورك المستهدف بشكل فعال.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#products" className="bg-[#FFD700] text-black px-8 py-4 rounded-xl font-black text-lg hover:bg-[#e6c200] transition-all flex items-center gap-2">
                  استكشف المنتجات
                  <ShoppingCart size={24} />
                </a>
                <a href="#portfolio" className="border-2 border-white/20 text-white px-8 py-4 rounded-xl font-black text-lg hover:border-[#FFD700] hover:text-[#FFD700] transition-all">
                  شاهد أعمالنا
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-8 -left-8 w-64 h-64 bg-[#FFD700]/20 rounded-full blur-3xl"></div>
              <div className="relative bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-3xl p-8">
                <img
                  src="https://picsum.photos/seed/hero/600/400"
                  alt="البحراوي للدعاية"
                  className="w-full h-auto rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-20 bg-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-4">أقسامنا</h2>
            <p className="text-gray-400 text-xl">اختر القسم الذي يناسب احتياجاتك</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {/* All Products Button */}
            <button
              onClick={() => setSelectedCategory(null)}
              className={`p-8 rounded-2xl border-2 transition-all ${!selectedCategory ? 'border-[#FFD700] bg-[#FFD700]/10' : 'border-white/10 bg-white/5 hover:border-[#FFD700]/50'}`}
            >
              <div className="w-16 h-16 bg-[#FFD700]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-8 h-8 text-[#FFD700]" />
              </div>
              <h3 className="text-lg font-black text-white">الكل</h3>
            </button>

            {categories.map((category) => {
              const IconObj = categoryIcons.find(i => i.id === category.icon);
              const Icon = IconObj?.icon || Layout;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`p-8 rounded-2xl border-2 transition-all ${selectedCategory === category.name ? 'border-[#FFD700] bg-[#FFD700]/10' : 'border-white/10 bg-white/5 hover:border-[#FFD700]/50'}`}
                >
                  <div className="w-16 h-16 bg-[#FFD700]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-[#FFD700]" />
                  </div>
                  <h3 className="text-lg font-black text-white">{category.name}</h3>
                  <p className="text-gray-400 text-sm mt-2">{category.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-4">منتجاتنا</h2>
            <p className="text-gray-400 text-xl">أفضل المنتجات بأعلى جودة</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#FFD700]/50 hover:scale-[1.02] transition-all duration-300">
                <img
                  src={product.imageUrl || product.image || `https://picsum.photos/seed/product${product.id}/300/300`}
                  alt={product.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <span className="text-[#FFD700] text-xs font-bold uppercase tracking-wider">{product.category}</span>
                  <h3 className="text-2xl font-black text-white mt-2 mb-2">{product.name}</h3>
                  {product.description && <p className="text-gray-400 text-sm mb-4">{product.description}</p>}
                  <div className="flex items-center justify-between">
                    <p className="text-3xl font-black text-[#FFD700]">{formatCurrency(product.price)}</p>
                    <button className="bg-[#FFD700] text-black px-6 py-3 rounded-xl font-black hover:bg-[#e6c200] transition-all flex items-center gap-2">
                      <ShoppingCart size={20} />
                      طلب الآن
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-20 bg-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-4">معرض الأعمال</h2>
            <p className="text-gray-400 text-xl">شاهد بعضًا من أعمالنا السابقة</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioItems.map((item) => (
              <div key={item.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#FFD700]/50 hover:scale-[1.02] transition-all duration-300 group">
                <div className="relative overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <div>
                      <span className="text-[#FFD700] text-xs font-bold uppercase tracking-wider">{item.category}</span>
                      <h3 className="text-2xl font-black text-white mt-2">{item.title}</h3>
                      {item.description && <p className="text-gray-300 text-sm mt-2">{item.description}</p>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marketing CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/10 to-transparent"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-black mb-6">
            جاهز لتحويل علامتك التجارية إلى <span className="text-[#FFD700]">قوة تسويقية</span>؟
          </h2>
          <p className="text-gray-400 text-xl mb-10 max-w-2xl mx-auto">
            تواصل معنا اليوم لاستكشاف كيف يمكننا مساعدتك في تحقيق أهدافك التسويقية
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#contact" className="bg-[#FFD700] text-black px-10 py-4 rounded-xl font-black text-lg hover:bg-[#e6c200] transition-all">
              بدأ مشروعك الآن
            </a>
            <a href="tel:+201234567890" className="border-2 border-white/20 text-white px-10 py-4 rounded-xl font-black text-lg hover:border-[#FFD700] hover:text-[#FFD700] transition-all">
              اتصل مباشرة
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-4">تواصل معنا</h2>
            <p className="text-gray-400 text-xl">نحن هنا لمساعدتك</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#FFD700]/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-[#FFD700]" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white mb-2">العنوان</h3>
                  <p className="text-gray-400">القاهرة، مصر</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#FFD700]/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-[#FFD700]" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white mb-2">الهاتف</h3>
                  <a href="tel:+201234567890" className="text-gray-400 hover:text-[#FFD700] transition-colors">+20 123 456 7890</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#FFD700]/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-[#FFD700]" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white mb-2">البريد الإلكتروني</h3>
                  <a href="mailto:info@albahrawy.com" className="text-gray-400 hover:text-[#FFD700] transition-colors">info@albahrawy.com</a>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <a href="#" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#FFD700]/20 transition-all">
                  <Facebook className="w-6 h-6 text-white" />
                </a>
                <a href="#" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#FFD700]/20 transition-all">
                  <Instagram className="w-6 h-6 text-white" />
                </a>
                <a href="#" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#FFD700]/20 transition-all">
                  <Twitter className="w-6 h-6 text-white" />
                </a>
              </div>
            </div>

            <form className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">الاسم</label>
                <input
                  type="text"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-[#FFD700]"
                  placeholder="أدخل اسمك"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">البريد الإلكتروني</label>
                <input
                  type="email"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-[#FFD700]"
                  placeholder="أدخل بريدك الإلكتروني"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">الرسالة</label>
                <textarea
                  rows={5}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-[#FFD700]"
                  placeholder="اكتب رسالتك هنا..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-[#FFD700] text-black py-4 rounded-xl font-black text-lg hover:bg-[#e6c200] transition-all"
              >
                إرسال الرسالة
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <img
            src="https://i.postimg.cc/rp3k0Sh7/albhrawy1.png"
            alt="البحراوي للدعاية"
            className="w-16 h-16 object-contain mx-auto mb-4"
            style={{ filter: 'brightness(0) invert(1) saturate(0)' }}
          />
          <p className="text-gray-400">&copy; 2026 البحراوي للدعاية. جميع الحقوق محفوظة.</p>
        </div>
      </footer>

      {/* Floating Chat Button */}
      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-8 right-8 z-40 w-16 h-16 bg-[#FFD700] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all"
      >
        <Phone className="text-black w-8 h-8" />
      </button>

      {/* Chat Window */}
      {chatOpen && (
        <div className="fixed bottom-28 right-8 z-50 w-96 max-w-[calc(100vw-3rem)] bg-[#121212] border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-[#FFD700] text-black p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                <img
                  src="https://i.postimg.cc/rp3k0Sh7/albhrawy1.png"
                  alt="البحراوي للدعاية"
                  className="w-8 h-8 object-contain"
                  style={{ filter: 'brightness(0) invert(1) saturate(0)' }}
                />
              </div>
              <div>
                <h4 className="font-black">البحراوي للدعاية</h4>
                <p className="text-xs text-black/70 font-bold">متصل الآن</p>
              </div>
            </div>
            <button onClick={() => setChatOpen(false)} className="p-2 hover:bg-black/10 rounded-full">
              <X className="text-black" />
            </button>
          </div>

          <div className="p-4 h-80 overflow-y-auto space-y-4">
            {chatMessages.map((message, idx) => (
              <div
                key={idx}
                className={`flex ${message.role === 'user' ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-[#FFD700] text-black'
                      : 'bg-white/10 text-white'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-white/10 flex gap-3">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="اكتب رسالتك هنا..."
              className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFD700]"
            />
            <button
              onClick={sendMessage}
              className="bg-[#FFD700] text-black p-3 rounded-xl hover:bg-[#e6c200] transition-all"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
