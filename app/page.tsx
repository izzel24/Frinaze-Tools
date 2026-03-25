import Link from "next/link"
import { HiOutlineQrcode } from "react-icons/hi"
import { Metadata } from "next"
import { PiSwap } from "react-icons/pi"
import { RiLockPasswordFill } from "react-icons/ri"
import Footer from "@/component/Footer"
import Navbar from "@/component/Navbar"
import { FaRegImage } from "react-icons/fa"
import { LiaFileInvoiceSolid } from "react-icons/lia"

export const metadata: Metadata = {
  title: "Frinaze Tools - Free Online Tools",
  description:
    "Free online tools including QR Code Generator and other useful utilities to simplify your workflow.",
}

export default function Home() {
  return (
    <>
    <Navbar />
    <main className="flex flex-col">


      <section className="min-h-[80vh] pt-[120px] flex flex-col justify-center items-center text-center px-[6vw] bg-gradient-to-b from-white to-blue-50 gap-6">

        <h1 className="text-[9vw] lg:text-[3.5vw] font-black leading-tight">
          Free Online Tools
        </h1>

        <p className="text-[4vw] lg:text-[1.4vw] text-gray-600 max-w-[700px]">
          Simple and powerful tools to make your daily tasks easier.
          Generate QR codes and use other utilities completely free.
        </p>

        <div className="flex gap-4 flex-wrap justify-center">

          <Link
            href="/qr-generator"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-[3.5vw] lg:text-[1vw] transition"
          >
            Try QR Generator
          </Link>

          <a
            href="#tools"
            className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-[3.5vw] lg:text-[1vw] hover:bg-blue-50 transition"
          >
            Explore Tools
          </a>

        </div>

        <div className="flex flex-wrap justify-center gap-6 text-gray-500 text-[3.2vw] lg:text-[0.9vw] mt-4">

          <span>✓ Free to use</span>
          <span>✓ No signup required</span>
          <span>✓ Fast & simple</span>

        </div>

      </section>



      <section id="tools" className="py-24 px-[6vw] lg:px-[10vw] bg-white flex flex-col gap-16">

        <div className="text-center flex flex-col gap-3">
          <h2 className="text-[7vw] lg:text-[2.5vw] font-bold">
            Available Tools
          </h2>

          <p className="text-gray-600 text-[3.5vw] lg:text-[1.1vw]">
            Fast, simple and free tools designed to boost productivity.
          </p>
        </div>


  
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

    

          <Link
            href="/qr-generator"
            className="group border border-gray-200 rounded-xl p-8 flex flex-col gap-6 hover:shadow-xl hover:-translate-y-1 transition"
          >

            <div className="w-14 h-14 flex items-center justify-center rounded-lg bg-blue-100">
              <HiOutlineQrcode className="text-3xl text-blue-600" />
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-semibold">
                QR Code Generator
              </h3>

              <p className="text-gray-600 text-sm leading-relaxed">
                Create QR codes for URLs, WiFi, WhatsApp, email,
                phone numbers and more in seconds.
              </p>
            </div>

            <span className="text-blue-600 font-medium group-hover:underline">
              Open Tool →
            </span>

          </Link>

          <Link
            href="/image-optimizer"
            className="group border border-gray-200 rounded-xl p-8 flex flex-col gap-6 hover:shadow-xl hover:-translate-y-1 transition"
          >

            <div className="w-14 h-14 flex items-center justify-center rounded-lg bg-blue-100">
              <FaRegImage className="text-3xl text-blue-600" />
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-semibold">
                Image Optimizer
              </h3>

              <p className="text-gray-600 text-sm leading-relaxed">
                Optimize your image by adjust quality or crop your image
              </p>
            </div>

            <span className="text-blue-600 font-medium group-hover:underline">
              Open Tool →
            </span>

          </Link>

          <div className="border border-gray-200 rounded-xl p-8 flex flex-col gap-6 opacity-60">

            <div className="w-14 h-14 flex items-center justify-center rounded-lg bg-gray-100">
              <LiaFileInvoiceSolid className="text-3xl text-gray-700" /> 
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-semibold">
                Invoice Generator
              </h3>

              <p className="text-gray-600 text-sm">
                {/* Generate strong and secure passwords instantly. */}
              </p>
            </div>

            <span className="text-gray-500 text-sm">
              Coming Soon
            </span>

          </div>

        </div>

      </section>

      <section id="about" className="py-24 bg-blue-700 text-white text-center flex flex-col gap-6 px-[6vw]">

        <h2 className="text-[6vw] lg:text-[2.2vw] font-bold">
          Built to Support Businesses
        </h2>

        <p className="text-blue-100 text-[3.5vw] lg:text-[1.1vw] max-w-[750px] mx-auto leading-relaxed">
          Frinaze Tools is part of our mission to help small businesses,
          entrepreneurs, and creators build a stronger digital presence.
          We create simple and free tools that make everyday tasks easier,
          from generating QR codes to other useful utilities that support
          modern business needs.
        </p>

        <p className="text-blue-100 text-[3.5vw] lg:text-[1.1vw] max-w-[750px] mx-auto leading-relaxed">
          These tools are designed to be fast, accessible, and easy to use,
          so anyone can benefit from them without technical knowledge.
        </p>

        <Link
          target="_blank"
          href="https://frinaze.site/tentang"
          className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold w-fit mx-auto hover:scale-105 transition"
        >
          Learn More About Frinaze
        </Link>

      </section>
    </main>
    <Footer />
    </>
  )
}