'use client';

import { useParams } from 'next/navigation';
import Buscador from '@/components/Buscador';


const BuscadorTipo = () => {
  const params = useParams();
  const tipo = params.tipo as string;

  const nombre = {
    viviendas: 'Viviendas',
    garajes: 'Garajes',
    locales: 'Locales Comerciales',
  }[tipo] || 'Propiedades';

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4 text-yellow-500">
        Buscador de {nombre}
      </h1>

      {/* 🔍 Buscador */}
      <Buscador tipo={tipo} />

      {/* Aquí irán los resultados */}
      <p className="text-lg text-gray-600">
        Resultados disponibles próximamente para `{nombre}`.
      </p>
    </div>
  );
};

export default BuscadorTipo;
