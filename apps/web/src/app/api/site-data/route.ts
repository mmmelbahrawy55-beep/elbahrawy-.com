import { NextResponse } from 'next/server'
import { prisma } from '@albahrawy/database'
import { defaultData } from '@/lib/site-data'

export async function GET() {
  try {
    const config = await prisma.siteConfig.findUnique({
      where: { id: 'current' }
    })
    
    if (config) {
      return NextResponse.json(JSON.parse(config.data))
    }
    
    return NextResponse.json(defaultData)
  } catch (error) {
    console.error('Error fetching site data:', error)
    return NextResponse.json(defaultData)
  }
}
