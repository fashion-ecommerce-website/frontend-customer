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
  title: "FIT - Fashion E-commerce",
  description: "Your one-stop shop for the latest fashion trends.",
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
