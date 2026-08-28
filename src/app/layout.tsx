import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "APEX STUDIO — Podcast & Media Production Studio",
  description:
    "A professional creative space built for podcasts, video content, interviews, live productions and stories that deserve to be heard. Book your studio session in Colombo.",
  keywords: [
    "APEX STUDIO",
    "podcast studio",
    "media production studio",
    "podcast recording Colombo",
    "video podcast",
    "content creation",
    "RØDECaster Pro II",
    "Sony 4K video podcast",
    "live streaming",
  ],
  openGraph: {
    title: "APEX STUDIO — Podcast & Media Production Studio",
    description:
      "A professional creative space built for podcasts, video content, interviews, live productions and stories that deserve to be heard.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "APEX STUDIO — Podcast & Media Production Studio",
    description:
      "A professional creative space built for podcasts, video content, interviews, live productions and stories that deserve to be heard.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "APEX STUDIO",
              description:
                "Professional Podcast & Media Production Studio",
              "@id": "#apex-studio",
              image: "/hero-studio.jpg",
              address: {
                "@type": "PostalAddress",
                streetAddress: "[Studio Address]",
                addressLocality: "[City]",
                addressRegion: "[Region]",
                postalCode: "[Postal Code]",
                addressCountry: "[Country]",
              },
              telephone: "[Phone Number]",
              email: "[Email]",
              openingHours: "[Opening Hours]",
              priceRange: "$$",
              makesOffer: [
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Podcast Recording",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Video Podcast Production",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Content Creation",
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body className="bg-bg-primary text-text-primary antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
