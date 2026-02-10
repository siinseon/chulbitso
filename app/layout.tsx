import type { Metadata, Viewport } from "next";
import { Nanum_Myeongjo } from "next/font/google";
import "./globals.css";

const nanumMyeongjo = Nanum_Myeongjo({
  weight: ["400", "700", "800"],
  subsets: ["latin"],
  variable: "--font-nanum-myeongjo",
});

export const metadata: Metadata = {
  title: "출빛소 - 책 덕후를 위한 기록 앱",
  description: "책 덕후를 위한 독서 기록 앱",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#11593F" />
      </head>
      <body
        className={`${nanumMyeongjo.variable} font-nanum-myeongjo antialiased min-h-screen bg-[#F2F2F2]`}
      >
        <div className="mx-auto w-full max-w-[480px] min-h-screen min-h-[100dvh] bg-[#F2F2F2]">
          {children}
        </div>
      </body>
    </html>
  );
}
