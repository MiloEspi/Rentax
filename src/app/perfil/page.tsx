'use client';
import React, { useState, useEffect } from 'react';

const generos = [
    { value: '', label: 'Seleccionar' },
    { value: 'masculino', label: 'Masculino' },
    { value: 'femenino', label: 'Femenino' },
    { value: 'otro', label: 'Otro' },
];

const esMayorDeEdad = (fecha: string) => {
    if (!fecha) return false;
    const hoy = new Date();
    const nacimiento = new Date(fecha);
    const edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
        return edad - 1 >= 18;
    }
    return edad >= 18;
};

const PerfilPage = () => {
    const [email, setEmail] = useState('');
    const [user, setUser] = useState({
        nombre: '',
        apellido: '',
        email: '',
        fechaNacimiento: '',
        genero: '',
        dni: ''
    });

    const [originalUser, setOriginalUser] = useState(user);

    const [editando, setEditando] = useState(false);
    const [password, setPassword] = useState('');
    const [errores, setErrores] = useState({ password: '', fechaNacimiento: '' });
    const [successMsg, setSuccessMsg] = useState('');

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedEmail = localStorage.getItem('userEmail');
        if (storedEmail) {
            setEmail(storedEmail);
            setUser(u => ({ ...u, email: storedEmail }));
        }
    }, []);

    const cargarPerfil = (email: string) => {
        setLoading(true);
        fetch('http://localhost:8000/perfil/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    const persona = data.persona;
                    let genero = '';
                    if (['masculino', 'femenino', 'otro'].includes((persona.sexo || '').toLowerCase())) {
                        genero = persona.sexo.toLowerCase();
                    }
                    const newUser = {
                        nombre: persona.nombre,
                        apellido: persona.apellido,
                        email: persona.email,
                        fechaNacimiento: persona.fecha_nacimiento,
                        genero: genero,
                        dni: persona.dni
                    };
                    setUser(newUser);
                    setOriginalUser(newUser);
                } else {
                    alert('No se pudo cargar el perfil');
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error al cargar el perfil:', error);
                setLoading(false);
            });
    };

    useEffect(() => {
        if (email) cargarPerfil(email);
    }, [email]);

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleEdit = () => {
        setOriginalUser(user);
        setEditando(true);
    };

    const handleCancel = () => {
        setUser(originalUser);
        setEditando(false);
        setPassword('');
        setErrores({ password: '', fechaNacimiento: '' });
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        let valid = true;
        let passwordError = '';
        let fechaNacimientoError = '';

        if (password && password.length < 8) {
            passwordError = 'La contraseña debe tener al menos 8 caracteres.';
            valid = false;
        }
        if (!esMayorDeEdad(user.fechaNacimiento)) {
            fechaNacimientoError = 'Debes ser mayor de 18 años.';
            valid = false;
        }

        setErrores({ password: passwordError, fechaNacimiento: fechaNacimientoError });

        if (!valid) return;

        fetch('http://localhost:8000/perfil/', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: user.email,
                nombre: user.nombre,
                apellido: user.apellido,
                fecha_nacimiento: user.fechaNacimiento,
                sexo: user.genero,
                password: password,
            }),
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setEditando(false);
                    setPassword('');
                    setSuccessMsg('Perfil actualizado correctamente');
                    cargarPerfil(user.email);
                    setTimeout(() => setSuccessMsg(''), 3000);
                } else {
                    alert('Error al actualizar el perfil: ' + data.error);
                }
            })
            .catch(error => {
                console.error('Error al actualizar el perfil:', error);
                alert('Error al actualizar el perfil');
            });
    };

    if (loading) return <p>Cargando perfil...</p>;

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <div style={{
                width: 500,
                background: '#fff',
                borderRadius: 16,
                boxShadow: '0 8px 32px rgba(60,60,120,0.12)',
                padding: 40,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                <h2 style={{
                    fontSize: 32,
                    fontWeight: 700,
                    marginBottom: 24,
                    color: '#4f46e5',
                    letterSpacing: 1,
                }}>
                    Mi Perfil
                </h2>
                {successMsg && (
                    <div style={{
                        color: '#22c55e',
                        background: '#dcfce7',
                        border: '1px solid #bbf7d0',
                        borderRadius: 8,
                        padding: '12px 24px',
                        marginBottom: 20,
                        fontWeight: 600,
                        fontSize: 16,
                        textAlign: 'center'
                    }}>
                        {successMsg}
                    </div>
                )}
                <form onSubmit={handleSave} style={{ width: '100%' }}>
                    <div style={{ display: 'flex', gap: 24, marginBottom: 20 }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontWeight: 600, color: '#6366f1' }}>Nombre</label>
                            <input
                                type="text"
                                name="nombre"
                                value={user.nombre}
                                onChange={(e) => setUser({ ...user, nombre: e.target.value })}
                                disabled={!editando}
                                required
                                style={{
                                    width: '100%',
                                    padding: 10,
                                    borderRadius: 8,
                                    border: '1px solid #c7d2fe',
                                    marginTop: 4,
                                    background: editando ? '#f1f5ff' : '#f3f4f6',
                                    color: 'black'
                                }}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontWeight: 600, color: '#6366f1' }}>Apellido</label>
                            <input
                                type="text"
                                name="apellido"
                                value={user.apellido}
                                onChange={(e) => setUser({ ...user, apellido: e.target.value })}
                                disabled={!editando}
                                required
                                style={{
                                    width: '100%',
                                    padding: 10,
                                    borderRadius: 8,
                                    border: '1px solid #c7d2fe',
                                    marginTop: 4,
                                    background: editando ? '#f1f5ff' : '#f3f4f6',
                                    color: 'black'
                                }}
                            />
                        </div>
                    </div>
                    <div style={{ marginBottom: 20 }}>
                        <label style={{ fontWeight: 600, color: '#6366f1' }}>DNI</label>
                        <input
                            type="text"
                            value={user.dni}
                            disabled
                            style={{
                                width: '100%',
                                padding: 10,
                                borderRadius: 8,
                                border: '1px solid #c7d2fe',
                                marginTop: 4,
                                background: '#f3f4f6',
                                color: 'black'
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: 20 }}>
                        <label style={{ fontWeight: 600, color: '#6366f1' }}>Email</label>
                        <input
                            type="email"
                            value={user.email}
                            disabled
                            style={{
                                width: '100%',
                                padding: 10,
                                borderRadius: 8,
                                border: '1px solid #c7d2fe',
                                marginTop: 4,
                                background: '#f3f4f6',
                                color: 'black'
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: 24, marginBottom: 20 }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontWeight: 600, color: '#6366f1' }}>Fecha de nacimiento</label>
                            <input
                                type="date"
                                name="fechaNacimiento"
                                value={user.fechaNacimiento}
                                onChange={(e) => setUser({ ...user, fechaNacimiento: e.target.value })}
                                disabled={!editando}
                                required
                                style={{
                                    width: '100%',
                                    padding: 10,
                                    borderRadius: 8,
                                    border: '1px solid #c7d2fe',
                                    marginTop: 4,
                                    background: editando ? '#f1f5ff' : '#f3f4f6',
                                    color: 'black'
                                }}
                            />
                            {errores.fechaNacimiento && (
                                <div style={{ color: 'red', fontSize: 13, marginTop: 4 }}>{errores.fechaNacimiento}</div>
                            )}
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontWeight: 600, color: '#6366f1' }}>Género</label>
                            <select
                                name="genero"
                                value={user.genero}
                                onChange={(e) => setUser({ ...user, genero: e.target.value })}
                                disabled={!editando}
                                required
                                style={{
                                    width: '100%',
                                    padding: 10,
                                    borderRadius: 8,
                                    border: '1px solid #c7d2fe',
                                    marginTop: 4,
                                    background: editando ? '#f1f5ff' : '#f3f4f6',
                                    color: 'black'
                                }}
                            >
                                {generos.map((g) => (
                                    <option key={g.value} value={g.value}>{g.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div style={{ marginBottom: 28 }}>
                        <label style={{ fontWeight: 600, color: '#6366f1' }}>Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={handlePasswordChange}
                            disabled={!editando}
                            placeholder="Nueva contraseña"
                            style={{
                                width: '100%',
                                padding: 10,
                                borderRadius: 8,
                                border: '1px solid #c7d2fe',
                                marginTop: 4,
                                background: editando ? '#f1f5ff' : '#f3f4f6',
                                color: 'black'
                            }}
                        />
                        {errores.password && (
                            <div style={{ color: 'red', fontSize: 13, marginTop: 4 }}>{errores.password}</div>
                        )}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
                        {editando ? (
                            <>
                                <button
                                    type="submit"
                                    style={{
                                        padding: '10px 32px',
                                        background: '#22c55e',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: 8,
                                        fontWeight: 600,
                                        fontSize: 16,
                                        cursor: 'pointer',
                                        boxShadow: '0 2px 8px #bbf7d0',
                                    }}
                                >
                                    Actualizar Perfil
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    style={{
                                        padding: '10px 32px',
                                        background: '#f3f4f6',
                                        color: '#6366f1',
                                        border: '1px solid #c7d2fe',
                                        borderRadius: 8,
                                        fontWeight: 600,
                                        fontSize: 16,
                                        cursor: 'pointer',
                                        marginLeft: 8,
                                    }}
                                >
                                    Cancelar
                                </button>
                            </>
                        ) : null}
                    </div>
                </form>
                {!editando && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
                        <button
                            type="button"
                            onClick={handleEdit}
                            style={{
                                padding: '10px 32px',
                                background: '#6366f1',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 8,
                                fontWeight: 600,
                                fontSize: 16,
                                cursor: 'pointer',
                                boxShadow: '0 2px 8px #c7d2fe',
                            }}
                        >
                            Editar
                        </button>
                    </div>
                )}
                {/* Botón "Ver mis alquileres" */}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
                    <button
                        type="button"
                        onClick={() => window.location.href = '/misAlquileres'}
                        style={{
                            padding: '12px 36px',
                            background: '#22d3ee',
                            color: '#0f172a',
                            border: 'none',
                            borderRadius: 8,
                            fontWeight: 700,
                            fontSize: 18,
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px #bae6fd',
                            letterSpacing: 1,
                            transition: 'background 0.2s',
                        }}
                        onMouseOver={e => (e.currentTarget.style.background = '#06b6d4')}
                        onMouseOut={e => (e.currentTarget.style.background = '#22d3ee')}
                    >
                        Ver mis alquileres
                    </button>
                </div>

            </div>
        </div>
    );
};

export default PerfilPage;