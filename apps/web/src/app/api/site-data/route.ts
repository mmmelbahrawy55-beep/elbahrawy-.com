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

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    const config = await prisma.siteConfig.upsert({
      where: { id: 'current' },
      update: { data: JSON.stringify(data) },
      create: { id: 'current', data: JSON.stringify(data) }
    })
    
    return NextResponse.json({ success: true, data: JSON.parse(config.data) })
  } catch (error) {
    console.error('Error saving site data:', error)
    return NextResponse.json({ success: false, error: 'Failed to save data' }, { status: 500 })
  }
}
