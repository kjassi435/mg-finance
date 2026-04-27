import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MG Financial Services - Loan Portal | Dehradun",
  description:
    "MG Financial Services — Dehradun, Uttarakhand का अपना विश्वसनीय फाइनेंस पार्टनर। Mudra Loan, Business Loan, Car Loan, Home Loan, Gold Loan। Low CIBIL Score? Bad Credit? Don't Worry — Everyone Gets a Loan!",
  keywords: [
    "MG Finance",
    "Loan Portal",
    "Dehradun",
    "Uttarakhand",
    "Mudra Loan",
    "Business Loan",
    "Home Loan",
    "Gold Loan",
    "EMI Calculator",
    "Loan Application",
    "CIBIL Score",
  ],
  authors: [{ name: "MG Financial Services" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "MG Financial Services - Loan Portal | Dehradun",
    description:
      "सिबिल स्कोर कम हो या खराब, चिंता छोड़ें... सबको मिलेगा लोन! Trusted loan services in Dehradun, Uttarakhand.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
