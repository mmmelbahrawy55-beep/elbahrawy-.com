'use client'

import { siteData } from '@/lib/site-data'
import { useState } from 'react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('شكرا لتواصلك! سنعود إليك قريباً.')
    setFormData({ name: '', email: '', phone: '', message: '' })
  }

  return (
    <div className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black mb-4">تواصل معنا</h1>
          <p className="text-muted-foreground text-lg">نحن هنا لمساعدتك في أي استفسار أو طلب</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="luxury-card p-8">
              <h3 className="text-2xl font-black mb-8 text-primary">معلومات الاتصال</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary text-xl shrink-0">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">العنوان</h4>
                    <a href={siteData.locationLink} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition">
                      {siteData.location}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary text-xl shrink-0">
                    <i className="fas fa-phone"></i>
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">الهاتف</h4>
                    <a href={`tel:${siteData.phone}`} className="text-muted-foreground hover:text-primary transition">{siteData.phone}</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary text-xl shrink-0">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">البريد الإلكتروني</h4>
                    <a href={`mailto:${siteData.email}`} className="text-muted-foreground hover:text-primary transition">{siteData.email}</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-80 rounded-3xl overflow-hidden border border-border">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3434.6644214457413!2d31.4883134!3d30.5841703!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14f7f05807955555%3A0x7d6f5f5f5f5f5f5f!2sAl%20Qawmiyah%2C%20Zagazig%2C%20Ash%20Sharqia%20Governorate!5e0!3m2!1sen!2seg!4v1624000000000!5m2!1sen!2seg" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                className="grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <div className="luxury-card p-8">
            <h3 className="text-2xl font-black mb-8">أرسل لنا رسالة</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-muted-foreground mb-3">الاسم</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="input-field w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-muted-foreground mb-3">البريد الإلكتروني</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="input-field w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-muted-foreground mb-3">رقم الهاتف</label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="input-field w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-muted-foreground mb-3">الرسالة</label>
                <textarea 
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="input-field w-full min-h-[150px]"
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn-primary w-full text-lg py-4">
                إرسال الرسالة
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}