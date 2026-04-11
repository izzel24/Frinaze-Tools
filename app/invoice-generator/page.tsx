'use client'

import jsPDF from 'jspdf'
import '@/fonts/PlusJakartaSans-Regular-normal'
import '@/fonts/PlusJakartaSans-Bold-bold'
import '@/fonts/PlusJakartaSans-SemiBold-normal'

import React, { useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { GoPlus } from 'react-icons/go'
import autoTable from 'jspdf-autotable'
import { IoMdCloseCircle } from 'react-icons/io'
import Navbar from '@/component/Navbar'
import Footer from '@/component/Footer'
import { MdKeyboardArrowDown, MdOutlineRemoveRedEye } from 'react-icons/md'
import Image from 'next/image'
import { RiDownloadLine } from 'react-icons/ri'
import { CgToday } from 'react-icons/cg'

type EditableField = "name" | "qty" | "price"

type Invoice = {
    title: string
    fromLabel: string
    billToLabel: string
    paymentDetailsLabel: string
    dateLabel: string
    paymentTermsLabel: string
    dueDateLabel: string
    poNumberLabel: string
    balanceDueLabel: string
    amountPaidLabel: string
    notesLabel: string
    notes: string
    from: string
    billTo: string
    paymentDetails: string
    invoiceNumber: string
    date: string
    paymentTerms: string
    dueDate: string
    poNumber: string
    tableItem: string
    tableQty: string
    tablePrice: string
    tableTotal: string
    amountPaid: number
}

type FieldConfig = {
    labelField: keyof Invoice
    valueField: keyof Invoice
    type: React.HTMLInputTypeAttribute
    placeholder: string
}

export default function InvoiceGenerator() {

    const [pdfUrl, setPdfUrl] = useState<URL | null>(null);
    const [logo, setLogo] = useState<string | null>(null);
    const [currency, setCurrency] = useState("USD")

    const [showTax, setShowTax] = useState(false)
    const [showDiscount, setShowDiscount] = useState(false)
    const [showShipping, setShowShipping] = useState(false)
    const [showAmountPaid, setShowAmountPaid] = useState(false)

    const today = new Date().toISOString().split("T")[0]

    const [invoice, setInvoice] = useState<Invoice>({
        title: "INVOICE",
        fromLabel: "From",
        billToLabel: "Bill to",
        paymentDetailsLabel: "Payment details",
        dateLabel: "Date",
        paymentTermsLabel: "Payment Terms",
        dueDateLabel: "Due Date",
        poNumberLabel: "PO Number",
        balanceDueLabel: "Balance Due",
        amountPaidLabel: "Amount Paid",
        notesLabel: "Notes",
        notes: "",
        from: "",
        billTo: "",
        paymentDetails: "",
        invoiceNumber: "",
        date: today,
        paymentTerms: "",
        dueDate: today,
        poNumber: "",
        tableItem: "Item",
        tableQty: "Qty",
        tablePrice: "Price",
        tableTotal: "Total",
        amountPaid: 0
    })

    const [items, setItems] = useState([
        { name: "", qty: "1", price: "", total: 0 }
    ])

    const [extra, setExtra] = useState({
        tax: "",
        discount: "",
        shipping: ""
    })

    const addItem = () => {
        setItems(prev => [...prev, { name: "", qty: "1", price: "", total: 0 }])
    }

    const updateItem = (index: number, field: EditableField , value: string ) => {
        setItems(prev => {
            const newItems = [...prev]
            const item = { ...newItems[index] }
            item[field] = value
            const qty = Number(item.qty) || 0
            const price = Number(item.price) || 0
            item.total = qty * price
            newItems[index] = item
            return newItems
        })
    }

    const removeItem = (index: number) => {
        setItems(prev => {
            const newItems = [...prev]
            newItems.splice(index, 1)
            return newItems
        })
    }

    const handleExtraChange = (field: string, value: string) => {
        setExtra(prev => ({ ...prev, [field]: value }))
    }

    const closeTax = () => {
        setShowTax(false)
        setExtra(prev => ({ ...prev, tax: "" }))
    }

    const closeDiscount = () => {
        setShowDiscount(false)
        setExtra(prev => ({ ...prev, discount: "" }))
    }

    const closeShipping = () => {
        setShowShipping(false)
        setExtra(prev => ({ ...prev, shipping: "" }))
    }

    const closeAmountPaid = () => {
        setShowAmountPaid(false)
        handleChange("amountPaid", "0")
    }

    const formatDate = (dateString: string) => {
        if (!dateString) return ""
        const date = new Date(dateString)
        const day = String(date.getDate()).padStart(2, "0")
        const year = date.getFullYear()
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        const month = months[date.getMonth()]
        return `${day} ${month} ${year}`
    }

    const generatePageContent = (doc: jsPDF) => {
        const pageWidth = doc.internal.pageSize.getWidth()
        const pageHeight = doc.internal.pageSize.getHeight()

        const formatMoney = (value: number) => {
            if (currency === "IDR") {
                return "Rp " + new Intl.NumberFormat("id-ID", { minimumFractionDigits: 0 }).format(value)
            }
            if (currency === "USD") {
                return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value)
            }
            if (currency === "EUR") {
                return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(value)
            }
            return value.toString()
        }

        const subtotal = items.reduce((s, i) => s + Number(i.qty) * Number(i.price), 0)
        const tax = Number(extra.tax) || 0
        const discount = Number(extra.discount) || 0
        const shipping = Number(extra.shipping) || 0
        const taxAmount = subtotal * (tax / 100)
        const discountAmount = subtotal * (discount / 100)
        const balance = subtotal + taxAmount + shipping - discountAmount
        const amountPaid = Number(invoice.amountPaid) || 0
        const balanceDue = balance - amountPaid

        if (logo) doc.addImage(logo, "PNG", 10, 10, 35, 35)

        doc.setFontSize(16)
        doc.setFont('PlusJakartaSans-Bold', 'bold')
        doc.text(invoice.from, 15, 55)

        doc.setFontSize(36)
        doc.setTextColor('#787877')
        doc.setFont('PlusJakartaSans-Regular', 'normal')
        doc.text(invoice.title, pageWidth - 20, 25, { align: "right" })

        doc.setFontSize(14)
        doc.text(`# ${invoice.invoiceNumber === "" ? "1" : invoice.invoiceNumber}`, pageWidth - 20, 32, { align: "right" })

        const rightFields = [
            [invoice.dateLabel, formatDate(invoice.date || new Date().toISOString().split('T')[0]), 43],
            [invoice.paymentTermsLabel, invoice.paymentTerms || "-", 48],
            [invoice.dueDateLabel, formatDate(invoice.dueDate || new Date().toISOString().split('T')[0]), 53],
            [invoice.poNumberLabel, invoice.poNumber || "-", 58],
        ]

        doc.setFontSize(10)
        doc.setFont('PlusJakartaSans-Regular', 'normal')

        const maxLabelWidth = Math.max(
            ...rightFields.map(([label]) => doc.getTextWidth(label as string))
        )

        const padding = 35
        const valueMaxWidth = 60 
        let y = 43

        console.log(maxLabelWidth)

        rightFields.forEach(([label, value]) => {
            const xLabel = pageWidth - 20 - maxLabelWidth - padding
            console.log(xLabel)
            doc.setFont('PlusJakartaSans-Regular', 'normal')
            doc.text(label as string, xLabel, y as number, {align: "right"})

            doc.setFont('PlusJakartaSans-SemiBold', 'normal')

            const splitValue = doc.splitTextToSize(value as string, valueMaxWidth)

            doc.text(splitValue, pageWidth - 20, y as number, { align: "right" })
            y += splitValue.length * 4
        })

        doc.setFillColor(240, 240, 240)
        doc.rect(100, 62, pageWidth - 20 - 90, 8, 'F')

        doc.setFont('PlusJakartaSans-Bold', 'bold')
        doc.setTextColor('#222222')
        doc.text("Balance Due", pageWidth - 80, 67, { align: "right" })
        doc.text(formatMoney(balanceDue), pageWidth - 20, 67, { align: "right" })

        doc.setFont('PlusJakartaSans-Regular', 'normal')
        doc.text(invoice.billToLabel, 15, 62)

        doc.setFont('PlusJakartaSans-Bold', 'bold')
        const splitBillTo = doc.splitTextToSize(invoice.billTo, 40)
        doc.text(splitBillTo, 15, 66)

        doc.setFont('PlusJakartaSans-Regular', 'normal')
        doc.text(invoice.paymentDetailsLabel, 60, 62)

        doc.setFont('PlusJakartaSans-Bold', 'bold')
        const splitPaymentDetails = doc.splitTextToSize(invoice.paymentDetails, 38)
        doc.text(splitPaymentDetails, 60, 66)

        const startTableY = 75 + (splitPaymentDetails.length >= splitBillTo.length ? splitPaymentDetails.length * 3 : splitBillTo.length * 3)

        autoTable(doc, {
            startY: startTableY,
            theme: "plain",
            headStyles: { fillColor: [240, 240, 240], textColor: 20, fontStyle: "bold" },
            head: [[invoice.tableItem, invoice.tableQty, invoice.tablePrice, invoice.tableTotal]],
            body: items.map(i => [
                i.name || "-",
                i.qty,
                formatMoney(Number(i.price)),
                formatMoney(Number(i.qty) * Number(i.price))
            ])
        })


        const lastY = (doc as any).lastAutoTable.finalY

        let notesY = lastY + 20

        if (invoice.notes) {

            doc.setFont('PlusJakartaSans-SemiBold', 'normal')
            doc.text(invoice.notesLabel, 15, notesY)

            notesY += 5

            doc.setFont('PlusJakartaSans-Regular', 'normal')

            const splitNotes = doc.splitTextToSize(invoice.notes, pageWidth - 20)

            doc.text(splitNotes, 15, notesY)

            notesY += splitNotes.length * 4
        }

        let summaryY = Math.max(notesY + 10, lastY + 10)

        if (summaryY > pageHeight - 40) {
            doc.addPage()
            summaryY = 20
        }

        const labelX = pageWidth - 120
        const valueX = pageWidth - 20

        doc.setLineDashPattern([2, 2], 0)
        doc.line(10, summaryY, pageWidth - 10, summaryY)


        summaryY += 10
        doc.setFont('PlusJakartaSans-Regular', 'normal')

        const summaryRows: any[] = [["Subtotal", formatMoney(subtotal)]]
        if (tax > 0) summaryRows.push([`Tax (${extra.tax}%)`, formatMoney(taxAmount)])
        if (discount > 0) summaryRows.push([`Discount (${extra.discount}%)`, `-${formatMoney(discountAmount)}`])
        if (shipping > 0) summaryRows.push(["Shipping", formatMoney(shipping)])
        if (amountPaid > 0) summaryRows.push(["Amount Paid", `-${formatMoney(amountPaid)}`])
        summaryRows.forEach(([label, val]) => {
            doc.text(label, labelX, summaryY)
            doc.text(val, valueX, summaryY, { align: "right" })
            summaryY += 6
        })

        summaryY += 6

        // doc.text(invoice.amountPaidLabel, labelX, summaryY)
        // doc.text(`-${formatMoney(amountPaid)}`, valueX, summaryY, { align: "right" })
        summaryY += 6

        doc.setFont('PlusJakartaSans-Bold', 'bold')
        doc.text("Total", labelX, summaryY)
        doc.text(formatMoney(balance), valueX, summaryY, { align: "right" })

        summaryY += 6

        doc.text(invoice.balanceDueLabel, labelX, summaryY)
        doc.text(formatMoney(balanceDue), valueX, summaryY, { align: "right" })

        
    }

    const handleChange = (field: string, value: string) => {
        setInvoice(prev => ({ ...prev, [field]: value }))
    }

    const downloadInvoice = () => {
        const doc = new jsPDF()
        generatePageContent(doc)
        doc.save(`invoice-${invoice.invoiceNumber || "1"}.pdf`)
    }

    const previewInvoice = () => {
        const doc = new jsPDF()

        generatePageContent(doc)

        setPdfUrl(doc.output("bloburl"))
    }

    const fields: FieldConfig[] = [
        { labelField: "dateLabel", valueField: "date", type: "date", placeholder: "Date" },
        { labelField: "paymentTermsLabel", valueField: "paymentTerms", type: "text", placeholder: "Ex: EOM (End of Month)" },
        { labelField: "dueDateLabel", valueField: "dueDate", type: "date", placeholder: "Due Date" },
        { labelField: "poNumberLabel", valueField: "poNumber", type: "text", placeholder: "Ex: PO-001" },
    ]

    return (
        <>
            <Navbar />
            <section className="pt-[130px] pb-24 px-6 lg:px-20 bg-gradient-to-b from-white to-blue-100">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    <div className="flex flex-col gap-6">

                        <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                            Create Professional <span className="text-blue-600">Invoices</span>
                            <br />
                            in Seconds
                        </h1>

                        <p className="text-xl text-gray-600 max-w-xl">
                            Generate clean and professional invoices instantly.
                            Add items, taxes, discounts, and export your invoice as PDF.
                        </p>

                        <div className="flex gap-4 mt-4">

                            <a
                                href="#generateInvoice"
                                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition"
                            >
                                Generate Invoice
                            </a>

                            <span className="flex items-center text-gray-500 text-sm">
                                Free • No signup required
                            </span>

                        </div>
                        <div className="flex flex-wrap gap-3 mt-4 text-sm text-gray-600">
                            <span className="px-3 py-1 bg-white rounded-full shadow">
                                PDF Export
                            </span>
                            <span className="px-3 py-1 bg-white rounded-full shadow">
                                Multi Currency
                            </span>
                            <span className="px-3 py-1 bg-white rounded-full shadow">
                                Tax & Discount
                            </span>
                        </div>

                    </div>
                    <div className="relative">

                        <div className="bg-white rounded-2xl shadow-[0_0_3px_0_rgba(0,0,0,0.25)] overflow-hidden border border-gray-200">

                            <Image
                                src="/InvoiceExample.jpg"
                                alt="invoice example"
                                width={900}
                                height={600}
                                className="object-cover"
                            />

                        </div>

                        {/* Glow background */}
                        <div className="absolute -z-10 w-full h-full bg-blue-200 blur-3xl opacity-30 top-8 left-8"></div>

                    </div>

                </div>
            </section>
            <section id='generateInvoice'>
                <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 py-5'>
                    <div className='flex flex-col gap-4 px-4 sm:px-5 py-5 shadow-[0_0_3px_0_rgba(0,0,0,0.25)] rounded-4xl'>
                        <div className='flex flex-col sm:flex-row w-full gap-6 shadow-[0_0_4px_0_rgba(0,0,0,0.25)] p-4 rounded-xl'>
                            <div className='flex flex-col w-full sm:w-[45%] p-2 gap-2'>
                                <div className='flex p-2'>
                                    {logo ? (
                                        <div className='relative w-[120px] h-[120px] sm:w-[150px] sm:h-[150px]'>
                                            <img src={logo} alt="logo preview" className="w-full h-full object-contain" />
                                            <button onClick={() => setLogo(null)} className='absolute top-0 right-0 text-2xl text-gray-300'>
                                                <IoMdCloseCircle />
                                            </button>
                                        </div>
                                    ) : (
                                        <label
                                            htmlFor="logo"
                                            className='w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] relative bg-gradient-to-b from-gray-200 to-gray-300 rounded-md shadow flex justify-center items-center cursor-pointer overflow-hidden'
                                        >
                                            <div className="flex flex-col items-center">
                                                <span className='text-4xl text-gray-500'>+</span>
                                                <span className='text-gray-500 text-sm'>Add Logo</span>
                                            </div>
                                        </label>
                                    )}
                                    <input
                                        id='logo'
                                        type="file"
                                        accept="image/*"
                                        className='hidden'
                                        onChange={(e) => {
                                            const file = e.target.files?.[0]
                                            if (!file) return
                                            const reader = new FileReader()
                                            reader.onload = () => setLogo(reader.result as string)
                                            reader.readAsDataURL(file)
                                        }}
                                    />
                                </div>

                                <input
                                    placeholder="From"
                                    value={invoice.from}
                                    type='text'
                                    onChange={(e) => handleChange("from", e.target.value)}
                                    className='p-2 text-lg sm:text-xl rounded border border-transparent focus:border-gray-200 focus:outline-none w-full'
                                />
                                <div className='flex gap-2 '>
                                    <div className='flex flex-col gap-2'>
                                        <input
                                            placeholder="Bill To"
                                            value={invoice.billToLabel}
                                            type='text'
                                            onChange={(e) => handleChange("billToLabel", e.target.value)}
                                            className='p-2 rounded border border-transparent focus:border-gray-200 focus:outline-none w-full'
                                        />
                                        <input
                                            placeholder="Ex: XYZ Ltd"
                                            value={invoice.billTo}
                                            type='text'
                                            onChange={(e) => handleChange("billTo", e.target.value)}
                                            className='p-2 rounded border border-transparent focus:border-gray-200 focus:outline-none w-full'
                                        />
                                    </div>
                                    <div className='flex flex-col gap-2 w-full'>
                                        <input
                                            placeholder="Payment Details"
                                            value={invoice.paymentDetailsLabel}
                                            type='text'
                                            onChange={(e) => handleChange("paymentDetailsLabel", e.target.value)}
                                            className='p-2 rounded border border-transparent focus:border-gray-200 focus:outline-none w-full'
                                        />
                                        <input
                                            placeholder="Ex: Bank Name - Bank Account Number "
                                            value={invoice.paymentDetails}
                                            type='text'
                                            onChange={(e) => handleChange("paymentDetails", e.target.value)}
                                            className='p-2 rounded border border-transparent focus:border-gray-200 focus:outline-none w-full'
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col gap-2 w-full sm:w-[55%] items-start sm:items-end'>
                                <input
                                    type="text"
                                    placeholder='Title'
                                    value={invoice.title}
                                    onChange={(e) => handleChange('title', e.target.value)}
                                    className='p-2 text-3xl sm:text-5xl text-gray-500 rounded border border-transparent focus:border-gray-200 focus:outline-none w-full sm:w-auto text-right'
                                />

                                <div className='relative sm:w-30 w-full'>
                                    <input
                                        type='text'
                                        placeholder="1"
                                        value={invoice.invoiceNumber}
                                        onChange={(e) => handleChange("invoiceNumber", e.target.value)}
                                        className='p-1 text-2xl text-gray-500 rounded border border-transparent text-right focus:border-gray-200 focus:outline-none w-full'
                                    />
                                    <div className='absolute top-0 h-full rounded-l bg-linear-to-b from-gray-200 to-gray-300 px-3 flex items-center'>
                                        <span className='text-gray-500'>#</span>
                                    </div>
                                </div>

                                {
                                    fields.map(({ labelField, valueField, type, placeholder }) => (
                                    <div key={labelField} className='w-full flex sm:justify-between sm:items-center gap-4 sm:gap-2'>
                                        <input
                                            type="text"
                                            value={invoice[labelField] as string}
                                            onChange={(e) => handleChange(labelField, e.target.value)}
                                            className='p-2 rounded border border-transparent focus:border-gray-200 focus:outline-none text-sm text-gray-600 sm:w-auto w-full'
                                        />
                                        <input
                                            type={type}
                                            placeholder={placeholder}
                                            value={invoice[valueField] as string }
                                            onChange={(e) => handleChange(valueField, e.target.value)}
                                            className='p-2 rounded focus:outline-none bg-white shadow-[0_0_2px_0_rgba(0,0,0,0.25)] w-full'
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className='p-4 rounded-xl shadow-[0_0_4px_0_rgba(0,0,0,0.25)] flex flex-col items-center'>
                            <div className='overflow-x-auto w-full'>
                                <table className='w-full min-w-[500px]'>
                                    <colgroup>
                                        <col className='w-[55%]' />
                                        <col className='w-[12%]' />
                                        <col className='w-[15%]' />
                                        <col className='w-[15%]' />
                                        <col className='w-[3%]' />
                                    </colgroup>
                                    <thead>
                                        <tr className='bg-gray-200'>
                                            <th className='text-start px-2 py-1 rounded-l'>
                                                <input value={invoice.tableItem} onChange={(e) => handleChange("tableItem", e.target.value)} className='p-2 w-full border-b focus:outline-none font-semibold' />
                                            </th>
                                            <th className='text-start px-2 py-1'>
                                                <input value={invoice.tableQty} onChange={(e) => handleChange("tableQty", e.target.value)} className='p-2 w-full border-b focus:outline-none font-semibold' />
                                            </th>
                                            <th className='text-start px-2 py-1'>
                                                <input value={invoice.tablePrice} onChange={(e) => handleChange("tablePrice", e.target.value)} className='p-2 w-full border-b focus:outline-none font-semibold' />
                                            </th>
                                            <th className='text-start px-2 py-1 '>
                                                <input value={invoice.tableTotal} onChange={(e) => handleChange("tableTotal", e.target.value)} className='p-2 w-full border-b focus:outline-none font-semibold' />
                                            </th>
                                            <th className='rounded-r'/>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((item, i) => (
                                            <tr key={i} className='group border-t border-gray-100'>
                                                <td className='px-2 py-1'>
                                                    <input
                                                        type='text'
                                                        placeholder="Product"
                                                        value={item.name}
                                                        onChange={(e) => updateItem(i, "name", e.target.value)}
                                                        className='w-full p-2 rounded border border-transparent focus:border-gray-200 focus:outline-none'
                                                    />
                                                </td>
                                                <td className='px-2 py-1'>
                                                    <input
                                                        type="number"
                                                        placeholder="Qty"
                                                        value={item.qty}
                                                        onChange={(e) => updateItem(i, "qty", e.target.value)}
                                                        className='w-full p-2 focus:outline-none shadow-[0_0_2px_0_rgba(0,0,0,0.25)] rounded'
                                                    />
                                                </td>
                                                <td className='px-2 py-1'>
                                                    <input
                                                        type="number"
                                                        placeholder="Price"
                                                        value={item.price}
                                                        onChange={(e) => updateItem(i, "price", e.target.value)}
                                                        className='w-full p-2 focus:outline-none shadow-[0_0_2px_0_rgba(0,0,0,0.25)] rounded'
                                                    />
                                                </td>
                                                <td className='px-2 py-1'>
                                                    <input
                                                        type="number"
                                                        placeholder="Total"
                                                        value={item.total}
                                                        readOnly
                                                        className='w-full p-2 focus:outline-none shadow-[0_0_2px_0_rgba(0,0,0,0.25)] rounded bg-gray-100'
                                                    />
                                                </td>
                                                <td className='px-1 py-1'>
                                                    <button
                                                        onClick={() => removeItem(i)}
                                                        className='text-gray-500 hover:text-gray-200 transition-colors p-2'
                                                    >
                                                        <IoClose />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <button className='p-2 flex items-center justify-center gap-2 text-blue-500 hover:text-blue-600 transition-colors' onClick={addItem}>
                                <GoPlus />
                                <span>Add Item</span>
                            </button>
                        </div>

                        <div className="flex flex-col p-4 rounded-xl gap-2 w-full shadow-[0_0_4px_0_rgba(0,0,0,0.25)]">
                            <input
                                type="text"
                                value={invoice.notesLabel}
                                onChange={(e) => handleChange("notesLabel", e.target.value)}
                                className="p-2 rounded border border-transparent focus:border-gray-200 focus:outline-none w-40 text-sm"
                            />

                            <textarea
                                placeholder="Write additional notes..."
                                value={invoice.notes}
                                onChange={(e) => handleChange("notes", e.target.value)}
                                className="p-3 rounded shadow-[0_0_2px_0_rgba(0,0,0,0.25)] focus:outline-none w-full min-h-[80px]"
                            />

                        </div>

                        <div className='border-[0.5px] border-gray-400 border-dashed w-full' />
                        <div className="flex flex-col items-end gap-2 w-full shadow-[0_0_4px_0_rgba(0,0,0,0.25)] p-4 rounded-xl">

                            {showTax ? (
                                <div className="flex gap-2 items-center">
                                    <span className="text-sm text-gray-600">Tax (%):</span>
                                    <input
                                        type="number"
                                        value={extra.tax}
                                        onChange={(e) => handleExtraChange("tax", e.target.value)}
                                        className="p-2 shadow-[0_0_2px_0_rgba(0,0,0,0.25)] rounded w-24 focus:outline-none"
                                    />
                                    <button
                                        onClick={closeTax}
                                        className="text-gray-500 hover:text-gray-200 transition-colors p-1"
                                        title="Remove tax"
                                    >
                                        <IoClose size={18} />
                                    </button>
                                </div>
                            ) : (
                                <button onClick={() => setShowTax(true)} className="text-blue-500 hover:text-blue-600 text-sm transition-colors">
                                    + Add Tax
                                </button>
                            )}

                            {showDiscount ? (
                                <div className="flex gap-2 items-center">
                                    <span className="text-sm text-gray-600">Discount (%):</span>
                                    <input
                                        type="number"
                                        value={extra.discount}
                                        onChange={(e) => handleExtraChange("discount", e.target.value)}
                                        className="p-2 shadow-[0_0_2px_0_rgba(0,0,0,0.25)] rounded w-24 focus:outline-none"
                                    />
                                    <button
                                        onClick={closeDiscount}
                                        className="text-gray-500 hover:text-gray-200 transition-colors p-1"
                                        title="Remove discount"
                                    >
                                        <IoClose size={18} />
                                    </button>
                                </div>
                            ) : (
                                <button onClick={() => setShowDiscount(true)} className="text-blue-500 hover:text-blue-600 text-sm transition-colors">
                                    + Add Discount
                                </button>
                            )}

                            {showShipping ? (
                                <div className="flex gap-2 items-center">
                                    <span className="text-sm text-gray-600">Shipping:</span>
                                    <input
                                        type="number"
                                        value={extra.shipping}
                                        onChange={(e) => handleExtraChange("shipping", e.target.value)}
                                        className="p-2 shadow-[0_0_2px_0_rgba(0,0,0,0.25)] rounded w-24 focus:outline-none"
                                    />
                                    <button
                                        onClick={closeShipping}
                                        className="text-gray-500 hover:text-gray-200 transition-colors p-1"
                                        title="Remove shipping"
                                    >
                                        <IoClose size={18} />
                                    </button>
                                </div>
                            ) : (
                                <button onClick={() => setShowShipping(true)} className="text-blue-500 hover:text-blue-600 text-sm transition-colors">
                                    + Add Shipping
                                </button>
                            )}

                            {showAmountPaid ? (
                                <div className="flex gap-2 items-center">
                                    <span className="text-sm text-gray-600">Amount Paid:</span>
                                    <input
                                        type="number"
                                        value={invoice.amountPaid}
                                        onChange={(e) => handleChange("amountPaid", e.target.value)}
                                        className="p-2 shadow-[0_0_2px_0_rgba(0,0,0,0.25)] rounded w-24 focus:outline-none"
                                    />
                                    <button
                                        onClick={closeAmountPaid}
                                        className="text-gray-500 hover:text-gray-200 transition-colors p-1"
                                        title="Remove amount paid"
                                    >
                                        <IoClose size={18} />
                                    </button>
                                </div>
                            ) : (
                                <button onClick={() => setShowAmountPaid(true)} className="text-blue-500 hover:text-blue-600 text-sm transition-colors">
                                    + Add Amount Paid
                                </button>
                            )}

                        </div>


                        {/* Currency + Generate */}
                        <div className='flex flex-col sm:flex-row gap-3 items-stretch sm:items-center'>
                            <div className='flex w-full gap-2'>
                                <div className='relative w-32'>
                                    <select
                                        value={currency}
                                        onChange={(e) => setCurrency(e.target.value)}
                                        className='p-2 w-full rounded-lg focus:outline-none relative z-20 appearance-none shadow-[0_0_2px_0_rgba(0,0,0,0.25)] '
                                    >
                                        <option value="USD">USD</option>
                                        <option value="IDR">IDR</option>
                                        <option value="EUR">EUR</option>
                                    </select>
                                    <div className='absolute top-0 right-0 h-full flex items-center bg-linear-to-b z-10 from-gray-200 to-gray-300 px-2 rounded-r-lg' >
                                        <MdKeyboardArrowDown className='' />
                                    </div>
                                </div>
                                <button
                                    className='p-2 bg-blue-600 hover:bg-blue-600 flex items-center gap-2 text-white rounded-lg transition-colors flex-1 sm:flex-none sm:px-8'
                                    onClick={previewInvoice}
                                >
                                    <MdOutlineRemoveRedEye /> Preview Invoice
                                </button>
                            </div>
                            <button
                                className='p-2 bg-blue-600 hover:bg-blue-600 flex items-center gap-2 text-white rounded-lg transition-colors flex-1 sm:flex-none sm:px-8'
                                onClick={downloadInvoice}
                            >
                                <RiDownloadLine /> Download Invoice
                            </button>
                        </div>
                    </div>

                    {pdfUrl && (
                        <div className='mt-4'>
                            <iframe
                                src={pdfUrl.toString()}
                                width="100%"
                                height="700px"
                                className='rounded shadow'
                            />
                        </div>
                    )}
                </div>
            </section>
            <section className="px-6 lg:px-20 py-20 bg-white">
                <div className="max-w-7xl mx-auto flex flex-col gap-16">

                    {/* HOW TO USE */}
                    <div className="flex flex-col gap-6">
                        <h2 className="text-3xl lg:text-4xl font-bold">
                            How to Create Your Invoice
                        </h2>

                        <p className="text-gray-600 max-w-2xl">
                            Easily generate professional invoices in just a few steps. No signup required.
                        </p>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                            {[
                                {
                                    step: "1",
                                    title: "Fill Your Info",
                                    desc: "Enter your business details, client info, and invoice number."
                                },
                                {
                                    step: "2",
                                    title: "Add Items",
                                    desc: "Add products or services with quantity and pricing."
                                },
                                {
                                    step: "3",
                                    title: "Customize",
                                    desc: "Include tax, discount, shipping, and notes."
                                },
                                {
                                    step: "4",
                                    title: "Download",
                                    desc: "Preview and export your invoice instantly as PDF."
                                }
                            ].map((item, i) => (
                                <div key={i} className="border rounded-xl p-6 flex flex-col gap-2">

                                    <span className="text-blue-600 font-bold text-lg w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                                        {item.step}
                                    </span>

                                    <h3 className="font-semibold">{item.title}</h3>
                                    <p className="text-gray-600 text-sm">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* FAQ */}
                    <div className="flex flex-col gap-6">
                        <h2 className="text-3xl lg:text-4xl font-bold">
                            Frequently Asked Questions
                        </h2>

                        <div className="flex flex-col gap-4 max-w-3xl">
                            <div>
                                <h3 className="font-semibold">Is this invoice generator free?</h3>
                                <p className="text-gray-600 text-sm">
                                    Yes, it's completely free to use. No signup or login required.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold">Can I add my logo?</h3>
                                <p className="text-gray-600 text-sm">
                                    Yes, you can upload your business logo and include it in the invoice.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold">Can I use different currencies?</h3>
                                <p className="text-gray-600 text-sm">
                                    Yes, you can switch between USD, IDR, and EUR easily.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold">Will my data be saved?</h3>
                                <p className="text-gray-600 text-sm">
                                    No, everything runs locally in your browser. Your data stays private.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
            <Footer />
        </>
    )
}