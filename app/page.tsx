import Navbar from "@/component/Navbar"
import Link from "next/link"
import { HiOutlineQrcode } from "react-icons/hi"
import { MdWifi } from "react-icons/md"
import { FaWhatsapp } from "react-icons/fa"
import { FiMail } from "react-icons/fi"
import { LuPhone } from "react-icons/lu"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "[Frinaze Tools] Free Online Tools - QR Code Generator & Utilities",
  description:
    "Free online tools to generate QR codes for URLs, WiFi, WhatsApp, email and phone numbers. Fast and simple.",
}

export default function Home() {
  return (
    <>
      <main className="flex flex-col">

        <section className="min-h-[80vh] flex flex-col justify-center items-center text-center px-[6vw] bg-linear-to-b from-white to-blue-50 gap-6">

          <h1 className="text-[9vw] lg:text-[3.5vw] font-black leading-tight">
            Free Online Tools
          </h1>

          <p className="text-[4vw] lg:text-[1.4vw] text-gray-600 max-w-[700px]">
            Simple and powerful online tools to make your daily tasks easier.
            Generate QR codes, convert data, and more — completely free.
          </p>

          <Link
            href="/qr-generator/url"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-[3.5vw] lg:text-[1vw] transition"
          >
            Try QR Generator
          </Link>

        </section>

        {/* TOOLS */}

        <section className="py-20 px-[6vw] lg:px-[10vw] bg-white flex flex-col gap-12">

          <div className="text-center flex flex-col gap-3">
            <h2 className="text-[7vw] lg:text-[2.5vw] font-bold">
              Tools
            </h2>

            <p className="text-gray-600 text-[3.5vw] lg:text-[1.1vw]">
              Fast, simple and free tools to boost productivity.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-5">

            <Link
              href="/qr-generator/url"
              className="tool-card"
            >
              <HiOutlineQrcode className="text-4xl text-blue-600" />
              <span>URL QR</span>
            </Link>

            <Link
              href="/qr-generator/wifi"
              className="tool-card"
            >
              <MdWifi className="text-4xl text-blue-600" />
              <span>WiFi QR</span>
            </Link>

            <Link
              href="/qr-generator/whatsapp"
              className="tool-card"
            >
              <FaWhatsapp className="text-4xl text-blue-600" />
              <span>WhatsApp QR</span>
            </Link>

            <Link
              href="/qr-generator/email"
              className="tool-card"
            >
              <FiMail className="text-4xl text-blue-600" />
              <span>Email QR</span>
            </Link>

            <Link
              href="/qr-generator/phone"
              className="tool-card"
            >
              <LuPhone className="text-4xl text-blue-600" />
              <span>Phone QR</span>
            </Link>

          </div>

        </section>

        <section className="py-24 bg-blue-600 text-white text-center flex flex-col gap-6 px-[6vw]">

          <h2 className="text-[6vw] lg:text-[2.2vw] font-bold">
            Start Creating QR Codes
          </h2>

          <p className="text-blue-100 text-[3.5vw] lg:text-[1.1vw]">
            Create custom QR codes for websites, WiFi, WhatsApp and more.
          </p>

          <Link
            href="/qr-generator/url"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold w-fit mx-auto hover:scale-105 transition"
          >
            Open QR Generator
          </Link>

        </section>
      </main>
    </>
  )
}