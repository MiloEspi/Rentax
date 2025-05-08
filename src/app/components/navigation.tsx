
import Link from "next/link";
export const Navigation = () => {
    return (
        <nav className="bg-gray-800 text-white p-4">
            <ul className="flex space-x-4">
                <li>
                    <Link href="/" className="mr-4 text-blue-500">Home</Link>
                </li>
                <li>
                    <Link href="/about" className="mr-4 text-blue-500">About</Link>
                </li>
                <li>
                    <Link href="/propiedades/[id]" as="/propiedades/1" className="mr-4 text-blue-500">Propiedades</Link>
                </li>
                <div className="ml-auto flex space-x-4">
                    <li>
                        <Link href="/login" className="text-blue-500">Iniciar Sesión</Link>
                    </li>
                    <li>
                        <Link href="/register" className="text-blue-500">Registrar</Link>
                    </li>
                </div>
            </ul>
        </nav>
    );
};
