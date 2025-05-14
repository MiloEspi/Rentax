import Link from "next/link";

export const Navigation = () => {
    return (
        <ul className="flex items-center space-x-8">
            <div className="flex space-x-4">
                <li>
                    <Link
                        href="/about"
                        className="text-black border border-gray-300 px-4 py-2 rounded hover:bg-gray-100"
                    >
                        About
                    </Link>
                </li>
            </div>
            <div className="ml-auto flex space-x-4">
                <li>
                    <Link
                        href="/login"
                        className="text-white bg-blue-500 border border-blue-500 px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Iniciar Sesión
                    </Link>
                </li>
                <li>
                    <Link
                        href="/register"
                        className="text-white bg-green-500 border border-green-500 px-4 py-2 rounded hover:bg-green-600"
                    >
                        Registrar
                    </Link>
                </li>
            </div>
        </ul>
    );
};
