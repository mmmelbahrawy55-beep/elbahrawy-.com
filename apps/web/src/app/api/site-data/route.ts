import { NextResponse } from 'next/server'
import { prisma } from '@albahrawy/database'
import { defaultData } from '../../../lib/site-data'

export async function GET() {
  try {
    let config = await prisma.siteConfig.findUnique({
      where: { id: 'current' }
    })
    
    // If no config exists, create it with default data automatically!
    if (!config) {
      config = await prisma.siteConfig.create({
        data: {
          id: 'current',
          data: JSON.stringify(defaultData)
        }
      })
      console.log('✅ Created default SiteConfig in database!')
    }
    
    if (config && config.data) {
      try {
        const parsedData = JSON.parse(config.data);
        // Ensure categories and products exist to prevent crashes
        if (!parsedData.categories) parsedData.categories = defaultData.categories;
        if (!parsedData.products) parsedData.products = defaultData.products;
        return NextResponse.json(parsedData)
      } catch (e) {
        console.error('Failed to parse site data JSON:', e);
        return NextResponse.json(defaultData)
      }
    }
    
    return NextResponse.json(defaultData)
  } catch (error) {
    console.error('Error fetching site data from database:', error)
    // If database connection fails, still return default data so site doesn't crash
    return NextResponse.json(defaultData)
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    if (!data || typeof data !== 'object') {
      return NextResponse.json({ success: false, error: 'Invalid data format' }, { status: 400 })
    }

    const config = await prisma.siteConfig.upsert({
      where: { id: 'current' },
      update: { data: JSON.stringify(data) },
      create: { id: 'current', data: JSON.stringify(data) }
    })
    
    return NextResponse.json({ 
      success: true, 
      data: JSON.parse(config.data) 
    })
  } catch (error) {
    console.error('Error saving site data to database:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to save data to database. Please check your connection.' 
    }, { status: 500 })
  }
}
