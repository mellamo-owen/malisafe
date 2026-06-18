import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateMalisafeId } from '@/lib/utils'
import { sendSMS } from '@/lib/sms'
import { INSURANCE_CONFIG, generatePolicyNumber } from '@/lib/insurance'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { customerName, customerPhone, itemName, serial, price, photoBase64 } = body
    const shopId = req.headers.get('x-shop-id')
    
    if (!shopId) {
      return NextResponse.json({ error: 'Shop ID required' }, { status: 401 })
    }

    if (!customerName || !customerPhone || !itemName || !price || !photoBase64) {
      return NextResponse.json({ 
        error: 'Tafadhali jaza sehemu zote muhimu' 
      }, { status: 400 })
    }

    const shop = await prisma.shop.findUnique({
      where: { id: shopId }
    })

    if (!shop) {
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 })
    }

    const malisafeId = generateMalisafeId()
    const policyNumber = generatePolicyNumber(INSURANCE_CONFIG.primaryPartner.policyPrefix)
    const expiryDate = new Date()
    expiryDate.setFullYear(expiryDate.getFullYear() + 1)
    
    const item = await prisma.item.create({
      data: {
        malisafeId,
        shopId,
        customerName,
        customerPhone,
        itemName,
        serial: serial || '',
        price: parseInt(price.toString()),
        photoBase64,
        insuranceCompany: INSURANCE_CONFIG.primaryPartner.name,
        policyNumber: policyNumber,
        insuranceStatus: 'Active',
        insuranceExpiry: expiryDate,
      },
      include: { shop: true },
    })

    await prisma.revenue.create({
      data: {
        shopId,
        amount: 50,
        type: 'SAAS',
      },
    })

    const message = `
${item.shop.name} imeweka ${itemName} yako kwa MaliSafe.
ID: ${malisafeId}
Bima: ${INSURANCE_CONFIG.primaryPartner.name}
Sera Namba: ${policyNumber}
Ikiibiwa pata PDF hapa: ${process.env.APP_URL}/item/${malisafeId}
`
    await sendSMS(customerPhone, message)

    return NextResponse.json({ 
      success: true, 
      malisafeId,
      policyNumber,
      insuranceCompany: INSURANCE_CONFIG.primaryPartner.name,
      item: item 
    })
    
  } catch (error) {
    console.error('Item creation error:', error)
    return NextResponse.json({ 
      error: 'Hitilafu katika kusajili bidhaa' 
    }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const items = await prisma.item.findMany({
      include: { 
        shop: true 
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(items || [])
  } catch (error) {
    console.error('Fetch items error:', error)
    return NextResponse.json([])
  }
}