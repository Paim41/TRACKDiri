import type { Metadata, Viewport } from "next";
import { Inter, Nunito_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const nunito = Nunito_Sans({ subsets: ["latin"], variable: "--font-heading" });

export const metadata: Metadata = {
  title: {
    default: "TRACKDiri",
    template: "%s | TRACKDiri"
  },
  description: "A real-time daily health and hydration tracker.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/assets/icons/icon-192.png",
    apple: "/assets/icons/icon-180.png"
  }
};

export const viewport: Viewport = {
  themeColor: "#0A96F0",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${nunito.variable}`}>
      <body className="font-sans">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:text-track-ocean"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
