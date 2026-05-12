import { useEffect, useState } from 'react';
import { groupService } from '../services/groupService';
import { useNavigate } from 'react-router-dom';
import { Users, PlusCircle, LogIn, ChevronRight } from 'lucide-react';

interface Group {
    id: number;
    name: string;
}

const GroupsPage = () => {
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const [groupInput, setGroupInput] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadGroups();
    }, []);

    const loadGroups = async () => {
        try {
            const data = await groupService.getMyGroups();
            setGroups(data);
        } catch (err) {
            console.error("Error cargando grupos", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateOrJoin = async (action: 'create' | 'join') => {
        if (!groupInput.trim()) return;
        setError('');

        try {
            if (action === 'create') {
                const newGroup = await groupService.createGroup(groupInput);
                navigate(`/groups/${newGroup.id}`);
            } else {
                const response = await groupService.joinGroup(groupInput);
                navigate(`/groups/${response.groupId}`);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || `Error al ${action === 'create' ? 'crear' : 'unirse al'} grupo.`);
        }
    };

    if (loading) return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
            <div className="text-4xl animate-bounce">⚽</div>
            <div className="text-yellow-400 font-black tracking-widest uppercase animate-pulse">Cargando Ligas...</div>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 relative">
            <div className="flex items-center gap-4 border-b border-green-800/50 pb-6 relative">
                <div className="bg-gradient-to-br from-yellow-300 to-yellow-500 p-3 sm:p-4 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.4)]">
                    <Users className="w-6 h-6 sm:w-8 sm:h-8 text-green-950" />
                </div>
                <div>
                    <h2 className="text-3xl sm:text-4xl font-black text-white italic drop-shadow-md tracking-tighter">MIS <span className="text-yellow-400">LIGAS</span></h2>
                    <p className="text-emerald-400/70 text-[10px] sm:text-xs font-black uppercase tracking-widest">Competí contra tus amigos</p>
                </div>
            </div>

            {/* Controles para Crear / Unirse */}
            <div className="bg-green-900/30 backdrop-blur-sm border border-green-800/50 p-6 sm:p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-yellow-400/60 to-transparent"></div>
                <label className="block text-sm font-black text-emerald-300 uppercase tracking-widest mb-4 drop-shadow-sm">Unite a una liga o creá la tuya</label>
                <div className="flex flex-col md:flex-row gap-4">
                    <input
                        type="text"
                        value={groupInput}
                        onChange={(e) => setGroupInput(e.target.value)}
                        placeholder="Ingresá el código o nombre..."
                        className="flex-1 bg-black/40 border border-green-800 rounded-xl py-4 px-6 text-white font-bold placeholder-green-800 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all shadow-inner"
                    />
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={() => handleCreateOrJoin('join')}
                            className="flex items-center justify-center gap-2 bg-green-950 hover:bg-green-900 text-emerald-400 border border-green-800 font-bold py-4 px-8 rounded-xl transition-all active:scale-95 shadow-lg whitespace-nowrap"
                        >
                            <LogIn className="w-5 h-5" /> Unirse con Código
                        </button>
                        <button
                            onClick={() => handleCreateOrJoin('create')}
                            className="flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-green-950 font-black py-4 px-8 rounded-xl transition-all active:scale-95 shadow-[0_0_15px_rgba(234,179,8,0.3)] hover:shadow-[0_0_25px_rgba(234,179,8,0.5)] whitespace-nowrap"
                        >
                            <PlusCircle className="w-5 h-5" /> Crear Liga
                        </button>
                    </div>
                </div>
                {error && <p className="text-red-400 text-sm mt-4 font-bold bg-red-950/40 p-3 rounded-lg border border-red-900/50 inline-block">{error}</p>}
            </div>

            {/* Lista de Grupos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {groups.length === 0 ? (
                    <div className="col-span-full text-center p-12 border border-dashed border-green-800/50 rounded-3xl bg-green-950/20">
                        <p className="text-emerald-400/70 font-bold text-lg mb-2">Todavía no estás en ninguna liga.</p>
                        <p className="text-emerald-500/50 text-sm">¡Creá una y pasale el código a tus amigos para empezar a competir!</p>
                    </div>
                ) : (
                    groups.map(group => (
                        <div key={group.id} onClick={() => navigate(`/groups/${group.id}`)} className="bg-green-900/40 backdrop-blur-sm border border-green-800/50 hover:border-yellow-500/50 hover:shadow-[0_0_20px_rgba(234,179,8,0.15)] p-5 sm:p-6 rounded-[1.5rem] flex items-center justify-between cursor-pointer transition-all hover:-translate-y-1 group">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 bg-green-950 border-2 border-green-800 shadow-inner rounded-full flex items-center justify-center font-black text-emerald-400 group-hover:bg-gradient-to-br group-hover:from-yellow-400 group-hover:to-yellow-500 group-hover:text-green-950 group-hover:border-yellow-300 transition-all">
                                    {group.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <span className="text-xl font-black text-white drop-shadow-md">{group.name}</span>
                                    <span className="block text-[10px] text-emerald-400/50 font-bold uppercase tracking-widest mt-1 group-hover:text-yellow-400/70 transition-colors">Ver Ranking</span>
                                </div>
                            </div>
                            <ChevronRight className="w-6 h-6 text-green-700 group-hover:text-yellow-400 transition-colors" />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default GroupsPage;