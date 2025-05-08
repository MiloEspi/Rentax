'use client'
import React, { useState } from 'react';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres');
        } else {
            setError('');
            // Aquí puedes manejar el envío del formulario
            console.log('Formulario enviado');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <form
                onSubmit={handleSubmit}
                style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}
            >
                <h1 style={{ textAlign: 'center' }}>Registro</h1>
                <input type="text" placeholder="Nombre" style={{ padding: '0.5rem', fontSize: '1rem' }} />
                <input type="text" placeholder="Apellido" style={{ padding: '0.5rem', fontSize: '1rem' }} />
                <input type="email" placeholder="Correo electrónico" style={{ padding: '0.5rem', fontSize: '1rem' }} />
                <div style={{ position: 'relative' }}>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ padding: '0.5rem', fontSize: '1rem', width: '100%' }}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                            position: 'absolute',
                            right: '0.5rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            color: '#007BFF',
                        }}
                    >
                        {showPassword ? 'Ocultar' : 'Mostrar'}
                    </button>
                </div>
                {error && <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}
                <input type="number" placeholder="Edad" style={{ padding: '0.5rem', fontSize: '1rem' }} />
                <input type="text" placeholder="DNI" style={{ padding: '0.5rem', fontSize: '1rem' }} />
                <select style={{ padding: '0.5rem', fontSize: '1rem' }}>
                    <option value="">Sexo</option>
                    <option value="male">Masculino</option>
                    <option value="female">Femenino</option>
                    <option value="other">Otro</option>
                </select>
                <input type="date" placeholder="Fecha de nacimiento" style={{ padding: '0.5rem', fontSize: '1rem' }} />
                <button
                    type="submit"
                    style={{
                        padding: '0.5rem',
                        fontSize: '1rem',
                        backgroundColor: '#007BFF',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                >
                    Registrarse
                </button>
            </form>
        </div>
    );
}