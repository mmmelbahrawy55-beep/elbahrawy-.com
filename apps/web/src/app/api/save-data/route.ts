import { NextResponse } from 'next/server'
import { prisma } from '@albahrawy/database'
import fs from 'fs'
import path from 'path'

const dataFilePath = path.join(process.cwd(), 'apps', 'web', 'src', 'lib', 'site-data.json')

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const dataToSave = JSON.stringify(body, null, 2)
    
    // 1. Save to Database (for production/online)
    try {
      await prisma.siteConfig.upsert({
        where: { id: 'current' },
        update: { data: dataToSave },
        create: { id: 'current', data: dataToSave },
      })
    } catch (dbError) {
      console.error('Database save error, falling back to file:', dbError)
    }

    // 2. Also save to file (for local development backup)
    try {
      if (fs.existsSync(path.dirname(dataFilePath))) {
        fs.writeFileSync(dataFilePath, dataToSave, 'utf8')
      }
    } catch (fsError) {
      console.error('File save error:', fsError)
    }
    
    return NextResponse.json({ success: true, message: 'Data saved successfully!' })
  } catch (error) {
    console.error('Error saving data:', error)
    return NextResponse.json({ success: false, error: 'Failed to save data' }, { status: 500 })
  }
}
