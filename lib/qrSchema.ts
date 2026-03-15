import { z } from "zod"

export const urlSchema = z.object({
    input: z
        .string()
        .min(1, "URL or text cannot be empty")
})

const phoneRegex = new RegExp(
    /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
)

export const phoneSchema = z.object({
    input: z
        .string()
        .min(8, "Invalid phone number")
        .regex(
            /^\d{8,15}$/,
            "Enter a valid WhatsApp number with country code (e.g. 628123456789)"
        ),
})

export const emailSchema = z.object({
    input: z
        .string()
        .email("Invalid email address"),

    subject: z
        .string()
        .optional(),

    message: z
        .string()
        .optional()
})

export const whatsappSchema = z.object({
    input: z
        .string()
        .min(8, "Invalid WhatsApp number")
        .regex(phoneRegex, "Invalid Whatsapp number"),

    message: z
        .string()
        .optional()
})

export const wifiSchema = z.object({
    ssid: z
        .string()
        .min(1, "WiFi name (SSID) is required"),

    password: z
        .string()
        .optional(),

    security: z.enum(["WPA", "WEP", "nopass"])
})