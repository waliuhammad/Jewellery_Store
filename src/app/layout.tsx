import type { Metadata } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import '@/styles/globals.css';
import { siteConfig } from '@/config/site';

const heading = Cormorant_Garamond({ subsets: ['latin'], weight: ['400', '500', '600'], style: ['normal', 'italic'], variable: '--font-heading', display: 'swap' });
const body = Manrope({ subsets: ['latin'], variable: '--font-body', display: 'swap' });

export const metadata: Metadata = {
  title: { default: siteConfig.brandName, template: `%s | ${siteConfig.brandName}` },
  description: siteConfig.tagline,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
