import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Stumble — find your people',
  description: 'meet the 3 people on your campus who actually get you.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
