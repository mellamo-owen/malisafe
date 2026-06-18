import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sendSMS } from '@/lib/sms'

const DEV_MODE = process.env.DEV_MODE === 'true'

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json()
    
    if (!phone) {
      return NextResponse.json({ error: 'Phone number required' }, { status: 400 })
    }

    // Generate 4-digit OTP
    let code = Math.floor(1000 + Math.random() * 9000).toString()
    if (DEV_MODE) {
      code = '1234'
    }

    // Save OTP to database
    await prisma.otp.create({
      data: {
        phone,
        code,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      },
    })

    // Send SMS
    const message = `MaliSafe: OTP yako ni ${code}. Halali kwa dakika 10.`
    await sendSMS(phone, message)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('OTP send error:', error)
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 })
  }
}