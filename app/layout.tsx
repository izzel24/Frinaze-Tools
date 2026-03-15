import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
})


export const metadata: Metadata = {
  title: "Frinaze Tools",
  description: "Free online tools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" >
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6901853127666700"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body
        className={`${jakarta.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
