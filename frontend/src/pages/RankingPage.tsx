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

    if (loading) return <div className="p-10 text-center text-slate-500">Cargando la tabla...</div>;

    return (
        <div>
            <div className="flex items-center gap-3 mb-8 border-b border-slate-800 pb-5">
                <div className="bg-emerald-950 p-3 rounded-2xl border border-emerald-800 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                    <Award className="w-7 h-7 text-emerald-400" />
                </div>
                <div>
                    <h2 className="text-3xl font-extrabold text-white tracking-tighter">Tabla General</h2>
                    <p className="text-slate-500">Los mejores pronosticadores de la Penca</p>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                <table className="w-full text-left">
                    <thead className="bg-slate-800/50 border-b border-slate-800">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400 tracking-wider w-20 text-center">Pos</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400 tracking-wider">Usuario</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400 tracking-wider text-right w-32">Puntos</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {ranking.map((user, index) => {
                            const pos = index + 1;
                            const isFirst = pos === 1;
                            const isMe = user.userName === currentUser.userName;

                            return (
                                <tr key={user.userName} className={`${isMe ? 'bg-blue-950/30' : ''} hover:bg-slate-800/30 transition-colors`}>
                                    <td className="px-6 py-5 text-center">
                                        {isFirst ? (
                                            <Medal className="w-6 h-6 text-yellow-500 mx-auto" />
                                        ) : (
                                            <span className={`font-mono text-lg ${pos <= 3 ? 'text-white font-bold' : 'text-slate-600'}`}>
                                                #{pos}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-5 flex items-center gap-3">
                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${isMe ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                                            {user.userName.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <span className={`font-bold ${isMe ? 'text-blue-400' : 'text-white'}`}>
                                                {user.userName}
                                            </span>
                                            {isMe && <span className="text-xs text-blue-500 ml-2 font-medium">(Tú)</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <span className="text-2xl font-black text-emerald-400 tracking-tight">
                                            {user.totalPoints}
                                        </span>
                                        <span className="text-xs text-emerald-700 font-bold ml-1">pts</span>
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