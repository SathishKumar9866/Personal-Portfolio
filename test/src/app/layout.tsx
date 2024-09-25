import type { Metadata } from "next";
import {Inter, Calistoga } from 'next/font/google';
import "./globals.css";
import { twMerge } from "tailwind-merge";
// import { Inter, Roboto_Mono } from 'next/font/google';
const inter = Inter({subsets: ['latin'], variable: '--font-sans'});
const calistoga = Calistoga(
  {
    subsets: ['latin'], 
    variable: '--font-sans', 
    weight: ['400'],
  }
)
export const metadata: Metadata = {
  title: "My Portfolio",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={twMerge(inter.variable, calistoga.variable, 
        
        "bg-gray-900 text-white antialiased font-sans ")}>
          {children}</body>
    </html>
  );
}
