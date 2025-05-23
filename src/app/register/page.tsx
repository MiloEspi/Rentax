'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
    const [form, setForm] = useState({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        dni: '',
        sexo: '',
        fecha_nacimiento: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
    const router = useRouter();

    useEffect(() => {
        if (localStorage.getItem('isLoggedIn') === 'true') {
            router.replace('/');
        }
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const calculateAge = (birthDate: string): number => {
        const birthDateObj = new Date(birthDate);
        const today = new Date();
        let age = today.getFullYear() - birthDateObj.getFullYear();
        const month = today.getMonth() - birthDateObj.getMonth();
        if (month < 0 || (month === 0 && today.getDate() < birthDateObj.getDate())) {
            age--;
        }
        return age;
    };

    const validateForm = () => {
        if (!form.nombre) return 'El nombre es obligatorio';
        if (!form.apellido) return 'El apellido es obligatorio';
        if (!form.email) return 'El correo electrónico es obligatorio';
        if (!form.password) return 'La contraseña es obligatoria';
        if (!form.dni) return 'El DNI es obligatorio';
        if (!form.sexo) return 'El sexo es obligatorio';
        if (!form.fecha_nacimiento) return 'La fecha de nacimiento es obligatoria';

        if (!form.email.includes('@')) return 'El correo electrónico no es válido';
        if (form.password.length < 8) return 'La contraseña debe tener al menos 8 caracteres';

        const age = calculateAge(form.fecha_nacimiento);
        if (age < 18) return 'Debes tener al menos 18 años';

        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formError = validateForm();
        if (formError) {
            setError(formError);
            return;
        }

        setError('');
        setSuccess('');
        setIsSubmitting(true);

        try {
            const payload = {
                persona: { ...form }
            };

            console.log('Datos enviados:', payload);
            const res = await fetch('http://localhost:8000/registro/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                setSuccess('Usuario registrado correctamente');
                window.location.href = '/login';
            } else {
                const errorData = await res.json();
                if (errorData.persona && errorData.persona.dni) {
                    setError(errorData.persona.dni);
                } else if (errorData.persona && errorData.persona.email) {
                    setError(errorData.persona.email);
                } else {
                    setError(errorData.message || 'Hubo un error al registrar el usuario');
                }
            }
        } catch (err: unknown) {
            console.error(err);
            setError('Hubo un error al registrar el usuario');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#FFFFFF' }}>
            <form
                onSubmit={handleSubmit}
                style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '600px', padding: '2rem', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}
            >
                <h1 style={{ textAlign: 'center', fontSize: '2rem', color: '#FFA726', marginBottom: '1rem' }}>Registrarme</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ fontWeight: 'bold', color: fieldErrors.nombre ? 'red' : '#000' }}>Nombre</label>
                            <input
                                name="nombre"
                                value={form.nombre}
                                onChange={handleChange}
                                type="text"
                                placeholder="Nombre"
                                style={{
                                    borderColor: fieldErrors.nombre ? 'red' : '#FFA726',
                                    borderRadius: '8px',
                                    borderWidth: '1px',
                                    padding: '0.5rem',
                                    color: '#000',
                                    width: '100%',
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ fontWeight: 'bold', color: fieldErrors.email ? 'red' : '#000' }}>Correo electrónico</label>
                            <input
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                type="text"
                                placeholder="Correo electrónico"
                                style={{
                                    borderColor: fieldErrors.email ? 'red' : '#FFA726',
                                    borderRadius: '8px',
                                    borderWidth: '1px',
                                    padding: '0.5rem',
                                    color: '#000',
                                    width: '100%',
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ fontWeight: 'bold', color: fieldErrors.dni ? 'red' : '#000' }}>DNI</label>
                            <input
                                name="dni"
                                value={form.dni}
                                onChange={handleChange}
                                type="text"
                                placeholder="DNI"
                                style={{
                                    borderColor: fieldErrors.dni ? 'red' : '#FFA726',
                                    borderRadius: '8px',
                                    borderWidth: '1px',
                                    padding: '0.5rem',
                                    color: '#000',
                                    width: '100%',
                                }}
                            />
                        </div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ fontWeight: 'bold', color: fieldErrors.apellido ? 'red' : '#000' }}>Apellido</label>
                            <input
                                name="apellido"
                                value={form.apellido}
                                onChange={handleChange}
                                type="text"
                                placeholder="Apellido"
                                style={{
                                    borderColor: fieldErrors.apellido ? 'red' : '#FFA726',
                                    borderRadius: '8px',
                                    borderWidth: '1px',
                                    padding: '0.5rem',
                                    color: '#000',
                                    width: '100%',
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ fontWeight: 'bold', color: fieldErrors.password ? 'red' : '#000' }}>Contraseña</label>
                            <input
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Contraseña"
                                value={form.password}
                                onChange={handleChange}
                                style={{
                                    borderColor: fieldErrors.password ? 'red' : '#FFA726',
                                    borderRadius: '8px',
                                    borderWidth: '1px',
                                    padding: '0.5rem',
                                    color: '#000',
                                    width: '100%',
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ fontWeight: 'bold', color: fieldErrors.fecha_nacimiento ? 'red' : '#000' }}>Fecha de nacimiento</label>
                            <input
                                name="fecha_nacimiento"
                                value={form.fecha_nacimiento}
                                onChange={handleChange}
                                type="date"
                                placeholder="Fecha de nacimiento"
                                style={{
                                    borderColor: fieldErrors.fecha_nacimiento ? 'red' : '#FFA726',
                                    borderRadius: '8px',
                                    borderWidth: '1px',
                                    padding: '0.5rem',
                                    color: '#000',
                                    width: '100%',
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <label style={{ fontWeight: 'bold', color: fieldErrors.sexo ? 'red' : '#000' }}>Sexo</label>
                    <select
                        name="sexo"
                        value={form.sexo}
                        onChange={handleChange}
                        style={{
                            borderColor: fieldErrors.sexo ? 'red' : '#FFA726',
                            borderRadius: '8px',
                            borderWidth: '1px',
                            padding: '0.5rem',
                            color: '#000',
                            width: '100%',
                        }}
                    >
                        <option value="">Sexo</option>
                        <option value="male">Masculino</option>
                        <option value="female">Femenino</option>
                        <option value="other">Otro</option>
                    </select>
                </div>
                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                {success && <p style={{ color: 'green', textAlign: 'center' }}>{success}</p>}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                        padding: '0.5rem',
                        fontSize: '1rem',
                        backgroundColor: '#FFA726',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        width: '100%',
                    }}
                >
                    {isSubmitting ? 'Registrando...' : 'Registrarse'}
                </button>
            </form>
        </div>
    );
}
