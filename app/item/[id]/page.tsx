'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { ShieldCheck, AlertTriangle, Building2, Phone, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { t, getLanguage, Language } from '@/lib/i18n'
import { INSURANCE_CONFIG } from '@/lib/insurance'

interface Item {
  id: string
  malisafeId: string
  customerName: string
  customerPhone: string
  itemName: string
  serial: string
  price: number
  photoBase64: string
  createdAt: string
  insuranceCompany: string
  policyNumber: string
  insuranceStatus: string
  insuranceExpiry: string
  shop: {
    name: string
    phone: string
  }
}

export default function ItemPage() {
  const params = useParams()
  const [item, setItem] = useState<Item | null>(null)
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState(false)
  const [lang, setLang] = useState<Language>('sw')

  useEffect(() => {
    setLang(getLanguage())
    fetchItem()
  }, [])

  const translate = (key: string) => t(key, lang)

  const fetchItem = async () => {
    try {
      const res = await fetch(`/api/items/${params.id}`)
      if (res.ok) {
        const data = await res.json()
        setItem(data)
      } else {
        toast.error(translate('itemNotFound'))
      }
    } catch (error) {
      toast.error(translate('networkError'))
    } finally {
      setLoading(false)
    }
  }

  const handleClaim = async () => {
    setClaiming(true)
    try {
      const res = await fetch('/api/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: item?.id }),
      })

      const data = await res.json()
      
      if (res.ok) {
        toast.success(`✅ Ombi la madai limewasilishwa kwa ${data.insuranceCompany}`)
        if (data.pdfUrl) {
          window.open(data.pdfUrl, '_blank')
        }
      } else {
        toast.error(data.error || translate('claimFailed'))
      }
    } catch (error) {
      toast.error(translate('networkError'))
    } finally {
      setClaiming(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">{translate('loading')}</div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center p-8">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold">{translate('itemNotFound')}</h2>
            <p className="mt-2">{translate('itemNotFoundDesc')}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        <Card className="border-2 border-red-500 bg-red-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-red-500" />
              <div>
                <p className="font-semibold text-sm">{item.insuranceCompany || 'Direct Assurance'}</p>
                <p className="text-xs text-gray-600">Insurance Partner</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-mono bg-white px-3 py-1 rounded border">
                {item.policyNumber || 'N/A'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Status: <span className={item.insuranceStatus === 'Active' ? 'text-green-600' : 'text-red-600'}>
                  {item.insuranceStatus || 'Active'}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl text-green-600">{translate('itemDetails')}</CardTitle>
              <ShieldCheck className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-sm text-gray-500 mt-2">MaliSafe ID: {item.malisafeId}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {item.photoBase64 && (
              <div className="rounded-lg overflow-hidden border">
                <img src={item.photoBase64} alt={item.itemName} className="w-full h-auto" />
              </div>
            )}

            <div className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">{translate('itemName')}:</span>
                <span>{item.itemName}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">{translate('serialNumber')}:</span>
                <span>{item.serial || 'Hakuna'}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">{translate('priceKES')}:</span>
                <span>KES {item.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">Sera ya Bima:</span>
                <span className="font-mono text-sm">{item.policyNumber || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">Bima Inaisha:</span>
                <span>{item.insuranceExpiry ? new Date(item.insuranceExpiry).toLocaleDateString() : 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">{translate('customerName')}:</span>
                <span>{item.customerName}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">{translate('customerPhone')}:</span>
                <span>{item.customerPhone}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">{translate('shopName')}:</span>
                <span>{item.shop.name}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">{translate('registrationDate')}:</span>
                <span>{new Date(item.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border">
              <p className="font-semibold text-sm mb-2">📞 Wasiliana na Bima</p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  <span>{INSURANCE_CONFIG.primaryPartner.claimsHotline}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  <span>{INSURANCE_CONFIG.primaryPartner.claimsEmail}</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleClaim}
              disabled={claiming || item.insuranceStatus === 'Claimed'}
              className={`w-full h-12 ${item.insuranceStatus === 'Claimed' ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'}`}
            >
              {item.insuranceStatus === 'Claimed' ? (
                'Madai Yamewasilishwa Tayari'
              ) : (
                claiming ? translate('loading') : '⚠️ Lipa KES 100 - Wasilisha Madai kwa Bima'
              )}
            </Button>

            <div className="text-center text-sm text-gray-500">
              <p>💰 Gharama ya madai: KES 100</p>
              <p>🏢 Madai yatachunguzwa na {item.insuranceCompany || INSURANCE_CONFIG.primaryPartner.name}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}