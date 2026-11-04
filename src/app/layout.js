import { Hind_Siliguri, Inter, Playfair_Display } from "next/font/google";
import AppToaster from "@/components/layout/AppToaster";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import StoreProvider from "@/store/StoreProvider";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const hindSiliguri = Hind_Siliguri({
  variable: "--font-hind",
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: "Shari Shop",
  description: "Traditional clothing for babies and mothers",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${hindSiliguri.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-bg font-sans text-text">
        <StoreProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <AppToaster />
        </StoreProvider>
      </body>
    </html>
  );
}
