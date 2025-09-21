import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/providers/ReduxProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AuthInitializer } from "@/components/AuthInitializer";
import { CartInitializer } from "@/components/CartInitializer";
import { ToastProvider } from "@/providers/ToastProvider";

const productSans = Inter({
  variable: "--font-product-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FIT - Fashion E-commerce",
  description: "Your one-stop shop for the latest fashion trends.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${productSans.variable} antialiased font-sans`}
      >
        <ReduxProvider>
          <AuthInitializer>
            <CartInitializer>
              <ToastProvider>
                <div className="min-h-screen flex flex-col">
                  <Header />
                  <main className="flex-1">
                    {children}
                  </main>
                  <Footer />
                </div>
              </ToastProvider>
            </CartInitializer>
          </AuthInitializer>
        </ReduxProvider>
      </body>
    </html>
  );
}
