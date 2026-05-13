import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { groupService } from '../services/groupService';
import { ArrowLeft, Copy, CheckCircle2, Medal } from 'lucide-react';
import type { UserRanking } from '../types';

const GroupDetailsPage = () => {
    const { id } = useParams(); // Agarramos el ID de la URL
    const navigate = useNavigate();

    const [group, setGroup] = useState<{ name: string, code: string } | null>(null);
    const [ranking, setRanking] = useState<UserRanking[]>([]);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        const fetchGroupData = async () => {
            if (!id) return;
            try {
                const [groupData, rankingData] = await Promise.all([
                    groupService.getGroupById(Number(id)),
                    groupService.getGroupRanking(Number(id))
                ]);
                setGroup(groupData);
                setRanking(rankingData);
            } catch (error) {
                console.error("Error cargando el grupo:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchGroupData();
    }, [id]);

    const handleCopyCode = () => {
        if (group?.code) {
            navigator.clipboard.writeText(group.code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (loading) return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
            <div className="text-4xl animate-bounce">⚽</div>
            <div className="text-yellow-400 font-black tracking-widest uppercase animate-pulse">Armando grupo...</div>
        </div>
    );
    if (!group) return <div className="p-10 text-center text-red-400 font-bold">Grupo no encontrado</div>;

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 relative space-y-6">
            {/* Cabecera y botón de volver */}
            <div className="flex items-center gap-4 border-b border-green-800/50 pb-6 relative">
                <button onClick={() => navigate('/groups')} className="p-3 bg-green-900/40 hover:bg-green-800/60 rounded-xl text-emerald-400 transition-colors border border-green-800/50 backdrop-blur-sm active:scale-95">
                    <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <div>
                    <h2 className="text-3xl sm:text-4xl font-black text-white italic drop-shadow-md tracking-tighter uppercase">{group.name}</h2>
                    <p className="text-emerald-400/70 text-[10px] sm:text-xs font-black uppercase tracking-widest">Ranking de la liga</p>
                </div>
            </div>

            {/* Tarjeta de Código de Invitación */}
            <div className="bg-gradient-to-r from-green-900/50 to-green-950/50 border border-yellow-500/30 p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_0_20px_rgba(234,179,8,0.05)] backdrop-blur-sm">
                <div>
                    <span className="block text-xs font-black text-yellow-400 mb-1 uppercase tracking-widest drop-shadow-sm">Código de Invitación</span>
                    <span className="text-emerald-200/70 text-sm">Pasale este código a tus amigos para que se unan:</span>
                </div>
                <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-3 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 px-5 py-3 rounded-xl font-mono font-bold tracking-widest border border-yellow-500/40 transition-all active:scale-95 hover:shadow-[0_0_15px_rgba(234,179,8,0.2)]"
                >
                    <span className="text-lg">{group.code}</span>
                    {copied ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                </button>
            </div>

            {/* Tabla de Posiciones */}
            <div className="bg-green-900/30 backdrop-blur-sm border border-green-800/50 rounded-3xl overflow-hidden shadow-xl mt-8">
                <table className="w-full text-left">
                    <thead className="bg-green-950/80 border-b border-green-800/50">
                        <tr>
                            <th className="px-4 sm:px-6 py-4 text-xs font-bold uppercase text-emerald-300/70 tracking-wider w-16 sm:w-20 text-center">Pos</th>
                            <th className="px-4 sm:px-6 py-4 text-xs font-bold uppercase text-emerald-300/70 tracking-wider">Jugador</th>
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

export default GroupDetailsPage;