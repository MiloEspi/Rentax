import React from 'react';

export default function AboutPage(): React.ReactElement {
    return (
        <div className="about-container bg-white text-black p-8">
            <h1 className="about-title text-center text-4xl font-bold mb-6">Sobre Nosotros</h1>
            <p className="about-text mb-4">
                En AlquilerExpress creemos que cada espacio merece ser descubierto con facilidad y confianza.
                Nuestra misión es conectar a arrendadores e inquilinos de forma ágil, ofreciendo desde acogedoras
                viviendas hasta garajes estratégicos y locales comerciales listos para tu proyecto.
            </p>
            <p className="about-text mb-4">
                Con una plataforma intuitiva, podrás navegar entre miles de opciones con descripciones claras,
                fotos de alta calidad y valoraciones reales de otros usuarios. Publicar tu propiedad o reservar
                tu próximo espacio es tan sencillo como un par de clics: olvídate del papeleo complicado y aprovecha
                nuestra firma electrónica de contratos y pagos seguros a través de tu pasarela preferida.
            </p>
            <p className="about-text mb-4">
                La seguridad y la transparencia son pilares fundamentales. Verificamos cada perfil, protegemos tus
                datos con cifrado HTTPS y almacenamos las credenciales con algoritmos de hashing de última generación.
                Además, nuestro equipo de atención está disponible las 24 horas para acompañarte en cada paso y resolver
                cualquier duda.
            </p>
            <p className="about-text">
                AlquilerExpress no es solo un portal de alquiler; es una comunidad donde la confianza y la comodidad
                se dan la mano. Únete a nosotros y experimenta la forma más rápida y confiable de encontrar, publicar
                y gestionar tu espacio ideal—con la tranquilidad de contar siempre con un servicio profesional y cercano.
            </p>
        </div>
    );
}