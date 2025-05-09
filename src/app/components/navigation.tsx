import Link from "next/link";

export const Navigation = () => {
    return (
            <ul className="flex items-center">
                <div className="flex space-x-4">
                    <li>
                        <Link href="/" className="text-black">Home</Link>
                    </li>
                    <li>
                        <Link href="/about" className="text-black">About </Link>
                    </li>
                </div>
                <div className="ml-auto flex space-x-4">
                    <li>
                        <Link href="/login" className="text-black"> Iniciar Sesión</Link>
                    </li>
                    <li>
                        <Link href="/register" className="text-black">Registrar</Link>
                    </li>
                </div>
            </ul>
    );
};
