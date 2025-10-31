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
import { ToastProvider } from "@/providers/ToastProvider";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://fit.com'),
  title: {
    default: 'FIT Fashion - Thời trang chính hãng, Ưu đãi hấp dẫn',
    template: '%s | FIT Fashion',
  },
  description: 'Cửa hàng thời trang trực tuyến hàng đầu Việt Nam. Khám phá bộ sưu tập áo thun, áo sơ mi, quần jean, váy đầm chính hãng. Miễn phí vận chuyển toàn quốc.',
  keywords: ['thời trang', 'quần áo', 'áo thun', 'áo sơ mi', 'quần jean', 'váy đầm', 'FIT Fashion', 'thời trang Việt Nam'],
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
    locale: 'vi_VN',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'https://fit.com',
    siteName: 'FIT Fashion',
    title: 'FIT Fashion - Thời trang chính hãng',
    description: 'Cửa hàng thời trang trực tuyến hàng đầu Việt Nam',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FIT Fashion',
    description: 'Thời trang chính hãng, Ưu đãi hấp dẫn',
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
