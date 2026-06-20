import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const dataFilePath = path.join(process.cwd(), 'apps', 'web', 'src', 'lib', 'site-data.json')

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const dataToSave = JSON.stringify(body, null, 2)
    
    fs.writeFileSync(dataFilePath, dataToSave, 'utf8')
    
    return NextResponse.json({ success: true, message: 'Data saved successfully!' })
  } catch (error) {
    console.error('Error saving data:', error)
    return NextResponse.json({ success: false, error: 'Failed to save data' }, { status: 500 })
  }
}
