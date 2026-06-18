import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

const DEV_MODE = process.env.DEV_MODE === 'true'

export async function POST(req: NextRequest) {
  try {
    const { phone, code } = await req.json()
    
    if (!phone || !code) {
      return NextResponse.json({ error: 'Phone and code required' }, { status: 400 })
    }

    // Verify OTP
    let isValid = false
    
    if (DEV_MODE && code === '1234') {
      isValid = true
    } else {
      const otp = await prisma.otp.findFirst({
        where: {
          phone,
          code,
          expiresAt: { gt: new Date() },
        },
      })
      
      if (otp) {
        isValid = true
        await prisma.otp.delete({ where: { id: otp.id } })
      }
    }

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 })
    }

    // Upsert shop
    const shop = await prisma.shop.upsert({
      where: { phone },
      update: {},
      create: {
        phone,
        name: `Duka la ${phone.slice(-4)}`,
      },
    })

    return NextResponse.json({ shopId: shop.id })
  } catch (error) {
    console.error('OTP verify error:', error)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}