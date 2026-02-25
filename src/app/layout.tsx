import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Thiệp đám cưới tên chú rể tên cô dâu",
  description:
    "Tên chú rể & Tên cô dâu - Website Helen Studio. Trải qua bao nhiêu chuyện thì chúng tôi đã tìm thấy nhau 1 mảnh ghép tình yêu.",
  authors: [{ name: "dewanakl" }],
  keywords: ["Tên chú rể", "Tên cô dâu", "Helen Studio", "wedding invitation"],
  openGraph: {
    title: "Tên chú rể & Tên cô dâu - Website Helen Studio",
    description:
      "Tên chú rể & Tên cô dâu - Website Helen Studio. Trải qua bao nhiêu chuyện thì chúng tôi đã tìm thấy nhau 1 mảnh ghép tình yêu.",
    images: [
      {
        url: "https://wedding-2-wheat.vercel.app/assets/images/1.jpg?v=3",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "Tên chú rể & Tên cô dâu - Website Helen Studio",
      },
    ],
    type: "website",
    locale: "id_ID",
    url: "https://wedding-2-wheat.vercel.app/",
    siteName: "Tên chú rể & Tên cô dâu - Website Helen Studio",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-title":
      "Tên chú rể & Tên cô dâu - Website Helen Studio",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" data-bs-theme="auto">
      <head>
        <meta name="theme-color" content="#000000" />
        <meta name="color-scheme" content="dark light" />
        <link rel="canonical" href="https://wedding-2-wheat.vercel.app/" />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="https://wedding-2-wheat.vercel.app/assets/images/1.jpg"
        />
        <link
          rel="apple-touch-icon"
          sizes="192x192"
          href="https://wedding-2-wheat.vercel.app/assets/images/1.jpg"
        />

        {/* Preconnect CDN */}
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link
          rel="preconnect"
          href="https://cdn.jsdelivr.net"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Josefin+Sans&display=swap"
        />

        {/* Bootstrap CSS */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
          integrity="sha256-2FMn2Zx6PuH5tdBQDRNwrOo60ts5wWPC9R8jK67b3t4="
          crossOrigin="anonymous"
        />

        {/* FontAwesome CSS */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@7.1.0/css/all.min.css"
          integrity="sha256-4rTIfo5GQTi/7UJqoyUJQKzxW8VN/YBH31+Cy+vTZj4="
          crossOrigin="anonymous"
        />

        {/* Bootstrap JS */}
        <script
          defer
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
          integrity="sha256-5P1JGBOIxI7FBAvT/mb1fCnI5n/NhQKzNUuW7Hq0fMc="
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
