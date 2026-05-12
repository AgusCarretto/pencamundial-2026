import { useEffect, useState } from 'react';
import { matchService } from '../services/matchService';
import type { Match } from '../types';
import { CalendarDays, Save, CheckCircle2, Lock, Trophy, ChevronRight } from 'lucide-react';

// Diccionario de banderas corregido con los nombres exactos de la API
const getCountryCode = (countryName: string) => {
    const map: Record<string, string> = {
        // Los que faltaban según tu reporte
        'Algeria': 'dz', 'Argelia': 'dz',
        'Turkey': 'tr', 'Turquía': 'tr', 'Türkiye': 'tr',
        'Czechia': 'cz', 'Czech Republic': 'cz', 'República Checa': 'cz',
        'Tunisia': 'tn', 'Túnez': 'tn',
        'Sweden': 'se', 'Suecia': 'se',
        'South Africa': 'za', 'Sudáfrica': 'za',

        // América
        'Uruguay': 'uy', 'Argentina': 'ar', 'Brazil': 'br', 'Brasil': 'br', 'Chile': 'cl', 'Colombia': 'co',
        'Ecuador': 'ec', 'Paraguay': 'py', 'Peru': 'pe', 'Perú': 'pe', 'Venezuela': 've',
        'USA': 'us', 'United States': 'us', 'Estados Unidos': 'us', 'Mexico': 'mx', 'México': 'mx',
        'Canada': 'ca', 'Canadá': 'ca', 'Costa Rica': 'cr', 'Panama': 'pa', 'Haiti': 'ht', 'Jamaica': 'jm',

        // Europa & Resto
        'France': 'fr', 'Francia': 'fr', 'Spain': 'es', 'España': 'es', 'Germany': 'de', 'Alemania': 'de',
        'Italy': 'it', 'Italia': 'it', 'England': 'gb-eng', 'Inglaterra': 'gb-eng', 'Portugal': 'pt',
        'Netherlands': 'nl', 'Países Bajos': 'nl', 'Belgium': 'be', 'Bélgica': 'be', 'Croatia': 'hr',
        'Japan': 'jp', 'Japón': 'jp', 'South Korea': 'kr', 'Corea del Sur': 'kr', 'Morocco': 'ma', 'Marruecos': 'ma'
    };
    return map[countryName] || 'un';
};

