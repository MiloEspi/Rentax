'use client';
import React from 'react';

type Review = { user: string; comment: string; rating: number };
type Question = { user: string; question: string; response?: string };

type Property = {
    id: string;
    title: string;
    description: string;
    mainImage?: string;
    images?: string[];
    ambientes?: number;
    huespedes?: number;
    banios?: number;
    precio?: number | string;
    reviews?: Review[];
    questions?: Question[];
    metros_cuadrados?: number;
    // ...otros campos posibles...
};

const RENTAX_RED = '#FF5722';
const RENTAX_LIGHT_RED = '#ffe6e0';
const RENTAX_GRAY = '#f5f6fa';
const RENTAX_DARK_GRAY = '#e3e4ea';

export default function PrimerPropiedad({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);

    const [property, setProperty] = React.useState<Property | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    const [selectedImageIdx, setSelectedImageIdx] = React.useState(0);
    const [modalOpen, setModalOpen] = React.useState(false);

    // Date selectors
    const [startDate, setStartDate] = React.useState<Date | null>(null);
    const [endDate, setEndDate] = React.useState<Date | null>(null);
    const [openStart, setOpenStart] = React.useState(false);
    const [openEnd, setOpenEnd] = React.useState(false);

    // Pregunta/comentario
    const [showQuestion, setShowQuestion] = React.useState(false);
    const [questionText, setQuestionText] = React.useState('');
    const [questions, setQuestions] = React.useState<Question[]>([]);

    // Fetch property data
    React.useEffect(() => {
        setLoading(true);
        setError(null);
        fetch(`http://localhost:8000/propiedades/${id}/`)
            .then(async res => {
                if (!res.ok) throw new Error('No se pudo cargar la propiedad');
                const data = await res.json();
                // Adaptar campos del backend a los del frontend
                setProperty({
                    id: data.id?.toString() ?? id,
                    title: data.titulo ?? data.title ?? '',
                    description: data.descripcion ?? '',
                    mainImage: data.fotos?.[0]?.imagen ?? undefined,
                    images: data.fotos?.map((f: any) => f.imagen) ?? [],
                    ambientes: data.ambientes,
                    huespedes: data.huespedes,
                    banios: data.banios,
                    precio: data.precio,
                    reviews: [], // Si tienes reviews en backend, cámbialo aquí
                    questions: [], // Si tienes preguntas en backend, cámbialo aquí
                    metros_cuadrados: data.metros_cuadrados,
                });
                setQuestions([]); // Si tienes preguntas en backend, cámbialo aquí
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [id]);

    function averageRating(reviews: Review[]) {
        if (!reviews.length) return 0;
        return (
            reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        );
    }

    function ratingDistribution(reviews: Review[]) {
        const dist = [0, 0, 0, 0, 0];
        reviews.forEach(r => {
            dist[r.rating - 1]++;
        });
        return dist;
    }

    function ArrowButton({
        direction,
        onClick,
        style = {},
        size = 44,
        ariaLabel,
    }: {
        direction: 'left' | 'right';
        onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
        style?: React.CSSProperties;
        size?: number;
        ariaLabel?: string;
    }) {
        return (
            <button
                onClick={onClick}
                style={{
                    position: 'absolute',
                    top: '50%',
                    [direction === 'left' ? 'left' : 'right']: -size / 1.2,
                    transform: 'translateY(-50%)',
                    background: '#fff',
                    border: `2.5px solid ${RENTAX_RED}`,
                    borderRadius: '50%',
                    width: size,
                    height: size,
                    fontSize: size * 0.65,
                    color: RENTAX_RED,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px #ff572233',
                    zIndex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    ...style,
                }}
                aria-label={ariaLabel}
            >
                {direction === 'left' ? '‹' : '›'}
            </button>
        );
    }

    function ImageModal({
        src,
        onClose,
        onPrev,
        onNext,
    }: {
        src: string;
        onClose: () => void;
        onPrev: () => void;
        onNext: () => void;
    }) {
        React.useEffect(() => {
            const handler = (e: KeyboardEvent) => {
                if (e.key === 'Escape') onClose();
                if (e.key === 'ArrowLeft') onPrev();
                if (e.key === 'ArrowRight') onNext();
            };
            window.addEventListener('keydown', handler);
            return () => window.removeEventListener('keydown', handler);
        }, [onClose, onPrev, onNext]);
        return (
            <div
                onClick={onClose}
                style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(30,30,30,0.85)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <div style={{ position: 'relative', maxWidth: '92vw', maxHeight: '88vh' }}>
                    <ArrowButton direction="left" onClick={e => { e.stopPropagation(); onPrev(); }} ariaLabel="Anterior" size={54} style={{ left: -60, background: RENTAX_LIGHT_RED }} />
                    <img
                        src={src}
                        alt="Vista grande"
                        style={{
                            maxWidth: '90vw',
                            maxHeight: '85vh',
                            borderRadius: 22,
                            boxShadow: '0 8px 32px #0008',
                            background: '#fff',
                            padding: 16,
                            border: `3px solid ${RENTAX_RED}`,
                            display: 'block',
                        }}
                        onClick={e => e.stopPropagation()}
                    />
                    <ArrowButton direction="right" onClick={e => { e.stopPropagation(); onNext(); }} ariaLabel="Siguiente" size={54} style={{ right: -60, background: RENTAX_LIGHT_RED }} />
                </div>
            </div>
        );
    }

    function Calendar({
        value,
        onChange,
        onClose,
        minDate,
        maxDate,
    }: {
        value: Date | null;
        onChange: (date: Date) => void;
        onClose: () => void;
        minDate?: Date;
        maxDate?: Date;
    }) {
        const [current, setCurrent] = React.useState(() => {
            const d = value || new Date();
            return new Date(d.getFullYear(), d.getMonth(), 1);
        });

        React.useEffect(() => {
            function handleClick(e: MouseEvent) {
                if (!(e.target as HTMLElement).closest('.calendar-popup')) {
                    onClose();
                }
            }
            document.addEventListener('mousedown', handleClick);
            return () => document.removeEventListener('mousedown', handleClick);
        }, [onClose]);

        const daysInMonth = (year: number, month: number) =>
            new Date(year, month + 1, 0).getDate();

        const handleSelect = (day: number) => {
            const date = new Date(current.getFullYear(), current.getMonth(), day);
            if (
                (minDate && date < minDate) ||
                (maxDate && date > maxDate)
            ) return;
            onChange(date);
            onClose();
        };

        const days = [];
        const firstDay = new Date(current.getFullYear(), current.getMonth(), 1).getDay();
        for (let i = 0; i < firstDay; i++) days.push(null);
        for (let d = 1; d <= daysInMonth(current.getFullYear(), current.getMonth()); d++) {
            days.push(d);
        }

        return (
            <div
                className="calendar-popup"
                style={{
                    position: 'absolute',
                    top: 48,
                    left: 0,
                    zIndex: 10,
                    background: '#fff',
                    border: `2px solid ${RENTAX_RED}`,
                    borderRadius: 12,
                    boxShadow: '0 4px 24px #0003',
                    padding: 18,
                    width: 270,
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <button
                        onClick={() =>
                            setCurrent(
                                new Date(current.getFullYear(), current.getMonth() - 1, 1)
                            )
                        }
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: 22,
                            cursor: 'pointer',
                            color: RENTAX_RED,
                            fontWeight: 700,
                        }}
                    >
                        ‹
                    </button>
                    <span style={{ fontWeight: 700, color: RENTAX_RED }}>
                        {current.toLocaleString('es-ES', {
                            month: 'long',
                            year: 'numeric',
                        })}
                    </span>
                    <button
                        onClick={() =>
                            setCurrent(
                                new Date(current.getFullYear(), current.getMonth() + 1, 1)
                            )
                        }
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: 22,
                            cursor: 'pointer',
                            color: RENTAX_RED,
                            fontWeight: 700,
                        }}
                    >
                        ›
                    </button>
                </div>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        gap: 4,
                        marginBottom: 4,
                        fontSize: 15,
                        color: RENTAX_RED,
                        fontWeight: 700,
                        letterSpacing: 1,
                    }}
                >
                    {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((d) => (
                        <div key={d} style={{ textAlign: 'center' }}>
                            {d}
                        </div>
                    ))}
                </div>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        gap: 4,
                    }}
                >
                    {days.map((d, i) =>
                        d ? (
                            <button
                                key={i}
                                onClick={() => handleSelect(d)}
                                disabled={
                                    (minDate && new Date(current.getFullYear(), current.getMonth(), d) < minDate) ||
                                    (maxDate && new Date(current.getFullYear(), current.getMonth(), d) > maxDate)
                                }
                                style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: 8,
                                    border: value &&
                                        value.getDate() === d &&
                                        value.getMonth() === current.getMonth() &&
                                        value.getFullYear() === current.getFullYear()
                                        ? `2.5px solid ${RENTAX_RED}`
                                        : '1.5px solid #e0e0e0',
                                    background:
                                        value &&
                                        value.getDate() === d &&
                                        value.getMonth() === current.getMonth() &&
                                        value.getFullYear() === current.getFullYear()
                                            ? RENTAX_LIGHT_RED
                                            : '#fafafa',
                                    color: '#222',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    opacity:
                                        (minDate && new Date(current.getFullYear(), current.getMonth(), d) < minDate) ||
                                        (maxDate && new Date(current.getFullYear(), current.getMonth(), d) > maxDate)
                                            ? 0.4
                                            : 1,
                                }}
                            >
                                {d}
                            </button>
                        ) : (
                            <div key={i} />
                        )
                    )}
                </div>
            </div>
        );
    }

    function DateSelector({
        label,
        value,
        onChange,
        minDate,
        maxDate,
        open,
        setOpen,
    }: {
        label: string;
        value: Date | null;
        onChange: (date: Date) => void;
        minDate?: Date;
        maxDate?: Date;
        open: boolean;
        setOpen: (open: boolean) => void;
    }) {
        return (
            <div style={{ position: 'relative', marginBottom: 0 }}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: `linear-gradient(135deg, #fff 60%, ${RENTAX_LIGHT_RED} 100%)`,
                        border: `2.5px solid ${RENTAX_RED}`,
                        borderRadius: 12,
                        padding: '14px 18px',
                        boxShadow: '0 2px 8px #0001',
                        minWidth: 220,
                        cursor: 'pointer',
                        gap: 16,
                        fontWeight: 700,
                    }}
                    onClick={() => setOpen(true)}
                >
                    <div
                        style={{
                            background: RENTAX_RED,
                            color: '#fff',
                            borderRadius: 8,
                            padding: '8px 18px',
                            fontWeight: 800,
                            fontSize: 16,
                            letterSpacing: 1,
                            boxShadow: '0 1px 4px #0002',
                            marginRight: 12,
                            minWidth: 70,
                            textAlign: 'center',
                        }}
                    >
                        {label}
                    </div>
                    <div style={{ fontSize: 17, color: value ? '#222' : '#888' }}>
                        {value
                            ? value.toLocaleDateString('es-ES', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                              })
                            : `Seleccionar fecha`}
                    </div>
                    <span style={{ marginLeft: 'auto', color: RENTAX_RED, fontSize: 20 }}>📅</span>
                </div>
                {open && (
                    <Calendar
                        value={value}
                        onChange={onChange}
                        onClose={() => setOpen(false)}
                        minDate={minDate}
                        maxDate={maxDate}
                    />
                )}
            </div>
        );
    }

    function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
        return (
            <div style={{ background: RENTAX_DARK_GRAY, borderRadius: 8, height: 12, width: 120, marginLeft: 8, marginRight: 8 }}>
                <div
                    style={{
                        width: `${(value / max) * 100}%`,
                        background: color,
                        height: '100%',
                        borderRadius: 8,
                        transition: 'width 0.3s',
                    }}
                />
            </div>
        );
    }

    const avg = averageRating(property?.reviews ?? []);
    const dist = ratingDistribution(property?.reviews ?? []);
    const maxVotes = Math.max(...dist, 1);

    // Navegación imágenes
    const goPrev = React.useCallback(
        () =>
            setSelectedImageIdx(i =>
                property?.images && property.images.length
                    ? i === 0
                        ? property.images.length - 1
                        : i - 1
                    : 0
            ),
        [property?.images]
    );
    const goNext = React.useCallback(
        () =>
            setSelectedImageIdx(i =>
                property?.images && property.images.length
                    ? i === property.images.length - 1
                        ? 0
                        : i + 1
                    : 0
            ),
        [property?.images]
    );

    // Evitar superposición de calendarios
    React.useEffect(() => {
        if (openStart) setOpenEnd(false);
        if (openEnd) setOpenStart(false);
    }, [openStart, openEnd]);

    // Agregar pregunta
    const handleAddQuestion = () => {
        if (questionText.trim()) {
            setQuestions(qs => [...qs, { user: 'Tú', question: questionText }]);
            setQuestionText('');
            setShowQuestion(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-2xl text-gray-600">
                Cargando propiedad...
            </div>
        );
    }
    if (error || !property) {
        return (
            <div className="min-h-screen flex items-center justify-center text-2xl text-red-600">
                {error || 'No se encontró la propiedad'}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 font-sans py-10">
            <div
                style={{
                    maxWidth: 1300,
                    margin: '40px auto',
                    background: `linear-gradient(120deg, #fff 70%, ${RENTAX_LIGHT_RED} 100%)`,
                    borderRadius: 28,
                    boxShadow: '0 8px 32px #0002',
                    padding: 38,
                    border: `2.5px solid ${RENTAX_RED}`,
                }}
            >
                {/* Visualizador de imágenes */}
                <div
                    style={{
                        background: `linear-gradient(120deg, ${RENTAX_GRAY} 60%, ${RENTAX_LIGHT_RED} 100%)`,
                        borderRadius: 22,
                        boxShadow: '0 2px 16px #ff572233',
                        border: `2.5px solid ${RENTAX_LIGHT_RED}`,
                        padding: 28,
                        marginBottom: 32,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <div style={{ position: 'relative', width: '100%', maxWidth: 800, margin: '0 auto', background: '#fff', borderRadius: 18, boxShadow: '0 2px 16px #e3e4ea', border: `2.5px solid ${RENTAX_DARK_GRAY}` }}>
                        <ArrowButton direction="left" onClick={goPrev} ariaLabel="Anterior" />
                        <img
                            src={
                                property.images && property.images.length
                                    ? property.images[selectedImageIdx]
                                    : 'https://via.placeholder.com/800x420?text=Sin+imagen'
                            }
                            alt="Principal"
                            style={{
                                width: '100%',
                                maxHeight: 420,
                                objectFit: 'cover',
                                borderRadius: 14,
                                border: `3px solid ${RENTAX_RED}`,
                                boxShadow: '0 4px 16px #ff572244',
                                cursor: 'pointer',
                                background: '#fff',
                                transition: 'box-shadow 0.2s',
                            }}
                            onClick={() => setModalOpen(true)}
                        />
                        <ArrowButton direction="right" onClick={goNext} ariaLabel="Siguiente" />
                    </div>
                    {/* Grid de miniaturas */}
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: `repeat(auto-fit, minmax(90px, 1fr))`,
                            gap: 14,
                            marginTop: 22,
                            width: '100%',
                            maxWidth: 800,
                        }}
                    >
                        {(property.images ?? []).map((img, idx) => (
                            <img
                                key={img}
                                src={img}
                                alt={`Foto ${idx + 1}`}
                                style={{
                                    width: '100%',
                                    height: 70,
                                    objectFit: 'cover',
                                    borderRadius: 10,
                                    border:
                                        selectedImageIdx === idx
                                            ? `3px solid ${RENTAX_RED}`
                                            : `2px solid ${RENTAX_DARK_GRAY}`,
                                    cursor: 'pointer',
                                    boxSizing: 'border-box',
                                    boxShadow:
                                        selectedImageIdx === idx
                                            ? '0 2px 8px #ff572233'
                                            : '0 1px 4px #0001',
                                    transition: 'border 0.2s, box-shadow 0.2s',
                                    background: '#fff',
                                }}
                                onClick={() => setSelectedImageIdx(idx)}
                            />
                        ))}
                    </div>
                    {modalOpen && property.images && property.images.length > 0 && (
                        <ImageModal
                            src={property.images[selectedImageIdx]}
                            onClose={() => setModalOpen(false)}
                            onPrev={goPrev}
                            onNext={goNext}
                        />
                    )}
                </div>

                {/* Título */}
                <h1
                    style={{
                        fontSize: 44,
                        fontWeight: 900,
                        margin: '18px 0 10px',
                        color: RENTAX_RED,
                        letterSpacing: 1,
                        textShadow: '0 2px 8px #ff572244',
                    }}
                >
                    {property.title}
                </h1>

                {/* Precio */}
                {property.precio && (
                    <div style={{ fontSize: 28, color: '#007a4d', fontWeight: 800, marginBottom: 10 }}>
                        ${property.precio}
                    </div>
                )}

                {/* Descripción */}
                <div
                    style={{
                        background: `linear-gradient(120deg, #fff 80%, ${RENTAX_DARK_GRAY} 100%)`,
                        borderRadius: 16,
                        padding: 22,
                        marginBottom: 28,
                        fontSize: 22,
                        border: `2px solid ${RENTAX_DARK_GRAY}`,
                        boxShadow: '0 1px 8px #e3e4ea',
                    }}
                >
                    {property.description}
                </div>

                {/* Información tipo tupla */}
                <div
                    style={{
                        display: 'flex',
                        gap: 48,
                        marginBottom: 32,
                        fontSize: 21,
                        background: RENTAX_GRAY,
                        borderRadius: 16,
                        padding: '18px 0',
                        border: `2px solid ${RENTAX_LIGHT_RED}`,
                        boxShadow: '0 1px 8px #ff572244',
                        justifyContent: 'center',
                        fontWeight: 700,
                    }}
                >
                    {property.ambientes !== undefined && (
                        <div style={{ color: RENTAX_RED }}>
                            <strong>Ambientes:</strong> {property.ambientes}
                        </div>
                    )}
                    {property.huespedes !== undefined && (
                        <div style={{ color: RENTAX_RED }}>
                            <strong>Huéspedes:</strong> {property.huespedes}
                        </div>
                    )}
                    {property.banios !== undefined && (
                        <div style={{ color: RENTAX_RED }}>
                            <strong>Baños:</strong> {property.banios}
                        </div>
                    )}
                </div>

                {/* Selectores de fechas y botón ALQUILAR */}
                <div
                    style={{
                        display: 'flex',
                        gap: 32,
                        marginBottom: 38,
                        alignItems: 'center',
                        background: `linear-gradient(120deg, #fff 80%, ${RENTAX_LIGHT_RED} 100%)`,
                        borderRadius: 16,
                        padding: 24,
                        border: `2px solid ${RENTAX_DARK_GRAY}`,
                        boxShadow: '0 1px 8px #e3e4ea',
                        maxWidth: 700,
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                        <DateSelector
                            label="Inicio"
                            value={startDate}
                            onChange={date => {
                                setStartDate(date);
                                if (endDate && date && endDate < date) setEndDate(null);
                            }}
                            minDate={new Date()}
                            maxDate={endDate ? new Date(endDate.getTime() - 24 * 60 * 60 * 1000) : undefined}
                            open={openStart}
                            setOpen={setOpenStart}
                        />
                        <DateSelector
                            label="Fin"
                            value={endDate}
                            onChange={date => setEndDate(date)}
                            minDate={startDate ? new Date(startDate.getTime() + 24 * 60 * 60 * 1000) : new Date()}
                            open={openEnd}
                            setOpen={setOpenEnd}
                        />
                    </div>
                    <button
                        style={{
                            marginLeft: 32,
                            background: `linear-gradient(90deg, ${RENTAX_RED} 70%, #ff8a50 100%)`,
                            color: '#fff',
                            fontWeight: 900,
                            fontSize: 22,
                            border: 'none',
                            borderRadius: 14,
                            padding: '22px 48px',
                            boxShadow: '0 2px 16px #ff572244',
                            cursor: 'pointer',
                            letterSpacing: 2,
                            textShadow: '0 2px 8px #ff572244',
                            transition: 'background 0.2s, box-shadow 0.2s',
                        }}
                    >
                        ALQUILAR
                    </button>
                </div>

                {/* Valoración y comentarios */}
                <div
                    style={{
                        marginTop: 32,
                        background: `linear-gradient(120deg, #fff 60%, ${RENTAX_LIGHT_RED} 100%)`,
                        borderRadius: 16,
                        padding: 28,
                        border: `2px solid ${RENTAX_DARK_GRAY}`,
                        boxShadow: '0 1px 8px #e3e4ea',
                        marginBottom: 24,
                    }}
                >
                    <h2 style={{ fontSize: 26, marginBottom: 18, color: RENTAX_RED, fontWeight: 900 }}>
                        Valoración
                    </h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 32, marginBottom: 18 }}>
                        <span style={{ fontSize: 54, color: '#f5b50a', fontWeight: 900, textShadow: '0 2px 8px #ffecb366' }}>
                            ★
                        </span>
                        <span style={{ fontSize: 38, fontWeight: 900, color: RENTAX_RED, marginLeft: -12 }}>
                            {avg.toFixed(1)}
                        </span>
                        <span style={{ fontSize: 20, color: '#888', marginLeft: 8 }}>
                            ({(property.reviews ?? []).length} valoraciones)
                        </span>
                    </div>
                    {/* Barras de progreso */}
                    <div style={{ marginLeft: 8 }}>
                        {[5, 4, 3, 2, 1].map(star => (
                            <div key={star} style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
                                <span style={{ width: 22, fontWeight: 700, color: '#f5b50a', fontSize: 18 }}>
                                    {star} ★
                                </span>
                                <ProgressBar value={dist[star - 1]} max={maxVotes} color="#f5b50a" />
                                <span style={{ fontSize: 15, color: '#888', minWidth: 24 }}>
                                    {dist[star - 1]}
                                </span>
                            </div>
                        ))}
                    </div>
                    {/* Comentarios */}
                    <div style={{ marginTop: 24 }}>
                        {(property.reviews ?? []).map((review, idx) => (
                            <div
                                key={idx}
                                style={{
                                    background: RENTAX_GRAY,
                                    borderRadius: 12,
                                    padding: 16,
                                    marginBottom: 14,
                                    boxShadow: '0 1px 8px #e3e4ea',
                                    border: `1.5px solid ${RENTAX_LIGHT_RED}`,
                                }}
                            >
                                <strong style={{ color: RENTAX_RED }}>{review.user}</strong> —{' '}
                                <span style={{ color: '#f5b50a', fontWeight: 700 }}>
                                    {'★'.repeat(review.rating)}
                                </span>
                                <div style={{ marginTop: 4 }}>{review.comment}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Preguntas o comentarios de la gente */}
                <div
                    style={{
                        marginTop: 36,
                        background: `linear-gradient(120deg, ${RENTAX_LIGHT_RED} 80%, #fff 100%)`,
                        borderRadius: 16,
                        padding: 28,
                        border: `2px solid ${RENTAX_DARK_GRAY}`,
                        boxShadow: '0 1px 8px #e3e4ea',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
                        <h2 style={{ fontSize: 23, color: RENTAX_RED, fontWeight: 900, margin: 0 }}>
                            Preguntas y comentarios
                        </h2>
                        <button
                            onClick={() => setShowQuestion(q => !q)}
                            style={{
                                marginLeft: 24,
                                background: RENTAX_RED,
                                color: '#fff',
                                fontWeight: 800,
                                fontSize: 18,
                                border: 'none',
                                borderRadius: 10,
                                padding: '10px 28px',
                                boxShadow: '0 2px 8px #ff572244',
                                cursor: 'pointer',
                                letterSpacing: 1,
                                transition: 'background 0.2s, box-shadow 0.2s',
                            }}
                        >
                            Hacer pregunta o comentario
                        </button>
                    </div>
                    {showQuestion && (
                        <div style={{ marginBottom: 18, display: 'flex', gap: 8 }}>
                            <input
                                type="text"
                                value={questionText}
                                onChange={e => setQuestionText(e.target.value)}
                                placeholder="Escribe tu pregunta o comentario..."
                                style={{
                                    flex: 1,
                                    padding: '10px 14px',
                                    borderRadius: 8,
                                    border: `1.5px solid ${RENTAX_RED}`,
                                    fontSize: 17,
                                    outline: 'none',
                                }}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') handleAddQuestion();
                                }}
                            />
                            <button
                                onClick={handleAddQuestion}
                                style={{
                                    background: RENTAX_RED,
                                    color: '#fff',
                                    fontWeight: 800,
                                    fontSize: 17,
                                    border: 'none',
                                    borderRadius: 8,
                                    padding: '10px 22px',
                                    boxShadow: '0 2px 8px #ff572244',
                                    cursor: 'pointer',
                                    letterSpacing: 1,
                                }}
                            >
                                Enviar
                            </button>
                        </div>
                    )}
                    <div>
                        {questions.map((q, idx) => (
                            <div key={idx} style={{ marginBottom: 12 }}>
                                <div
                                    style={{
                                        background: '#fff',
                                        borderRadius: 10,
                                        padding: 14,
                                        boxShadow: '0 1px 6px #e3e4ea',
                                        border: `1.5px solid ${RENTAX_LIGHT_RED}`,
                                        marginLeft: 0,
                                        marginBottom: q.response ? 6 : 0,
                                    }}
                                >
                                    <strong style={{ color: RENTAX_RED }}>{q.user}</strong>:{' '}
                                    <span>{q.question}</span>
                                </div>
                                {q.response && (
                                    <div
                                        style={{
                                            background: RENTAX_GRAY,
                                            borderRadius: 10,
                                            padding: 14,
                                            boxShadow: '0 1px 6px #e3e4ea',
                                            border: `1.5px solid ${RENTAX_LIGHT_RED}`,
                                            marginLeft: 38,
                                            marginTop: 2,
                                        }}
                                    >
                                        <strong style={{ color: '#007a4d' }}>Propietario</strong>:{' '}
                                        <span>{q.response}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
