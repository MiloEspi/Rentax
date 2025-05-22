'use client';

import React, { useEffect, useState } from 'react';

type Foto = { id: number; imagen: string; descripcion?: string };
type Propiedad = {
    id: number | string;
    titulo: string;
    precio: string | number;
    descripcion: string;
    ambientes: number;
    huespedes: number;
    banios: number;
    fotos: Foto[];
    [key: string]: any;
};

export default function ModificarPropiedad({ params }: { params: { id: string } }) {
    const [propiedad, setPropiedad] = useState<Propiedad | null>(null);
    const [loading, setLoading] = useState(true);
    const [nuevasFotos, setNuevasFotos] = useState<File[]>([]);
    const [mensaje, setMensaje] = useState('');

    // Cargar datos de la propiedad
    useEffect(() => {
        fetch(`http://localhost:8000/propiedades/${params.id}/`)
            .then(res => res.json())
            .then(data => {
                setPropiedad(data);
                setLoading(false);
            });
    }, [params.id]);

    // Manejar cambios en los campos
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!propiedad) return;
        setPropiedad({ ...propiedad, [e.target.name]: e.target.value });
    };

    // Manejar nuevas fotos
    const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setNuevasFotos(Array.from(e.target.files));
        }
    };

    // Eliminar foto existente
    const handleEliminarFoto = (fotoId: number) => {
        if (!propiedad) return;
        setPropiedad({
            ...propiedad,
            fotos: propiedad.fotos.filter(f => f.id !== fotoId)
        });
    };

    // Guardar cambios
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!propiedad) return;

        const formData = new FormData();
        formData.append('titulo', propiedad.titulo);
        formData.append('precio', String(propiedad.precio));
        formData.append('descripcion', propiedad.descripcion);
        formData.append('ambientes', String(propiedad.ambientes));
        formData.append('huespedes', String(propiedad.huespedes));
        formData.append('banios', String(propiedad.banios));
        // ...agrega aquí otros campos según tu modelo...

        // IDs de fotos a mantener
        propiedad.fotos.forEach(f => formData.append('fotos_existentes', String(f.id)));
        // Nuevas fotos
        nuevasFotos.forEach(f => formData.append('fotos', f));

        const res = await fetch(`http://localhost:8000/propiedades/${params.id}/`, {
            method: 'PUT',
            body: formData,
        });

        if (res.ok) {
            setMensaje('Propiedad actualizada correctamente');
            setNuevasFotos([]);
            // Recargar datos
            const data = await res.json();
            setPropiedad(data);
        } else {
            setMensaje('Error al actualizar la propiedad');
        }
    };

    if (loading || !propiedad) return <div>Cargando...</div>;

    return (
        <div style={{
            minHeight: '100vh',
            background: '#f8fafc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <form onSubmit={handleSubmit} style={{
                background: '#fff',
                borderRadius: 16,
                boxShadow: '0 8px 32px rgba(60,60,120,0.12)',
                padding: 40,
                width: 600,
                display: 'flex',
                flexDirection: 'column',
                gap: 20
            }}>
                <h2 style={{ fontSize: 28, fontWeight: 700, color: '#4f46e5' }}>Modificar Propiedad</h2>
                {mensaje && <div style={{ color: '#22c55e', fontWeight: 600 }}>{mensaje}</div>}
                <label>
                    Título:
                    <input
                        name="titulo"
                        value={propiedad.titulo}
                        onChange={handleChange}
                        style={{ width: '100%', padding: 8, marginTop: 4, color: 'black' }}
                        required
                    />
                </label>
                <label>
                    Precio por día:
                    <input
                        name="precio"
                        type="number"
                        value={propiedad.precio}
                        onChange={handleChange}
                        style={{ width: '100%', padding: 8, marginTop: 4, color: 'black' }}
                        required
                    />
                </label>
                <label>
                    Descripción:
                    <textarea
                        name="descripcion"
                        value={propiedad.descripcion}
                        onChange={handleChange}
                        style={{ width: '100%', padding: 8, marginTop: 4, color: 'black' }}
                        required
                    />
                </label>
                <label>
                    Ambientes:
                    <input
                        name="ambientes"
                        type="number"
                        value={propiedad.ambientes}
                        onChange={handleChange}
                        style={{ width: '100%', padding: 8, marginTop: 4, color: 'black' }}
                        required
                    />
                </label>
                <label>
                    Huespedes:
                    <input
                        name="huespedes"
                        type="number"
                        value={propiedad.huespedes}
                        onChange={handleChange}
                        style={{ width: '100%', padding: 8, marginTop: 4, color: 'black' }}
                        required
                    />
                </label>
                <label>
                    Baños:
                    <input
                        name="banios"
                        type="number"
                        value={propiedad.banios}
                        onChange={handleChange}
                        style={{ width: '100%', padding: 8, marginTop: 4, color: 'black' }}
                        required
                    />
                </label>
                {/* Muestra todas las fotos actuales */}
                <div>
                    <div style={{ fontWeight: 600, marginBottom: 8 }}>Fotos actuales:</div>
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                        {propiedad.fotos.map(f => (
                            <div key={f.id} style={{ position: 'relative' }}>
                                <img src={f.imagen} alt="" style={{ width: 100, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid #ccc' }} />
                                <button
                                    type="button"
                                    onClick={() => handleEliminarFoto(f.id)}
                                    style={{
                                        position: 'absolute', top: 2, right: 2, background: '#ef4444', color: '#fff',
                                        border: 'none', borderRadius: '50%', width: 22, height: 22, cursor: 'pointer', fontWeight: 700
                                    }}
                                    title="Eliminar foto"
                                >×</button>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Subir nuevas fotos */}
                <label>
                    Agregar nuevas fotos:
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFotoChange}
                        style={{ marginTop: 8 }}
                    />
                </label>
                <button
                    type="submit"
                    style={{
                        padding: '12px 0',
                        background: '#6366f1',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        fontWeight: 700,
                        fontSize: 18,
                        cursor: 'pointer',
                        marginTop: 16
                    }}
                >
                    Guardar cambios
                </button>
            </form>
        </div>
    );
}