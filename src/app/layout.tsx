import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { ReduxProvider } from "@/providers/ReduxProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AuthInitializer } from "@/components/AuthInitializer";
import { CartInitializer } from "@/components/CartInitializer";
import { WishlistInitializer } from "@/components/WishlistInitializer";
import { ChatBot } from "@/components/ChatBot";
import { ToastProvider } from "@/providers/ToastProvider";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://fit.com'),
  title: {
    default: 'FIT - Fashion E-commerce',
    template: '%s | FIT Fashion',
  },
  description: 'Leading online fashion store in Vietnam. Discover our collection of authentic t-shirts, shirts, jeans, dresses. Free nationwide shipping.',
  keywords: ['fashion', 'clothing', 't-shirts', 'shirts', 'jeans', 'dresses', 'FIT Fashion', 'Vietnam fashion'],
  authors: [{ name: 'FIT Fashion' }],
  creator: 'FIT Fashion',
  publisher: 'FIT Fashion',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'https://fit.com',
    siteName: 'FIT Fashion',
    title: 'FIT Fashion - Authentic Fashion',
    description: 'Leading online fashion store in Vietnam',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FIT Fashion',
    description: 'Authentic Fashion, Attractive Deals',
    creator: '@fitfashion',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add these when you have them
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body
        className="antialiased font-sans"
      >
        <ReduxProvider>
          <AuthInitializer>
            <CartInitializer>
              <WishlistInitializer>
                <ToastProvider>
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-1">
                      {children}
                    </main>
                    <Footer />
                    <ChatBot />
                  </div>
                </ToastProvider>
              </WishlistInitializer>
            </CartInitializer>
          </AuthInitializer>
        </ReduxProvider>
      </body>
    </html>
  );
}
