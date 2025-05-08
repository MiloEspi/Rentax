import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "./components/navigation";

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
  description: "Alquiler de propiedades online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-white text-gray-800`}
      >
        {/* HEADER */}
        <header className="bg-gradient-to-r from-yellow-400 to-orange-400 shadow-md py-4 px-6">
          <div className="max-w-6xl mx-auto">
            <Navigation />
          </div>
        </header>

        {/* MAIN */}
        <main className="flex-grow">{children}</main>

        {/* FOOTER */}
        <footer className="bg-gradient-to-r from-blue-400 to-green-400 text-white py-10 mt-12">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-6">
            {/* Redes */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Redes</h2>
              <ul className="space-y-2 text-lg">
                <li>
                  <a
                    href="https://www.instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-yellow-100 transition-colors"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-yellow-100 transition-colors"
                  >
                    Facebook
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.tiktok.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-yellow-100 transition-colors"
                  >
                    TikTok
                  </a>
                </li>
              </ul>
            </div>

            {/* Contacto */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Contacto</h2>
              <ul className="space-y-2 text-lg">
                <li>
                  <a
                    href="mailto:tuemail@example.com"
                    className="hover:text-yellow-100 transition-colors"
                  >
                    tuemail@example.com
                  </a>
                </li>
                <li>Teléfono: +123 456 789</li>
                <li>
                  <a
                    href="https://wa.me/123456789"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-yellow-100 transition-colors"
                  >
                    WhatsApp
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-8 text-sm opacity-75">
            © {new Date().getFullYear()} Rentax. Todos los derechos reservados.
          </div>
        </footer>
      </body>
    </html>
  );
}
