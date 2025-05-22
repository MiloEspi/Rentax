'use client';

import React, { useEffect, useState } from 'react';

type Propiedad = {
    id: number | string;
    titulo: string;
    precio: string | number;
    fotos: { imagen: string }[];
};

export default function ListarPropiedades() {
    const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
    const [busqueda, setBusqueda] = useState('');
    const [busquedaId, setBusquedaId] = useState('');
    const [menuAbierto, setMenuAbierto] = useState<number | null>(null);

    useEffect(() => {
        fetch('http://localhost:8000/propiedades/')
            .then(res => res.json())
            .then(data => setPropiedades(data));
    }, []);

    const propiedadesFiltradas = propiedades.filter(p =>
        (busqueda === '' || p.titulo.toLowerCase().includes(busqueda.toLowerCase())) &&
        (busquedaId === '' || String(p.id) === busquedaId)
    );

    const handleEliminar = (id: number | string) => {
        if (window.confirm('¿Seguro que deseas eliminar esta propiedad?')) {
            fetch(`http://localhost:8000/propiedades/${id}/`, { method: 'DELETE' })
                .then(() => setPropiedades(props => props.filter(p => p.id !== id)));
        }
    };

    const handleModificar = (id: number | string) => {
        window.location.href = `/modificarPropiedad/${id}`;
    };

    return (
        <div style={{
            minHeight: '100vh',
            width: '100vw',
            background: '#f8fafc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div style={{
                width: '100%',
                maxWidth: 1200,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 24, color: '#4f46e5', textAlign: 'center' }}>Propiedades</h1>
                <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
                    {/* Buscador por título */}
                    <div style={{ position: 'relative', width: 250 }}>
                        <input
                            type="text"
                            placeholder="Buscar por título"
                            value={busqueda}
                            onChange={e => setBusqueda(e.target.value)}
                            style={{
                                padding: '10px 10px 10px 38px',
                                borderRadius: 8,
                                border: '1px solid #c7d2fe',
                                width: '100%',
                                color: 'black',
                                background: '#f3f4f6',
                                outline: 'none'
                            }}
                        />
                        <span style={{
                            position: 'absolute',
                            left: 10,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            pointerEvents: 'none',
                            color: '#6366f1'
                        }}>
                            {/* SVG de lupa */}
                            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <circle cx="11" cy="11" r="7" />
                                <line x1="16.5" y1="16.5" x2="21" y2="21" />
                            </svg>
                        </span>
                    </div>
                    {/* Buscador por ID */}
                    <div style={{ position: 'relative', width: 120 }}>
                        <input
                            type="text"
                            placeholder="Buscar por ID"
                            value={busquedaId}
                            onChange={e => setBusquedaId(e.target.value)}
                            style={{
                                padding: '10px 10px 10px 38px',
                                borderRadius: 8,
                                border: '1px solid #c7d2fe',
                                width: '100%',
                                color: 'black',
                                background: '#f3f4f6',
                                outline: 'none'
                            }}
                        />
                        <span style={{
                            position: 'absolute',
                            left: 10,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            pointerEvents: 'none',
                            color: '#6366f1'
                        }}>
                            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <circle cx="11" cy="11" r="7" />
                                <line x1="16.5" y1="16.5" x2="21" y2="21" />
                            </svg>
                        </span>
                    </div>
                </div>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: 24,
                        width: '100%',
                        justifyItems: 'center'
                    }}
                >
                    {propiedadesFiltradas.map((prop) => (
                        <div
                            key={prop.id}
                            style={{
                                background: '#fff',
                                borderRadius: 12,
                                boxShadow: '0 2px 12px #e0e7ff',
                                padding: 20,
                                display: 'flex',
                                flexDirection: 'column',
                                position: 'relative',
                                minHeight: 320,
                                width: '100%',
                                maxWidth: 340
                            }}
                        >
                            <img
                                src={prop.fotos?.[0]?.imagen || '/no-image.png'}
                                alt={prop.titulo}
                                style={{
                                    width: '100%',
                                    height: 160,
                                    objectFit: 'cover',
                                    borderRadius: 8,
                                    marginBottom: 16,
                                    background: '#f3f4f6',
                                }}
                            />
                            <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8, color: '#222' }}>
                                {prop.titulo}
                            </div>
                            <div style={{ color: '#6366f1', fontWeight: 600, marginBottom: 8 }}>
                                ${prop.precio} / día
                            </div>
                            <div style={{ color: '#888', fontSize: 15, marginBottom: 8 }}>
                                ID: {prop.id}
                            </div>
                            {/* Botón de tres puntos */}
                            <div style={{ position: 'absolute', top: 16, right: 16 }}>
                                <button
                                    onClick={() => setMenuAbierto(menuAbierto === prop.id ? null : Number(prop.id))}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        fontSize: 24,
                                        cursor: 'pointer',
                                        color: '#6366f1',
                                        padding: 0,
                                    }}
                                    aria-label="Opciones"
                                >
                                    &#8942;
                                </button>
                                {menuAbierto === Number(prop.id) && (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: 32,
                                            right: 0,
                                            background: '#fff',
                                            border: '1px solid #e0e7ff',
                                            borderRadius: 8,
                                            boxShadow: '0 2px 8px #e0e7ff',
                                            zIndex: 10,
                                            minWidth: 160,
                                        }}
                                    >
                                        <button
                                            onClick={() => {
                                                setMenuAbierto(null);
                                                handleEliminar(prop.id);
                                            }}
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                background: 'none',
                                                border: 'none',
                                                color: '#ef4444',
                                                fontWeight: 600,
                                                textAlign: 'left',
                                                cursor: 'pointer',
                                                borderBottom: '1px solid #f3f4f6',
                                            }}
                                        >
                                            Eliminar propiedad
                                        </button>
                                        <button
                                            onClick={() => handleModificar(prop.id)}
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                background: 'none',
                                                border: 'none',
                                                color: '#6366f1',
                                                fontWeight: 600,
                                                textAlign: 'left',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            Modificar propiedad
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}