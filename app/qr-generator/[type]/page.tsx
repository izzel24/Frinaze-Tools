import { Metadata } from "next"
import QRGeneratorClient from "./QRGeneratorClient"

type Props = {
  params: Promise<{ type: string }>
}

const metaMap: Record<string, Metadata> = {
  url: {
    title: "URL QR Code Generator",
    description: "Generate QR code for website links or text instantly."
  },
  wifi: {
    title: "WiFi QR Code Generator",
    description: "Create WiFi QR code so guests connect without typing password."
  },
  whatsapp: {
    title: "WhatsApp QR Code Generator",
    description: "Create QR code to start WhatsApp chat instantly."
  },
  email: {
    title: "Email QR Code Generator",
    description: "Generate QR code that opens an email draft."
  },
  phone: {
    title: "Phone QR Code Generator",
    description: "Generate QR code to call a phone number."
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type } = await params
  return metaMap[type] ?? metaMap.url
}

export default async function Page({ params }: Props) {
  const { type } = await params
  return <QRGeneratorClient />
}