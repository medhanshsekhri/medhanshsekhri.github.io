import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import GlobalBackground from "@/components/GlobalBackground";
import FlightProgress from "@/components/FlightProgress";

const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});

const SITE_URL = "https://medhanshsekhri.github.io";
const TITLE = "Medhansh Sekhri | Mechanical & Aerospace Engineering";
const DESCRIPTION =
  "Portfolio of Medhansh Sekhri, ME/Aerospace student at UQ, Brisbane. Building autonomous systems from scratch.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    // Child pages set their own title; this frames it.
    template: "%s | Medhansh Sekhri",
  },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Medhansh Sekhri",
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
    locale: "en_AU",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Medhansh Sekhri - Mechanical & Aerospace Engineering",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og.png"],
  },
};

// Structured data: identifies the site subject to search engines.
const PERSON_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Medhansh Sekhri",
  url: SITE_URL,
  image: `${SITE_URL}/og.png`,
  jobTitle: "Mechanical & Aerospace Engineering Student",
  description: DESCRIPTION,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Brisbane",
    addressRegion: "QLD",
    addressCountry: "AU",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "University of Queensland",
  },
  knowsAbout: [
    "Mechanical Engineering",
    "Aerospace Engineering",
    "Embedded Systems",
    "Arduino",
    "C++",
    "Autonomous Systems",
  ],
  sameAs: ["https://github.com/medhanshsekhri"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cormorant.variable} suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,600,700&display=swap"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_JSON_LD) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('theme');if(s==='dark'||(s===null&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');}else{document.documentElement.classList.remove('dark');}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-screen">
        {/* First thing in the tab order: skips the nav on the homepage and the
            sticky chrome on /projects. Off-screen until focused. */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded focus:border focus:border-border focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:font-body focus:text-text"
        >
          Skip to content
        </a>
        <GlobalBackground />
        <FlightProgress />
        {children}
      </body>
    </html>
  );
}
