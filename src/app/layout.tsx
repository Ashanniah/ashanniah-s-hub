import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AppProvider } from '@/context/AppContext'
import { Sidebar } from '@/components/Sidebar'
import { Navbar } from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Hub OS - Personal Productivity, Finance & Health',
  description:
    'All-in-one personal productivity platform with habit tracking, calendar notes, multi-account ledger, and AI vision food calorie scanner.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="light">
      <body className={`${inter.className} bg-slate-50 text-slate-900 antialiased min-h-screen flex selection:bg-indigo-500 selection:text-white`}>
        <AppProvider>
          <div className="flex w-full min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
              <Navbar />
              <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
                {children}
              </main>
            </div>
          </div>
        </AppProvider>
      </body>
    </html>
  )
}
