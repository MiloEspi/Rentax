'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VerificacionAdmin() {
    const [codigo, setCodigo] = useState("");
    const [error, setError] = useState("");
    const [enviado, setEnviado] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const email = typeof window !== "undefined" ? localStorage.getItem('adminEmail') : "";

    useEffect(() => {
        if (localStorage.getItem('isLoggedIn') === 'true') {
            router.replace('/');
        }
    }, [router]);

    useEffect(() => {
        if (email) {
            setLoading(true);
            fetch('http://localhost:8000/verificacionAdmin/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) setEnviado(true);
                else setError(data.error || "No se pudo enviar el código");
            })
            .catch(() => setError("No se pudo enviar el código"))
            .finally(() => setLoading(false));
        }
    }, [email]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (codigo.trim() === "") {
            setError("Por favor ingrese el código.");
            return;
        }
        const res = await fetch('http://localhost:8000/validarCodigo/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, codigo }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
            localStorage.setItem('isLoggedIn', 'true');                        
            localStorage.setItem('isAdmin', 'true');
            localStorage.removeItem('adminEmail');

            window.location.href = '/';
        } else {
            setError(data.error || "Código incorrecto.");
        }
    };

    return (
        <div style={{ 
            backgroundColor: "#fff", // Fondo blanco para toda la página
            minHeight: "100vh", 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center" 
        }}>
            <div style={{ 
                maxWidth: 400, 
                margin: "60px auto", 
                padding: 24, 
                borderRadius: 8, 
                backgroundColor: "#fff", 
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", 
                textAlign: "center" 
            }}>
                <h1 style={{ 
                    color: "#FFA500", // Naranja más amarillento
                    marginBottom: 24, 
                    fontSize: "1.5rem" 
                }}>
                    Ingrese el Código
                </h1>
                {loading && <div style={{ marginBottom: 16, color: "#FFA500" }}>Enviando código...</div>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={codigo}
                        onChange={e => setCodigo(e.target.value)}
                        placeholder="Código de verificación"
                        style={{ 
                            width: "100%", 
                            padding: 12, 
                            marginBottom: 16, 
                            borderRadius: 4, 
                            border: "1px solid #ccc", 
                            fontSize: "1rem", 
                            color: "#000" // Letras negras
                        }}
                    />
                    {error && <div style={{ color: "red", marginBottom: 16 }}>{error}</div>}
                    <button 
                        type="submit" 
                        style={{ 
                            width: "100%", 
                            padding: 12, 
                            borderRadius: 4, 
                            backgroundColor: "#FFA500", // Naranja más amarillento
                            color: "#fff", 
                            border: "none", 
                            fontSize: "1rem", 
                            cursor: "pointer" 
                        }}
                    >
                        Verificar Código
                    </button>
                </form>
                {enviado && <div style={{ color: "green", marginTop: 16 }}>¡Código enviado al mail!</div>}
            </div>
        </div>
    );
}
