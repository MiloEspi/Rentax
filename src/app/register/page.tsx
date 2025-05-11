'use client';
import React, { useState } from 'react';
import axios from 'axios';

export default function Register() {
    const [form, setForm] = useState({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        edad: '',
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

    const validateForm = () => {
        if (form.password.length < 8) {
            return 'La contraseña debe tener al menos 8 caracteres';
        }
        if (!form.email.includes('@')) {
            return 'El correo electrónico no es válido';
        }
        if (!form.nombre || !form.apellido || !form.dni || !form.edad || !form.sexo || !form.fecha_nacimiento) {
            return 'Todos los campos son obligatorios';
        }
        const age = calculateAge(form.fecha_nacimiento);
        if (age < 18) {
            return 'Debes tener al menos 18 años para registrarte';
        }

        return '';
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
            const res = await axios.post('http://localhost:8000/api/register/', form);
            if (res.status === 201 || res.status === 200) {
                setSuccess('Usuario registrado correctamente');
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

                <input name="nombre" value={form.nombre} onChange={handleChange} type="text" placeholder="Nombre" />
                <input name="apellido" value={form.apellido} onChange={handleChange} type="text" placeholder="Apellido" />
                <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="Correo electrónico" />

                <div style={{ position: 'relative' }}>
                    <input
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Contraseña"
                        value={form.password}
                        onChange={handleChange}
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

                <input name="edad" value={form.edad} onChange={handleChange} type="number" placeholder="Edad" />
                <input name="dni" value={form.dni} onChange={handleChange} type="text" placeholder="DNI" />

                <select name="sexo" value={form.sexo} onChange={handleChange}>
                    <option value="">Sexo</option>
                    <option value="male">Masculino</option>
                    <option value="female">Femenino</option>
                    <option value="other">Otro</option>
                </select>

                <input
                    name="fecha_nacimiento"
                    value={form.fecha_nacimiento}
                    onChange={handleChange}
                    type="date"
                    placeholder="Fecha de nacimiento"
                />

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
