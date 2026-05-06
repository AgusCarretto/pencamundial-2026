import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Trophy, LogOut, Globe, Users } from 'lucide-react';

// Ícono SVG personalizado para la pelota de fútbol (estilo Lucide)
const SoccerBallIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 12l2.5-3.5L12 5.5l-2.5 3 2.5 3.5z" />
        <path d="M14.5 8.5L20 10" />
        <path d="M9.5 8.5L4 10" />
        <path d="M12 12v6" />
        <path d="M12 18l-4 3" />
        <path d="M12 18l4 3" />
    </svg>
);

const MainLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const userData = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const getActiveColor = (path: string) => {
        return location.pathname === path ? 'text-blue-500' : 'text-slate-500 hover:text-slate-300';
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col">
            {/* Navbar Superior */}
            <nav className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
                        <Trophy className="text-yellow-500 w-6 h-6" />
                        <span className="font-black text-xl tracking-tighter text-white">PENCA 2026</span>
                    </div>

                    {/* Navegación Desktop */}
                    <div className="hidden md:flex items-center gap-6">
                        <button onClick={() => navigate('/dashboard')} className={`flex items-center gap-2 font-bold text-sm transition-colors ${getActiveColor('/dashboard')}`}>
                            <SoccerBallIcon className="w-4 h-4" /> Partidos
                        </button>
                        <button onClick={() => navigate('/groups')} className={`flex items-center gap-2 font-bold text-sm transition-colors ${getActiveColor('/groups')}`}>
                            <Users className="w-4 h-4" /> Grupos
                        </button>
                        <button onClick={() => navigate('/ranking')} className={`flex items-center gap-2 font-bold text-sm transition-colors ${getActiveColor('/ranking')}`}>
                            <Globe className="w-4 h-4" /> Global
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Puntos</span>
                        <span className="text-emerald-400 font-black">{userData.totalPoints || 0}</span>
                    </div>
                    <button onClick={handleLogout} className="text-slate-500 hover:text-red-500 transition-colors">
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </nav>

            {/* Contenido Principal */}
            <main className="flex-1 max-w-5xl w-full mx-auto p-6 pb-24 md:pb-6">
                <Outlet />
            </main>

            {/* Navegación Mobile */}
            <div className="md:hidden bg-slate-900 border-t border-slate-800 p-3 flex justify-around items-center fixed bottom-0 left-0 right-0 z-50">
                <button onClick={() => navigate('/dashboard')} className={`flex flex-col items-center gap-1 w-20 transition-colors ${getActiveColor('/dashboard')}`}>
                    <SoccerBallIcon className="w-6 h-6" />
                    <span className='text-[10px] font-bold uppercase'>Partidos</span>
                </button>
                <button onClick={() => navigate('/groups')} className={`flex flex-col items-center gap-1 w-20 transition-colors ${getActiveColor('/groups')}`}>
                    <Users className="w-6 h-6" />
                    <span className='text-[10px] font-bold uppercase'>Grupos</span>
                </button>
                <button onClick={() => navigate('/ranking')} className={`flex flex-col items-center gap-1 w-20 transition-colors ${getActiveColor('/ranking')}`}>
                    <Globe className="w-6 h-6" />
                    <span className='text-[10px] font-bold uppercase'>Global</span>
                </button>
            </div>
        </div>
    );
};

export default MainLayout;