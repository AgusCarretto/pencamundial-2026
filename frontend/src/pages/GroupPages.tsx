import { useEffect, useState } from 'react';
import { groupService } from '../services/groupService';
import { useNavigate } from 'react-router-dom';
import { Users, PlusCircle, LogIn, ChevronRight } from 'lucide-react';

// Tipado rápido para salir del paso (luego lo pasamos a types/index.ts)
interface Group {
    id: number;
    name: string;
}

const GroupsPage = () => {
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const [groupInput, setGroupInput] = useState('');
    const [error, setError] = useState('');

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

    const navigate = useNavigate();

    const handleCreateOrJoin = async (action: 'create' | 'join') => {
        if (!groupInput.trim()) return;
        setError('');

        try {
            if (action === 'create') {
                const newGroup = await groupService.createGroup(groupInput);
                // Redirigimos usando el ID que nos devolvió C#
                navigate(`/groups/${newGroup.id}`);
            } else {
                const response = await groupService.joinGroup(groupInput);
                // Redirigimos usando el ID que agregamos a C# en el Paso 1
                navigate(`/groups/${response.groupId}`);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || `Error al ${action === 'create' ? 'crear' : 'unirse al'} grupo.`);
        }
    };

    if (loading) return <div className="p-10 text-center text-slate-500">Cargando grupos...</div>;

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-5">
                <div className="bg-blue-950 p-3 rounded-2xl border border-blue-800">
                    <Users className="w-7 h-7 text-blue-400" />
                </div>
                <div>
                    <h2 className="text-3xl font-extrabold text-white tracking-tighter">Mis Grupos</h2>
                    <p className="text-slate-500">Competí contra tus amigos</p>
                </div>
            </div>

            {/* Controles para Crear / Unirse */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
                <label className="block text-sm font-bold text-slate-400 mb-3">Unite a un grupo o creá el tuyo</label>
                <div className="flex flex-col sm:flex-row gap-3">
                    <input
                        type="text"
                        value={groupInput}
                        onChange={(e) => setGroupInput(e.target.value)}
                        placeholder="Nombre del grupo..."
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleCreateOrJoin('join')}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                        >
                            <LogIn className="w-4 h-4" /> Unirse
                        </button>
                        <button
                            onClick={() => handleCreateOrJoin('create')}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                        >
                            <PlusCircle className="w-4 h-4" /> Crear
                        </button>
                    </div>
                </div>
                {error && <p className="text-red-400 text-sm mt-3 font-medium">{error}</p>}
            </div>

            {/* Lista de Grupos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groups.length === 0 ? (
                    <div className="col-span-full text-center p-10 border border-dashed border-slate-700 rounded-2xl text-slate-500">
                        Todavía no estás en ningún grupo. ¡Creá uno y pasale el nombre a tus amigos!
                    </div>
                ) : (
                    groups.map(group => (
                        <div key={group.id} onClick={() => navigate(`/groups/${group.id}`)} className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-5 rounded-2xl flex items-center justify-between cursor-pointer transition-all group">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center font-black text-slate-400 group-hover:text-blue-400 transition-colors">
                                    {group.name.substring(0, 2).toUpperCase()}
                                </div>
                                <span className="text-lg font-bold text-white">{group.name}</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default GroupsPage;