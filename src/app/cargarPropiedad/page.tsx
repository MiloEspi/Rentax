'use client';

import React, { useRef, useState, useEffect, ReactNode } from 'react';

const RENTAX_RED = '#ff5a1f';
const RENTAX_LIGHT_RED = '#ffe7db';
const RENTAX_GRAY = '#f5f6fa';

const CATEGORIAS = [
  { label: 'Vivienda', value: 'vivienda' },
  { label: 'Local', value: 'local' },
  { label: 'Cochera', value: 'cochera' },
];

const ATRIBUTOS = [
  { label: 'WiFi', value: 'wifi' },
  { label: 'Pileta', value: 'pileta' },
  { label: 'Estacionamiento', value: 'estacionamiento' },
  { label: 'TV', value: 'tv' },
  { label: 'Aire acondicionado', value: 'aire' },
];

export default function CargarPropiedad() {
  const [form, setForm] = useState({
    categoria: '',
    titulo: '',
    descripcion: '',
    ciudad: '',
    direccion_calle: '',
    direccion_numero: '',
    direccion_piso: '',
    direccion_departamento: '',
    politica: '',
    ambientes: 1,
    huespedes: 1,
    banios: 1,
    metros_cuadrados: '',
    precio: '',
    cantidadDiasMinimo: '',
    atributos: [] as string[],
    fotos: [] as File[],
  });
  const [fotoPreviews, setFotoPreviews] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // NUEVO: Estados para políticas y ciudades desde el backend
  const [politicas, setPoliticas] = useState<{
    politica: ReactNode; id: number, nombre: string 
}[]>([]);
  const [ciudades, setCiudades] = useState<{ id: number, nombre: string }[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargar políticas y ciudades al montar el componente
  useEffect(() => {
    fetch('http://localhost:8000/politicas/')
      .then(res => res.json())
      .then(data => setPoliticas(data));
    fetch('http://localhost:8000/localidades/')
      .then(res => res.json())
      .then(data => setCiudades(data));
  }, []);

  // Manejo de campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Manejo de atributos (checkbox)
  const handleAtributo = (value: string) => {
    setForm(f => ({
      ...f,
      atributos: f.atributos.includes(value)
        ? f.atributos.filter(a => a !== value)
        : [...f.atributos, value],
    }));
  };

  // Manejo de fotos
  const handleFotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 20) {
      setError('Solo se pueden cargar hasta 20 fotos.');
      return;
    }
    setError('');
    setForm(f => ({ ...f, fotos: files }));
    setFotoPreviews(files.map(file => URL.createObjectURL(file)));
  };

  // Sumar/restar ambientes, huespedes, banios
  const handleSumar = (field: 'ambientes' | 'huespedes' | 'banios', delta: number) => {
    setForm(f => ({
      ...f,
      [field]: Math.max(1, (f[field] as number) + delta),
    }));
  };

  // Validación según reglas de negocio
  const validate = () => {
    if (!form.categoria) return 'Debe seleccionar la categoría.';
    if (!form.titulo) return 'Debe ingresar el título de la propiedad.';
    if (!form.descripcion) return 'Debe ingresar la descripción.';
    if (!form.ciudad) return 'Debe seleccionar la ciudad.';
    if (!form.direccion_calle) return 'Debe ingresar la calle.';
    if (!form.direccion_numero) return 'Debe ingresar el número.';
    if (form.categoria === 'vivienda') {
      if (!form.ambientes || !form.huespedes || !form.banios)
        return 'Debe indicar ambientes, huéspedes y banios.';
    }
    if (form.categoria === 'local') {
      if (!form.metros_cuadrados) return 'Debe indicar los metros cuadrados.';
    }
    if (!form.precio) return 'Debe indicar el precio por día.';
    if (!form.cantidadDiasMinimo) return 'Debe seleccionar la cantidad mínima de días.';
    if (!form.politica) return 'Debe seleccionar la política de cancelación.';
    if (form.fotos.length < 3) return 'Como minimo se tienen que cargar 3 fotos.';
    if (form.fotos.length > 20) return 'Solo se pueden cargar hasta 20 fotos.';
    return null;
  };

  // Simulación de verificación de título único (debería ser backend)
  const checkTituloUnico = async (titulo: string) => {
    if (titulo.trim().toLowerCase() === 'monoambiente en palermo') {
      return false;
    }
    return true;
  };

  // Envío real al backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    setIsSubmitting(true);

    const unico = await checkTituloUnico(form.titulo);
    if (!unico) {
      setError('El título de la propiedad debe ser único. Ya existe una propiedad con ese título.');
      setIsSubmitting(false);
      return;
    }

    // Buscar el ID de la política seleccionada
    const politicaObj = politicas.find(p => String(p.id) === form.politica || p.nombre === form.politica);
    // Buscar el ID de la ciudad seleccionada
    const ciudadObj = ciudades.find(c => String(c.id) === form.ciudad || c.nombre === form.ciudad);

    let url = '';
    let categoriaPayload: any = {};
    if (form.categoria === 'vivienda') {
      url = 'http://localhost:8000/viviendas/';
      categoriaPayload = {
        ambientes: form.ambientes,
        huespedes: form.huespedes,
        banios: form.banios,
        atributos: JSON.stringify(form.atributos), 
        tipoPropiedad:'vivienda',
      };
    } else if (form.categoria === 'cochera') {
      url = 'http://localhost:8000/cocheras/';
      categoriaPayload = {
        cupo_de_autos: 1,
        tipoPropiedad: 'cochera',
      };
    } else if (form.categoria === 'local') {
      url = 'http://localhost:8000/local/';
      categoriaPayload = {
        metros_cuadrados: form.metros_cuadrados,
        tipoPropiedad:'local',
      };
    }

    // Construir FormData
    const formData = new FormData();
    formData.append('titulo', form.titulo);
    formData.append('descripcion', form.descripcion);
    formData.append('precio', form.precio);
    formData.append('cantidadDiasMinimo', form.cantidadDiasMinimo);
    formData.append('politica', politicaObj ? String(politicaObj.id) : form.politica);
    formData.append('localidad', ciudadObj ? String(ciudadObj.id) : form.ciudad);

    // Enviar los campos de dirección directamente
    formData.append('calle', form.direccion_calle);
    formData.append(
      'numero',
      form.direccion_numero && !isNaN(Number(form.direccion_numero))
        ? String(Number(form.direccion_numero))
        : ''
    );
    formData.append(
      'piso',
      form.direccion_piso && !isNaN(Number(form.direccion_piso))
        ? String(Number(form.direccion_piso))
        : ''
    );
    formData.append(
      'departamento',
      form.direccion_departamento && form.direccion_departamento.trim() !== ''
        ? form.direccion_departamento.trim()
        : ''
    );

    // Agregar campos específicos de la categoría
    Object.entries(categoriaPayload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, typeof value === 'string' ? value : String(value));
      }
    });
    // Agregar fotos
    form.fotos.forEach((file, idx) => {
      formData.append('fotos', file);
    });

    try {
      const res = await fetch(url, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        setSuccess('Propiedad registrada correctamente.');
        setForm({
          categoria: '',
          titulo: '',
          descripcion: '',
          ciudad: '',
          direccion_calle: '',
          direccion_numero: '',
          direccion_piso: '',
          direccion_departamento: '',
          politica: '',
          ambientes: 1,
          huespedes: 1,
          banios: 1,
          metros_cuadrados: '',
          precio: '',
          cantidadDiasMinimo: '',
          atributos: [],
          fotos: [],
        });
        // Limpiar el input de archivos
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setFotoPreviews([]);
        // Redirigir a listarPropiedades
        window.location.href = '/listarPropiedades';
      } else {
        // Intenta parsear la respuesta como JSON, si es posible
        let errorMsg = 'Error al registrar la propiedad';
        try {
          const data = await res.json();
          errorMsg = data.titulo || data.detail || JSON.stringify(data) || errorMsg;
        } catch {
          // Si no es JSON, usa texto plano
          const text = await res.text();
          if (text) errorMsg = text;
        }
        setError(errorMsg);
      }
    } catch (e: any) {
      setError('Error de conexión con el servidor');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f6fa 60%, #ffe7db 100%)',
      fontFamily: 'sans-serif',
      padding: '40px 0',
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          background: '#fff',
          borderRadius: 20,
          boxShadow: '0 8px 32px #0002',
          padding: 36,
          border: `2.5px solid ${RENTAX_RED}`,
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
          position: 'relative',
        }}
      >
        {/* SELECTOR DE TIPO DE PROPIEDAD */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            gap: 32,
            padding: '18px 0 22px 0',
            background: '#f2c6b3',
            borderRadius: 18,
            border: `4px solid ${RENTAX_RED}`,
            marginBottom: 36,
            marginTop: 30,
            boxShadow: '0 4px 18px #ff572244',
            position: 'relative',
            zIndex: 10,
          }}
        >
          {CATEGORIAS.map(c => (
            <button
              key={c.value}
              type="button"
              onClick={() => setForm(f => ({ ...f, categoria: c.value }))}
              style={{
                fontSize: 26,
                fontWeight: 900,
                padding: '18px 38px',
                borderRadius: 14,
                border: form.categoria === c.value ? `4px solid ${RENTAX_RED}` : `3px solid #bbb`,
                background: form.categoria === c.value ? RENTAX_LIGHT_RED : '#f5f6fa',
                color: form.categoria === c.value ? RENTAX_RED : '#333',
                boxShadow: form.categoria === c.value ? '0 2px 12px #ff572244' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                outline: 'none',
              }}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* RECUADRO GENERAL DEL FORMULARIO */}
        <div
          style={{
            width: '100%',
            background: '#fbeee2',
            borderRadius: 22,
            border: `3px solid ${RENTAX_RED}`,
            boxShadow: '0 6px 32px #ff572244',
            padding: '36px 28px 28px 28px',
            marginTop: 18,
            display: 'flex',
            flexDirection: 'row',
            gap: 32,
            position: 'relative',
          }}
        >
          {/* IZQUIERDA */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 22,
            background: RENTAX_GRAY,
            borderRadius: 16,
            padding: 24,
            border: `2px solid ${RENTAX_LIGHT_RED}`,
            marginTop: 0,
          }}>
            <h1 style={{
              textAlign: 'center',
              color: RENTAX_RED,
              fontWeight: 900,
              fontSize: 28,
              marginBottom: 10,
              letterSpacing: 1,
            }}>Datos principales</h1>

            {/* Titulo */}
            <label style={{ fontWeight: 700, color: '#333' }}>Título</label>
            <input
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              type="text"
              placeholder="Ej: Monoambiente en Palermo"
              style={{
                border: `2px solid ${RENTAX_RED}`,
                borderRadius: 10,
                padding: '12px 16px',
                fontSize: 18,
                background: '#fff',
                color: 'black', // Cambiado a negro
              }}
            />

            {/* Descripción */}
            <label style={{ fontWeight: 700, color: '#333' }}>Descripción</label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Describe la propiedad..."
              rows={3}
              style={{
                border: `2px solid ${RENTAX_RED}`,
                borderRadius: 10,
                padding: '12px 16px',
                fontSize: 18,
                background: '#fff',
                resize: 'vertical',
                color: 'black', // Cambiado a negro
              }}
            />

            {/* Ciudad */}
            <label style={{ fontWeight: 700, color: '#333' }}>Ciudad</label>
            <select
              name="ciudad"
              value={form.ciudad}
              onChange={handleChange}
              style={{
                border: `2px solid ${RENTAX_RED}`,
                borderRadius: 10,
                padding: '12px 16px',
                fontSize: 18,
                background: '#fff',
                color: 'black', // Cambiado a negro
              }}
            >
              <option value="">Seleccionar ciudad</option>
              {ciudades.map(c => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>

            {/* Dirección */}
            <label style={{ fontWeight: 700, color: '#333' }}>Dirección</label>
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                name="direccion_calle"
                value={form.direccion_calle}
                onChange={handleChange}
                type="text"
                placeholder="Calle"
                style={{
                  border: `2px solid ${RENTAX_RED}`,
                  borderRadius: 10,
                  padding: '12px 10px',
                  fontSize: 16,
                  background: '#fff',
                  flex: 2,
                  color: 'black', // Cambiado a negro
                }}
              />
              <input
                name="direccion_numero"
                value={form.direccion_numero}
                onChange={handleChange}
                type="number"
                placeholder="N°"
                style={{
                  border: `2px solid ${RENTAX_RED}`,
                  borderRadius: 10,
                  padding: '12px 10px',
                  fontSize: 16,
                  background: '#fff',
                  width: 80,
                  color: 'black', // Cambiado a negro
                }}
              />
              <input
                name="direccion_piso"
                value={form.direccion_piso}
                onChange={handleChange}
                type="number"
                placeholder="Piso"
                style={{
                  border: `2px solid ${RENTAX_RED}`,
                  borderRadius: 10,
                  padding: '12px 10px',
                  fontSize: 16,
                  background: '#fff',
                  width: 70,
                  color: 'black', // Cambiado a negro
                }}
              />
              <input
                name="direccion_departamento"
                value={form.direccion_departamento}
                onChange={handleChange}
                type="text"
                placeholder="Depto"
                style={{
                  border: `2px solid ${RENTAX_RED}`,
                  borderRadius: 10,
                  padding: '12px 10px',
                  fontSize: 16,
                  background: '#fff',
                  width: 70,
                  color: 'black', // Cambiado a negro
                }}
              />
            </div>

            {/* Política de cancelación */}
            <label style={{ fontWeight: 700, color: '#333' }}>Política de cancelación</label>
            <select
              name="politica"
              value={form.politica}
              onChange={handleChange}
              style={{
                border: `2px solid ${RENTAX_RED}`,
                borderRadius: 10,
                padding: '12px 16px',
                fontSize: 18,
                background: '#fff',
                color: 'black', // Cambiado a negro
              }}
            >
              <option value="">Seleccionar política</option>
              {politicas.map(p => (
                <option key={p.id} value={p.id}>{p.politica}</option>
              ))}
            </select>
          </div>

          {/* DERECHA */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 22,
            background: RENTAX_GRAY,
            borderRadius: 16,
            padding: 24,
            border: `2px solid ${RENTAX_LIGHT_RED}`,
            marginTop: 0,
          }}>
            <h1 style={{
              textAlign: 'center',
              color: RENTAX_RED,
              fontWeight: 900,
              fontSize: 28,
              marginBottom: 10,
              letterSpacing: 1,
            }}>Características y fotos</h1>

            {/* Vivienda: Ambientes, Huespedes, Baños, Atributos */}
            {form.categoria === 'vivienda' && (
              <>
                {/* Ambientes, Huespedes, Baños */}
                <div style={{
                  display: 'flex',
                  gap: 18,
                  justifyContent: 'space-between',
                }}>
                  {/* Ambientes */}
                  <div style={{ flex: 1 }}>
                    <label style={{ fontWeight: 700, color: '#333' }}>Ambientes</label>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      background: '#fff', borderRadius: 10, padding: '8px 10px',
                      border: `2px solid ${RENTAX_LIGHT_RED}`,
                      marginTop: 2,
                      color: 'black', // Cambiado a negro
                    }}>
                      <button type="button" onClick={() => handleSumar('ambientes', -1)}
                        style={{
                          fontSize: 22, color: RENTAX_RED, border: 'none', background: 'none', cursor: 'pointer', fontWeight: 900,
                        }}>–</button>
                      <span style={{ fontSize: 20, fontWeight: 700, width: 28, textAlign: 'center' }}>{form.ambientes}</span>
                      <button type="button" onClick={() => handleSumar('ambientes', 1)}
                        style={{
                          fontSize: 22, color: RENTAX_RED, border: 'none', background: 'none', cursor: 'pointer', fontWeight: 900,
                        }}>+</button>
                    </div>
                  </div>
                  {/* Huespedes */}
                  <div style={{ flex: 1 }}>
                    <label style={{ fontWeight: 700, color: '#333' }}>Huéspedes</label>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      background: '#fff', borderRadius: 10, padding: '8px 10px',
                      border: `2px solid ${RENTAX_LIGHT_RED}`,
                      marginTop: 2,
                      color: 'black', // Cambiado a negro
                    }}>
                      <button type="button" onClick={() => handleSumar('huespedes', -1)}
                        style={{
                          fontSize: 22, color: RENTAX_RED, border: 'none', background: 'none', cursor: 'pointer', fontWeight: 900,
                        }}>–</button>
                      <span style={{ fontSize: 20, fontWeight: 700, width: 28, textAlign: 'center' }}>{form.huespedes}</span>
                      <button type="button" onClick={() => handleSumar('huespedes', 1)}
                        style={{
                          fontSize: 22, color: RENTAX_RED, border: 'none', background: 'none', cursor: 'pointer', fontWeight: 900,
                        }}>+</button>
                    </div>
                  </div>
                  {/* Baños */}
                  <div style={{ flex: 1 }}>
                    <label style={{ fontWeight: 700, color: '#333' }}>Baños</label>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      background: '#fff', borderRadius: 10, padding: '8px 10px',
                      border: `2px solid ${RENTAX_LIGHT_RED}`,
                      marginTop: 2,
                      color: 'black', // Cambiado a negro
                    }}>
                      <button type="button" onClick={() => handleSumar('banios', -1)}
                        style={{
                          fontSize: 22, color: RENTAX_RED, border: 'none', background: 'none', cursor: 'pointer', fontWeight: 900,
                        }}>–</button>
                      <span style={{ fontSize: 20, fontWeight: 700, width: 28, textAlign: 'center' }}>{form.banios}</span>
                      <button type="button" onClick={() => handleSumar('banios', 1)}
                        style={{
                          fontSize: 22, color: RENTAX_RED, border: 'none', background: 'none', cursor: 'pointer', fontWeight: 900,
                        }}>+</button>
                    </div>
                  </div>
                </div>

                {/* Atributos */}
                <label style={{ fontWeight: 700, color: '#333' }}>Atributos</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
                  {ATRIBUTOS.map(attr => (
                    <label key={attr.value} style={{
                      display: 'flex', alignItems: 'center', gap: 7,
                      background: form.atributos.includes(attr.value) ? RENTAX_LIGHT_RED : '#fff',
                      border: `2px solid ${form.atributos.includes(attr.value) ? RENTAX_RED : RENTAX_LIGHT_RED}`,
                      borderRadius: 10,
                      padding: '8px 18px',
                      cursor: 'pointer',
                      fontWeight: 600,
                      color: 'black', // Cambiado a negro
                    }}>
                      <input
                        type="checkbox"
                        checked={form.atributos.includes(attr.value)}
                        onChange={() => handleAtributo(attr.value)}
                        style={{ accentColor: RENTAX_RED, width: 18, height: 18 }}
                      />
                      <span>{attr.label}</span>
                    </label>
                  ))}
                </div>
              </>
            )}

            {/* Local: Metros cuadrados */}
            {form.categoria === 'local' && (
              <>
                <label style={{ fontWeight: 700, color: '#333' }}>Metros cuadrados</label>
                <input
                  name="metros_cuadrados"
                  value={form.metros_cuadrados}
                  onChange={handleChange}
                  type="number"
                  min={1}
                  placeholder="Ej: 100"
                  style={{
                    border: `2px solid ${RENTAX_RED}`,
                    borderRadius: 10,
                    padding: '12px 16px',
                    fontSize: 18,
                    background: '#fff',
                    color: 'black', // Cambiado a negro
                  }}
                />
              </>
            )}

            {/* Precio por día */}
            <label style={{ fontWeight: 700, color: '#333' }}>Precio por día (USD)</label>
            <input
              name="precio"
              value={form.precio}
              onChange={handleChange}
              type="number"
              min={1}
              placeholder="Ej: 30"
              style={{
                border: `2px solid ${RENTAX_RED}`,
                borderRadius: 10,
                padding: '12px 16px',
                fontSize: 18,
                background: '#fff',
                color: 'black', // Cambiado a negro
              }}
            />

            {/* Días mínimos */}
            <label style={{ fontWeight: 700, color: '#333' }}>Cantidad mínima de días de alquiler</label>
            <input
              name="cantidadDiasMinimo"
              value={form.cantidadDiasMinimo}
              onChange={handleChange}
              type="number"
              min={1}
              placeholder="Ej: 5"
              style={{
                border: `2px solid ${RENTAX_RED}`,
                borderRadius: 10,
                padding: '12px 16px',
                fontSize: 18,
                background: '#fff',
                color: 'black', // Cambiado a negro
              }}
            />

            {/* Cargar fotos */}
            <label style={{ fontWeight: 700, color: '#333' }}>Fotos</label>
            <input
              type="file"
              accept="image/*"
              multiple
              ref={fileInputRef}
              onChange={handleFotos}
              style={{
                border: `2px solid ${RENTAX_RED}`,
                borderRadius: 10,
                padding: '10px',
                background: '#fff',
                fontSize: 16,
                color: 'black', // Cambiado a negro
              }}
              // Limitar selección a 20 archivos desde el input (no todos los navegadores lo respetan)
              max={20}
            />
            {/* Previews */}
            {fotoPreviews.length > 0 && (
              <div style={{
                display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 8,
              }}>
                {fotoPreviews.map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt={`Foto ${idx + 1}`}
                    style={{
                      width: 90, height: 70, objectFit: 'cover', borderRadius: 8, border: `2px solid ${RENTAX_RED}`,
                      boxShadow: '0 1px 6px #ff572244',
                      background: '#fff',
                      color: 'black', // Cambiado a negro
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mensajes y botón */}
        <div style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 32,
        }}>
          {error && <div style={{ color: 'red', fontWeight: 700, marginTop: 8 }}>{error}</div>}
          {success && <div style={{ color: 'green', fontWeight: 700, marginTop: 8 }}>{success}</div>}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              marginTop: 18,
              padding: '16px 60px',
              fontSize: 22,
              background: RENTAX_RED,
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              fontWeight: 900,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 8px #ff572244',
              letterSpacing: 1,
              transition: 'background 0.2s',
            }}
          >
            {isSubmitting ? 'Registrando...' : 'Registrar propiedad'}
          </button>
        </div>
      </form>
    </div>
  );
}