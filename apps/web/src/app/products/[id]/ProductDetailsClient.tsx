'use client'

import { siteData as defaultSiteData, SiteData } from '../../../lib/site-data'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ProductDetailsClient({ id }: { id: string }) {
  const router = useRouter()
  const [siteData, setSiteData] = useState<SiteData>(defaultSiteData)
  const [product, setProduct] = useState<any>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [quantity, setQuantity] = useState(1)
  const [formData, setFormData] = useState({
    size: '',
    customSize: { width: '', height: '', unit: 'cm' },
    needDesign: false,
    designFile: null as File | null,
    notes: '',
    phone: '',
    name: ''
  })

  useEffect(() => {
    const storedData = localStorage.getItem('albahrawy_site_data')
    if (storedData) {
      setSiteData(JSON.parse(storedData))
    }
  }, [])

  useEffect(() => {
    const prod = siteData.products.find((p: any) => p.id === Number(id))
    setProduct(prod)
  }, [siteData, id])

  const calculateTotalPrice = () => {
    if (!product) return 0
    
    if (product.pricingType === 'meter' && formData.size === 'مخصص' && formData.customSize.width && formData.customSize.height) {
      let width = Number(formData.customSize.width)
      let height = Number(formData.customSize.height)
      
      if (formData.customSize.unit === 'cm') {
        width = width / 100
        height = height / 100
      }
      
      const area = width * height
      return Math.round(product.price * area * quantity)
    }
    
    return Math.round(product.price * quantity)
  }

  const handleWhatsAppSubmit = () => {
    const totalPrice = calculateTotalPrice()
    
    let projectDetails = `طلب منتج: ${product?.name}`
    if (formData.size) projectDetails += ` - ${formData.size}`
    if (formData.customSize.width && formData.customSize.height) 
      projectDetails += ` - ${formData.customSize.width}x${formData.customSize.height} ${formData.customSize.unit}`
    projectDetails += ` - كمية: ${quantity} - تصميم: ${formData.needDesign ? 'منكم' : 'عندي'}`
    if (formData.notes) projectDetails += ` - ملاحظات: ${formData.notes}`
    projectDetails += ` - سعر: ${totalPrice} ج.م`
    
    const newOrder = {
      id: Date.now(),
      name: formData.name,
      phone: formData.phone,
      projectDetails,
      source: 'whatsapp',
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
    
    const updatedData = {
      ...siteData,
      orders: [...siteData.orders, newOrder],
    }
    localStorage.setItem('albahrawy_site_data', JSON.stringify(updatedData))
    setSiteData(updatedData)
    
    let message = `طلب جديد للمنتج: ${product?.name}%0A%0A`
    if (formData.size) {
      message += `المقاس المختار: ${formData.size}%0A`
    }
    if (formData.customSize.width && formData.customSize.height) {
      message += `مقاس مخصص: ${formData.customSize.width} x ${formData.customSize.height} ${formData.customSize.unit}%0A`
    }
    message += `الكمية: ${quantity}%0A`
    message += `تحتاج تصميم: ${formData.needDesign ? 'نعم' : 'لا'}%0A`
    if (formData.notes) {
      message += `ملاحظات: ${formData.notes}%0A`
    }
    message += `الاسم: ${formData.name}%0A`
    message += `رقم الهاتف: ${formData.phone}%0A%0A`
    message += `السعر الإجمالي: ${totalPrice} ج.م%0A`

    const whatsappUrl = `https://wa.me/201120053007?text=${message}`
    window.open(whatsappUrl, '_blank')
  }

  if (!product) return <div className="min-h-screen flex items-center justify-center text-white">جاري التحميل...</div>

  const totalPrice = calculateTotalPrice()

  return (
    <div className="min-h-screen pt-24 pb-16 bg-background">
      <div className="container mx-auto px-6">
        <button onClick={() => router.back()} className="text-muted-foreground hover:text-primary mb-8 flex items-center gap-2">
          <i className="fas fa-arrow-right"></i> العودة للمنتجات
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="relative">
            <img src={product.image} alt={product.name} className="w-full h-[500px] object-cover rounded-[2rem] luxury-card" />
          </div>
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4">{product.name}</h1>
              <p className="text-2xl font-black text-primary mb-6">
                {product.price} ج.م {product.pricingType === 'meter' ? '/متر' : product.pricingType === 'letter' ? '/حرف' : '/القطعة'}
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">{product.description}</p>
              
              <div className="mt-8 space-y-4">
                <label className="text-white font-bold text-lg">الكمية المطلوبة</label>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center text-2xl font-bold hover:bg-primary transition"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-24 text-center bg-muted border border-border rounded-xl py-3 text-2xl font-black text-white"
                    min={1}
                  />
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center text-2xl font-bold hover:bg-primary transition"
                  >
                    +
                  </button>
                </div>
                <div className="bg-primary/10 border border-primary rounded-2xl p-6">
                  <p className="text-muted-foreground text-lg">السعر الإجمالي</p>
                  <p className="text-4xl font-black text-primary">{totalPrice} ج.م</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto bg-card rounded-[2rem] p-8 lg:p-12 luxury-card">
          <h2 className="text-3xl font-black text-white mb-10 text-center">خطوات الطلب</h2>

          <div className="flex justify-between mb-12 relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-muted -translate-y-1/2 z-0"></div>
            {[1, 2, 3, 4].map(step => (
              <div key={step} className="relative z-10 flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-xl transition-all duration-300 ${
                  currentStep === step ? 'bg-primary text-primary-foreground shadow-xl shadow-primary/40 scale-110' :
                  currentStep > step ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'
                }`}>
                  {step}
                </div>
                <span className="mt-3 text-sm font-bold text-muted-foreground hidden md:block">
                  {step === 1 ? 'اختر المقاس' : step === 2 ? 'تصميم' : step === 3 ? 'تفاصيل' : 'إرسال'}
                </span>
              </div>
            ))}
          </div>

          {currentStep === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <h3 className="text-2xl font-black text-white mb-6 text-center">اختر المقاس</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {['100×50 سم', '150×100 سم', '200×100 سم', 'مخصص'].map(size => (
                  <button
                    key={size}
                    onClick={() => {
                      if (size === 'مخصص') {
                        setFormData({...formData, size: 'مخصص'})
                      } else {
                        setFormData({...formData, size, customSize: {width: '', height: '', unit: 'cm'}})
                      }
                    }}
                    className={`p-6 rounded-2xl border-2 text-lg font-bold transition-all ${
                      formData.size === size ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-background hover:border-white/30 text-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              {formData.size === 'مخصص' && (
                <div className="bg-background p-8 rounded-2xl border border-border space-y-6">
                  <h4 className="text-xl font-black text-white mb-6">أدخل المقاس المخصص</h4>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-muted-foreground font-bold">العرض</label>
                      <input
                        type="number"
                        value={formData.customSize.width}
                        onChange={(e) => setFormData({...formData, customSize: {...formData.customSize, width: e.target.value}})}
                        className="w-full bg-black/30 border border-border rounded-xl px-4 py-3 text-white"
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-muted-foreground font-bold">الارتفاع</label>
                      <input
                        type="number"
                        value={formData.customSize.height}
                        onChange={(e) => setFormData({...formData, customSize: {...formData.customSize, height: e.target.value}})}
                        className="w-full bg-black/30 border border-border rounded-xl px-4 py-3 text-white"
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-muted-foreground font-bold">الوحدة</label>
                      <select
                        value={formData.customSize.unit}
                        onChange={(e) => setFormData({...formData, customSize: {...formData.customSize, unit: e.target.value as 'cm' | 'm'}})}
                        className="w-full bg-black/30 border border-border rounded-xl px-4 py-3 text-white"
                      >
                        <option value="cm">سم</option>
                        <option value="m">م</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <button onClick={() => setCurrentStep(2)} className="w-full btn-primary text-xl py-5 mt-8">
                التالي <i className="fas fa-arrow-left mr-3"></i>
              </button>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <h3 className="text-2xl font-black text-white mb-6 text-center">التصميم</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <button
                  onClick={() => setFormData({...formData, needDesign: true})}
                  className={`p-8 rounded-2xl border-2 text-lg font-bold transition-all ${
                    formData.needDesign ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-background hover:border-white/30 text-white'
                  }`}
                >
                  <i className="fas fa-magic text-4xl mb-4 block"></i>
                  أريد منكم التصميم
                </button>
                <button
                  onClick={() => setFormData({...formData, needDesign: false})}
                  className={`p-8 rounded-2xl border-2 text-lg font-bold transition-all ${
                    !formData.needDesign && formData.designFile ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-background hover:border-white/30 text-white'
                  }`}
                >
                  <i className="fas fa-upload text-4xl mb-4 block"></i>
                  لدي تصميم جاهز
                </button>
              </div>

              {!formData.needDesign && (
                <div className="bg-background p-8 rounded-2xl border border-border">
                  <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/30 rounded-2xl cursor-pointer hover:border-primary transition-all">
                    <i className="fas fa-cloud-upload-alt text-5xl text-primary mb-4"></i>
                    <span className="text-lg font-bold text-white">ارفع ملف التصميم</span>
                    <span className="text-sm text-muted-foreground mt-2">PNG, JPG, PDF حتى 50MB</span>
                    <input type="file" className="hidden" onChange={(e) => setFormData({...formData, designFile: e.target.files?.[0] || null})} />
                  </label>
                </div>
              )}

              <div className="flex gap-4">
                <button onClick={() => setCurrentStep(1)} className="flex-1 bg-white/5 text-white py-5 rounded-2xl font-bold hover:bg-white/10 transition">
                  السابق
                </button>
                <button onClick={() => setCurrentStep(3)} className="flex-1 btn-primary text-xl py-5">
                  التالي <i className="fas fa-arrow-left mr-3"></i>
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <h3 className="text-2xl font-black text-white mb-6 text-center">تفاصيل التواصل</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-muted-foreground font-bold">الاسم بالكامل</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-background border border-border rounded-2xl px-6 py-5 text-white"
                    placeholder="أدخل اسمك"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-muted-foreground font-bold">رقم الهاتف (WhatsApp)</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-background border border-border rounded-2xl px-6 py-5 text-white"
                    placeholder="01000000000"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-muted-foreground font-bold">ملاحظات إضافية (اختياري)</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full bg-background border border-border rounded-2xl px-6 py-5 text-white min-h-[150px]"
                    placeholder="أي تفاصيل إضافية..."
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setCurrentStep(2)} className="flex-1 bg-white/5 text-white py-5 rounded-2xl font-bold hover:bg-white/10 transition">
                  السابق
                </button>
                <button onClick={() => setCurrentStep(4)} className="flex-1 btn-primary text-xl py-5">
                  التالي <i className="fas fa-arrow-left mr-3"></i>
                </button>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 text-center">
              <div className="text-8xl text-green-500 mb-6">
                <i className="fas fa-check-circle"></i>
              </div>
              <h3 className="text-3xl font-black text-white mb-6">جاهز للإرسال!</h3>
              <p className="text-muted-foreground text-lg mb-10">اضغط على زر إرسال الطلب للتواصل معنا عبر WhatsApp</p>
              
              <div className="bg-background p-8 rounded-2xl border border-border text-right mb-10">
                <h4 className="text-xl font-black text-primary mb-6">ملخص الطلب</h4>
                <div className="space-y-3 text-white">
                  <p><span className="text-muted-foreground">المنتج:</span> {product.name}</p>
                  {formData.size && <p><span className="text-muted-foreground">المقاس:</span> {formData.size}</p>}
                  {formData.customSize.width && formData.customSize.height && <p><span className="text-muted-foreground">مقاس مخصص:</span> {formData.customSize.width} x {formData.customSize.height} {formData.customSize.unit}</p>}
                  <p><span className="text-muted-foreground">الكمية:</span> {quantity}</p>
                  <p><span className="text-muted-foreground">السعر الإجمالي:</span> {totalPrice} ج.م</p>
                  <p><span className="text-muted-foreground">التصميم:</span> {formData.needDesign ? 'منكم' : 'عندي'}</p>
                  <p><span className="text-muted-foreground">الاسم:</span> {formData.name}</p>
                  <p><span className="text-muted-foreground">الهاتف:</span> {formData.phone}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setCurrentStep(3)} className="flex-1 bg-white/5 text-white py-5 rounded-2xl font-bold hover:bg-white/10 transition">
                  السابق
                </button>
                <button onClick={handleWhatsAppSubmit} className="flex-1 bg-green-500 text-white py-5 rounded-2xl font-black text-xl hover:bg-green-600 transition shadow-xl hover:shadow-green-500/40">
                  <i className="fab fa-whatsapp mr-3"></i> إرسال الطلب على WhatsApp
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
