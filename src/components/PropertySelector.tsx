'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

// Orden: Vivienda, Local, Cochera
const propertyTypes = [
    { label: 'Vivienda', value: 'vivienda' },
    { label: 'Local', value: 'local' },
    { label: 'Cochera', value: 'cochera' },
];

const PropertySelector: React.FC = () => {
    const router = useRouter();

    const handleClick = (value: string) => {
        router.push(`/BuscarPropiedades?tipo=${value}`);
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.header}>¿Qué tipo de propiedad estás buscando?</h2>
            <div style={styles.selectorContainer}>
                {propertyTypes.map((property, index) => (
                    <button
                        key={property.value}
                        type="button"
                        style={{
                            ...styles.property,
                            backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#FFFF99',
                            border: 'none',
                            outline: 'none',
                        }}
                        onClick={() => handleClick(property.value)}
                        onMouseEnter={e => {
                            (e.target as HTMLElement).style.backgroundColor = '#FFD700';
                            (e.target as HTMLElement).style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.2)';
                        }}
                        onMouseLeave={e => {
                            (e.target as HTMLElement).style.backgroundColor = index % 2 === 0 ? '#FFFFFF' : '#FFFF99';
                            (e.target as HTMLElement).style.boxShadow = 'none';
                        }}
                    >
                        {property.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        backgroundColor: '#FFFF99',
        padding: '20px',
        borderRadius: '8px',
    },
    header: {
        marginBottom: '20px',
        fontSize: '24px',
        fontWeight: 'bold' as const,
        color: '#333',
        textAlign: 'center' as const,
    },
    selectorContainer: {
        display: 'flex',
        justifyContent: 'space-around',
        width: '100%',
    },
    property: {
        flex: 1,
        textAlign: 'center' as const,
        padding: '20px',
        margin: '0 10px',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },
};

export default PropertySelector;