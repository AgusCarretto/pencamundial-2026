import { useEffect, useState } from 'react';
import { matchService } from '../services/matchService';
import type { Match } from '../types';
import { CalendarDays, Save, CheckCircle2 } from 'lucide-react';

const Dashboard = () => {
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);
    // Estado local para los inputs de goles (usamos un objeto con matchId como llave)
    const [localScores, setLocalScores] = useState<Record<number, { home: number, away: number }>>({});
    const [savedStatus, setSavedStatus] = useState<Record<number, boolean>>({});

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [matchesData, predictionsData] = await Promise.all([
                    matchService.getMatches(),
                    matchService.getMyPredictions()
                ]);

                setMatches(matchesData);

                // Llenamos los inputs con lo que el usuario ya había predicho
                const initialScores: Record<number, { home: number, away: number }> = {};
                predictionsData.forEach(p => {
                    initialScores[p.matchId] = { home: p.predictedHomeScore, away: p.predictedAwayScore };
                });
                setLocalScores(initialScores);
            } catch (error) {
                console.error("Error cargando datos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const handleScoreChange = (matchId: number, side: 'home' | 'away', value: string) => {
        const score = parseInt(value) || 0;
        setLocalScores(prev => ({
            ...prev,
            [matchId]: { ...prev[matchId], [side]: score }
        }));
        setSavedStatus(prev => ({ ...prev, [matchId]: false })); // Resetear estado de "guardado" si cambia el número
    };

    const handleSavePrediction = async (matchId: number) => {
        const score = localScores[matchId] || { home: 0, away: 0 };
        try {
            await matchService.submitPrediction(matchId, score.home, score.away);
            setSavedStatus(prev => ({ ...prev, [matchId]: true }));

            // Opcional: desaparecer el check verde después de 2 segundos
            setTimeout(() => {
                setSavedStatus(prev => ({ ...prev, [matchId]: false }));
            }, 2000);
        } catch (error) {
            alert("No se pudo guardar la predicción. ¿El partido ya empezó?");
        }
    };

    if (loading) return <div className="p-10 text-center text-blue-500">Cargando fixture...</div>;

    return (
        <div>
            <div className="flex items-center gap-2 mb-8 border-b border-slate-800 pb-4">
                <CalendarDays className="w-6 h-6 text-blue-500" />
                <h2 className="text-2xl font-bold text-white tracking-tight text-center">Tus Predicciones</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {matches.map((match) => {
                    const score = localScores[match.id] || { home: 0, away: 0 };
                    const isSaved = savedStatus[match.id];

                    return (
                        <div key={match.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                            <div className="flex justify-between items-center mb-6 text-xs font-bold uppercase tracking-widest text-slate-500">
                                <span>{new Date(match.matchDate).toLocaleDateString('es-UY', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                                <span className="bg-slate-800 px-2 py-1 rounded text-slate-400">Grupo A</span>
                            </div>

                            <div className="flex items-center justify-between gap-4">
                                {/* Local */}
                                <div className="flex flex-col items-center w-1/3 text-center">
                                    <div className="w-12 h-12 bg-slate-800 rounded-full mb-2 flex items-center justify-center border border-slate-700 group-hover:border-blue-500/50 transition-colors">
                                        <span className="text-white font-bold">{match.homeTeam.substring(0, 3)}</span>
                                    </div>
                                    <span className="text-sm font-bold text-white leading-tight">{match.homeTeam}</span>
                                </div>

                                {/* Inputs de Predicción */}
                                <div className="flex items-center gap-2 w-1/3 justify-center">
                                    <input
                                        type="number"
                                        min="0"
                                        value={score.home}
                                        onChange={(e) => handleScoreChange(match.id, 'home', e.target.value)}
                                        className="w-12 h-12 bg-slate-950 border border-slate-700 rounded-lg text-center text-xl font-black text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                    />
                                    <span className="text-slate-600 font-bold">-</span>
                                    <input
                                        type="number"
                                        min="0"
                                        value={score.away}
                                        onChange={(e) => handleScoreChange(match.id, 'away', e.target.value)}
                                        className="w-12 h-12 bg-slate-950 border border-slate-700 rounded-lg text-center text-xl font-black text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                    />
                                </div>

                                {/* Visitante */}
                                <div className="flex flex-col items-center w-1/3 text-center">
                                    <div className="w-12 h-12 bg-slate-800 rounded-full mb-2 flex items-center justify-center border border-slate-700 group-hover:border-blue-500/50 transition-colors">
                                        <span className="text-white font-bold">{match.awayTeam.substring(0, 3)}</span>
                                    </div>
                                    <span className="text-sm font-bold text-white leading-tight">{match.awayTeam}</span>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
                                <button
                                    onClick={() => handleSavePrediction(match.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${isSaved
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-blue-600 hover:bg-blue-500 text-white active:scale-95'
                                        }`}
                                >
                                    {isSaved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                                    {isSaved ? 'Guardado' : 'Guardar Jugada'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Dashboard;