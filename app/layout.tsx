import type { Metadata, Viewport } from "next";
import { Cinzel, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

// Font فاخر وعريق مخصص للـ Luxury Perfume Brands
const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#09090b",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  title: {
    default: "AURA LUXE | Haute Parfumerie",
    template: "%s | AURA LUXE",
  },
  description: "A premium online fragrance boutique curating rare, authentic luxury perfumes.",
  keywords: ["AURA LUXE", "Perfumes", "Luxurious Fragrances", "Haute Parfumerie"],
  authors: [{ name: "Omar Gouda" }],
 icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
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
      dir="ltr"
      className={`${cinzel.variable} ${jakarta.variable} h-full dark antialiased selection:bg-amber-500 selection:text-black`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 font-sans">
        {children}
      </body>
    </html>
  );
}