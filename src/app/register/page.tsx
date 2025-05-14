'use client';
import React, { useState } from 'react';

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

    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

    const validateForm = () => {
        // Validar campos obligatorios
        if (!form.nombre) return 'El nombre es obligatorio';
        if (!form.apellido) return 'El apellido es obligatorio';
        if (!form.email) return 'El correo electrónico es obligatorio';
        if (!form.password) return 'La contraseña es obligatoria';
        if (!form.dni) return 'El DNI es obligatorio';
        if (!form.sexo) return 'El sexo es obligatorio';
        if (!form.fecha_nacimiento) return 'La fecha de nacimiento es obligatoria';
    
        // Validar formatos o restricciones
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
            // Transformar los datos para enviarlos en el formato esperado por el backend
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

                }
                else {
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
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <form
                onSubmit={handleSubmit}
                style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}
            >
                <h1 style={{ textAlign: 'center' }}>Registro</h1>
                <label style={{ fontWeight: 'bold', color: fieldErrors.nombre ? 'red' : undefined }}>Nombre</label>
                <input
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    type="text"
                    placeholder="Nombre"
                    style={{
                        borderColor: fieldErrors.nombre ? 'red' : undefined,
                        borderRadius: '8px',
                        borderWidth: '1px',
                        padding: '0.5rem',
                    }}
                />
                {fieldErrors.nombre && <p style={{ color: 'red' }}>{fieldErrors.nombre}</p>}

                <label style={{ fontWeight: 'bold', color: fieldErrors.apellido ? 'red' : undefined }}>Apellido</label>
                <input
                    name="apellido"
                    value={form.apellido}
                    onChange={handleChange}
                    type="text"
                    placeholder="Apellido"
                    style={{
                        borderColor: fieldErrors.apellido ? 'red' : undefined,
                        borderRadius: '8px',
                        borderWidth: '1px',
                        padding: '0.5rem',
                    }}
                />
                {fieldErrors.apellido && <p style={{ color: 'red' }}>{fieldErrors.apellido}</p>}

                <label style={{ fontWeight: 'bold', color: fieldErrors.email ? 'red' : undefined }}>Correo electrónico</label>
                <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    type="text"
                    placeholder="Correo electrónico"
                    style={{
                        borderColor: fieldErrors.email ? 'red' : undefined,
                        borderRadius: '8px',
                        borderWidth: '1px',
                        padding: '0.5rem',
                    }}
                />
                {fieldErrors.email && <p style={{ color: 'red' }}>{fieldErrors.email}</p>}

                <div style={{ position: 'relative' }}>
                    <label style={{ fontWeight: 'bold', color: fieldErrors.password ? 'red' : undefined }}>Contraseña</label>
                    <input
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Contraseña"
                        value={form.password}
                        onChange={handleChange}
                        style={{
                            borderColor: fieldErrors.password ? 'red' : undefined,
                            borderRadius: '8px',
                            borderWidth: '1px',
                            padding: '0.5rem',
                            fontSize: '1rem',
                            width: '100%',
                        }}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                            position: 'absolute',
                            right: '0.5rem',
                            top: '70%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            color: '#007BFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                        }}
                    >
                        {showPassword ? 'Ocultar' : 'Mostrar'}
                    </button>
                </div>
                {fieldErrors.password && <p style={{ color: 'red' }}>{fieldErrors.password}</p>}

                <label style={{ fontWeight: 'bold', color: fieldErrors.dni ? 'red' : undefined }}>DNI</label>
                <input
                    name="dni"
                    value={form.dni}
                    onChange={handleChange}
                    type="text"
                    placeholder="DNI"
                    style={{
                        borderColor: fieldErrors.dni ? 'red' : undefined,
                        borderRadius: '8px',
                        borderWidth: '1px',
                        padding: '0.5rem',
                    }}
                />
                {fieldErrors.dni && <p style={{ color: 'red' }}>{fieldErrors.dni}</p>}

                <label style={{ fontWeight: 'bold', color: fieldErrors.sexo ? 'red' : undefined }}>Sexo</label>
                <select
                    name="sexo"
                    value={form.sexo}
                    onChange={handleChange}
                    style={{
                        borderColor: fieldErrors.sexo ? 'red' : undefined,
                        borderRadius: '8px',
                        borderWidth: '1px',
                        padding: '0.5rem',
                    }}
                >
                    <option value="">Sexo</option>
                    <option value="male">Masculino</option>
                    <option value="female">Femenino</option>
                    <option value="other">Otro</option>
                </select>
                {fieldErrors.sexo && <p style={{ color: 'red' }}>{fieldErrors.sexo}</p>}

                <label style={{ fontWeight: 'bold', color: fieldErrors.fecha_nacimiento ? 'red' : undefined }}>Fecha de nacimiento</label>
                <input
                    name="fecha_nacimiento"
                    value={form.fecha_nacimiento}
                    onChange={handleChange}
                    type="date"
                    placeholder="Fecha de nacimiento"
                    style={{
                        borderColor: fieldErrors.fecha_nacimiento ? 'red' : undefined,
                        borderRadius: '8px',
                        borderWidth: '1px',
                        padding: '0.5rem',
                    }}
                />
                {fieldErrors.fecha_nacimiento && <p style={{ color: 'red' }}>{fieldErrors.fecha_nacimiento}</p>}

                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                        padding: '0.5rem',
                        fontSize: '1rem',
                        backgroundColor: '#007BFF',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    }}
                >
                    {isSubmitting ? 'Registrando...' : 'Registrarse'}
                </button>
            </form>
        </div>
    );
}