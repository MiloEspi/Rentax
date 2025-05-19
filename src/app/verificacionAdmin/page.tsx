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

    // Redirige al home si ya está logueado
    useEffect(() => {
        if (localStorage.getItem('isLoggedIn') === 'true') {
            router.replace('/');
        }
    }, [router]);

    // Envía el código al cargar la página
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
        // Validar el código con el backend
        const res = await fetch('http://localhost:8000/validarCodigo/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, codigo }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
            localStorage.setItem('isLoggedIn', 'true');                        
            localStorage.setItem('isAdmin', 'true'); // <-- ESTA LÍNEA AGREGA EL FLAG DE ADMIN
            localStorage.removeItem('adminEmail');

            window.location.href = '/';
        } else {
            setError(data.error || "Código incorrecto.");
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "60px auto", padding: 24, border: "1px solid #eee", borderRadius: 8, boxShadow: "0 2px 8px #eee" }}>
            <h2>Verificación en dos pasos</h2>
            <p>Ingrese el código que se ha enviado a tu mail.</p>
            {loading && <div>Enviando código...</div>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={codigo}
                    onChange={e => setCodigo(e.target.value)}
                    placeholder="Código de verificación"
                    style={{ width: "100%", padding: 8, marginBottom: 12, borderRadius: 4, border: "1px solid #ccc" }}
                />
                {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
                <button type="submit" style={{ width: "100%", padding: 10, borderRadius: 4, background: "#0070f3", color: "#fff", border: "none" }}>
                    Verificar
                </button>
            </form>
            {enviado && <div style={{ color: "green", marginTop: 16 }}>¡Código enviado al mail!</div>}
        </div>
    );
}


