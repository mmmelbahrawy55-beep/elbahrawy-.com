import { siteData } from '@/lib/site-data'

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border pt-24 pb-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex flex-col items-center mb-6 gap-4">
            <img
              src="https://i.postimg.cc/rp3k0Sh7/albhrawy1.png"
              alt="البحراوي للدعاية والاعلان"
              className="h-24 md:h-32 w-auto"
              style={{ filter: 'brightness(0) invert(1) saturate(0)' }}
            />
            <h3 className="text-3xl font-black tracking-tight flex flex-row gap-2" dir="ltr">
              <span className="text-white">ELBA</span> <span className="text-primary">7RAWY</span>
            </h3>
          </div>
          <p className="text-muted-foreground max-w-xl mb-8">
            {siteData.companyName} - إبداع يفوق الحدود. تميز يصنع التاريخ
          </p>
          <div className="flex gap-4 mb-8">
            <a href="#" className="w-14 h-14 bg-muted rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition text-2xl">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="w-14 h-14 bg-muted rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition text-2xl">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="w-14 h-14 bg-muted rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition text-2xl">
              <i className="fab fa-tiktok"></i>
            </a>
            <a href={`https://wa.me/2${siteData.phone}`} target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-muted rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition text-2xl">
              <i className="fab fa-whatsapp"></i>
            </a>
          </div>
          <a href={`tel:${siteData.phone}`} className="text-primary text-xl font-bold">
            <i className="fas fa-phone mr-2"></i> {siteData.phone}
          </a>
        </div>
        <div className="border-t border-border pt-8 text-center text-muted-foreground text-sm">
          <p dir="rtl">جميع الحقوق محفوظة. © 2026 {siteData.companyName}</p>
        </div>
      </div>
    </footer>
  )
}