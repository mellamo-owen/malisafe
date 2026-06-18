'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Smartphone, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { t, getLanguage, Language } from '@/lib/i18n'

export default function LoginPage() {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [loading, setLoading] = useState(false)
  const [lang, setLang] = useState<Language>('sw')

  useEffect(() => {
    setLang(getLanguage())
  }, [])

  const translate = (key: string) => t(key, lang)

  const sendOTP = async () => {
    if (!phone) {
      toast.error(translate('enterValidPhone'))
      return
    }
    
    setLoading(true)
    try {
      const res = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })
      
      if (res.ok) {
        toast.success(translate('otpSent'))
        setStep('otp')
      } else {
        toast.error(translate('networkError'))
      }
    } catch (error) {
      toast.error(translate('networkError'))
    } finally {
      setLoading(false)
    }
  }

  const verifyOTP = async () => {
    if (!otp) {
      toast.error(translate('invalidOTP'))
      return
    }
    
    setLoading(true)
    try {
      const res = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code: otp }),
      })
      
      if (res.ok) {
        const data = await res.json()
        localStorage.setItem('shopId', data.shopId)
        toast.success(translate('welcome'))
        router.push('/register')
      } else {
        toast.error(translate('invalidOTP'))
      }
    } catch (error) {
      toast.error(translate('networkError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <ShieldCheck className="h-16 w-16 text-green-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-green-600">
            {translate('appName')}
          </CardTitle>
          <CardDescription className="text-lg">
            {translate('appTagline')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'phone' ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {translate('phoneNumber')}
                </label>
                <Input
                  type="tel"
                  placeholder="0712345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-12 text-lg"
                />
              </div>
              <Button 
                onClick={sendOTP} 
                disabled={loading} 
                className="w-full h-12 bg-green-600 hover:bg-green-700"
              >
                <Smartphone className="mr-2 h-5 w-5" />
                {loading ? translate('loading') : translate('sendOTP')}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {translate('enterOTP')}
                </label>
                <Input
                  type="text"
                  placeholder="1234"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="h-12 text-lg text-center text-2xl tracking-widest"
                  maxLength={4}
                />
              </div>
              <Button 
                onClick={verifyOTP} 
                disabled={loading} 
                className="w-full h-12 bg-green-600 hover:bg-green-700"
              >
                {loading ? translate('loading') : translate('login')}
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setStep('phone')} 
                className="w-full"
              >
                {translate('backToPhone')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}