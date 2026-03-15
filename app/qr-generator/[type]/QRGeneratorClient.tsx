'use client'

import QRCard from '@/component/QRCard'
import { emailSchema, phoneSchema, urlSchema, whatsappSchema, wifiSchema } from '@/lib/qrSchema'
import {useParams, useRouter } from 'next/navigation'
import { showToast } from 'nextjs-toast-notify'
import React, { useEffect, useState } from 'react'
import { ZodError } from 'zod'

type QRType = "url" | "phone" | "email" | "wifi" | "whatsapp"
type Props = {
  defaultType: QRType
}


export default function QRGeneratorClient() {
    
  
  const [input, setInput] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  
  const [ssid, setSsid] = useState("")
  const [password, setPassword] = useState("")
  const [security, setSecurity] = useState<"WPA" | "WEP" | "nopass">("WPA")
  
  const router = useRouter()
  const params = useParams()
  
  const qrType = (params.type as QRType) ?? "url"
  const [qrData, setQrData] = useState("")

  
    const generateQR = (e: React.FormEvent) => {
      e.preventDefault()
  
      try {
  
        switch (qrType) {
  
          case "url":
            urlSchema.parse({ input })
            setQrData(input)
            break
  
          case "phone":
            phoneSchema.parse({ input })
            setQrData(`tel:${input}`)
            break
  
          case "email":
            emailSchema.parse({ input, subject, message })
            setQrData(
              `mailto:${input}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`
            )
            break
  
          case "whatsapp":
            whatsappSchema.parse({ input, message })
            setQrData(
              `https://wa.me/${input}?text=${encodeURIComponent(message)}`
            )
            break
  
          case "wifi":
            wifiSchema.parse({ ssid, password, security })
            setQrData(
              `WIFI:T:${security};S:${ssid};P:${password};;`
            )
            break
        }
  
      } catch (err) {
        if(err instanceof ZodError){  
          showToast.error(err.issues[0].message, {
            duration: 2000,
            position: 'top-center',
            transition: 'popUp',
            sound: true,
          })
          // alert(err.issues[0].message)
        }else{
          alert("Something went wrong")
        }
      }
    }
    const changeType = (type: QRType) => {

      router.replace(`/qr-generator/${type}`)
  
      setInput("")
      setSubject("")
      setMessage("")
      setSsid("")
      setPassword("")
    }
  
    return (
      <main>
        <div className='min-h-[500px] py-[5vw] bg-linear-to-b from-[#ffffff] to-[#3265f224] flex flex-col gap-10 justify-center px-[5vw] portrait:lg:px-[6vw] lg:px-[10vw]'>
  
          <div className='flex flex-col gap-2'>
            <h1 className='text-[8.5vw] portrait:lg:text-[6vw] lg:text-[3.5vw] font-black'>Free QR Code Generator</h1>
  
            <h2 className='text-[4vw] portrait:lg:text-[3.25vw] portrait:lg:w-[100%] lg:text-[1.65vw] lg:w-[60%]'>
              Generate custom QR codes for URLs, phone numbers, WiFi access and more.
            </h2>
          </div>
  
          <div className='flex flex-col'>
  
            <div className='flex flex-wrap lg:flex-nowrap gap-2 *:py-[max(8px,1.5vw)] lg:*:py-2 *:px-[5vw] lg:*:px-10 lg:gap-0 mb-2 lg:mb-0 *:rounded-[1vw] *:rounded-t-[1vw] lg:*:rounded-none *:text-[3vw] *:portrait:lg:text-[1.5vw] *:lg:text-[1vw] lg:*:rounded-t-xl'>
  
              <button onClick={() => changeType('url')} className={` shadow-[0_0_2px_0_rgba(0,0,0,0.25)] ${qrType === "url" ? "bg-blue-600 text-white" : "bg-gray-200"} whitespace-nowrap`}>
                <span className=''>URL / Text</span>
              </button>
  
              <button onClick={() => changeType('phone')} className={`  shadow-[0_0_2px_0_rgba(0,0,0,0.25)] ${qrType === "phone" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
                Phone
              </button>
  
              <button onClick={() => changeType('email')} className={`  shadow-[0_0_2px_0_rgba(0,0,0,0.25)] ${qrType === "email" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
                Email
              </button>
  
              <button onClick={() => changeType('whatsapp')} className={`  shadow-[0_0_2px_0_rgba(0,0,0,0.25)] ${qrType === "whatsapp" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
                WhatsApp
              </button>
  
              <button onClick={() => changeType('wifi')} className={`  shadow-[0_0_2px_0_rgba(0,0,0,0.25)] ${qrType === "wifi" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
                WiFi
              </button>
  
            </div>
  
  
            <form
              onSubmit={generateQR}
              className='p-8 w-full gap-4 bg-white flex flex-col shadow rounded-xl lg:rounded-tl-none '
            >
  
              {qrType === "url" && (
                <input
                  type="text"
                  placeholder="Enter URL or text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="border p-3 rounded"
                />
              )}
  
              {qrType === "phone" && (
                <input
                  type="text"
                  placeholder="Enter phone number"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="border p-3 rounded"
                />
              )}
  
              {qrType === "email" && (
                <>
                  <input
                    type="email"
                    placeholder="Email address"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="border p-3 rounded"
                  />
  
                  <input
                    type="text"
                    placeholder="Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="border p-3 rounded"
                  />
  
                  <textarea
                    placeholder="Email message template"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="border p-3 rounded"
                  />
                </>
              )}
  
              {qrType === "whatsapp" && (
                <>
                  <input
                    type="text"
                    placeholder="Phone number (628xxxx)"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="border p-3 rounded rounded-t-none"
                  />
  
                  <textarea
                    placeholder="Template message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="border p-3 rounded"
                  />
                </>
              )}
  
              {qrType === "wifi" && (
                <>
                  <input
                    type="text"
                    placeholder="WiFi Name (SSID)"
                    value={ssid}
                    onChange={(e) => setSsid(e.target.value)}
                    className="border p-3 rounded"
                  />
  
                  <input
                    type="text"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-3 rounded"
                  />
  
                  <select
                    value={security}
                    onChange={(e) => setSecurity(e.target.value)}
                    className="border p-3 rounded"
                  >
                    <option value="WPA">WPA/WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">No Password</option>
                  </select>
                </>
              )}
  
              <button
                type="submit"
                className="bg-blue-600 text-white p-3 rounded"
              >
                Generate QR Code
              </button>
  
            </form>
  
          </div>
        </div>

        <div className='min-h-screen flex bg-white px-[5vw] portrait:lg:px-[6vw] lg:px-[10vw] items-start py-10'>
          <QRCard Link={qrData} />
        </div>
      </main>
    )
}
