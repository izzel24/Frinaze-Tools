import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaInstagram, FaLinkedin } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-[#d1d9dd73] pt-24">
      <div className="w-full rounded-t-[2vw] bg-white px-8 py-10 border-b border-black/25 -mt-20 flex flex-col">
        <div className="relative h-16 w-40">
          <Image
            src="/Logo2.png"
            alt="frinaze logo"
            fill
            className="object-contain"
          />
        </div>


        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mt-8">

          <div className="flex flex-col gap-3 lg:border-r border-black/20 pr-4">
            <h2 className="text-black/80 flex gap-2 items-center  text-lg lg:text-xl font-semibold">
              About Frinaze Tools 
            </h2>

            <div className="text-black/50 text-sm lg:text-base">
              <p>We create simple, fast and accessible tools that make your daily work easier</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:border-r border-black/20 pr-4">
            <h2 className="text-black/80 text-lg lg:text-xl font-semibold">
              Frinaze
            </h2>

            <div className="flex flex-col text-black/50 text-sm lg:text-base gap-1">
              <p>
                Need a custom website? 
                <a className="underline underline-offset-2" href="https://frinaze.site">
                  Visit our main site
                </a>
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:border-r border-black/20 pr-4">
            <Link target="_blank" rel="noopener noreferrer" href={"https://tools.frinaze.site/"} className="text-black/80 flex gap-2 items-center  text-lg lg:text-xl font-semibold">
              Tools <FiExternalLink className="text-lg" />
            </Link>

            <ul className="flex flex-col text-black/50 text-sm lg:text-base gap-1">
              <li><a
                rel="noopener noreferrer"
                target="_blank"
                href="https://tools.frinaze.site/qr-generator/url"
                className="underline underline-offset-2"
              >
                QR Code Generator
              </a>
              </li>

              <li>More Tools (Coming Soon)</li>
            </ul>
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="text-black/80 text-lg lg:text-xl font-semibold">
              Follow Us
            </h2>

            <div className="flex text-black/50 gap-3">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.instagram.com/frinaze_/"
              >
                <FaInstagram className="text-2xl lg:text-3xl" />
              </a>

              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.linkedin.com/in/frinaze/"
              >
                <FaLinkedin className="text-2xl lg:text-3xl" />
              </a>
            </div>
          </div>

        </div>
      </div>
      <div className="flex flex-col lg:flex-row px-8 pb-4 pt-4 gap-2 lg:gap-0 justify-between items-center text-black/50 text-xs lg:text-sm font-semibold">

        <h2>© 2026 FRINAZE. All Rights Reserved.</h2>

        <div className="flex gap-2">
          <a href="/privacy-policy">Privacy Policy</a>
          <span>•</span>
          <a href="/terms-of-service">Terms of Service</a>
        </div>

      </div>
    </footer>
  );
}