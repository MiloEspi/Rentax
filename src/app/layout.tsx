import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rentax",
  description: "Encuentra tu hogar perfecto en cualquier lugar del mundo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-gray-50 text-gray-900`}
      >
        {/* HEADER */}
        <header className="bg-white shadow-md py-4 px-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link href="/">
              <h1 className="text-2xl font-bold text-red-500">Rentax</h1>
            </Link>
            <Navigation />
          </div>
        </header>

        {/* MAIN */}
        <main className="flex-grow">{children}</main>

        {/* FOOTER */}
        <footer className="bg-gray-900 text-white py-10 mt-12">
          {/* Contacto */}
          <div className="bg-gray-800 text-white py-6 mt-8">
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-xl font-semibold mb-4">Contacto</h2>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="mailto:contacto@rentax.com" className="hover:underline">
                    contacto@rentax.com
                  </a>
                </li>
                <li>Teléfono: +123 456 789</li>
                <li>
                  <a
                    href="https://wa.me/123456789"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    WhatsApp
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Redes sociales */}
          <div className="bg-gray-800 text-white py-6 mt-4">
            <div className="max-w-7xl mx-auto px-6 text-center">
              <h2 className="text-xl font-semibold mb-4">Síguenos</h2>
              <div className="flex justify-center space-x-4">
                <a
                  href="https://www.tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  TikTok
                </a>
                <a
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Facebook
                </a>
                <a
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>

          <div className="text-center mt-8 text-xs opacity-75">
            © {new Date().getFullYear()} Rentax. Todos los derechos reservados.
          </div>
        </footer>
      </body>
    </html>
  );
}