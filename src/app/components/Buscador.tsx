'use client';

type Props = {
  tipo: string;
};

export default function Buscador({ tipo }: Props) {
  const placeholder = {
    viviendas: 'Buscar viviendas...',
    garajes: 'Buscar garajes...',
    locales: 'Buscar locales comerciales...',
  }[tipo] || 'Buscar propiedades...';

  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder={placeholder}
        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
