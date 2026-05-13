import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Trophy, LogOut, Globe, Users, History } from 'lucide-react';
import { authService } from '../../services/authService';
import { useEffect, useState } from 'react';

const MainLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    //const userData = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const [puntos, setPuntos] = useState<number>(0);

    useEffect(() => {
        const cargarDatosUsuario = async () => {
            try {
                // Le pegamos al backend para traer los datos actuales
                const userData = await authService.getMe();

                // Actualizamos el estado con los puntos reales de la base de datos
                setPuntos(userData.totalPoints);

                // Opcional: si guardás los datos en el localStorage, actualizalos acá también
                // localStorage.setItem('user', JSON.stringify(userData));
            } catch (error) {
                console.error("Error al cargar los datos del usuario:", error);
            }
        };

        cargarDatosUsuario();
    }, []); // Los corchetes vacíos hacen que se ejecute al cargar el componente


    const getActiveColor = (path: string) => {
        return location.pathname === path ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]' : 'text-emerald-200/60 hover:text-yellow-200';
    };

    return (
        <div className="min-h-screen text-emerald-50 flex flex-col relative overflow-hidden bg-green-950">
            {/* Background Image de Césped con Overlay oscuro - Opacidad reducida para que se vea más la foto */}
            <div
                className="absolute inset-0 z-0 opacity-80 mix-blend-overlay"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1589487391730-58f20eb2c308?q=80&w=2074&auto=format&fit=crop")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed'
                }}
            />
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-green-950/70 via-emerald-950/60 to-green-950/80" />

            {/* Navbar Superior */}
            <nav className="bg-green-950/80 backdrop-blur-md border-b border-green-800/50 px-4 sm:px-6 py-4 sm:py-5 flex justify-between items-center sticky top-0 z-50 shadow-lg">
                <div className="flex items-center gap-4 sm:gap-8">
                    <div className="flex items-center gap-2 sm:gap-3 cursor-pointer group" onClick={() => navigate('/dashboard')}>
                        <div className="bg-gradient-to-b from-yellow-300 to-yellow-500 p-1.5 sm:p-2 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.4)] group-hover:scale-110 transition-transform shrink-0">
                            <Trophy className="text-green-950 w-4 sm:w-5 h-4 sm:h-5" />
                        </div>
                        <span className="font-black text-xl md:text-2xl tracking-tighter text-white drop-shadow-md">MUNDIAL 2026</span>
                    </div>

                    {/* Navegación Desktop */}
                    <div className="hidden md:flex items-center gap-6 ml-4">
                        <button onClick={() => navigate('/dashboard')} className={`flex items-center gap-2 font-bold text-sm transition-all ${getActiveColor('/dashboard')}`}>
                            <div className="w-4 h-4 rounded-full border-2 border-current"></div> Partidos
                        </button>
                        <button onClick={() => navigate('/groups')} className={`flex items-center gap-2 font-bold text-sm transition-all ${getActiveColor('/groups')}`}>
                            <Users className="w-4 h-4" /> Grupos
                        </button>
                        <button onClick={() => navigate('/ranking')} className={`flex items-center gap-2 font-bold text-sm transition-all ${getActiveColor('/ranking')}`}>
                            <Globe className="w-4 h-4" /> Global
                        </button>
                        <button onClick={() => navigate('/history')} className={`flex items-center gap-2 font-bold text-sm transition-all ${getActiveColor('/history')}`}>
                            <History className="w-4 h-4" /> Historial
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-6">
                    <div className="flex items-center gap-1.5 sm:gap-2 bg-green-900/50 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-green-700/50 shadow-inner backdrop-blur-sm">
                        <span className="text-[9px] sm:text-[10px] font-black text-emerald-200/70 uppercase tracking-widest hidden sm:inline">Puntos</span>
                        <span className="text-[9px] sm:text-[10px] font-black text-emerald-200/70 uppercase tracking-widest sm:hidden">Pts</span>
                        <span className="text-yellow-400 font-black text-base sm:text-lg drop-shadow-[0_0_5px_rgba(250,204,21,0.5)] leading-none">{puntos}</span>
                    </div>
                    <button onClick={handleLogout} className="text-emerald-200/60 hover:text-red-400 transition-colors p-1">
                        <LogOut className="w-5 h-5 sm:w-5 sm:h-5" />
                    </button>
                </div>
            </nav>

            {/* Contenido Principal */}
            <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 pb-24 md:pb-6 relative z-10">
                <Outlet />
            </main>

            {/* Navegación Mobile */}
            <div className="md:hidden bg-green-950/95 backdrop-blur-xl border-t border-green-800/50 p-3 flex justify-around items-center fixed bottom-0 left-0 right-0 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] pb-6">
                <button onClick={() => navigate('/dashboard')} className={`flex flex-col items-center gap-1 w-20 transition-all ${getActiveColor('/dashboard')}`}>
                    <div className="w-6 h-6 rounded-full border-[3px] border-current"></div>
                    <span className='text-[10px] font-bold uppercase tracking-wider mt-1'>Partidos</span>
                </button>
                <button onClick={() => navigate('/groups')} className={`flex flex-col items-center gap-1 w-20 transition-all ${getActiveColor('/groups')}`}>
                    <Users className="w-6 h-6" />
                    <span className='text-[10px] font-bold uppercase tracking-wider mt-1'>Grupos</span>
                </button>
                <button onClick={() => navigate('/ranking')} className={`flex flex-col items-center gap-1 w-20 transition-all ${getActiveColor('/ranking')}`}>
                    <Globe className="w-6 h-6" />
                    <span className='text-[10px] font-bold uppercase tracking-wider mt-1'>Global</span>
                </button>
                <button onClick={() => navigate('/history')} className={`flex flex-col items-center gap-1 w-20 transition-all ${getActiveColor('/history')}`}>
                    <History className="w-6 h-6" />
                    <span className='text-[10px] font-bold uppercase tracking-wider mt-1'>Historial</span>
                </button>
            </div>
        </div>
    );
};

export default MainLayout;