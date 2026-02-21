import type { Metadata } from "next";
import { Playfair_Display, Source_Serif_4, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
});

const ibmMono = IBM_Plex_Mono({
  variable: "--font-mono-plex",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "The GrowMax Study — Research Dashboard",
  description:
    "A classroom game that teaches students what p-hacking is through direct experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${sourceSerif.variable} ${ibmMono.variable} antialiased`}
        style={{ fontFamily: "var(--font-source), Georgia, serif" }}
      >
        {children}
      </body>
    </html>
  );
}
