'use client';

import React, { useRef, useState } from 'react';

const RENTAX_RED = '#ff5a1f';
const RENTAX_LIGHT_RED = '#ffe7db';
const RENTAX_GRAY = '#f5f6fa';

const CATEGORIAS = [
  { label: 'Vivienda', value: 'vivienda' },
  { label: 'Local', value: 'local' },
  { label: 'Cochera', value: 'cochera' },
];

const POLITICAS = [
  { label: 'Sin reembolso', value: 'sin_reembolso' },
  { label: 'Reembolso parcial', value: 'parcial' },
  { label: 'Reembolso total', value: 'total' },
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
    diasMin: '',
    atributos: [] as string[],
    fotos: [] as File[],
  });
  const [fotoPreviews, setFotoPreviews] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

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
        return 'Debe indicar ambientes, huéspedes y baños.';
    }
    if (form.categoria === 'local') {
      if (!form.metros_cuadrados) return 'Debe indicar los metros cuadrados.';
    }
    if (!form.precio) return 'Debe indicar el precio por día.';
    if (!form.diasMin) return 'Debe seleccionar la cantidad mínima de días.';
    if (!form.politica) return 'Debe seleccionar la política de cancelación.';
    if (!form.fotos.length) return 'Debe cargar al menos una foto.';
    return null;
  };

  // Simulación de verificación de título único (debería ser backend)
  const checkTituloUnico = async (titulo: string) => {
    // Simular que "Monoambiente en Palermo" ya existe
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

    // Regla de título único (simulada, el backend también valida)
    const unico = await checkTituloUnico(form.titulo);
    if (!unico) {
      setError('El título de la propiedad debe ser único. Ya existe una propiedad con ese título.');
      setIsSubmitting(false);
      return;
    }

    // Armar JSON para el backend según tipo
    let payload: any = {
      titulo: form.titulo,
      descripcion: form.descripcion,
      precio: form.precio,
      cantidadDiasMinimo: form.diasMin,
      politica: form.politica,
      localidad: form.ciudad,
      direccion: {
        calle: form.direccion_calle,
        numero: form.direccion_numero,
        piso: form.direccion_piso || null,
        departamento: form.direccion_departamento || null,
      },
    };

    let url = '';
    if (form.categoria === 'vivienda') {
      url = 'http://localhost:8000/api/viviendas/';
      payload = {
        ...payload,
        ambientes: form.ambientes,
        huespedes: form.huespedes,
        baños: form.banios,
        caracteristicas: form.atributos.join(', '),
        atributos: form.atributos,
      };
    } else if (form.categoria === 'cochera') {
      url = 'http://localhost:8000/api/cocheras/';
      payload = {
        ...payload,
        cupo_de_autos: 1, // Podrías agregar un campo para esto si lo necesitás
        caracteristicas: '',
      };
    } else if (form.categoria === 'local') {
      url = 'http://localhost:8000/api/local/';
      payload = {
        ...payload,
        metros_cuadrados: form.metros_cuadrados,
        caracteristicas: '',
      };
    }

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
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
          diasMin: '',
          atributos: [],
          fotos: [],
        });
        setFotoPreviews([]);
      } else {
        const data = await res.json();
        setError(data.titulo || data.detail || 'Error al registrar la propiedad');
      }
    } catch (e) {
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
              }}
            />

            {/* Ciudad */}
            <label style={{ fontWeight: 700, color: '#333' }}>Ciudad</label>
            <input
              name="ciudad"
              value={form.ciudad}
              onChange={handleChange}
              type="text"
              placeholder="Ej: Buenos Aires"
              style={{
                border: `2px solid ${RENTAX_RED}`,
                borderRadius: 10,
                padding: '12px 16px',
                fontSize: 18,
                background: '#fff',
              }}
            />

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
              }}
            >
              <option value="">Seleccionar política</option>
              {POLITICAS.map(p => (
                <option key={p.value} value={p.value}>{p.label}</option>
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
              }}
            />

            {/* Días mínimos */}
            <label style={{ fontWeight: 700, color: '#333' }}>Cantidad mínima de días de alquiler</label>
            <input
              name="diasMin"
              value={form.diasMin}
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
              }}
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
