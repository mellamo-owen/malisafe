import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { stkPush } from '@/lib/daraja'
import { generateClaimPDF } from '@/lib/pdf'
import { sendSMS } from '@/lib/sms'
import { INSURANCE_CONFIG } from '@/lib/insurance'

const DEV_MODE = process.env.DEV_MODE === 'true'

export async function POST(req: NextRequest) {
  try {
    const { itemId } = await req.json()
    
    if (!itemId) {
      return NextResponse.json({ error: 'Item ID required' }, { status: 400 })
    }

    const item = await prisma.item.findUnique({
      where: { id: itemId },
      include: { shop: true },
    })

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    const claimNumber = `CLM-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`
    
    const claim = await prisma.claim.create({
      data: {
        itemId,
        amount: 100,
        status: 'PENDING',
        claimNumber: claimNumber,
        insuranceNotes: `Claim submitted for ${item.itemName} (Policy: ${item.policyNumber})`,
      },
    })

    await prisma.item.update({
      where: { id: itemId },
      data: { insuranceStatus: 'Claimed' }
    })

    if (DEV_MODE) {
      const pdfUrl = await generateClaimPDF(item, claim)
      
      await prisma.claim.update({
        where: { id: claim.id },
        data: {
          status: 'UNDER_REVIEW',
          pdfUrl,
          reviewedAt: new Date(),
          reviewedBy: 'System (DEV Mode)',
        },
      })

      await prisma.revenue.create({
        data: {
          shopId: item.shopId,
          amount: 100,
          type: 'CLAIM',
        },
      })

      const smsMessage = `
MaliSafe: Ombi la madai limepokelewa.
Namba ya Madai: ${claimNumber}
Bima: ${INSURANCE_CONFIG.primaryPartner.name}
Hotline: ${INSURANCE_CONFIG.primaryPartner.claimsHotline}
PDF: ${process.env.APP_URL}${pdfUrl}
`
      await sendSMS(item.customerPhone, smsMessage)

      return NextResponse.json({ 
        status: 'UNDER_REVIEW', 
        claimNumber,
        pdfUrl,
        insuranceCompany: INSURANCE_CONFIG.primaryPartner.name,
        claimsHotline: INSURANCE_CONFIG.primaryPartner.claimsHotline
      })
    } else {
      const result = await stkPush(
        item.customerPhone,
        100,
        `CLAIM-${claim.id}`,
        `MaliSafe Insurance Claim for ${item.itemName}`
      )

      await prisma.claim.update({
        where: { id: claim.id },
        data: {
          mpesaCode: result.CheckoutRequestID,
        },
      })

      return NextResponse.json({ 
        status: 'PENDING', 
        claimNumber,
        message: 'STK Push sent' 
      })
    }
  } catch (error) {
    console.error('Claim creation error:', error)
    return NextResponse.json({ error: 'Failed to process claim' }, { status: 500 })
  }
}