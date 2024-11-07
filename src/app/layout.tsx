import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import { AvatarProvider } from "@/contexts/AvatarContext";

export const metadata: Metadata = {
  title: "Virtual Avatar Creator",
  description: "基于 Heygen API 开发的虚拟人生成应用",
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className={`${inter.className} antialiased`}>
        <AvatarProvider>
          <nav className="border-b">
            {/* 导航栏将在后续实现 */}
          </nav>
          {children}
        </AvatarProvider>
      </body>
    </html>
  );
}
