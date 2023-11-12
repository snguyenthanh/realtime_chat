import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import classNames from 'classnames';
import './globals.css';
import { Providers } from "@/app/providers";
import Header from '@/components/Header';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Real-time Chat',
  description: 'Written by Son Thanh Nguyen',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full bg-gray-100">
      <body
        className={classNames(inter.className, 'h-full overflow-hidden')}
      >
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  )
}
