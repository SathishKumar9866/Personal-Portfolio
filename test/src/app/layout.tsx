import type { Metadata } from "next";
import {Inter, Calistoga } from 'next/font/google'
import "./globals.css";
import { twMerge } from "tailwind-merge";

const inter = Inter({subsets: ['latin'], variable: '--font-sans'});
const catlistoga = Calistoga(
  {subsets: ['latin'], variable: '--font-sans', weight: ['400'],}
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
      <body className={twMerge(inter.variable, catlistoga.variable, 
        
        "bg-gray-900 text-white antialiased font-sans ")}>
          {children}</body>
    </html>
  );
}
