'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Download, TrendingUp, Package, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { t, getLanguage, Language } from '@/lib/i18n'

interface Stats {
  itemsToday: number
  revenueToday: number
}

interface Item {
  id: string
  malisafeId: string
  itemName: string
  customerName: string
  createdAt: string
  policyNumber: string
  insuranceCompany: string
  shop: {
    name: string
  }
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats>({ itemsToday: 0, revenueToday: 0 })
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [lang, setLang] = useState<Language>('sw')

  useEffect(() => {
    setLang(getLanguage())
    fetchData()
  }, [])

  const translate = (key: string) => t(key, lang)

  const fetchData = async () => {
    try {
      const [statsRes, itemsRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/items'),
      ])
      
      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }
      
      if (itemsRes.ok) {
        const itemsData = await itemsRes.json()
        if (Array.isArray(itemsData)) {
          setItems(itemsData)
        } else {
          setItems([])
        }
      } else {
        setItems([])
      }
    } catch (error) {
      console.error('Fetch error:', error)
      toast.error(translate('networkError'))
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  const exportCSV = async () => {
    try {
      const res = await fetch('/api/export')
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'malisafe_items.csv'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      toast.success(translate('csvDownloaded'))
    } catch (error) {
      toast.error(translate('networkError'))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-green-600">{translate('adminTitle')}</h1>
          <Button onClick={exportCSV} className="bg-green-600 hover:bg-green-700">
            <Download className="mr-2 h-5 w-5" />
            {translate('exportCSV')}
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{translate('itemsToday')}</CardTitle>
              <Package className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.itemsToday || 0}</div>
              <p className="text-xs text-gray-500">{translate('itemsRegisteredToday')}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{translate('revenueToday')}</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">KES {(stats.revenueToday || 0).toLocaleString()}</div>
              <p className="text-xs text-gray-500">{translate('fromRegistrations')}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{translate('allItems')}</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">{translate('loading')}</div>
            ) : items.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>{translate('noItems')}</p>
                <p className="text-sm mt-1">{translate('goToRegister')}</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>MaliSafe ID</TableHead>
                    <TableHead>{translate('itemName')}</TableHead>
                    <TableHead>{translate('customerName')}</TableHead>
                    <TableHead>Sera</TableHead>
                    <TableHead>Bima</TableHead>
                    <TableHead>Tarehe</TableHead>
                    <TableHead>{translate('actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono text-sm">{item.malisafeId}</TableCell>
                      <TableCell>{item.itemName}</TableCell>
                      <TableCell>{item.customerName}</TableCell>
                      <TableCell className="font-mono text-xs">{item.policyNumber || '-'}</TableCell>
                      <TableCell>{item.insuranceCompany || '-'}</TableCell>
                      <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(`/item/${item.malisafeId}`, '_blank')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}