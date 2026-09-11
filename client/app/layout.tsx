import type { Metadata } from "next";
import { Bricolage_Grotesque, Space_Grotesk } from "next/font/google";
// import "./globals.css";
import { AppProvider } from "@/components/providers/app-provider";
import { Navbar } from "@/components/navbar/navbar";
import { ToastProvider } from "@/components/ui/toast";
import { Footer } from "@/components/ui/footer";

const displayFont = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
});

const bodyFont = Space_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CultureLens",
  description: "Decode cultural references with local context.",
  verification: {
    google: "WtSB11jC-xNMWvpJ0Sokz434ykqgozA7pQQ784VzlY0",
  },
  icons: {
    icon: "/logo_2.png",
    shortcut: "/logo_2.png",
    apple: "/logo_2.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/logo_2.png" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </head>
      <body className={`${displayFont.variable} ${bodyFont.variable} site-frame antialiased`}>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <AppProvider>
          <ToastProvider>
            <Navbar />
            <div id="main-content" className="flex min-h-[calc(100vh-72px)] flex-col">{children}</div>
            <Footer />
          </ToastProvider>
        </AppProvider>
      </body>
    </html>
  );
}
