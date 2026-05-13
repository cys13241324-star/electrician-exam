import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollProgress from "@/components/ScrollProgress";
import AICoach from "@/components/AICoach";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "전기기능사 필기 학습 | addto 온라인",
    template: "%s | addto 온라인",
  },
  description:
    "전기기능사 필기 시험 대비. CBT 모의고사, 무료 기출 해설강의, 플립 암기카드, 오디오북, 이론 시뮬레이터까지 한 곳에서.",
  keywords: [
    "전기기능사",
    "전기기능사 필기",
    "CBT 모의고사",
    "전기기능사 기출",
    "전기기능사 무료강의",
    "addto",
    "애드투",
  ],
  authors: [{ name: "addto" }],
  openGraph: {
    type: "website",
    title: "전기기능사 필기 학습 | addto 온라인",
    description:
      "CBT 모의고사·해설강의·플립카드·오디오북·시뮬레이터까지 한 곳에서. 전기기능사 합격을 위한 모든 학습 도구.",
    siteName: "addto 온라인",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "전기기능사 필기 학습 | addto 온라인",
    description:
      "CBT 모의고사·해설강의·플립카드·오디오북·시뮬레이터까지 한 곳에서.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              name: "addto 온라인 — 전기기능사 학습",
              url: "https://electrician-exam.vercel.app",
              logo: "https://electrician-exam.vercel.app/addto-bi.png",
              sameAs: [],
              hasCredential: {
                "@type": "EducationalOccupationalCredential",
                credentialCategory: "전기기능사 필기",
                educationalLevel: "기능사",
              },
            }),
          }}
        />
        <ScrollProgress />
        {children}
        <ScrollToTop />
        <AICoach />
      </body>
    </html>
  );
}
