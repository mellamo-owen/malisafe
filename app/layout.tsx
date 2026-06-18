import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MaliSafe - Kinga Vifaa Vyako',
  description: 'Digital Logbook + Insurance Claims for Electronics',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sw">
      <body className={inter.className}>
        <div className="min-h-screen relative">
          <div className="absolute top-4 right-4 z-50">
            <LanguageSwitcher />
          </div>
          {children}
        </div>
        <Toaster position="top-center" />
      </body>
    </html>
  )
}