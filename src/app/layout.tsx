import type { Metadata } from 'next'
import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Link from 'next/link'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'MarketBox | Community Marketplace',
  description: 'Community marketplace for buying and selling items locally',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
        <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
          <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
              <Link href="/" className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                <span className="w-7 h-7 bg-slate-900 text-white rounded-lg flex items-center justify-center text-sm font-black">
                  M
                </span>
                MarketBox
              </Link>
              <div className="flex items-center gap-3 sm:gap-4">
                <Show when="signed-out">
                  <SignInButton mode="modal">
                    <button className="text-sm font-medium text-slate-700 hover:text-slate-900 px-3 py-1.5 cursor-pointer transition">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium text-sm px-4 py-2 cursor-pointer transition">
                      Sign Up
                    </button>
                  </SignUpButton>
                </Show>
                <Show when="signed-in">
                  <Link href="/dashboard" className="text-slate-600 hover:text-slate-900 text-sm font-medium transition">
                    Dashboard
                  </Link>
                  <Link
                    href="/chats"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 text-sm font-medium transition"
                  >
                    <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>Messages</span>
                  </Link>
                  <UserButton />
                </Show>
              </div>
            </div>
          </header>
          <div className="flex-1">
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  )
}