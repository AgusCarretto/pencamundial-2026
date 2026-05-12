import { useEffect, useState } from 'react';
import { matchService } from '../services/matchService';
import { adminService } from '../services/adminService';
import type { Match } from '../types';
import { Settings, CheckCircle, RefreshCw } from 'lucide-react';

const AdminPage = () => {
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState<Record<number, { home: number, away: number }>>({});
    const [isSyncing, setIsSyncing] = useState(false);


    const handleSync = async () => {
        setIsSyncing(true);
        try {
            const response = await adminService.syncMatches();
            alert(response.message); // Te va a mostrar "Creados: X, Actualizados: Y"
            loadMatches(); // Recargamos la lista para ver los cambios
        } catch (error) {
            alert("Ocurrió un error al sincronizar.");
        } finally {
            setIsSyncing(false);
        }
    };

    useEffect(() => {
        loadMatches();
    }, []);

    const loadMatches = async () => {
        const data = await matchService.getMatches();
        // Filtramos solo los pendientes para no llenar la pantalla
        setMatches(data.filter(m => m.status === 'Pending'));
        setLoading(false);
    };

    const handleFinish = async (matchId: number) => {
        const score = results[matchId] || { home: 0, away: 0 };
        if (!window.confirm("¿Estás seguro? Esto repartirá puntos a todos los usuarios.")) return;

        try {
            await adminService.finishMatch(matchId, score.home, score.away);
            alert("¡Partido finalizado!");
            loadMatches(); // Recargar lista
        } catch (error) {
            alert("Error al finalizar el partido.");
        }
    };

    if (loading) return <div className="p-10 text-center text-slate-500">Cargando panel...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
                <div className="flex items-center gap-3">
                    <Settings className="w-7 h-7 text-orange-500" />
                    <h2 className="text-3xl font-extrabold text-white">Panel de Control</h2>
                </div>

                <button
                    onClick={handleSync}
                    disabled={isSyncing}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${isSyncing
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-500 text-white'
                        }`}
                >
                    <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                    {isSyncing ? 'Sincronizando...' : 'Sincronizar Fixture'}
                </button>
            </div>

            <div className="grid gap-4">
                {matches.map(match => (
                    <div key={match.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                        <div className="w-1/3 font-bold text-white">
                            {match.homeTeam} vs {match.awayTeam}
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                className="w-12 h-10 bg-slate-950 border border-slate-700 rounded text-center text-white"
                                onChange={(e) => setResults({ ...results, [match.id]: { ...(results[match.id] || { away: 0 }), home: parseInt(e.target.value) } })}
                            />
                            <span className="text-slate-500">-</span>
                            <input
                                type="number"
                                className="w-12 h-10 bg-slate-950 border border-slate-700 rounded text-center text-white"
                                onChange={(e) => setResults({ ...results, [match.id]: { ...(results[match.id] || { home: 0 }), away: parseInt(e.target.value) } })}
                            />
                        </div>

                        <button
                            onClick={() => handleFinish(match.id)}
                            className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all"
                        >
                            <CheckCircle className="w-4 h-4" /> Finalizar
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminPage;