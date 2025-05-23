'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

const tipoMap: Record<string, string> = {
  viviendas: 'vivienda',
  garages: 'cochera',
  locales: 'local',
};

export default function RedirectBuscadorTipo() {
  const params = useParams();
  const router = useRouter();
  const tipo = params.tipo as string;
  const tipoProp = tipoMap[tipo] || 'vivienda';

  useEffect(() => {
    router.replace(`/BuscarPropiedades?tipo=${tipoProp}`);
  }, [router, tipoProp]);

  return null;
}