const Dashboard = () => {
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);
    const [localScores, setLocalScores] = useState<Record<number, { home: number, away: number }>>({});
    const [savedStatus, setSavedStatus] = useState<Record<number, boolean>>({});
    const [selectedGroup, setSelectedGroup] = useState<string>('Todos');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [matchesData, predictionsData] = await Promise.all([
                    matchService.getMatches(),
                    matchService.getMyPredictions()
                ]);
                setMatches(matchesData);
                const initialScores: Record<number, { home: number, away: number }> = {};
                predictionsData.forEach(p => {
                    initialScores[p.matchId] = { home: p.predictedHomeScore, away: p.predictedAwayScore };
                });
                setLocalScores(initialScores);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const handleScoreChange = (matchId: number, side: 'home' | 'away', value: string) => {
        const score = parseInt(value) || 0;
        setLocalScores(prev => ({ ...prev, [matchId]: { ...prev[matchId], [side]: score } }));
        setSavedStatus(prev => ({ ...prev, [matchId]: false }));
    };

    const handleSavePrediction = async (matchId: number) => {
        const score = localScores[matchId] || { home: 0, away: 0 };
        try {
            await matchService.submitPrediction(matchId, score.home, score.away);
            setSavedStatus(prev => ({ ...prev, [matchId]: true }));
            setTimeout(() => setSavedStatus(prev => ({ ...prev, [matchId]: false })), 2000);
        } catch (error) {
            alert("Error al guardar.");
        }
    };

    if (loading) return <div className="p-10 text-center text-blue-500 font-bold animate-pulse">Cargando...</div>;

    const playableMatches = matches.filter(m => m.homeTeam !== "A definir" && m.awayTeam !== "A definir");
    const allGroups = [...new Set(playableMatches.map(m => m.groupName))];
    const groupStages = allGroups.filter(g => g.toLowerCase().includes("group") || g.toLowerCase().includes("grupo")).sort();
    const knockoutStages = allGroups.filter(g => !groupStages.includes(g)).sort();
    const filterOptions = ['Todos', ...groupStages, ...knockoutStages];

    const filteredMatches = selectedGroup === 'Todos'
        ? playableMatches
        : playableMatches.filter(m => m.groupName === selectedGroup);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Diseño del Scrollbar para PC */}
            <style>{`
                .custom-scroll::-webkit-scrollbar { height: 6px; }
                .custom-scroll::-webkit-scrollbar-track { background: transparent; }
                .custom-scroll::-webkit-scrollbar-thumb { 
                    background: #1e293b; 
                    border-radius: 10px; 
                }
                .custom-scroll:hover::-webkit-scrollbar-thumb { background: #334155; }
            `}</style>

            <div className="flex items-center gap-4 mb-10 border-b border-slate-800 pb-8">
                <div className="bg-blue-600/20 p-3 rounded-2xl">
                    <Trophy className="w-8 h-8 text-blue-500" />
                </div>
                <h2 className="text-3xl font-black text-white italic">FIXTURE 2026</h2>
            </div>

            {/* Contenedor de filtros con diseño mejorado */}
            <div className="relative mb-10">
                <div className="flex gap-3 overflow-x-auto pb-4 custom-scroll snap-x">
                    {filterOptions.map(group => {
                        const isKnockout = knockoutStages.includes(group);
                        return (
                            <button
                                key={group}
                                onClick={() => setSelectedGroup(group)}
                                className={`snap-start whitespace-nowrap px-6 py-3 rounded-xl text-[10px] font-black transition-all border uppercase tracking-widest ${selectedGroup === group
                                    ? 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-900/40'
                                    : isKnockout
                                        ? 'bg-orange-950/20 text-orange-400 border-orange-900/50 hover:bg-orange-900/30'
                                        : 'bg-slate-900/50 text-slate-500 border-slate-800 hover:border-slate-700'
                                    }`}
                            >
                                {group.replace('_', ' ')}
                            </button>
                        );
                    })}
                </div>
                {/* Indicador visual de que hay más para scrollear */}
                <div className="absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-[#020617] to-transparent pointer-events-none md:hidden" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMatches.map((match) => {
                    const score = localScores[match.id] || { home: 0, away: 0 };
                    const isSaved = savedStatus[match.id];
                    const isFinished = match.status === 'Finished';

                    return (
                        <div key={match.id} className="bg-[#0f172a] border border-slate-800/60 rounded-[2.5rem] p-6 shadow-2xl flex flex-col hover:scale-[1.02] transition-all group">

                            <div className="flex justify-between items-center mb-8">
                                <span className="bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800 text-[10px] font-black text-slate-500 uppercase">
                                    {new Date(match.matchDate).toLocaleDateString('es-UY', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <span className="text-[10px] font-black text-blue-500 uppercase tracking-tighter">
                                    {match.groupName.replace('_', ' ')}
                                </span>
                            </div>

                            <div className="flex items-center justify-between gap-2 mb-8">
                                {/* Local */}
                                <div className="flex flex-col items-center w-[40%]">
                                    <div className="w-14 h-14 mb-3 overflow-hidden rounded-full border-2 border-slate-800 shadow-xl bg-slate-900">
                                        <img
                                            src={`https://flagcdn.com/w160/${getCountryCode(match.homeTeam)}.png`}
                                            alt={match.homeTeam}
                                            className="w-full h-full object-cover" // object-cover evita que se estire
                                        />
                                    </div>
                                    <span className="font-black text-white text-lg tracking-tighter mb-1">{match.homeTeam.substring(0, 3).toUpperCase()}</span>
                                </div>

                                {/* Marcador */}
                                <div className="flex items-center gap-1">
                                    <input
                                        type="number"
                                        value={score.home}
                                        onChange={(e) => handleScoreChange(match.id, 'home', e.target.value)}
                                        disabled={isFinished}
                                        className="w-12 h-14 bg-slate-950 border border-slate-800 rounded-2xl text-center text-2xl font-black text-white focus:border-blue-500 transition-all outline-none"
                                    />
                                    <span className="text-slate-800 font-black">/</span>
                                    <input
                                        type="number"
                                        value={score.away}
                                        onChange={(e) => handleScoreChange(match.id, 'away', e.target.value)}
                                        disabled={isFinished}
                                        className="w-12 h-14 bg-slate-950 border border-slate-800 rounded-2xl text-center text-2xl font-black text-white focus:border-blue-500 transition-all outline-none"
                                    />
                                </div>

                                {/* Visitante */}
                                <div className="flex flex-col items-center w-[40%]">
                                    <div className="w-14 h-14 mb-3 overflow-hidden rounded-full border-2 border-slate-800 shadow-xl bg-slate-900">
                                        <img
                                            src={`https://flagcdn.com/w160/${getCountryCode(match.awayTeam)}.png`}
                                            alt={match.awayTeam}
                                            className="w-full h-full object-cover" // object-cover evita que se estire
                                        />
                                    </div>
                                    <span className="font-black text-white text-lg tracking-tighter mb-1">{match.awayTeam.substring(0, 3).toUpperCase()}</span>
                                </div>
                            </div>

                            {isFinished ? (
                                <div className="w-full py-4 bg-slate-900/50 rounded-2xl border border-slate-800 text-center text-[10px] font-black text-slate-600 uppercase flex items-center justify-center gap-2">
                                    <Lock className="w-3 h-3" /> Cerrado
                                </div>
                            ) : (
                                <button
                                    onClick={() => handleSavePrediction(match.id)}
                                    className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${isSaved
                                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-900/20'
                                        : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/20'
                                        }`}
                                >
                                    {isSaved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                                    {isSaved ? 'Guardado' : 'Guardar'}
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Dashboard;