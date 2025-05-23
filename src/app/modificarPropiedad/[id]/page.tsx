'use client';

import React, { useEffect, useState } from 'react';

type Foto = { id: number; imagen: string; descripcion?: string };

type PoliticaObj = { id: number; nombre?: string; politica?: string };
type PropiedadBase = {
  id: number;
  titulo: string;
  precio: number;
  descripcion: string;
  tipoPropiedad: 'vivienda' | 'cochera' | 'local';
  fotos: Foto[];
  calle: string;
  numero: number;
  piso?: number | null;
  departamento?: string | null;
  politica: PoliticaObj | null;
  localidad: number | null;
  cantidadDiasMinimo?: number | null;
  // ...otros campos comunes...
};

type PropiedadVivienda = PropiedadBase & {
  ambientes: number;
  huespedes?: number | null;
  banios?: number | null;
  atributos?: string[];
};

type PropiedadCochera = PropiedadBase & {
  // cupo_de_autos: number; // Eliminado
};

type PropiedadLocal = PropiedadBase & {
  metros_cuadrados: number;
};

// Opciones de atributos para vivienda (igual que en cargarPropiedad)
const ATRIBUTOS = [
  { label: 'WiFi', value: 'wifi' },
  { label: 'Pileta', value: 'pileta' },
  { label: 'Estacionamiento', value: 'estacionamiento' },
  { label: 'TV', value: 'tv' },
  { label: 'Aire acondicionado', value: 'aire' },
];

