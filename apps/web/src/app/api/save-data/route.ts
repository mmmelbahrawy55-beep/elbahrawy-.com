import { NextResponse } from 'next/server'
import { prisma } from '@albahrawy/database'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const dataToSave = JSON.stringify(body, null, 2)
    
    // Save to Database (for production/online)
    await prisma.siteConfig.upsert({
      where: { id: 'current' },
      update: { data: dataToSave },
      create: { id: 'current', data: dataToSave },
    })
    
    return NextResponse.json({ success: true, message: 'Data saved successfully!' })
  } catch (error) {
    console.error('Error saving data:', error)
    return NextResponse.json({ success: false, error: 'Failed to save data' }, { status: 500 })
  }
}
