import type { Metadata } from "next";
import "../styles/globals.css";
import { Cairo } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FloatingButtons from '@/components/FloatingButtons'
import AOSInitializer from '@/components/AOSInitializer'
import { ToastContainer } from '@/components/Toast'
import { headers } from 'next/headers'
import { Providers } from './Providers'

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '600', '700', '900'],
  variable: '--font-cairo',
})

export const metadata: Metadata = {
  title: "البحراوي للدعاية والاعلان",
  description: "البحراوي للدعاية والاعلان - إبداع يفوق الحدود. تميز يصنع التاريخ",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || ''
  const isDashboard = pathname.startsWith('/dashboard')

  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className="min-h-screen bg-background text-foreground font-sans flex flex-col">
        <Providers>
          {!isDashboard && <Header />}
          <main className="flex-grow">
            {children}
          </main>
          {!isDashboard && <FloatingButtons />}
          <AOSInitializer />
          {!isDashboard && <Footer />}
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}