export default function ModificarPropiedad({ params }: { params: { id: string } }) {
  // Acceso seguro a id
  const id = typeof params === 'object' && params !== null ? params.id : undefined;

  const [propiedad, setPropiedad] = useState<PropiedadBase | null>(null);
  const [loading, setLoading] = useState(true);
  const [nuevasFotos, setNuevasFotos] = useState<File[]>([]);
  const [mensaje, setMensaje] = useState('');
  const [politicas, setPoliticas] = useState<any[]>([]);
  const [localidades, setLocalidades] = useState<any[]>([]);
  const [tipoPropMsg, setTipoPropMsg] = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      fetch(`http://localhost:8000/propiedades/${id}/`).then((res) => {
        if (!res.ok) throw new Error('Propiedad no encontrada');
        return res.json();
      }),
      fetch('http://localhost:8000/politicas/').then((res) => res.json()),
      fetch('http://localhost:8000/localidades/').then((res) => res.json())
    ])
      .then(([propiedadData, politicasData, ciudadesData]) => {
        setPoliticas(politicasData);
        setLocalidades(ciudadesData);

        // --- Normaliza el campo politica para todos los casos ---
        if (
          propiedadData.politica &&
          typeof propiedadData.politica === 'object' &&
          propiedadData.politica.id
        ) {
          // ok, ya es objeto
        } else if (typeof propiedadData.politica === 'number') {
          // Buscar el objeto en politicasData
          const found = politicasData.find((p: any) => p.id === propiedadData.politica);
          propiedadData.politica = found || null;
        } else {
          propiedadData.politica = null;
        }
        // --- FIN Normalización ---

        // Si atributos es string, parsear
        if (
          propiedadData.tipoPropiedad === 'vivienda' &&
          propiedadData.atributos &&
          typeof propiedadData.atributos === 'string'
        ) {
          try {
            propiedadData.atributos = JSON.parse(propiedadData.atributos);
          } catch {
            propiedadData.atributos = [];
          }
        }

        setPropiedad(propiedadData);
        setLoading(false);
      })
      .catch(() => {
        setMensaje('No se encontró la propiedad');
        setLoading(false);
      });
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (!propiedad) return;
    const { name, value, type } = e.target;
    let val: any = value;
    if (type === 'number') val = value === '' ? '' : Number(value);
    if (type === 'select-one' && name === 'politica') {
      val = politicas.find((p: any) => String(p.id) === value) || null;
    } else if (type === 'select-one' && name === 'localidad') {
      val = value === '' ? null : Number(value);
    }
    setPropiedad({ ...propiedad, [name]: val });
  };

  // handleAtributosChange igual que en cargarPropiedad pero adaptado a este contexto
  const handleAtributosChange = (value: string) => {
    if (!propiedad || propiedad.tipoPropiedad !== 'vivienda') return;
    const v = propiedad as PropiedadVivienda;
    let nuevos: string[] = Array.isArray(v.atributos) ? [...v.atributos] : [];
    if (nuevos.includes(value)) {
      nuevos = nuevos.filter((a) => a !== value);
    } else {
      nuevos.push(value);
    }
    if (propiedad.tipoPropiedad === 'vivienda') {
      setPropiedad({ ...(propiedad as PropiedadVivienda), atributos: nuevos });
    }
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setNuevasFotos(Array.from(e.target.files));
  };

  const handleEliminarFoto = (fotoId: number) => {
    if (!propiedad) return;
    setPropiedad({
      ...propiedad,
      fotos: propiedad.fotos.filter((f) => f.id !== fotoId),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!propiedad) return;

    setMensaje('Cambiando...');

    const formData = new FormData();
    formData.append('titulo', propiedad.titulo);
    formData.append('precio', propiedad.precio.toString());
    formData.append('descripcion', propiedad.descripcion);
    formData.append('calle', propiedad.calle);
    formData.append('numero', propiedad.numero.toString());
    formData.append('piso', propiedad.piso?.toString() ?? '');
    formData.append('departamento', propiedad.departamento ?? '');
    // Solo el id de la política (ahora siempre es number o null)
    formData.append('politica', propiedad.politica?.id?.toString() ?? '');
    formData.append('localidad', propiedad.localidad?.toString() ?? '');
    formData.append('tipoPropiedad', propiedad.tipoPropiedad);

    // cantidadDiasMinimo siempre presente
    formData.append('cantidadDiasMinimo', (propiedad as any).cantidadDiasMinimo?.toString() ?? '');

    // campos según tipo
    if (propiedad.tipoPropiedad === 'vivienda') {
      const v = propiedad as PropiedadVivienda;
      formData.append('ambientes', v.ambientes.toString());
      formData.append('huespedes', v.huespedes?.toString() ?? '');
      formData.append('banios', v.banios?.toString() ?? '');
      formData.append('atributos', JSON.stringify(v.atributos ?? []));
    }
    if (propiedad.tipoPropiedad === 'cochera') {
      // const c = propiedad as PropiedadCochera;
      // formData.append('cupo_de_autos', c.cupo_de_autos.toString());
    }
    if (propiedad.tipoPropiedad === 'local') {
      const l = propiedad as PropiedadLocal;
      formData.append('metros_cuadrados', l.metros_cuadrados.toString());
    }

    propiedad.fotos.forEach((f) =>
      formData.append('fotos_existentes', String(f.id))
    );
    nuevasFotos.forEach((f) => formData.append('fotos', f));

    // Corrige la URL para usar el id local
    const res = await fetch(
      `http://localhost:8000/propiedades/${id}/`,
      { method: 'PUT', body: formData }
    );

    if (res.ok) {
      const data = await res.json();

      // --- Normaliza el campo politica igual que al cargar ---
      let politicaObj = null;
      if (
        data.politica &&
        typeof data.politica === 'object' &&
        data.politica.id
      ) {
        politicaObj = data.politica;
      } else if (typeof data.politica === 'number') {
        const found = politicas.find((p: any) => p.id === data.politica);
        politicaObj = found || null;
      } else {
        politicaObj = null;
      }
      data.politica = politicaObj;
      // --- FIN Normalización ---

      setPropiedad(data);
      setNuevasFotos([]);
      setTimeout(() => setMensaje('✓ Cambios guardados'), 750);
    } else {
      setMensaje('✗ Error al guardar');
    }
  };

  if (loading) return <div className="p-4">Cargando...</div>;
  if (!propiedad) return <div className="p-4">Propiedad no encontrada</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-3xl space-y-6"
      >
        <h2 className="text-2xl font-bold text-indigo-700">
          Modificar Propiedad
        </h2>
        {/* Mensaje de éxito/error arriba del botón guardar */}
        {mensaje && (
          <div
            className={`text-center font-medium mb-2 ${
              mensaje.startsWith('✓')
                ? 'text-green-600'
                : 'text-red-600'
            }`}
          >
            {mensaje}
          </div>
        )}

        {/* Campos en dos columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="block">
              <span className="font-medium">Título</span>
              <input
                name="titulo"
                value={propiedad.titulo}
                onChange={handleChange}
                className="mt-1 block w-full border rounded p-2"
                required
              />
            </label>
            <label className="block">
              <span className="font-medium">Precio por día</span>
              <input
                name="precio"
                type="number"
                value={propiedad.precio}
                onChange={handleChange}
                className="mt-1 block w-full border rounded p-2"
                required
              />
            </label>
            <label className="block">
              <span className="font-medium">Descripción</span>
              <textarea
                name="descripcion"
                value={propiedad.descripcion}
                onChange={handleChange}
                className="mt-1 block w-full border rounded p-2 h-24"
                required
              />
            </label>
            <label className="block">
              <span className="font-medium">Calle</span>
              <input
                name="calle"
                value={propiedad.calle}
                onChange={handleChange}
                className="mt-1 block w-full border rounded p-2"
                required
              />
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="font-medium">Número</span>
                <input
                  name="numero"
                  type="number"
                  value={propiedad.numero}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded p-2"
                  required
                />
              </label>
              <label className="block">
                <span className="font-medium">Piso</span>
                <input
                  name="piso"
                  type="number"
                  value={propiedad.piso ?? ''}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded p-2"
                />
              </label>
            </div>
            <label className="block">
              <span className="font-medium">Departamento</span>
              <input
                name="departamento"
                value={propiedad.departamento ?? ''}
                onChange={handleChange}
                className="mt-1 block w-full border rounded p-2"
              />
            </label>
            {/* cantidadDiasMinimo SIEMPRE visible */}
            <label className="block">
              <span className="font-medium">Días mínimo</span>
              <input
                name="cantidadDiasMinimo"
                type="number"
                value={(propiedad as any).cantidadDiasMinimo ?? ''}
                onChange={handleChange}
                className="mt-1 block w-full border rounded p-2"
                required
              />
            </label>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="font-medium">Política</span>
                <select
                  name="politica"
                  value={propiedad.politica?.id ?? ''}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded p-2"
                  required
                >
                  <option value="">Seleccionar</option>
                  {politicas.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre || p.politica}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="font-medium">Localidad</span>
                <select
                  name="localidad"
                  value={propiedad.localidad ?? ''}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded p-2"
                  required
                >
                  <option value="">Seleccionar</option>
                  {localidades.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.nombre}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="block">
              <span className="font-medium">Tipo de Propiedad</span>
              <div
                tabIndex={0}
                className="mt-1 block w-full border rounded p-2 bg-gray-200 text-gray-500 cursor-not-allowed select-none relative"
                onClick={() => setTipoPropMsg('No se puede modificar el tipo de propiedad')}
                onFocus={() => setTipoPropMsg('No se puede modificar el tipo de propiedad')}
                onBlur={() => setTipoPropMsg('')}
                style={{ pointerEvents: 'auto' }}
              >
                {propiedad.tipoPropiedad === 'vivienda'
                  ? 'Vivienda'
                  : propiedad.tipoPropiedad === 'cochera'
                  ? 'Cochera'
                  : 'Local comercial'}
              </div>
              {tipoPropMsg && (
                <div className="text-red-600 text-sm mt-1">{tipoPropMsg}</div>
              )}
            </label>
            {/* Campos específicos por tipo */}
            {propiedad.tipoPropiedad === 'vivienda' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="font-medium">Ambientes</span>
                    <input
                      name="ambientes"
                      type="number"
                      value={(propiedad as PropiedadVivienda).ambientes}
                      onChange={handleChange}
                      className="mt-1 block w-full border rounded p-2"
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="font-medium">Huéspedes</span>
                    <input
                      name="huespedes"
                      type="number"
                      value={(propiedad as PropiedadVivienda).huespedes ?? ''}
                      onChange={handleChange}
                      className="mt-1 block w-full border rounded p-2"
                    />
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="font-medium">Baños</span>
                    <input
                      name="banios"
                      type="number"
                      value={(propiedad as PropiedadVivienda).banios ?? ''}
                      onChange={handleChange}
                      className="mt-1 block w-full border rounded p-2"
                    />
                  </label>
                  <label className="block">
                    <span className="font-medium">Días mínimo</span>
                    <input
                      name="cantidadDiasMinimo"
                      type="number"
                      value={(propiedad as PropiedadVivienda).cantidadDiasMinimo ?? ''}
                      onChange={handleChange}
                      className="mt-1 block w-full border rounded p-2"
                      required
                    />
                  </label>
                </div>
                {/* Atributos visual estilo cargarPropiedad */}
                <label className="block font-medium mb-1">Atributos</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
                  {ATRIBUTOS.map(attr => (
                    <label key={attr.value} style={{
                      display: 'flex', alignItems: 'center', gap: 7,
                      background: Array.isArray((propiedad as PropiedadVivienda).atributos) && (propiedad as PropiedadVivienda).atributos!.includes(attr.value) ? '#ffe7db' : '#fff',
                      border: `2px solid ${Array.isArray((propiedad as PropiedadVivienda).atributos) && (propiedad as PropiedadVivienda).atributos!.includes(attr.value) ? '#ff5a1f' : '#ffe7db'}`,
                      borderRadius: 10,
                      padding: '8px 18px',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}>
                      <input
                        type="checkbox"
                        checked={Array.isArray((propiedad as PropiedadVivienda).atributos) && (propiedad as PropiedadVivienda).atributos!.includes(attr.value)}
                        onChange={() => handleAtributosChange(attr.value)}
                        style={{ accentColor: '#ff5a1f', width: 18, height: 18 }}
                      />
                      <span>{attr.label}</span>
                    </label>
                  ))}
                </div>
              </>
            )}

            {propiedad.tipoPropiedad === 'cochera' && (
              <></>
            )}

            {propiedad.tipoPropiedad === 'local' && (
              <label className="block">
                <span className="font-medium">Metros cuadrados</span>
                <input
                  name="metros_cuadrados"
                  type="number"
                  value={(propiedad as PropiedadLocal).metros_cuadrados}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded p-2"
                  required
                />
              </label>
            )}
            {/* Fotos existentes */}
            <div>
              <span className="block font-medium mb-2">Fotos actuales</span>
              <div className="flex flex-wrap gap-2">
                {propiedad.fotos.map((f) => (
                  <div key={f.id} className="relative">
                    <img
                      src={f.imagen}
                      alt=""
                      className="w-24 h-16 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => handleEliminarFoto(f.id)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      title="Eliminar foto"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {/* Subir nuevas fotos */}
            <label className="block">
              <span className="font-medium">Agregar nuevas fotos</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFotoChange}
                className="mt-1"
              />
            </label>
          </div>
        </div>
        {/* Botón guardar */}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded font-semibold hover:bg-indigo-700 transition"
        >
          Guardar cambios
        </button>
      </form>
    </div>
  );
}
