'use client'

// Online database version

import { siteData as defaultSiteData, SiteData } from '@/lib/site-data'
import { useState, useEffect } from 'react'

export default function Home() {
  const [siteData, setSiteData] = useState<SiteData>(defaultSiteData)
  const [activeCategory, setActiveCategory] = useState('all')

  useEffect(() => {
    // 1. Load from localStorage (existing logic)
    const storedData = localStorage.getItem('albahrawy_site_data')
    if (storedData) {
      setSiteData(JSON.parse(storedData))
    }

    // 2. Fetch fresh data from API (for online updates)
    const fetchFreshData = async () => {
      try {
        const response = await fetch('/api/site-data')
        if (response.ok) {
          const freshData = await response.json()
          setSiteData(freshData)
          // Update localStorage as well
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

  const [activeFaq, setActiveFaq] = useState<number | null>(null)
  const [formData, setFormData] = useState({ name: '', phone: '', projectDetails: '' })
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const filteredProducts = activeCategory === 'all' 
    ? siteData.products 
    : siteData.products.filter(p => p.category === activeCategory)

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormStatus('submitting')

    // Create new order
    const newOrder = {
      id: Date.now(),
      name: formData.name,
      phone: formData.phone,
      projectDetails: formData.projectDetails,
      source: 'website',
      status: 'pending',
      createdAt: new Date().toISOString(),
    }

    // Update siteData with new order
    const updatedData = {
      ...siteData,
      orders: [...siteData.orders, newOrder],
    }
    
    // Save to localStorage
    localStorage.setItem('albahrawy_site_data', JSON.stringify(updatedData))
    setSiteData(updatedData)

    // Simulate successful submission
    setTimeout(() => {
      setFormStatus('success')
      setFormData({ name: '', phone: '', projectDetails: '' })
      alert('تم إرسال طلبك بنجاح! سنقوم بالتواصل معك قريباً.')
    }, 1000)
  }

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center pt-32 pb-20 overflow-hidden relative bg-background">
        <div className="container mx-auto px-6 text-center relative z-10">
          <div data-aos="zoom-in" data-aos-duration="1200" className="mb-8 flex flex-col justify-center items-center gap-4">
            <img
              src="https://i.postimg.cc/rp3k0Sh7/albhrawy1.png"
              alt="البحراوي للدعاية والاعلان"
              className="w-40 md:w-64 lg:w-80 h-auto drop-shadow-xl"
              style={{ filter: 'brightness(0) invert(1) saturate(0)' }}
            />
            <div className="flex flex-col items-center">
              <h1 className="text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter leading-tight flex flex-row gap-2 md:gap-4" dir="ltr">
                <span className="text-white">ELBA</span> <span className="relative inline-block text-primary">7RAWY
                  <span className="absolute -bottom-2 md:-bottom-3 left-0 w-full h-1.5 md:h-2 bg-gradient-to-r from-primary via-white/30 to-primary rounded-full shadow-xl shadow-primary/40"></span>
                </span>
              </h1>
              <div className="flex flex-col items-center mt-4" dir="ltr">
                <p className="text-white text-lg md:text-2xl lg:text-3xl font-bold tracking-[0.3em] leading-none">ADVERTISING</p>
              </div>
            </div>
          </div>
          <p className="text-base md:text-lg lg:text-xl mb-12 text-muted-foreground max-w-2xl mx-auto font-normal">
            {siteData.companyName} - إبداع يفوق الحدود. تميز يصنع التاريخ
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-reverse sm:space-x-6">
            <a href="/products" className="btn-primary text-lg px-10 py-4 flex items-center">
              <i className="fas fa-shopping-cart mr-3"></i> تسوق الآن
            </a>
            <a href="#contact" className="bg-muted/70 text-white border border-border px-10 py-4 rounded-2xl font-black text-lg hover:bg-white/10 transition">
              تواصل معنا
            </a>
          </div>

          {/* Stats Grid */}
          <div data-aos="fade-up" data-aos-delay="400" className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-24">
            <div className="bg-muted backdrop-blur-sm border border-border p-6 md:p-8 rounded-2xl hover:border-primary/30 transition group">
              <div className="text-3xl md:text-4xl font-black text-purple-400 mb-2 group-hover:scale-110 transition">25+</div>
              <div className="text-muted-foreground text-xs md:text-sm font-bold">سنة من الخبرة الإبداعية</div>
            </div>
            <div className="bg-muted backdrop-blur-sm border border-border p-6 md:p-8 rounded-2xl hover:border-primary/30 transition group">
              <div className="text-3xl md:text-4xl font-black text-green-400 mb-2 group-hover:scale-110 transition">8000+</div>
              <div className="text-muted-foreground text-xs md:text-sm font-bold">عميل يثق في تميزنا</div>
            </div>
            <div className="bg-muted backdrop-blur-sm border border-blue-500/20 p-6 md:p-8 rounded-2xl hover:border-primary/30 transition group">
              <div className="text-3xl md:text-4xl font-black text-blue-400 mb-2 group-hover:scale-110 transition">2500+</div>
              <div className="text-muted-foreground text-xs md:text-sm font-bold">مشروع إعلاني ناجح</div>
            </div>
            <div className="bg-muted backdrop-blur-sm border border-border p-6 md:p-8 rounded-2xl hover:border-primary/30 transition group">
              <div className="text-3xl md:text-4xl font-black text-yellow-400 mb-2 group-hover:scale-110 transition">50+</div>
              <div className="text-muted-foreground text-xs md:text-sm font-bold">خبير في الدعاية والإعلان</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-card relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div data-aos="fade-up" className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">لماذا تختار البحراوي؟</h2>
            <p className="text-muted-foreground text-lg">نحن لا نقدم مجرد دعاية، نحن نصنع هوية لعلامتك التجارية</p>
            <div className="h-1.5 w-32 bg-primary mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { title: 'سرعة التنفيذ', desc: 'نحن نقدر وقتك، لذا نلتزم بأسرع جداول زمنية لتنفيذ مشاريعك دون المساس بالجودة.', icon: 'fa-rocket' },
              { title: 'أحدث التقنيات', desc: 'نستخدم أحدث ماكينات الليزر والطباعة لضمان دقة متناهية وألوان تنبض بالحياة.', icon: 'fa-microchip' },
              { title: 'دعم فني متواصل', desc: 'فريقنا معك من بداية الفكرة وحتى التسليم، لضمان وصولك للنتيجة التي تحلم بها.', icon: 'fa-headset' }
            ].map((item, i) => (
              <div key={i} data-aos="fade-up" data-aos-delay={`${i * 100}`} className="bg-background border border-border p-10 rounded-[3rem] luxury-card">
                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary text-4xl mb-8">
                  <i className={`fas ${item.icon}`}></i>
                </div>
                <h3 className="text-2xl font-black mb-4">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Process Section */}
      <section className="py-32 bg-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <img src="https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=2071&auto=format&fit=crop" className="w-full h-full object-cover" alt="" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-start gap-20 lg:gap-32">
            <div data-aos="fade-left" className="lg:w-1/2">
              <h2 className="text-4xl md:text-5xl font-black mb-16 leading-tight">
                كيف نعمل على 
                <span className="text-primary block mt-8">تحويل فكرتك إلى واقع؟</span>
              </h2>
              <div className="space-y-20">
                <div className="flex gap-12 group">
                  <div className="flex-shrink-0 w-20 h-20 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-black text-4xl shadow-2xl shadow-primary/30 group-hover:scale-110 transition-all duration-300">1</div>
                  <div className="pt-3">
                    <h4 className="text-2xl font-bold mb-5 text-white">الاستشارة والتخطيط</h4>
                    <p className="text-muted-foreground text-lg leading-relaxed">نستمع لمتطلباتك بدقة ونقدم لك أفضل الحلول الفنية والتقنية التي تناسب هويتك وميزانيتك.</p>
                  </div>
                </div>
                <div className="flex gap-12 group">
                  <div className="flex-shrink-0 w-20 h-20 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-black text-4xl shadow-2xl shadow-primary/30 group-hover:scale-110 transition-all duration-300">2</div>
                  <div className="pt-3">
                    <h4 className="text-2xl font-bold mb-5 text-white">التصميم المبدئي</h4>
                    <p className="text-muted-foreground text-lg leading-relaxed">نبدأ برسم ملامح المشروع وتقديم نماذج أولية (Mockups) للمعاينة والموافقة قبل البدء في التنفيذ.</p>
                  </div>
                </div>
                <div className="flex gap-12 group">
                  <div className="flex-shrink-0 w-20 h-20 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-black text-4xl shadow-2xl shadow-primary/30 group-hover:scale-110 transition-all duration-300">3</div>
                  <div className="pt-3">
                    <h4 className="text-2xl font-bold mb-5 text-white">التنفيذ والتركيب</h4>
                    <p className="text-muted-foreground text-lg leading-relaxed">بأعلى معايير الدقة وباستخدام أحدث الماكينات، نقوم بتصنيع وتركيب العمل في مكانه النهائي لضمان أفضل نتيجة.</p>
                  </div>
                </div>
              </div>
            </div>
            <div data-aos="fade-right" className="lg:w-1/2 relative pt-8">
              <div className="rounded-[3rem] overflow-hidden border-8 border-muted shadow-2xl">
                <img src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="فريق عمل البحراوي" className="w-full aspect-[4/5] object-cover" />
              </div>
              <div className="absolute -bottom-16 -left-16 bg-primary p-14 rounded-[3rem] text-primary-foreground hidden md:block shadow-2xl ring-8 ring-background">
                <div className="text-7xl font-black mb-3">100%</div>
                <div className="font-bold text-2xl">ضمان جودة التنفيذ</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products-section" className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <h2 data-aos="fade-up" className="text-4xl font-black text-center mb-4">منتجاتنا الإبداعية</h2>
          <div data-aos="fade-up" className="h-1 w-32 bg-primary mx-auto mb-12"></div>
          
          {/* Categories List */}
          <div data-aos="fade-up" className="flex flex-wrap justify-center gap-6 mb-16">
            {siteData.categories.map(cat => (
              <div 
                key={cat.id} 
                className="flex flex-col items-center gap-3 group cursor-pointer" 
                onClick={() => setActiveCategory(cat.id)}
              >
                <div 
                  className={`w-20 h-20 rounded-3xl flex items-center justify-center text-3xl transition-all duration-300 shadow-lg ${
                    activeCategory === cat.id 
                      ? 'bg-primary text-primary-foreground shadow-glow scale-110' 
                      : 'bg-card border border-border text-primary hover:bg-primary hover:text-primary-foreground'
                  }`}
                >
                  <i className={`fas ${cat.icon}`}></i>
                </div>
                <span 
                  className={`text-base transition-all duration-300 ${
                    activeCategory === cat.id ? 'text-primary font-black' : 'text-muted-foreground font-bold'
                  }`}
                >
                  {cat.name}
                </span>
              </div>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map(product => (
              <div key={product.id} data-aos="fade-up" className="luxury-card overflow-hidden p-0 cursor-pointer group">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                    loading="lazy" 
                  />
                </div>
                <div className="p-8">
                  <h4 className="text-xl font-black mb-3">{product.name}</h4>
                  <p className="text-muted-foreground text-sm mb-6">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-muted-foreground">ج.م / {product.pricingType === 'piece' ? 'القطعة' : product.pricingType === 'meter' ? 'المتر' : 'الحرف'}</span>
                      <span className="text-3xl font-black text-primary">{product.price}</span>
                    </div>
                    <button onClick={() => window.location.href = `/products/${product.id}`} className="btn-primary">
                      تفاصيل
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Showcase Section */}
      <section className="py-32 bg-card relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div data-aos="fade-up" className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">معرض أعمالنا</h2>
            <p className="text-muted-foreground text-lg">اطلع على نماذج من أعمالنا الاحترافية والدقة الفائقة</p>
            <div className="h-1.5 w-32 bg-primary mx-auto mt-6 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {siteData.portfolio.slice(0, 6).map((item: any, i: number) => (
              <div key={item.id} data-aos="fade-up" data-aos-delay={`${i * 100}`} className="bg-background border border-border rounded-[3rem] overflow-hidden luxury-card p-0 group">
                <div className="relative h-64 overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                    <p className="text-white font-bold">{item.category}</p>
                  </div>
                </div>
                <div className="p-8">
                  <h4 className="text-2xl font-black mb-3 text-white">{item.title}</h4>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div data-aos="fade-up" className="text-center mt-16">
            <a href="/portfolio" className="bg-muted text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-white/10 transition inline-block">
              عرض كل الأعمال
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 bg-card">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div data-aos="fade-up" className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black mb-4">الأسئلة الشائعة</h2>
              <p className="text-muted-foreground">إجابات سريعة على تساؤلاتك حول خدماتنا</p>
              <div className="h-1.5 w-32 bg-primary mx-auto mt-6 rounded-full"></div>
            </div>

            <div className="space-y-4">
              {siteData.faqs.map((faq, i) => (
                <div 
                  key={faq.id} 
                  data-aos="fade-up"
                  data-aos-delay={`${i * 100}`}
                  className={`bg-background border border-border rounded-[2rem] overflow-hidden transition-all duration-300 ${
                    activeFaq === faq.id ? 'border-primary/30 bg-card' : ''
                  }`}
                >
                  <button 
                    onClick={() => setActiveFaq(activeFaq === faq.id ? null : faq.id)} 
                    className="w-full px-8 py-6 flex items-center justify-between text-right"
                  >
                    <span className={`text-xl font-bold ${activeFaq === faq.id ? 'text-primary' : 'text-white'}`}>{faq.question}</span>
                    <i className={`fas fa-chevron-down transition-transform duration-300 ${activeFaq === faq.id ? 'rotate-180 text-primary' : 'text-gray-500'}`}></i>
                  </button>
                  {activeFaq === faq.id && (
                    <div className="px-8 pb-8 text-muted-foreground text-lg leading-relaxed">{faq.answer}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Success Partners Section */}
      <section className="py-24 bg-background overflow-hidden border-y border-border">
        <div data-aos="fade-up" className="container mx-auto px-6 mb-12 text-center">
          <h2 className="text-3xl font-black mb-4">شركاء النجاح</h2>
          <p className="text-muted-foreground">نعتز بثقة كبرى الشركات والمحلات في أعمالنا</p>
        </div>
        <div className="relative flex overflow-hidden">
          <div className="flex items-center gap-12 py-4 animate-scroll whitespace-nowrap">
            {[...siteData.clients, ...siteData.clients].map((client: any, i) => (
              <div key={i} className="flex-shrink-0 w-48 h-24 bg-muted/50 rounded-2xl border border-border flex items-center justify-center p-6 grayscale hover:grayscale-0 transition-all duration-500 hover:border-primary/30">
                <img src={client.logo} alt={client.name} className="max-w-full max-h-full object-contain opacity-50 hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 bg-card">
        <div className="container mx-auto px-6">
          <h2 data-aos="fade-up" className="text-4xl md:text-5xl font-black text-center mb-4">آراء عملائنا</h2>
          <div data-aos="fade-up" className="h-1.5 w-32 bg-primary mx-auto mb-16 rounded-full"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {siteData.testimonials.map((t: any, i: number) => (
              <div key={i} data-aos="fade-up" data-aos-delay={`${i * 100}`} className="bg-background p-10 rounded-[3rem] border border-border luxury-card relative">
                <i className="fas fa-quote-right text-primary/10 text-8xl absolute top-8 left-8"></i>
                <p className="text-muted-foreground text-xl leading-relaxed mb-10 relative z-10 italic">"{t.text}"</p>
                <div className="flex items-center gap-6 relative z-10">
                  <div className="w-20 h-20 rounded-full border-4 border-primary overflow-hidden shadow-xl">
                    <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-black text-2xl text-white">{t.name}</h4>
                    <p className="text-primary font-bold text-lg uppercase tracking-wider">{t.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-32 bg-background relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="bg-card border border-border rounded-[3rem] p-10 lg:p-20 overflow-hidden relative">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div data-aos="fade-left" className="lg:w-1/2 text-center lg:text-right">
                <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">جاهز لبدء <br /><span className="text-primary">مشروعك القادم؟</span></h2>
                <p className="text-xl text-muted-foreground mb-12">فريقنا الإبداعي في الزقازيق جاهز لتنفيذ طلبك بأعلى جودة وأفضل سعر.</p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                  <a href={`https://wa.me/2${siteData.phone}`} target="_blank" rel="noopener noreferrer" className="btn-primary text-xl px-12 py-6 flex items-center justify-center">
                    <i className="fab fa-whatsapp mr-3 text-2xl"></i> تواصل معنا الآن
                  </a>
                  <a href={`tel:${siteData.phone}`} className="bg-white/5 border border-border text-white px-12 py-6 rounded-2xl font-black text-xl hover:bg-white/10 transition-all flex items-center justify-center">
                    <i className="fas fa-phone-alt mr-3"></i> {siteData.phone}
                  </a>
                </div>
              </div>
              <div data-aos="fade-right" className="lg:w-1/2 w-full">
                <form onSubmit={handleFormSubmit} className="bg-background border border-border rounded-[3rem] p-8 shadow-2xl">
                  <h3 className="text-2xl font-black mb-6 text-center text-primary">أرسل طلبك الآن</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-400 mb-3">الاسم بالكامل</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-primary transition-all"
                        placeholder="أدخل اسمك"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-400 mb-3">رقم الهاتف</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-primary transition-all"
                        placeholder="01000000000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-400 mb-3">تفاصيل المشروع</label>
                      <textarea
                        value={formData.projectDetails}
                        onChange={(e) => setFormData({ ...formData, projectDetails: e.target.value })}
                        required
                        rows={4}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-primary transition-all resize-none"
                        placeholder="أخبرنا عن مشروعك..."
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={formStatus === 'submitting'}
                      className="w-full btn-primary text-xl py-5 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {formStatus === 'submitting' ? 'جاري الإرسال...' : 'إرسال الطلب'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="w-full h-[500px] relative overflow-hidden border-y border-border">
        <div className="absolute inset-0 bg-black/20 z-10 pointer-events-none"></div>
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3434.6644214457413!2d31.4883134!3d30.5841703!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14f7f05807955555%3A0x7d6f5f5f5f5f5f5f!2sAl%20Qawmiyah%2C%20Zagazig%2C%20Ash%20Sharqia%20Governorate!5e0!3m2!1sen!2seg!4v1624000000000!5m2!1sen!2seg" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen 
          loading="lazy" 
          className="grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
        ></iframe>
        <div className="absolute bottom-10 right-10 z-20 bg-background/90 backdrop-blur-md border border-border p-8 rounded-[2rem] max-w-xs hidden md:block">
          <h4 className="text-primary font-black text-xl mb-2">موقعنا</h4>
          <p className="text-white text-sm leading-relaxed">{siteData.location}</p>
        </div>
      </section>

      <style jsx global>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
          width: max-content;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}