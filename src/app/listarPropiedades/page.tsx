'use client';

import React, { useEffect, useState } from 'react';

type Propiedad = {
    id: number | string;
    titulo: string;
    precio: string | number;
    fotos: { imagen: string }[];
    tipoPropiedad: string;
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

    const handleCardClick = (id: number | string) => {
        window.location.href = `/propiedades/${id}`;
    };

    return (
        <div style={{
            minHeight: '100vh',
            width: '100vw',
            background: '#fff',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: 24
        }}>
            <div style={{
                width: '100%',
                maxWidth: 1200,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                {/* Header y botón */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    marginBottom: 16
                }}>
                    <h1 style={{
                        fontSize: 44,
                        fontWeight: 900,
                        color: '#fb923c',
                        margin: 0,
                        letterSpacing: 1,
                        background: '#f3f4f6',
                        padding: '24px 32px',
                        borderRadius: 12,
                        flex: 1
                    }}>
                        Propiedades
                    </h1>
                    <div style={{ marginLeft: 24 }}>
                        <button
                            onClick={() => window.location.href = '/cargarPropiedad'}
                            style={{
                                background: '#fde047',
                                color: '#b45309',
                                border: 'none',
                                borderRadius: 12,
                                fontWeight: 900,
                                fontSize: 18,
                                padding: '18px 32px',
                                display: 'flex',
                                alignItems: 'center',
                                boxShadow: '0 2px 8px #fef08a',
                                cursor: 'pointer',
                                gap: 10,
                                fontFamily: 'inherit'
                            }}
                        >
                            <span style={{
                                fontSize: 28,
                                fontWeight: 900,
                                marginRight: 8,
                                lineHeight: 1
                            }}>+</span>
                            <span style={{ fontWeight: 900, fontSize: 18 }}>Cargar Propiedad</span>
                        </button>
                    </div>
                </div>
                {/* Buscadores en bloque ancho */}
                <div style={{
                    width: '100%',
                    maxWidth: 1200,
                    background: '#f3f4f6',
                    borderRadius: 14,
                    padding: '32px 40px 28px 40px',
                    marginBottom: 32,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 24,
                    boxSizing: 'border-box',
                    boxShadow: '0 1px 4px #e5e7eb'
                }}>
                    <div style={{
                        display: 'flex',
                        gap: 32,
                        width: '100%',
                        justifyContent: 'flex-start'
                    }}>
                        {/* Buscador por título */}
                        <div style={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 8,
                            minWidth: 260
                        }}>
                            <label style={{
                                fontWeight: 700,
                                color: '#fb923c',
                                marginBottom: 2,
                                fontSize: 17
                            }}>Buscar por nombre</label>
                            <div style={{ position: 'relative', width: '100%' }}>
                                <input
                                    type="text"
                                    placeholder=""
                                    value={busqueda}
                                    onChange={e => setBusqueda(e.target.value)}
                                    style={{
                                        padding: '18px 16px 18px 44px',
                                        borderRadius: 10,
                                        border: '1.5px solid #fb923c',
                                        width: '100%',
                                        color: 'black',
                                        background: '#fff',
                                        outline: 'none',
                                        fontWeight: 500,
                                        fontSize: 20,
                                        boxShadow: 'none'
                                    }}
                                />
                                <span style={{
                                    position: 'absolute',
                                    left: 14,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    pointerEvents: 'none',
                                    color: '#fb923c'
                                }}>
                                    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <circle cx="11" cy="11" r="7" />
                                        <line x1="16.5" y1="16.5" x2="21" y2="21" />
                                    </svg>
                                </span>
                            </div>
                        </div>
                        {/* Buscador por ID */}
                        <div style={{
                            width: 180,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 8
                        }}>
                            <label style={{
                                fontWeight: 700,
                                color: '#fb923c',
                                marginBottom: 2,
                                fontSize: 17
                            }}>Buscar por ID</label>
                            <div style={{ position: 'relative', width: '100%' }}>
                                <input
                                    type="text"
                                    placeholder=""
                                    value={busquedaId}
                                    onChange={e => setBusquedaId(e.target.value)}
                                    style={{
                                        padding: '18px 16px 18px 44px',
                                        borderRadius: 10,
                                        border: '1.5px solid #fb923c',
                                        width: '100%',
                                        color: 'black',
                                        background: '#fff',
                                        outline: 'none',
                                        fontWeight: 500,
                                        fontSize: 20,
                                        boxShadow: 'none'
                                    }}
                                />
                                <span style={{
                                    position: 'absolute',
                                    left: 14,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    pointerEvents: 'none',
                                    color: '#fb923c'
                                }}>
                                    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <circle cx="11" cy="11" r="7" />
                                        <line x1="16.5" y1="16.5" x2="21" y2="21" />
                                    </svg>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Grilla de propiedades en recuadro gris oscuro */}
                <div
                    style={{
                        width: '100%',
                        background: '#e5e7eb',
                        borderRadius: 16,
                        padding: '36px 32px',
                        marginBottom: 32,
                        minHeight: 400,
                        boxSizing: 'border-box'
                    }}
                >
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
                                onClick={e => {
                                    if ((e.target as HTMLElement).closest('.menu-opciones')) return;
                                    handleCardClick(prop.id);
                                }}
                                style={{
                                    background: '#f3f4f6',
                                    borderRadius: 12,
                                    boxShadow: '0 1px 4px #e5e7eb',
                                    padding: 20,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    position: 'relative',
                                    minHeight: 340,
                                    width: '100%',
                                    maxWidth: 340,
                                    cursor: 'pointer',
                                    border: 'none',
                                    transition: 'box-shadow 0.2s, border 0.2s',
                                }}
                                tabIndex={0}
                                aria-label={`Ver propiedad ${prop.titulo}`}
                            >
                                {/* Botón de tres puntos grande, a la derecha */}
                                <div
                                    className="menu-opciones"
                                    style={{
                                        position: 'absolute',
                                        top: 260,
                                        right: 24,
                                        zIndex: 20,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <button
                                        onClick={e => {
                                            e.stopPropagation();
                                            setMenuAbierto(menuAbierto === prop.id ? null : Number(prop.id));
                                        }}
                                        style={{
                                            width: 48,
                                            height: 48,
                                            borderRadius: '50%',
                                            background: '#fff',
                                            border: '2.5px solid #fb923c',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: 34,
                                            color: '#fb923c',
                                            cursor: 'pointer',
                                            boxShadow: '0 2px 8px #f3f4f6',
                                            transition: 'border 0.2s'
                                        }}
                                        aria-label="Opciones"
                                    >
                                        <span style={{ fontWeight: 900, fontSize: 34, letterSpacing: 2 }}>⋮</span>
                                    </button>
                                    {menuAbierto === Number(prop.id) && (
                                        <>
                                            {/* Overlay para cerrar el menú solo si se hace click fuera del menú */}
                                            <div
                                                onClick={() => setMenuAbierto(null)}
                                                style={{
                                                    position: 'fixed',
                                                    inset: 0,
                                                    zIndex: 9,
                                                    background: 'transparent'
                                                }}
                                            />
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    top: 56,
                                                    right: 0,
                                                    background: '#fff',
                                                    border: '1px solid #f3f4f6',
                                                    borderRadius: 8,
                                                    boxShadow: '0 2px 8px #f3f4f6',
                                                    zIndex: 10,
                                                    minWidth: 180,
                                                }}
                                                onClick={e => e.stopPropagation()} // Evita que el click en el menú cierre el menú
                                            >
                                                <button
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                        handleEliminar(prop.id);
                                                        setMenuAbierto(null);
                                                    }}
                                                    style={{
                                                        width: '100%',
                                                        padding: '16px 20px',
                                                        background: 'none',
                                                        border: 'none',
                                                        color: '#ef4444',
                                                        fontWeight: 700,
                                                        textAlign: 'left',
                                                        cursor: 'pointer',
                                                        borderBottom: '1px solid #f3f4f6',
                                                        fontSize: 18
                                                    }}
                                                >
                                                    Eliminar propiedad
                                                </button>
                                                <button
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                        handleModificar(prop.id);
                                                        setMenuAbierto(null);
                                                    }}
                                                    style={{
                                                        width: '100%',
                                                        padding: '16px 20px',
                                                        background: '#fde047',
                                                        border: 'none',
                                                        color: '#b45309',
                                                        fontWeight: 700,
                                                        textAlign: 'left',
                                                        cursor: 'pointer',
                                                        fontSize: 18,
                                                        borderRadius: '0 0 8px 8px'
                                                    }}
                                                >
                                                    Modificar propiedad
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <img
                                    src={prop.fotos?.[0]?.imagen || '/no-image.png'}
                                    alt={prop.titulo}
                                    style={{
                                        width: '100%',
                                        height: 160,
                                        objectFit: 'cover',
                                        borderRadius: 8,
                                        marginBottom: 16,
                                        background: '#fff',
                                        border: '2px solid #fb923c'
                                    }}
                                />
                                <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8, color: '#fb923c' }}>
                                    {prop.titulo}
                                </div>
                                <div style={{ color: '#ea580c', fontWeight: 700, marginBottom: 8 }}>
                                    ${prop.precio} / día
                                </div>
                                <div style={{ color: '#888', fontSize: 15, marginBottom: 8 }}>
                                    ID: {prop.id}
                                </div>
                                {/* Tipo de propiedad en negrita abajo de todo */}
                                <div style={{
                                    fontWeight: 900,
                                    color: '#fb923c',
                                    fontSize: 17,
                                    marginTop: 'auto',
                                    marginBottom: 0,
                                    textTransform: 'capitalize'
                                }}>
                                    {prop.tipoPropiedad || 'Tipo desconocido'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}