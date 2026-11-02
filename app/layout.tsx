import type { Metadata } from "next";
import { Merriweather, Inter } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";

const merriweather = Merriweather({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-editorial",
});

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-interface",
});

export const metadata: Metadata = {
  title: {
    default: "ScientificRadar — Science Journalism, Explainers & Research Digests",
    template: "%s | ScientificRadar",
  },
  description:
    "Independent scientific publication delivering long-form features, mechanistic explainers, and transparent research digests across physics, biology, chemistry, and earth sciences.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
  openGraph: {
    title: "ScientificRadar — Science Journalism, Explainers & Research Digests",
    description:
      "In-depth long-form science journalism, mechanistic explainers, and research digests across the physical, life, and earth sciences.",
    type: "website",
    siteName: "ScientificRadar",
  },
  twitter: {
    card: "summary_large_image",
    title: "ScientificRadar — Science Journalism, Explainers & Research Digests",
    description:
      "In-depth long-form science journalism, mechanistic explainers, and research digests across the physical, life, and earth sciences.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${merriweather.variable} ${inter.variable}`}
    >
      <body suppressHydrationWarning className="min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
