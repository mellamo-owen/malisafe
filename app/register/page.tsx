'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Camera, Save, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { t, getLanguage, Language } from '@/lib/i18n'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [lang, setLang] = useState<Language>('sw')
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    itemName: '',
    serial: '',
    price: '',
    photoBase64: '',
  })
  const [photoPreview, setPhotoPreview] = useState('')

  useEffect(() => {
    setLang(getLanguage())
    const shopId = localStorage.getItem('shopId')
    if (!shopId) {
      toast.error('Tafadhali ingia kwanza')
      router.push('/')
    }
  }, [router, lang])

  const translate = (key: string) => t(key, lang)

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(translate('photoTooLarge'))
        return
      }
      
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        setFormData({ ...formData, photoBase64: base64 })
        setPhotoPreview(base64)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.customerName.trim()) {
      toast.error(translate('customerName') + ' ' + translate('requiredFields'))
      return
    }
    if (!formData.customerPhone.trim()) {
      toast.error(translate('customerPhone') + ' ' + translate('requiredFields'))
      return
    }
    if (!formData.itemName.trim()) {
      toast.error(translate('itemName') + ' ' + translate('requiredFields'))
      return
    }
    if (!formData.price || parseInt(formData.price) <= 0) {
      toast.error(translate('enterValidPrice'))
      return
    }
    if (!formData.photoBase64) {
      toast.error(translate('photoRequired'))
      return
    }

    setLoading(true)
    try {
      const shopId = localStorage.getItem('shopId')
      
      const payload = {
        customerName: formData.customerName.trim(),
        customerPhone: formData.customerPhone.trim(),
        itemName: formData.itemName.trim(),
        serial: formData.serial.trim(),
        price: parseInt(formData.price),
        photoBase64: formData.photoBase64,
      }

      const res = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-shop-id': shopId || '',
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        toast.success(`${translate('itemRegistered')} MaliSafe ID: ${data.malisafeId}`)
        toast.success(`📋 Sera ya Bima: ${data.policyNumber}`)
        setFormData({
          customerName: '',
          customerPhone: '',
          itemName: '',
          serial: '',
          price: '',
          photoBase64: '',
        })
        setPhotoPreview('')
        
        setTimeout(() => {
          if (confirm(`${translate('itemRegistered')}\n${translate('viewItem')}`)) {
            window.open(`/item/${data.malisafeId}`, '_blank')
          }
        }, 1000)
        
      } else {
        toast.error(data.error || translate('networkError'))
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast.error(translate('networkError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-green-600">
              {translate('registerItem')}
            </CardTitle>
            <p className="text-sm text-gray-500">{translate('fillDetails')}</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="customerName">{translate('customerName')} *</Label>
                <Input
                  id="customerName"
                  placeholder="John Doe"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="h-12"
                  required
                />
              </div>

              <div>
                <Label htmlFor="customerPhone">{translate('customerPhone')} *</Label>
                <Input
                  id="customerPhone"
                  type="tel"
                  placeholder="0712345678"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  className="h-12"
                  required
                />
              </div>

              <div>
                <Label htmlFor="itemName">{translate('itemName')} *</Label>
                <Input
                  id="itemName"
                  placeholder="Samsung TV, iPhone 14..."
                  value={formData.itemName}
                  onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                  className="h-12"
                  required
                />
              </div>

              <div>
                <Label htmlFor="serial">{translate('serialNumber')}</Label>
                <Input
                  id="serial"
                  placeholder="SN-12345..."
                  value={formData.serial}
                  onChange={(e) => setFormData({ ...formData, serial: e.target.value })}
                  className="h-12"
                />
              </div>

              <div>
                <Label htmlFor="price">{translate('priceKES')} *</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="50000"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="h-12"
                  required
                />
              </div>

              <div>
                <Label htmlFor="photo">{translate('takePhoto')} *</Label>
                <div className="mt-2">
                  <input
                    type="file"
                    id="photo"
                    accept="image/*"
                    capture="environment"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('photo')?.click()}
                    className="w-full h-12"
                  >
                    <Camera className="mr-2 h-5 w-5" />
                    {translate('takePhotoButton')}
                  </Button>
                </div>
                {photoPreview && (
                  <div className="mt-4">
                    <img src={photoPreview} alt="Preview" className="max-h-48 rounded-lg mx-auto" />
                    <p className="text-xs text-center text-green-600 mt-1">
                      {translate('photoUploaded')}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading} className="flex-1 h-12 bg-green-600 hover:bg-green-700">
                  <Save className="mr-2 h-5 w-5" />
                  {loading ? translate('loading') : translate('registerButton')}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFormData({
                      customerName: '',
                      customerPhone: '',
                      itemName: '',
                      serial: '',
                      price: '',
                      photoBase64: '',
                    })
                    setPhotoPreview('')
                  }}
                  className="h-12"
                >
                  {translate('clearButton')}
                </Button>
              </div>

              <Button
                type="button"
                variant="ghost"
                onClick={() => window.location.href = '/admin'}
                className="w-full"
              >
                <FileText className="mr-2 h-5 w-5" />
                {translate('adminPanel')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}