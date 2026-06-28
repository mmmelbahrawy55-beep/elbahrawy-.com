'use client'

import { useState, useEffect } from 'react'
import { siteData as defaultSiteData } from '../lib/site-data'
import { db } from '../lib/firebaseConfig'
import { doc, onSnapshot } from 'firebase/firestore'

export default function FloatingButtons() {
  const [siteData, setSiteData] = useState(defaultSiteData)

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

  return (
    <>
      {/* Floating WhatsApp Button */}
      <a 
        href={`https://wa.me/2${siteData.phone}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-8 left-8 z-[100] w-16 h-16 md:w-20 md:h-20 bg-[#25D366] text-white rounded-full flex items-center justify-center text-3xl md:text-4xl shadow-2xl hover:scale-110 hover:rotate-12 transition-all duration-300 group"
      >
        <i className="fab fa-whatsapp"></i>
        <span className="absolute right-full mr-4 bg-black/80 backdrop-blur-md text-white px-4 py-2 rounded-xl text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">تحدث معنا الآن</span>
      </a>

      {/* Back to Top Button */}
      <button 
        onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
        className="fixed bottom-8 right-8 w-12 h-12 md:w-14 md:h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg md:text-xl shadow-lg shadow-primary/30 hover:scale-110 transition z-50"
        aria-label="العودة لأعلى"
      >
        <i className="fas fa-arrow-up"></i>
      </button>
    </>
  )
}
