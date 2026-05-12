import { useEffect, useState } from 'react';
import { matchService } from '../services/matchService';
//import type { Match } from '../types';
import { History, CheckCircle2, XCircle, MinusCircle } from 'lucide-react';

// Si lo sacaste a un helper, importalo. Si no, pegá el diccionario getCountryCode acá.
const getCountryCode = (countryName: string) => {
    const map: Record<string, string> = {
        'Uruguay': 'uy', 'Argentina': 'ar', 'Brasil': 'br', 'Francia': 'fr', 'España': 'es', 'Alemania': 'de', 'Inglaterra': 'gb-eng', 'Estados Unidos': 'us', 'México': 'mx', 'Canadá': 'ca', 'Bosnia-Herzegovina': 'ba', 'Corea del Sur': 'kr', 'Japón': 'jp'
        // ... (tu lista completa) ...
    };
    return map[countryName] || 'un';
};

const HistoryPage = () => {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                // Traemos partidos y predicciones
                const [matchesData, predictionsData] = await Promise.all([
                    matchService.getMatches(),
                    matchService.getMyPredictions()
                ]);

                // Filtramos SOLO los finalizados
                const finishedMatches = matchesData.filter(m => m.status === 'Finished');

                // Armamos un arreglo combinando el partido con lo que predijo el usuario
                const combinedHistory = finishedMatches.map(match => {
                    const prediction = predictionsData.find(p => p.matchId === match.id);

                    // Calculamos los puntos visuales acá
                    let points = 0;
                    if (prediction) {
                        const predHome = prediction.predictedHomeScore;
                        const predAway = prediction.predictedAwayScore;
                        const actHome = match.homeScore ?? 0;
                        const actAway = match.awayScore ?? 0;

                        // Lógica exacta (8 pts)
                        if (predHome === actHome && predAway === actAway) {
                            points = 8;
                        }
                        // Lógica tendencia (3 pts)
                        else if (
                            (predHome > predAway && actHome > actAway) || // Gana Local
                            (predHome < predAway && actHome < actAway) || // Gana Visita
                            (predHome === predAway && actHome === actAway) // Empate
                        ) {
                            points = 3;
                        }
                    }

                    return {
                        ...match,
                        prediction,
                        points
                    };
                });

                // Los ordenamos por fecha (del más reciente al más viejo)
                combinedHistory.sort((a, b) => new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime());
                setHistory(combinedHistory);

            } catch (error) {
                console.error("Error cargando historial", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    if (loading) return <div className="p-10 text-center text-blue-500 font-bold animate-pulse text-xl">Cargando tu historial...</div>;

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="flex items-center gap-4 mb-8 border-b border-slate-800 pb-6">
                <div className="bg-emerald-600/20 p-3 rounded-2xl">
                    <History className="w-8 h-8 text-emerald-500" />
                </div>
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tighter">MI HISTORIAL</h2>
                    <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Partidos Finalizados</p>
                </div>
            </div>

            {history.length === 0 ? (
                <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-dashed border-slate-800">
                    <p className="text-slate-500 font-bold">Todavía no hay partidos finalizados.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {history.map((item) => (
                        <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-slate-700 transition-all">

                            {/* Fecha y Grupo */}
                            <div className="w-full md:w-auto flex justify-between md:flex-col md:items-start text-[10px] font-black uppercase text-slate-500 min-w-[120px]">
                                <span>{new Date(item.matchDate).toLocaleDateString('es-UY', { day: 'numeric', month: 'short' })}</span>
                                <span className="text-blue-500">{item.groupName.replace('_', ' ')}</span>
                            </div>

                            {/* Resultado REAL */}
                            <div className="flex items-center justify-center gap-4 flex-1">
                                <div className="flex items-center gap-2 w-24 justify-end">
                                    <span className="font-black text-white text-sm hidden md:block">{item.homeTeam.substring(0, 3).toUpperCase()}</span>
                                    <img src={`https://flagcdn.com/w40/${getCountryCode(item.homeTeam)}.png`} alt="home" className="w-6 h-6 rounded-full object-cover" />
                                </div>

                                <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 flex items-center gap-2 font-black text-xl text-white">
                                    <span>{item.homeScore}</span>
                                    <span className="text-slate-700">-</span>
                                    <span>{item.awayScore}</span>
                                </div>

                                <div className="flex items-center gap-2 w-24 justify-start">
                                    <img src={`https://flagcdn.com/w40/${getCountryCode(item.awayTeam)}.png`} alt="away" className="w-6 h-6 rounded-full object-cover" />
                                    <span className="font-black text-white text-sm hidden md:block">{item.awayTeam.substring(0, 3).toUpperCase()}</span>
                                </div>
                            </div>

                            {/* Tu Predicción y Puntos */}
                            <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-6 bg-slate-950 md:bg-transparent p-3 md:p-0 rounded-xl">

                                <div className="flex flex-col items-center md:items-end">
                                    <span className="text-[9px] font-black uppercase text-slate-500 mb-1">Tu Jugada</span>
                                    {item.prediction ? (
                                        <span className="font-black text-slate-300">
                                            {item.prediction.predictedHomeScore} - {item.prediction.predictedAwayScore}
                                        </span>
                                    ) : (
                                        <span className="font-bold text-red-500/50 text-xs">NO JUGÓ</span>
                                    )}
                                </div>

                                {/* Píldora de Puntos */}
                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-black text-xs ${item.points === 8 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                    item.points === 3 ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                                        'bg-slate-800 text-slate-500'
                                    }`}>
                                    {item.points === 8 && <CheckCircle2 className="w-4 h-4" />}
                                    {item.points === 3 && <MinusCircle className="w-4 h-4" />}
                                    {item.points === 0 && <XCircle className="w-4 h-4" />}
                                    +{item.points} PTS
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HistoryPage;