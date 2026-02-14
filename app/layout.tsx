import type { Metadata, Viewport } from "next";
import { Gowun_Batang, Noto_Sans_KR, Noto_Serif_KR, Jua, IBM_Plex_Mono, Black_Han_Sans, Press_Start_2P, Gaegu } from "next/font/google";
import "./globals.css";

const gowunBatang = Gowun_Batang({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-serif",
});

const notoSerif = Noto_Serif_KR({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-serif-myeongjo",
});

const notoSans = Noto_Sans_KR({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
});

const jua = Jua({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-jua",
});

const blackHanSans = Black_Han_Sans({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-paint",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "600"],
  subsets: ["latin"],
  variable: "--font-mono",
});

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
});

const gaegu = Gaegu({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-handwriting",
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
        <meta name="theme-color" content="#4A5E42" />
      </head>
      <body
        className={`${gowunBatang.variable} ${notoSerif.variable} ${notoSans.variable} ${jua.variable} ${ibmPlexMono.variable} ${blackHanSans.variable} ${pressStart2P.variable} ${gaegu.variable} font-myeongjo antialiased min-h-screen bg-vintage-bg text-text-main`}
      >
        <div className="mx-auto w-full max-w-[480px] min-h-screen min-h-[100dvh] bg-vintage-bg">
          {children}
        </div>
      </body>
    </html>
  );
}
