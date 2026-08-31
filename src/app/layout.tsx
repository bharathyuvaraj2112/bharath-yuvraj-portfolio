import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bharath Yuvraj | AI & Machine Learning Student | Full Stack Developer",
  description:
    "Portfolio of Bharath Yuvraj, an AI and Machine Learning student focused on software development, full-stack applications, artificial intelligence, and building real-world solutions.",
  keywords: [
    "Bharath Yuvraj",
    "AI Student",
    "Machine Learning Student",
    "Full Stack Developer",
    "Software Developer Portfolio",
    "React",
    "Next.js",
    "TypeScript",
    "Python AI",
    "Data Structures Algorithms",
  ],
  authors: [{ name: "Bharath Yuvraj" }],
  creator: "Bharath Yuvraj",
  openGraph: {
    title: "Bharath Yuvraj | AI & Machine Learning Student | Full Stack Developer",
    description:
      "Portfolio of Bharath Yuvraj, an AI and Machine Learning student focused on software development, full-stack applications, artificial intelligence, and building real-world solutions.",
    url: "https://bharathyuvraj.dev",
    siteName: "Bharath Yuvraj Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bharath Yuvraj | AI & Machine Learning Student | Full Stack Developer",
    description:
      "Portfolio of Bharath Yuvraj, an AI and Machine Learning student focused on software development, full-stack applications, artificial intelligence, and building real-world solutions.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth suppressHydrationWarning" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
