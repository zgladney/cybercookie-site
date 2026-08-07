import type { Metadata } from "next";
import { ContactPageClient } from "./ContactPageClient";

export const metadata: Metadata = {
  title: "Contact | CyberCookie",
  description:
    "Contact CyberCookie about CyberCookie Academy, Astraea Enterprise, partnerships, support, or general inquiries.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
