import { useEffect, useState } from 'react';
import { userService } from '../services/userService';
import type { UserRanking } from '../types';
import { Award, Medal } from 'lucide-react';

const RankingPage = () => {
    const [ranking, setRanking] = useState<UserRanking[]>([]);
    const [loading, setLoading] = useState(true);
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        const fetchRanking = async () => {
            try {
                const data = await userService.getGlobalRanking();
                setRanking(data);
            } catch (error) {
                console.error("Error cargando ranking:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRanking();
    }, []);

    if (loading) return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
            <div className="text-4xl animate-bounce">⚽</div>
            <div className="text-yellow-400 font-black tracking-widest uppercase animate-pulse">Armando posiciones...</div>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 relative">
            <div className="flex items-center gap-4 mb-8 border-b border-green-800/50 pb-6 relative">
                <div className="bg-gradient-to-br from-yellow-300 to-yellow-500 p-3 sm:p-4 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.4)]">
                    <Award className="w-6 h-6 sm:w-8 sm:h-8 text-green-950" />
                </div>
                <div>
                    <h2 className="text-3xl sm:text-4xl font-black text-white italic drop-shadow-md tracking-tighter">TABLA <span className="text-yellow-400">GENERAL</span></h2>
                    <p className="text-emerald-400/70 text-[10px] sm:text-xs font-black uppercase tracking-widest">Los mejores pronosticadores de la Penca</p>
                </div>
            </div>

            <div className="bg-green-900/30 backdrop-blur-sm border border-green-800/50 rounded-3xl overflow-hidden shadow-xl">
                <table className="w-full text-left">
                    <thead className="bg-green-950/80 border-b border-green-800/50">
                        <tr>
                            <th className="px-4 sm:px-6 py-4 text-xs font-bold uppercase text-emerald-300/70 tracking-wider w-16 sm:w-20 text-center">Pos</th>
                            <th className="px-4 sm:px-6 py-4 text-xs font-bold uppercase text-emerald-300/70 tracking-wider">Usuario</th>
                            <th className="px-4 sm:px-6 py-4 text-xs font-bold uppercase text-emerald-300/70 tracking-wider text-right w-24 sm:w-32">Puntos</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-green-800/30">
                        {ranking.map((user, index) => {
                            const pos = index + 1;
                            const isMe = user.userName === currentUser.userName;

                            return (
                                <tr key={user.userName} className={`${isMe ? 'bg-yellow-500/10' : ''} hover:bg-green-800/30 transition-colors`}>
                                    <td className="px-4 sm:px-6 py-4 sm:py-5">
                                        <div className="flex justify-center items-center">
                                            {/* PUESTO 1: ORO */}
                                            {pos === 1 && (
                                                <Medal className="w-6 h-6 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
                                            )}

                                            {/* PUESTO 2: PLATA */}
                                            {pos === 2 && (
                                                <Medal className="w-6 h-6 text-slate-300 drop-shadow-[0_0_8px_rgba(203,213,225,0.6)]" />
                                            )}

                                            {/* PUESTO 3: BRONCE */}
                                            {pos === 3 && (
                                                <Medal className="w-6 h-6 text-amber-600 drop-shadow-[0_0_8px_rgba(217,119,6,0.6)]" />
                                            )}

                                            {/* DEL 4TO EN ADELANTE: NÚMERO NORMAL */}
                                            {pos > 3 && (
                                                <span className="font-mono text-base sm:text-lg text-emerald-400/50">
                                                    #{pos}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 sm:px-6 py-4 sm:py-5 flex items-center gap-3">
                                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm shadow-inner ${isMe ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-green-950 shadow-[0_0_10px_rgba(234,179,8,0.3)]' : 'bg-green-950 text-emerald-400 border border-green-800/50'}`}>
                                            {user.userName.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <span className={`font-black tracking-tight text-sm sm:text-base ${isMe ? 'text-yellow-400 drop-shadow-md' : 'text-white'}`}>
                                                {user.userName}
                                            </span>
                                            {isMe && <span className="text-[10px] sm:text-xs text-yellow-500/80 ml-2 font-black uppercase tracking-widest">(Tú)</span>}
                                        </div>
                                    </td>
                                    <td className="px-4 sm:px-6 py-4 sm:py-5 text-right">
                                        <span className="text-xl sm:text-2xl font-black text-emerald-400 tracking-tight drop-shadow-sm">
                                            {user.totalPoints}
                                        </span>
                                        <span className="text-[10px] sm:text-xs text-emerald-600 font-bold ml-1 uppercase">pts</span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RankingPage;