import { useEffect, useState } from 'react';
import { matchService } from '../services/matchService';
import { History, CheckCircle2, XCircle, MinusCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const getCountryCode = (countryName: string) => {
    const map: Record<string, string> = {
        'BOS': 'ba', 'QAT': 'qa', 'SUI': 'ch', 'SCO': 'gb-sct', 'AUS': 'au',
        'IVO': 'ci', 'CUR': 'cw', 'EGY': 'eg', 'IRA': 'ir', 'NEW': 'nz',
        'CAP': 'cv', 'ARA': 'sa', 'SEN': 'sn', 'NOR': 'no', 'JOR': 'jo',
        'CON': 'cd', 'UZB': 'uz', 'CRO': 'hr', 'GHA': 'gh',
        'Algeria': 'dz', 'Argelia': 'dz', 'Turkey': 'tr', 'Turquía': 'tr', 'Türkiye': 'tr',
        'Czechia': 'cz', 'Czech Republic': 'cz', 'República Checa': 'cz',
        'Tunisia': 'tn', 'Túnez': 'tn', 'Sweden': 'se', 'Suecia': 'se',
        'South Africa': 'za', 'Sudáfrica': 'za',
        'Uruguay': 'uy', 'Argentina': 'ar', 'Brazil': 'br', 'Brasil': 'br', 'Chile': 'cl', 'Colombia': 'co',
        'Ecuador': 'ec', 'Paraguay': 'py', 'Peru': 'pe', 'Perú': 'pe', 'Venezuela': 've',
        'USA': 'us', 'United States': 'us', 'Estados Unidos': 'us', 'Mexico': 'mx', 'México': 'mx',
        'Canada': 'ca', 'Canadá': 'ca', 'Costa Rica': 'cr', 'Panama': 'pa', 'Haiti': 'ht', 'Jamaica': 'jm',
        'France': 'fr', 'Francia': 'fr', 'Spain': 'es', 'España': 'es', 'Germany': 'de', 'Alemania': 'de',
        'Italy': 'it', 'Italia': 'it', 'England': 'gb-eng', 'Inglaterra': 'gb-eng', 'Portugal': 'pt',
        'Netherlands': 'nl', 'Países Bajos': 'nl', 'Belgium': 'be', 'Bélgica': 'be', 'Croatia': 'hr',
        'Japan': 'jp', 'Japón': 'jp', 'South Korea': 'kr', 'Corea del Sur': 'kr', 'Morocco': 'ma', 'Marruecos': 'ma'
    };
    return map[countryName] || 'un';
};

const HistoryPage = () => {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const [matchesData, predictionsData] = await Promise.all([
                    matchService.getMatches(),
                    matchService.getMyPredictions()
                ]);

                const finishedMatches = matchesData.filter(m => m.status === 'Finished');

                const combinedHistory = finishedMatches.map(match => {
                    const prediction = predictionsData.find(p => p.matchId === match.id);

                    let points = 0;
                    if (prediction) {
                        const predHome = prediction.predictedHomeScore;
                        const predAway = prediction.predictedAwayScore;
                        const actHome = match.homeScore ?? 0;
                        const actAway = match.awayScore ?? 0;

                        if (predHome === actHome && predAway === actAway) {
                            points = 8;
                        } else if (
                            (predHome > predAway && actHome > actAway) ||
                            (predHome < predAway && actHome < actAway) ||
                            (predHome === predAway && actHome === actAway)
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

    if (loading) return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
            <div className="text-4xl animate-bounce">⚽</div>
            <div className="text-yellow-400 font-black tracking-widest uppercase animate-pulse">Buscando en el VAR...</div>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 relative">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-4 mb-8 border-b border-green-800/50 pb-6 relative"
            >
                <div className="bg-gradient-to-br from-yellow-300 to-yellow-500 p-3 sm:p-4 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.4)]">
                    <History className="w-6 h-6 sm:w-8 sm:h-8 text-green-950" />
                </div>
                <div>
                    <h2 className="text-3xl sm:text-4xl font-black text-white italic drop-shadow-md tracking-tighter">MI <span className="text-yellow-400">HISTORIAL</span></h2>
                    <p className="text-emerald-400/70 text-[10px] sm:text-xs font-black uppercase tracking-widest">Partidos Finalizados</p>
                </div>
            </motion.div>

            {history.length === 0 ? (
                <div className="text-center py-20 bg-green-900/30 backdrop-blur-sm rounded-3xl border border-dashed border-green-800/50">
                    <p className="text-emerald-400/70 font-bold">Todavía no hay partidos finalizados.</p>
                </div>
            ) : (
                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={{
                        hidden: { opacity: 0 },
                        show: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.25
                            }
                        }
                    } as any}
                    className="flex flex-col gap-4"
                >
                    {history.map((item) => (
                        <motion.div
                            variants={{
                                hidden: { opacity: 0, scale: 0.95, y: 30 },
                                show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 14 } }
                            } as any}
                            key={item.id} className="bg-green-900/30 backdrop-blur-sm border border-green-800/50 rounded-[1.5rem] p-4 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-yellow-500/30 hover:shadow-[0_5px_20px_rgba(234,179,8,0.15)] transition-all relative overflow-hidden group">

                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-green-500/20 to-transparent"></div>

                            {/* Fecha y Grupo */}
                            <div className="w-full md:w-auto flex justify-between md:flex-col md:items-start text-[10px] font-black uppercase text-emerald-400/70 min-w-[120px] relative z-10">
                                <span className="bg-green-950/80 px-2 py-1 rounded-md border border-green-800/50 shadow-inner mb-0 md:mb-2 font-mono text-emerald-300">
                                    {new Date(item.matchDate).toLocaleDateString('es-UY', { day: 'numeric', month: 'short' })}
                                </span>
                                <span className="text-yellow-400 tracking-tighter bg-yellow-400/10 px-2 py-1 rounded-md border border-yellow-400/20">
                                    {item.groupName.replace('_', ' ')}
                                </span>
                            </div>

                            {/* Resultado REAL */}
                            <div className="flex items-center justify-center gap-2 sm:gap-4 flex-1 relative z-10">
                                <div className="flex items-center gap-2 w-20 sm:w-24 justify-end">
                                    <span className="font-black text-white text-sm hidden md:block drop-shadow-md">{item.homeTeam.substring(0, 3).toUpperCase()}</span>
                                    <img src={`https://flagcdn.com/w40/${getCountryCode(item.homeTeam)}.png`} alt="home" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-green-950 shadow-[0_0_10px_rgba(0,0,0,0.5)]" />
                                </div>

                                <div className="bg-black/40 px-4 sm:px-6 py-2 rounded-xl border-2 border-green-950 flex items-center gap-2 font-mono font-bold text-2xl text-yellow-400 shadow-inner">
                                    <span>{item.homeScore}</span>
                                    <span className="text-green-800 font-sans">:</span>
                                    <span>{item.awayScore}</span>
                                </div>

                                <div className="flex items-center gap-2 w-20 sm:w-24 justify-start">
                                    <img src={`https://flagcdn.com/w40/${getCountryCode(item.awayTeam)}.png`} alt="away" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-green-950 shadow-[0_0_10px_rgba(0,0,0,0.5)]" />
                                    <span className="font-black text-white text-sm hidden md:block drop-shadow-md">{item.awayTeam.substring(0, 3).toUpperCase()}</span>
                                </div>
                            </div>

                            {/* Tu Predicción y Puntos */}
                            <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-6 bg-green-950/40 md:bg-transparent p-4 md:p-0 rounded-xl relative z-10 border md:border-none border-green-800/50">

                                <div className="flex flex-col items-center md:items-end">
                                    <span className="text-[9px] font-black uppercase text-emerald-400/70 mb-1 tracking-widest">Tu Jugada</span>
                                    {item.prediction ? (
                                        <span className="font-mono font-bold text-lg text-white drop-shadow-sm bg-black/30 px-3 py-1 rounded-lg border border-green-900 shadow-inner">
                                            {item.prediction.predictedHomeScore} <span className="text-green-800/80 mx-1">:</span> {item.prediction.predictedAwayScore}
                                        </span>
                                    ) : (
                                        <span className="font-bold text-red-500/80 text-[10px] uppercase tracking-widest border border-red-500/20 bg-red-500/10 px-2 py-1 rounded-md">No Jugó</span>
                                    )}
                                </div>

                                {/* Píldora de Puntos */}
                                {item.prediction ? (
                                    <div className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-black text-xs transition-all ${item.points === 8
                                        ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)] border border-emerald-400' :
                                        item.points === 3
                                            ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-green-950 shadow-[0_0_15px_rgba(234,179,8,0.5)] border border-yellow-300' :
                                            'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)] border border-red-400'
                                        }`}>
                                        {item.points === 8 && <CheckCircle2 className="w-4 h-4" />}
                                        {item.points === 3 && <MinusCircle className="w-4 h-4" />}
                                        {item.points === 0 && <XCircle className="w-4 h-4" />}
                                        +{item.points} PTS
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-black text-xs bg-slate-800/50 text-slate-500 border border-slate-700">
                                        <XCircle className="w-4 h-4" />
                                        0 PTS
                                    </div>
                                )}

                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
};

export default HistoryPage;