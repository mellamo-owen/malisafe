import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await prisma.item.findFirst({
      where: { malisafeId: params.id },
      include: { shop: true },
    })
    
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }
    
    return NextResponse.json(item)
  } catch (error) {
    console.error('Fetch item error:', error)
    return NextResponse.json({ error: 'Failed to fetch item' }, { status: 500 })
  }
}