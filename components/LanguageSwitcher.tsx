// components/LanguageSwitcher.tsx

'use client'

import { useState, useEffect } from 'react'
import { Language, getLanguage, setLanguage } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Globe } from 'lucide-react'

interface LanguageSwitcherProps {
  className?: string
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const [lang, setLang] = useState<Language>('sw')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setLang(getLanguage())
  }, [])

  const toggleLanguage = (newLang: Language) => {
    setLang(newLang)
    setLanguage(newLang)
    setIsOpen(false)
    window.location.reload()
  }

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 h-10 bg-white"
      >
        <Globe className="h-4 w-4" />
        <span>{lang === 'sw' ? 'SW' : 'EN'}</span>
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-50">
          <div className="py-1">
            <button
              onClick={() => toggleLanguage('sw')}
              className={`block px-4 py-2 text-sm w-full text-left hover:bg-green-50 ${
                lang === 'sw' ? 'bg-green-100 text-green-700' : ''
              }`}
            >
              🇰🇪 Kiswahili
            </button>
            <button
              onClick={() => toggleLanguage('en')}
              className={`block px-4 py-2 text-sm w-full text-left hover:bg-green-50 ${
                lang === 'en' ? 'bg-green-100 text-green-700' : ''
              }`}
            >
              🇬🇧 English
            </button>
          </div>
        </div>
      )}
    </div>
  )
}