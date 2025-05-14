'use client';

import { useEffect, useRef, useState } from 'react';

const SERVICIOS = [
  { label: 'WiFi', value: 'wifi' },
  { label: 'Estacionamiento', value: 'estacionamiento' },
  { label: 'Aire Acondicionado', value: 'aire' },
  { label: 'TV', value: 'tv' },
  { label: 'Pileta', value: 'pileta' },
];

const TIPOS_PROPIEDAD = [
  { label: 'Vivienda', value: 'vivienda' },
  { label: 'Local', value: 'local' },
  { label: 'Cochera', value: 'cochera' },
];

export default function BuscarPropiedades() {
  const [tipoPropiedad, setTipoPropiedad] = useState<'vivienda' | 'local' | 'cochera'>('vivienda');
  const [ciudadInput, setCiudadInput] = useState('');
  const [ciudadFiltrada, setCiudadFiltrada] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [precio, setPrecio] = useState<[number, number]>([30, 500]);
  const [metros, setMetros] = useState<[number, number]>([10, 500]);
  const [resultados, setResultados] = useState<any[]>([]);
  const [showResultados, setShowResultados] = useState(false);

  // Servicios seleccionados
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState<string[]>([]);

  // Huespedes, ambientes y baños
  const [huespedes, setHuespedes] = useState(1);
  const [ambientes, setAmbientes] = useState(1);
  const [banios, setBanios] = useState(1);

  // Autocompletado de ciudad
  useEffect(() => {
    if (ciudadInput.length === 0) {
      setCiudadFiltrada([]);
      return;
    }
    fetch(`http://localhost:8000/api/localidades/?q=${encodeURIComponent(ciudadInput)}`)
      .then(res => res.json())
      .then(data => setCiudadFiltrada(data.map((c: any) => c.nombre)))
      .catch(() => setCiudadFiltrada([]));
  }, [ciudadInput]);

  // Custom range bar refs
  const barRef = useRef<HTMLDivElement>(null);
  const metrosBarRef = useRef<HTMLDivElement>(null);

  // Custom range bar interaction (precio)
  const handleBarClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!barRef.current) return;
    const rect = barRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    const value = Math.round(30 + percent * (500 - 30));
    const distToMin = Math.abs(value - precio[0]);
    const distToMax = Math.abs(value - precio[1]);
    if (distToMin < distToMax) {
      setPrecio([Math.min(value, precio[1] - 1), precio[1]]);
    } else {
      setPrecio([precio[0], Math.max(value, precio[0] + 1)]);
    }
  };

  // Custom range bar interaction (metros cuadrados)
  const handleMetrosBarClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!metrosBarRef.current) return;
    const rect = metrosBarRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    const value = Math.round(10 + percent * (500 - 10));
    const distToMin = Math.abs(value - metros[0]);
    const distToMax = Math.abs(value - metros[1]);
    if (distToMin < distToMax) {
      setMetros([Math.min(value, metros[1] - 1), metros[1]]);
    } else {
      setMetros([metros[0], Math.max(value, metros[0] + 1)]);
    }
  };

  const handleBuscar = () => {
    setShowResultados(true);
    // Simulación de filtrado por tipoPropiedad
    setResultados([
      { id: 1, titulo: tipoPropiedad === 'vivienda' ? 'Casa' : tipoPropiedad === 'local' ? 'Local Comercial' : 'Cochera', ciudad: selectedCity, precio: 100, foto: '', tipo: tipoPropiedad },
      { id: 2, titulo: tipoPropiedad === 'vivienda' ? 'Depto' : tipoPropiedad === 'local' ? 'Local Centro' : 'Cochera Cubierta', ciudad: selectedCity, precio: 200, foto: '', tipo: tipoPropiedad },
      { id: 3, titulo: tipoPropiedad === 'vivienda' ? 'PH' : tipoPropiedad === 'local' ? 'Local Galería' : 'Cochera Descubierta', ciudad: selectedCity, precio: 300, foto: '', tipo: tipoPropiedad },
    ]);
  };

  const resetAll = () => {
    setSelectedCity('');
    setCiudadInput('');
    setPrecio([30, 500]);
    setMetros([10, 500]);
    setResultados([]);
    setShowResultados(false);
    setServiciosSeleccionados([]);
    setHuespedes(1);
    setAmbientes(1);
    setBanios(1);
    setTipoPropiedad('vivienda');
  };

  // For dragging thumbs (precio)
  const [dragging, setDragging] = useState<null | 'min' | 'max'>(null);

  const handleThumbMouseDown = (thumb: 'min' | 'max') => {
    setDragging(thumb);
  };

  useEffect(() => {
    if (!dragging) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (!barRef.current) return;
      const rect = barRef.current.getBoundingClientRect();
      let x = e.clientX - rect.left;
      x = Math.max(0, Math.min(x, rect.width));
      const percent = x / rect.width;
      const value = Math.round(30 + percent * (500 - 30));
      if (dragging === 'min') {
        setPrecio([Math.min(value, precio[1] - 1), precio[1]]);
      } else {
        setPrecio([precio[0], Math.max(value, precio[0] + 1)]);
      }
    };
    const handleMouseUp = () => setDragging(null);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    // eslint-disable-next-line
  }, [dragging, precio]);

  // For dragging thumbs (metros cuadrados)
  const [draggingMetros, setDraggingMetros] = useState<null | 'min' | 'max'>(null);

  const handleMetrosThumbMouseDown = (thumb: 'min' | 'max') => {
    setDraggingMetros(thumb);
  };

  useEffect(() => {
    if (!draggingMetros) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (!metrosBarRef.current) return;
      const rect = metrosBarRef.current.getBoundingClientRect();
      let x = e.clientX - rect.left;
      x = Math.max(0, Math.min(x, rect.width));
      const percent = x / rect.width;
      const value = Math.round(10 + percent * (500 - 10));
      if (draggingMetros === 'min') {
        setMetros([Math.min(value, metros[1] - 1), metros[1]]);
      } else {
        setMetros([metros[0], Math.max(value, metros[0] + 1)]);
      }
    };
    const handleMouseUp = () => setDraggingMetros(null);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    // eslint-disable-next-line
  }, [draggingMetros, metros]);

  // Manejo de servicios
  const toggleServicio = (value: string) => {
    setServiciosSeleccionados(prev =>
      prev.includes(value)
        ? prev.filter(s => s !== value)
        : [...prev, value]
    );
  };

  // Filtrar resultados por tipoPropiedad
  const resultadosFiltrados = resultados.filter(r => r.tipo === tipoPropiedad);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 font-sans py-10">
      {/* Barra de navegación de tipo de propiedad */}
      <nav className="w-full max-w-5xl mx-auto px-4 mb-8">
        <div className="flex gap-6 justify-center bg-white rounded-2xl shadow-lg py-4">
          {TIPOS_PROPIEDAD.map(tp => (
            <button
              key={tp.value}
              className={`px-8 py-3 rounded-xl font-bold text-lg border-2 transition-all
                ${tipoPropiedad === tp.value
                  ? 'bg-orange-500 text-white border-orange-500 shadow'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-orange-100'}
              `}
              onClick={() => setTipoPropiedad(tp.value as any)}
              type="button"
            >
              {tp.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="w-full max-w-5xl mx-auto px-4">
        {/* GRAN RECUADRO GRIS */}
        <section className="bg-gray-200 rounded-3xl shadow-xl p-10 flex flex-col md:flex-row gap-10 mb-12">
          {/* Buscador de ciudad */}
          <div className="flex-1 flex flex-col justify-center">
            <h2 className="font-bold text-2xl text-gray-700 mb-4">Ciudad</h2>
            <div className="relative">
              <input
                type="text"
                value={ciudadInput}
                onChange={e => {
                  setCiudadInput(e.target.value);
                  setSelectedCity('');
                }}
                placeholder="Escribí una ciudad..."
                className="w-full border-2 border-gray-400 rounded-xl px-6 py-5 focus:outline-none focus:ring-2 focus:ring-orange-400 text-2xl bg-white"
                autoComplete="off"
              />
              {ciudadInput && ciudadFiltrada.length > 0 && (
                <ul className="absolute z-10 bg-white border border-gray-200 rounded-xl w-full mt-2 max-h-56 overflow-y-auto shadow-lg text-lg">
                  {ciudadFiltrada.map((c) => (
                    <li
                      key={c}
                      onClick={() => {
                        setSelectedCity(c);
                        setCiudadInput(c);
                        setCiudadFiltrada([]);
                      }}
                      className="px-6 py-3 hover:bg-orange-100 cursor-pointer"
                    >
                      {c}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {selectedCity && (
              <div className="text-lg text-gray-500 mt-2">
                Seleccionado: <span className="font-semibold">{selectedCity}</span>
              </div>
            )}
          </div>
          {/* Barra de rango de precios */}
          <div className="flex-1 flex flex-col justify-center">
            <h2 className="font-bold text-2xl text-gray-700 mb-4">Rango de precios</h2>
            <div className="flex items-center gap-6 mb-2">
              <span className="font-bold text-xl text-gray-700">${precio[1]}</span>
              <span className="mx-2 text-gray-400 text-xl">-</span>
              <span className="font-bold text-xl text-gray-700">${precio[0]}</span>
            </div>
            {/* Custom range bar */}
            <div
              ref={barRef}
              className="relative w-full h-8 bg-gray-300 rounded-full cursor-pointer select-none"
              onClick={handleBarClick}
              style={{ minWidth: 260 }}
            >
              {/* Selected range */}
              <div
                className="absolute h-8 bg-orange-500 rounded-full"
                style={{
                  left: `${((precio[0] - 30) / (500 - 30)) * 100}%`,
                  width: `${((precio[1] - precio[0]) / (500 - 30)) * 100}%`,
                  top: 0,
                  transition: dragging ? 'none' : 'left 0.1s, width 0.1s',
                  opacity: 0.95,
                }}
              />
              {/* Min thumb */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-7 h-7 bg-white border-4 border-orange-500 rounded-full shadow cursor-pointer z-10"
                style={{
                  left: `calc(${((precio[0] - 30) / (500 - 30)) * 100}% - 14px)`,
                  transition: dragging === 'min' ? 'none' : 'left 0.1s',
                }}
                onMouseDown={e => {
                  e.stopPropagation();
                  handleThumbMouseDown('min');
                }}
                tabIndex={0}
                aria-label="Mover mínimo"
              />
              {/* Max thumb */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-7 h-7 bg-white border-4 border-orange-500 rounded-full shadow cursor-pointer z-10"
                style={{
                  left: `calc(${((precio[1] - 30) / (500 - 30)) * 100}% - 14px)`,
                  transition: dragging === 'max' ? 'none' : 'left 0.1s',
                }}
                onMouseDown={e => {
                  e.stopPropagation();
                  handleThumbMouseDown('max');
                }}
                tabIndex={0}
                aria-label="Mover máximo"
              />
            </div>
            <div className="flex justify-between text-gray-500 text-sm mt-1 px-1">
              <span>$30</span>
              <span>$500</span>
            </div>
          </div>
        </section>

        {/* Vivienda: Bloque de huéspedes, ambientes y baños */}
        {tipoPropiedad === 'vivienda' && (
          <section className="bg-gray-200 rounded-2xl shadow p-8 mb-8">
            <h2 className="font-bold text-2xl text-gray-700 mb-4">Capacidad y ambientes</h2>
            <div className="flex flex-wrap gap-10">
              {/* Huespedes */}
              <div className="flex flex-col items-start">
                <span className="text-gray-700 font-semibold mb-2">Huéspedes</span>
                <div className="flex items-center gap-4 bg-white border-2 border-gray-300 rounded-xl px-4 py-2">
                  <button
                    type="button"
                    className="text-orange-500 text-2xl font-bold px-2"
                    onClick={() => setHuespedes(h => Math.max(1, h - 1))}
                    aria-label="Menos huéspedes"
                  >
                    –
                  </button>
                  <span className="text-xl font-bold w-8 text-center">{huespedes}</span>
                  <button
                    type="button"
                    className="text-orange-500 text-2xl font-bold px-2"
                    onClick={() => setHuespedes(h => Math.min(20, h + 1))}
                    aria-label="Más huéspedes"
                  >
                    +
                  </button>
                </div>
              </div>
              {/* Ambientes */}
              <div className="flex flex-col items-start">
                <span className="text-gray-700 font-semibold mb-2">Ambientes</span>
                <div className="flex items-center gap-4 bg-white border-2 border-gray-300 rounded-xl px-4 py-2">
                  <button
                    type="button"
                    className="text-orange-500 text-2xl font-bold px-2"
                    onClick={() => setAmbientes(a => Math.max(1, a - 1))}
                    aria-label="Menos ambientes"
                  >
                    –
                  </button>
                  <span className="text-xl font-bold w-8 text-center">{ambientes}</span>
                  <button
                    type="button"
                    className="text-orange-500 text-2xl font-bold px-2"
                    onClick={() => setAmbientes(a => Math.min(10, a + 1))}
                    aria-label="Más ambientes"
                  >
                    +
                  </button>
                </div>
              </div>
              {/* Baños */}
              <div className="flex flex-col items-start">
                <span className="text-gray-700 font-semibold mb-2">Baños</span>
                <div className="flex items-center gap-4 bg-white border-2 border-gray-300 rounded-xl px-4 py-2">
                  <button
                    type="button"
                    className="text-orange-500 text-2xl font-bold px-2"
                    onClick={() => setBanios(b => Math.max(1, b - 1))}
                    aria-label="Menos baños"
                  >
                    –
                  </button>
                  <span className="text-xl font-bold w-8 text-center">{banios}</span>
                  <button
                    type="button"
                    className="text-orange-500 text-2xl font-bold px-2"
                    onClick={() => setBanios(b => Math.min(10, b + 1))}
                    aria-label="Más baños"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Vivienda: Bloque de servicios */}
        {tipoPropiedad === 'vivienda' && (
          <section className="bg-gray-200 rounded-2xl shadow p-8 mb-8">
            <h2 className="font-bold text-2xl text-gray-700 mb-4">Características</h2>
            <div className="flex flex-wrap gap-6 max-w-2xl">
              {SERVICIOS.map(servicio => (
                <label
                  key={servicio.value}
                  className={`flex items-center gap-3 px-5 py-3 rounded-xl cursor-pointer border-2 ${
                    serviciosSeleccionados.includes(servicio.value)
                      ? 'bg-orange-100 border-orange-400'
                      : 'bg-white border-gray-300'
                  } transition-all`}
                  style={{ flex: '1 1 220px', minWidth: 180 }}
                >
                  <input
                    type="checkbox"
                    checked={serviciosSeleccionados.includes(servicio.value)}
                    onChange={() => toggleServicio(servicio.value)}
                    className="accent-orange-500 w-5 h-5"
                  />
                  <span className="text-lg text-gray-700">{servicio.label}</span>
                </label>
              ))}
            </div>
          </section>
        )}

        {/* Local: Bloque de metros cuadrados */}
        {tipoPropiedad === 'local' && (
          <section className="bg-gray-200 rounded-2xl shadow p-8 mb-8">
            <h2 className="font-bold text-2xl text-gray-700 mb-4">Metros cuadrados</h2>
            <div className="flex items-center gap-6 mb-2">
              <span className="font-bold text-xl text-gray-700">{metros[1]} m²</span>
              <span className="mx-2 text-gray-400 text-xl">-</span>
              <span className="font-bold text-xl text-gray-700">{metros[0]} m²</span>
            </div>
            {/* Custom range bar metros */}
            <div
              ref={metrosBarRef}
              className="relative w-full h-8 bg-gray-300 rounded-full cursor-pointer select-none"
              onClick={handleMetrosBarClick}
              style={{ minWidth: 260 }}
            >
              {/* Selected range */}
              <div
                className="absolute h-8 bg-orange-500 rounded-full"
                style={{
                  left: `${((metros[0] - 10) / (500 - 10)) * 100}%`,
                  width: `${((metros[1] - metros[0]) / (500 - 10)) * 100}%`,
                  top: 0,
                  transition: draggingMetros ? 'none' : 'left 0.1s, width 0.1s',
                  opacity: 0.95,
                }}
              />
              {/* Min thumb */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-7 h-7 bg-white border-4 border-orange-500 rounded-full shadow cursor-pointer z-10"
                style={{
                  left: `calc(${((metros[0] - 10) / (500 - 10)) * 100}% - 14px)`,
                  transition: draggingMetros === 'min' ? 'none' : 'left 0.1s',
                }}
                onMouseDown={e => {
                  e.stopPropagation();
                  handleMetrosThumbMouseDown('min');
                }}
                tabIndex={0}
                aria-label="Mover mínimo metros"
              />
              {/* Max thumb */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-7 h-7 bg-white border-4 border-orange-500 rounded-full shadow cursor-pointer z-10"
                style={{
                  left: `calc(${((metros[1] - 10) / (500 - 10)) * 100}% - 14px)`,
                  transition: draggingMetros === 'max' ? 'none' : 'left 0.1s',
                }}
                onMouseDown={e => {
                  e.stopPropagation();
                  handleMetrosThumbMouseDown('max');
                }}
                tabIndex={0}
                aria-label="Mover máximo metros"
              />
            </div>
            <div className="flex justify-between text-gray-500 text-sm mt-1 px-1">
              <span>10 m²</span>
              <span>500 m²</span>
            </div>
          </section>
        )}

        {/* BOTONES */}
        <div className="flex justify-center gap-8 mb-10">
          <button
            onClick={resetAll}
            className="border border-gray-400 px-8 py-3 rounded-lg bg-white hover:bg-gray-100 font-semibold text-lg"
          >
            Borrar todo
          </button>
          <button
            onClick={handleBuscar}
            className="bg-orange-500 text-white px-12 py-4 rounded-lg font-bold shadow-lg text-2xl hover:bg-orange-600 transition-all"
          >
            Buscar
          </button>
        </div>

        {/* RESULTADOS */}
        {showResultados && (
          <section className="w-full bg-white/90 rounded-2xl shadow-lg border border-gray-200 p-8 flex flex-col items-center min-h-[200px] mb-10">
            {resultadosFiltrados.length === 0 ? (
              <span className="text-gray-400 text-xl">Aquí se mostrarán las propiedades encontradas...</span>
            ) : (
              <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {resultadosFiltrados.map((r, idx) => (
                  <div
                    key={r.id}
                    className="bg-white border border-gray-200 rounded-2xl shadow-lg flex flex-col overflow-hidden"
                  >
                    {/* Foto principal */}
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      {/* Imagen vacía */}
                      <span className="text-gray-400 text-3xl">Foto</span>
                    </div>
                    {/* Nombre */}
                    <div className="px-6 py-4 border-b border-gray-100">
                      <span className="font-bold text-xl text-gray-800 block text-center">{r.titulo || <>&nbsp;</>}</span>
                    </div>
                    {/* Características */}
                    <div className="flex flex-col gap-2 px-6 py-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Precio por día:</span>
                        <span className="text-orange-600 font-bold text-lg">{r.precio ? `$${r.precio}` : <>&nbsp;</>}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Ciudad:</span>
                        <span className="text-gray-700 font-semibold">{r.ciudad || <>&nbsp;</>}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
