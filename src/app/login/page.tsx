'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    // Redirige al home si ya está logueado
    useEffect(() => {
        if (localStorage.getItem('isLoggedIn') === 'true') {
            router.replace('/');
        }
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:8000/login/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                localStorage.setItem('isLoggedIn', 'true');
                window.location.href = '/';
            } else if (data.is_admin) {
                localStorage.setItem('adminEmail', email);
                window.location.href = '/verificacionAdmin';
            } else {
                setError(data.error || 'Credenciales incorrectas');
            }
        }
        catch (err: unknown) {
            if (err instanceof Error) {
                setError('Error de conexión con el servidor: ' + err.message);
            } else {
                setError('Error de conexión con el servidor');
            }
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#f5f5f5'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '400px',
                padding: '20px',
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
                border: error ? '2px solid #ff0000' : 'none'
            }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '20px', color: '#000' }}>Iniciar Sesión</h1>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px', textAlign: 'left' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#000' }}>Email</label>
                        <input
                            type="text"
                            placeholder="Acá va tu mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                                fontSize: '16px',
                                color: '#333',
                                backgroundColor: '#f9f9f9',
                            }}
                            onFocus={(e) => e.target.style.backgroundColor = '#e0e0e0'}
                            onBlur={(e) => e.target.style.backgroundColor = '#f9f9f9'}
                        />
                    </div>
                    <div style={{ marginBottom: '15px', textAlign: 'left' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#000' }}>Contraseña</label>
                        <input
                            type="password"
                            placeholder="Acá va tu contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                                fontSize: '16px',
                                color: '#333',
                                backgroundColor: '#f9f9f9',
                            }}
                            onFocus={(e) => e.target.style.backgroundColor = '#e0e0e0'}
                            onBlur={(e) => e.target.style.backgroundColor = '#f9f9f9'}
                        />
                    </div>
                    {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}
                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '10px',
                            backgroundColor: '#007bff',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '16px',
                            cursor: 'pointer'
                        }}
                    >
                        Iniciar Sesión
                    </button>
                </form>
            </div>
        </div>
    );
}