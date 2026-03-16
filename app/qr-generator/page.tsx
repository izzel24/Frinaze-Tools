import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import React from 'react'

export const metadata: Metadata = {
    title: "QR Code Generator | Frinaze Tools",
    description:
        "Create free QR codes for URLs, WiFi, phone numbers, WhatsApp and more.",
}

export default function QrGenerator() {
  return (
      redirect("/qr-generator/url")
  )
}
