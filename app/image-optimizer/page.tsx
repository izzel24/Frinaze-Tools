import type { Metadata } from "next";
import Image_Converter from "./Image_Converter";

export const metadata: Metadata = {
    title: "Free Image Converter & Compressor Online | JPEG, PNG, WebP | Frinaze Tools",
    description:
        "Convert, compress, and resize images online for free. Optimize JPG, PNG, and WebP images without losing quality. Perfect for websites, Instagram, and marketplaces.",

    keywords: [
        "image converter",
        "image compressor",
        "convert jpg to webp",
        "convert png to jpeg",
        "resize image online",
        "compress image online",
        "optimize image for web",
        "free image optimizer"
    ],

    robots: {
        index: true,
        follow: true
    },

    alternates: {
        canonical: "https://tools.frinaze.site/image-optimizer"
    },

    openGraph: {
        title: "Free Image Converter & Compressor Online",
        description:
            "Convert, compress, and resize images online instantly. Supports JPG, PNG, and WebP.",
        url: "https://tools.frinaze.site/image-optimizer",
        siteName: "YourTools",
        images: [
            {
                url: "https://frinaze.site/og/image-optimizer.png",
                width: 1200,
                height: 630,
                alt: "Free Image Converter Tool"
            }
        ],
        locale: "en_US",
        type: "website"
    },

    twitter: {
        card: "summary_large_image",
        title: "Free Image Converter & Compressor",
        description:
            "Convert and optimize images for web, Instagram, and marketplaces instantly.",
        images: ["https://frinaze.site/og/image-optimizer.png"]
    }
};

export default function Page() {
    return <Image_Converter />;
}