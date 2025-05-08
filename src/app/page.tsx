import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-6xl font-extrabold text-black mb-4">Alquiler Express</h1>
        <h2 className="text-4xl font-bold text-black mb-8">¿Qué deseas alquilar?</h2>
        <div className="flex gap-6 justify-center">
          <Link 
            href="/buscador/viviendas"
            className="bg-yellow-500 hover:bg-yellow-600 text-white py-4 px-8 rounded-lg text-center transition duration-300 shadow-md"
          >
            Viviendas
            
          </Link>
          <Link 
            href="/buscador/garajes"
            className="bg-yellow-500 hover:bg-yellow-600 text-white py-4 px-8 rounded-lg text-center transition duration-300 shadow-md"
          >
            Garajes
          </Link>
          <Link 
            href="/buscador/locales"
            className="bg-yellow-500 hover:bg-yellow-600 text-white py-4 px-8 rounded-lg text-center transition duration-300 shadow-md"
          >
            Locales Comerciales
          </Link>
        </div>
      </div>
    </div>
  );
}

