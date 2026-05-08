import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { groupService } from '../services/groupService';
import { Trophy, ArrowLeft, Copy, CheckCircle2 } from 'lucide-react';
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

    if (loading) return <div className="p-10 text-center text-slate-500">Cargando la liga...</div>;
    if (!group) return <div className="p-10 text-center text-red-500">Grupo no encontrado</div>;

    return (
        <div className="space-y-6">
            {/* Cabecera y botón de volver */}
            <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
                <button onClick={() => navigate('/groups')} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h2 className="text-2xl font-extrabold text-white">{group.name}</h2>
                    <p className="text-slate-500 text-sm">Ranking del grupo</p>
                </div>
            </div>

            {/* Tarjeta de Código de Invitación */}
            <div className="bg-blue-950/30 border border-blue-900/50 p-5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <span className="block text-sm font-bold text-blue-400 mb-1">Código de Invitación</span>
                    <span className="text-slate-300 text-sm">Pasale este código a tus amigos para que se unan:</span>
                </div>
                <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-2 bg-blue-900/50 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-mono font-bold tracking-widest border border-blue-700 transition-colors"
                >
                    {group.code}
                    {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
            </div>

            {/* Tabla de Posiciones (Reciclada del Global pero ajustada) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
                <table className="w-full text-left">
                    <thead className="bg-slate-800/50 border-b border-slate-800">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400 tracking-wider w-16 text-center">Pos</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400 tracking-wider">Jugador</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400 tracking-wider text-right w-24">Pts</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {ranking.map((user, index) => {
                            const pos = index + 1;
                            const isMe = user.userName === currentUser.userName;

                            return (
                                <tr key={user.userName} className={`${isMe ? 'bg-blue-950/20' : ''}`}>
                                    <td className="px-6 py-4 text-center">
                                        {pos === 1 ? <Trophy className="w-5 h-5 text-yellow-500 mx-auto" /> : <span className="font-mono font-bold text-slate-500">{pos}</span>}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`font-bold ${isMe ? 'text-blue-400' : 'text-white'}`}>{user.userName}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="text-xl font-black text-emerald-400">{user.totalPoints}</span>
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