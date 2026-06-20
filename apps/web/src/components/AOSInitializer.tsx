'use client'

import { useEffect } from 'react'

export default function AOSInitializer() {
  useEffect(() => {
    import('aos').then(({ default: AOS }) => {
      import('aos/dist/aos.css')
      AOS.init({
        duration: 1000,
        once: true,
      })
    })
  }, [])

  return null
}
