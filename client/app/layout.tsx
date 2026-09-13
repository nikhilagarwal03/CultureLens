import type { Metadata } from "next";
import { Bricolage_Grotesque, Space_Grotesk } from "next/font/google";

import "./globals.css";

import { AppProvider } from "@/components/providers/app-provider";
import { Navbar } from "@/components/navbar/navbar";
import { ToastProvider } from "@/components/ui/toast";
import { Footer } from "@/components/ui/footer";

const displayFont = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const bodyFont = Space_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://culturelensai.vercel.app";
const siteName = "CultureLens";
const authorName = "Nikhil Agarwal";
const siteDescription =
  "CultureLens helps you understand cultural references from songs, movies, memes, slang, and global moments through their origin, meaning, cultural impact, and local context.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "CultureLens — Decode Cultural References",
    template: "%s | CultureLens",
  },

  description: siteDescription,
  applicationName: siteName,
  authors: [
    {name: authorName,url: siteUrl,},
  ],

  creator: authorName,
  publisher: authorName,
  category: "Technology",
  alternates: {
    canonical: "/",
  },

  verification: {
    google: "WtSB11jC-xNMWvpJ0Sokz434ykqgozA7pQQ784VzlY0",
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,

      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

    icons: {
    icon: [
      {
        url: "/logo_2.png",
        type: "image/png",
      },
    ],

    shortcut: ["/logo_2.png"],

    apple: [
      {
        url: "/logo_2.png",
        type: "image/png",
      },
    ],
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName,
    title: "CultureLens — Decode Cultural References",
    description:
      "Understand cultural references from songs, movies, memes, slang, and global moments through their origin, meaning, cultural impact, and local context.",

    images: [
      {
        url: "/logo_1200x630.png",
        width: 1200,
        height: 630,
        alt: "CultureLens — Decode Cultural References",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",

    title: "CultureLens — Decode Cultural References",

    description:
      "Understand cultural references through origin, meaning, cultural impact, and local context.",

    images: ["/logo_1200x630.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${displayFont.variable} ${bodyFont.variable} site-frame antialiased`}>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <AppProvider>
          <ToastProvider>
            <Navbar />
            <main id = "main-content" className = "flex min-h-[calc(100vh-72px)] flex-col"
              > {children}
            </main>
            <Footer />
          </ToastProvider>
        </AppProvider>
      </body>
    </html>
  );
}
