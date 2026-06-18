import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const items = await prisma.item.findMany({
      include: { shop: true },
      orderBy: { createdAt: 'desc' },
    })

    const csvRows = [
      ['MaliSafe ID', 'Item Name', 'Customer Name', 'Customer Phone', 'Serial', 'Price', 'Shop', 'Date Registered'],
    ]

    for (const item of items) {
      csvRows.push([
        item.malisafeId,
        item.itemName,
        item.customerName,
        item.customerPhone,
        item.serial,
        item.price.toString(),
        item.shop.name,
        new Date(item.createdAt).toLocaleString(),
      ])
    }

    const csvContent = csvRows.map(row => row.join(',')).join('\n')
    
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=malisafe_export.csv',
      },
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json({ error: 'Failed to export' }, { status: 500 })
  }
}