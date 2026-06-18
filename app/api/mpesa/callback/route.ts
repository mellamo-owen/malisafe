import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateClaimPDF } from '@/lib/pdf'
import { sendSMS } from '@/lib/sms'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const stkCallback = body.Body?.stkCallback
    
    if (!stkCallback) {
      return NextResponse.json({ error: 'Invalid callback' }, { status: 400 })
    }

    const { ResultCode, CheckoutRequestID, ResultDesc } = stkCallback

    if (ResultCode === 0) {
      // Payment successful
      const claim = await prisma.claim.findFirst({
        where: { mpesaCode: CheckoutRequestID },
        include: { item: true },
      })

      if (claim) {
        const pdfUrl = await generateClaimPDF(claim.item, claim)
        
        await prisma.claim.update({
          where: { id: claim.id },
          data: {
            status: 'COMPLETED',
            pdfUrl,
          },
        })

        await prisma.revenue.create({
          data: {
            shopId: claim.item.shopId,
            amount: 100,
            type: 'CLAIM',
          },
        })

        const smsMessage = `MaliSafe: PDF ya madai yako imetayarishwa. Pakua hapa: ${process.env.APP_URL}${pdfUrl}`
        await sendSMS(claim.item.customerPhone, smsMessage)
      }
    } else {
      // Payment failed
      await prisma.claim.updateMany({
        where: { mpesaCode: CheckoutRequestID },
        data: { status: 'FAILED' },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('M-Pesa callback error:', error)
    return NextResponse.json({ error: 'Failed to process callback' }, { status: 500 })
  }
}