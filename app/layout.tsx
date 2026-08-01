import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://cybercookie.org"),
  title: "CyberCookie | Practical Cybersecurity Education & Defense",
  description: "Learn cybersecurity by doing with CyberCookie Academy, and help security teams act on risk with Astraea Enterprise.",
  applicationName: "CyberCookie",
  alternates: { canonical: "/" },
  openGraph: {
    title: "CyberCookie | Cybersecurity Built for People Who Learn by Doing",
    description: "Practical cybersecurity education and focused defensive security tools, built to make security more accessible.",
    url: "https://cybercookie.org",
    siteName: "CyberCookie",
    locale: "en_US",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "CyberCookie — cybersecurity built for people who learn by doing" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CyberCookie | Practical Cybersecurity",
    description: "Practical education and defensive tools for people who learn by doing.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }, { url: "/favicon.ico", sizes: "64x64" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
