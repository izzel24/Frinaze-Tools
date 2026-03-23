import { Metadata } from "next"
import QRGeneratorClient from "./QRGeneratorClient"
import Navbar from "@/component/Navbar"
import Footer from "@/component/Footer"

type Props = {
  params: { type: string }
}

const metaMap: Record<string, { title: string; description: string }> = {
  url: {
    title: "Free URL QR Code Generator",
    description:
      "Generate QR codes for website links or text instantly. Customize colors and add your logo."
  },
  wifi: {
    title: "WiFi QR Code Generator",
    description:
      "Create WiFi QR code so guests can connect instantly without typing the password."
  },
  whatsapp: {
    title: "WhatsApp QR Code Generator",
    description:
      "Generate WhatsApp QR code to start a chat instantly with a pre-filled message."
  },
  email: {
    title: "Email QR Code Generator",
    description:
      "Create QR codes that open an email draft with subject and message."
  },
  phone: {
    title: "Phone QR Code Generator",
    description:
      "Generate QR codes that allow users to call a phone number instantly."
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {

  const type = params.type ?? "url"
  const meta = metaMap[type] ?? metaMap.url

  const url = `https://tools.frinaze.site/qr-generator/${type}`

  return {
    title: `${meta.title} | Frinaze Tools`,
    description: meta.description,

    alternates: {
      canonical: url
    },

    openGraph: {
      title: `${meta.title} | Frinaze`,
      description: meta.description,
      url,
      siteName: "Frinaze Tools",
      images: [
        {
          url: "https://tools.frinaze.site/og/qr-generator.png",
          width: 1200,
          height: 630,
          alt: "Frinaze QR Code Generator"
        }
      ],
      type: "website"
    },

    twitter: {
      card: "summary_large_image",
      title: `${meta.title} | Frinaze`,
      description: meta.description,
      images: ["https://tools.frinaze.site/og/qr-generator.png"]
    }
  }
}

export default function Page() {
  return (
  <>
    <Navbar />
    <QRGeneratorClient />
    <Footer />
  </>
)
}