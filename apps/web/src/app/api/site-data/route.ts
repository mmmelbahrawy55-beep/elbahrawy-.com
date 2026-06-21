import { NextResponse } from 'next/server'
import { getSiteData } from '@/lib/site-data'

export async function GET() {
  try {
    const data = await getSiteData()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching site data:', error)
    return NextResponse.json({ error: 'Failed to fetch site data' }, { status: 500 })
  }
}
