import { useEffect, useState } from 'react';
import { matchService } from '../services/matchService';
import type { Match } from '../types';
import { Save, CheckCircle2, Lock, Trophy } from 'lucide-react';

// Diccionario de banderas mapeado por nombre de país completo (inglés y español)
const getCountryCode = (countryName: string) => {
    const map: Record<string, string> = {
        // Los que faltaban (Inglés y Español)
        'Bosnia and Herzegovina': 'ba', 'Bosnia': 'ba', 'Bosnia-Herzegovina': 'ba',
        'Qatar': 'qa', 'Catar': 'qa',
        'Switzerland': 'ch', 'Suiza': 'ch',
        'Scotland': 'gb-sct', 'Escocia': 'gb-sct',
        'Australia': 'au',
        'Ivory Coast': 'ci', 'Côte d\'Ivoire': 'ci', 'Costa de Marfil': 'ci',
        'Curacao': 'cw', 'Curaçao': 'cw', 'Curazao': 'cw',
        'Egypt': 'eg', 'Egipto': 'eg',
        'Iran': 'ir', 'Irán': 'ir',
        'New Zealand': 'nz', 'Nueva Zelanda': 'nz',
        'Cape Verde': 'cv', 'Cabo Verde': 'cv', 'Cape Verde Islands': 'cv',
        'Saudi Arabia': 'sa', 'Arabia Saudita': 'sa', 'Arabia Saudí': 'sa',
        'Senegal': 'sn',
        'Norway': 'no', 'Noruega': 'no',
        'Jordan': 'jo', 'Jordania': 'jo',
        'DR Congo': 'cd', 'Congo DR': 'cd', 'R.D. Congo': 'cd', 'República Democrática del Congo': 'cd',
        'Uzbekistan': 'uz', 'Uzbekistán': 'uz',
        'Croatia': 'hr', 'Croacia': 'hr',
        'Ghana': 'gh',
        'Austria': 'at',
        'Iraq': 'iq', 'Irak': 'iq',
        'Haiti': 'ht', 'Haití': 'ht',

        // Más países del mundial o habituales
        'Wales': 'gb-wls', 'Gales': 'gb-wls',
        'Poland': 'pl', 'Polonia': 'pl',
        'Portugal': 'pt',
        'Mexico': 'mx', 'México': 'mx',
        'USA': 'us', 'United States': 'us', 'Estados Unidos': 'us',
        'Canada': 'ca', 'Canadá': 'ca',
        'Jamaica': 'jm',
        'Costa Rica': 'cr',
        'Panama': 'pa', 'Panamá': 'pa',
        'Honduras': 'hn',
        'El Salvador': 'sv',
        'Brazil': 'br', 'Brasil': 'br',
        'Argentina': 'ar',
        'Uruguay': 'uy',
        'Colombia': 'co',
        'Chile': 'cl',
        'Peru': 'pe', 'Perú': 'pe',
        'Ecuador': 'ec',
        'Venezuela': 've',
        'Paraguay': 'py',
        'Bolivia': 'bo',
        'Algeria': 'dz', 'Argelia': 'dz',
        'Turkey': 'tr', 'Turquía': 'tr', 'Türkiye': 'tr',
        'Czechia': 'cz', 'Czech Republic': 'cz', 'República Checa': 'cz',
        'Tunisia': 'tn', 'Túnez': 'tn',
        'Sweden': 'se', 'Suecia': 'se',
        'South Africa': 'za', 'Sudáfrica': 'za',
        'France': 'fr', 'Francia': 'fr',
        'Spain': 'es', 'España': 'es',
        'Germany': 'de', 'Alemania': 'de',
        'Italy': 'it', 'Italia': 'it',
        'England': 'gb-eng', 'Inglaterra': 'gb-eng',
        'Netherlands': 'nl', 'Países Bajos': 'nl', 'Holanda': 'nl',
        'Belgium': 'be', 'Bélgica': 'be',
        'Japan': 'jp', 'Japón': 'jp',
        'South Korea': 'kr', 'Corea del Sur': 'kr',
        'Morocco': 'ma', 'Marruecos': 'ma'
    };
    return map[countryName] || 'un';
};

// Traductor de nombres para la UI
const translateCountryName = (name: string) => {
    const map: Record<string, string> = {
        'Bosnia-Herzegovina': 'Bosnia y Herz.',
        'Bosnia': 'Bosnia',
        'Qatar': 'Catar',
        'Switzerland': 'Suiza',
        'Scotland': 'Escocia',
        'Ivory Coast': 'Costa de Marfil',
        'Cape Verde Islands': 'Cabo Verde',
        'Cape Verde': 'Cabo Verde',
        'Curacao': 'Curazao',
        'Egypt': 'Egipto',
        'Iran': 'Irán',
        'New Zealand': 'Nueva Zelanda',
        'Saudi Arabia': 'Arabia Saudita',
        'Norway': 'Noruega',
        'Jordan': 'Jordania',
        'DR Congo': 'R.D. Congo',
        'Uzbekistan': 'Uzbekistán',
        'Croatia': 'Croacia',
        'Wales': 'Gales',
        'Poland': 'Polonia',
        'Morocco': 'Marruecos',
        'Japan': 'Japón',
        'South Korea': 'Corea del Sur',
        'Belgium': 'Bélgica',
        'Netherlands': 'Países Bajos',
        'England': 'Inglaterra',
        'Italy': 'Italia',
        'Germany': 'Alemania',
        'Spain': 'España',
        'France': 'Francia',
        'South Africa': 'Sudáfrica',
        'Sweden': 'Suecia',
        'Tunisia': 'Túnez',
        'Czechia': 'República Checa',
        'Czech Republic': 'República Checa',
        'Turkey': 'Turquía',
        'Algeria': 'Argelia',
        'Brazil': 'Brasil',
        'United States': 'Estados Unidos',
        'USA': 'Estados Unidos',
        'Haiti': 'Haití',
        'Panama': 'Panamá',
        'Peru': 'Perú',
        'Iraq': 'Irak',
        'Cameroon': 'Camerún',
        'Cameroon ': 'Camerún',
        'Saudi Arabia ': 'Arabia Saudita'
    };
    return map[name] || name;
};

const containerVariants: any = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.25
        }
    }
};

const itemVariants: any = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 120, damping: 14 } }
};

const Dashboard = () => {
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);
    // Cambiado a strings para permitir input vacío y no mostrar '0' forzado
    const [localScores, setLocalScores] = useState<Record<number, { home: string, away: string }>>({});
    const [savedStatus, setSavedStatus] = useState<Record<number, boolean>>({});
    const [hasPredicted, setHasPredicted] = useState<Record<number, boolean>>({});
    const [selectedGroup, setSelectedGroup] = useState<string>('Todos');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [matchesData, predictionsData] = await Promise.all([
                    matchService.getMatches(),
                    matchService.getMyPredictions()
                ]);
                setMatches(matchesData);
                const initialScores: Record<number, { home: string, away: string }> = {};
                const initialPredicted: Record<number, boolean> = {};
                predictionsData.forEach(p => {
                    initialScores[p.matchId] = { home: p.predictedHomeScore.toString(), away: p.predictedAwayScore.toString() };
                    initialPredicted[p.matchId] = true;
                });
                setLocalScores(initialScores);
                setHasPredicted(initialPredicted);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const handleScoreChange = (matchId: number, side: 'home' | 'away', value: string) => {
        const numericValue = value.replace(/[^0-9]/g, '');
        // Evitar ceros a la izquierda innecesarios (ej: '01' -> '1', '00' -> '0')
        const cleanValue = numericValue.replace(/^0+(?=\d)/, '');
        setLocalScores(prev => ({ ...prev, [matchId]: { ...(prev[matchId] || { home: '', away: '' }), [side]: cleanValue } }));
        setSavedStatus(prev => ({ ...prev, [matchId]: false }));
    };

    const handleSavePrediction = async (matchId: number) => {
        const score = localScores[matchId] || { home: '', away: '' };
        const h = parseInt(score.home) || 0;
        const a = parseInt(score.away) || 0;
        try {
            await matchService.submitPrediction(matchId, h, a);
            setSavedStatus(prev => ({ ...prev, [matchId]: true }));
            setHasPredicted(prev => ({ ...prev, [matchId]: true }));
            setTimeout(() => setSavedStatus(prev => ({ ...prev, [matchId]: false })), 2000);
        } catch (error) {
            alert("Error al guardar.");
        }
    };

    if (loading) return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
            <div className="text-4xl animate-bounce">⚽</div>
            <div className="text-yellow-400 font-black tracking-widest uppercase animate-pulse">Armando la cancha...</div>
        </div>
    );

    const playableMatches = matches.filter(m => m.homeTeam !== "A definir" && m.awayTeam !== "A definir");
    const allGroups = [...new Set(playableMatches.map(m => m.groupName))];
    const groupStages = allGroups.filter(g => g.toLowerCase().includes("group") || g.toLowerCase().includes("grupo")).sort();
    const knockoutStages = allGroups.filter(g => !groupStages.includes(g)).sort();
    const filterOptions = ['Todos', ...groupStages, ...knockoutStages];

    const filteredMatches = selectedGroup === 'Todos'
        ? playableMatches
        : playableMatches.filter(m => m.groupName === selectedGroup);

    return (
        <div className="w-full relative">
            <style>{`
                .custom-scroll::-webkit-scrollbar { height: 6px; }
                .custom-scroll::-webkit-scrollbar-track { background: transparent; }
                .custom-scroll::-webkit-scrollbar-thumb { 
                    background: #14532d; 
                    border-radius: 10px; 
                }
                .custom-scroll:hover::-webkit-scrollbar-thumb { background: #166534; }
                /* Ocultar flechas de inputs numéricos por si acaso */
                input[type="number"]::-webkit-inner-spin-button,
                input[type="number"]::-webkit-outer-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
                input[type="number"] {
                    -moz-appearance: textfield;
                }
            `}</style>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-4 mb-10 border-b border-green-800/50 pb-8 relative"
            >
                <div className="bg-gradient-to-br from-yellow-300 to-yellow-500 p-4 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.4)]">
                    <Trophy className="w-8 h-8 text-green-950" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-white italic drop-shadow-md tracking-tighter uppercase">FIXTURE DEL <span className="text-yellow-400">MUNDIAL 2026</span></h2>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="relative mb-10"
            >
                <div className="flex gap-3 overflow-x-auto pb-4 custom-scroll snap-x">
                    {filterOptions.map(group => {
                        const isKnockout = knockoutStages.includes(group);
                        const isSelected = selectedGroup === group;
                        return (
                            <button
                                key={group}
                                onClick={() => setSelectedGroup(group)}
                                className={`snap-start whitespace-nowrap px-6 py-3 rounded-xl text-[10px] font-black transition-all border uppercase tracking-widest active:scale-95 ${isSelected
                                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-green-950 border-yellow-300 shadow-[0_0_15px_rgba(234,179,8,0.4)]'
                                    : isKnockout
                                        ? 'bg-orange-950/40 text-orange-400 border-orange-900/50 hover:bg-orange-900/60 hover:border-orange-500/50'
                                        : 'bg-green-900/60 backdrop-blur-md text-emerald-200/70 border-green-800/80 hover:border-green-600/50 hover:bg-green-800/60'
                                    }`}
                            >
                                {group.replace('_', ' ')}
                            </button>
                        );
                    })}
                </div>
                <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-green-950 to-transparent pointer-events-none md:hidden" />
            </motion.div>

            {/* Tarjetas más grandes y anchas (grid-cols-1 o grid-cols-2 como máximo) */}
            <motion.div
                key={selectedGroup} // Para que se re-anime al cambiar de grupo
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-5"
            >
                {filteredMatches.map((match) => {
                    const score = localScores[match.id] || { home: '', away: '' };
                    const isSaved = savedStatus[match.id];
                    const isPredicted = hasPredicted[match.id];
                    const isFinished = match.status === 'Finished';

                    return (
                        <motion.div variants={itemVariants} key={match.id} className={`bg-green-900/30 backdrop-blur-sm border ${isPredicted ? 'border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.15)]' : 'border-green-800/50'} rounded-[2rem] py-7 px-4 sm:p-6 shadow-xl flex flex-col hover:scale-[1.02] hover:-translate-y-1 hover:border-yellow-500/40 hover:shadow-[0_10px_30px_rgba(234,179,8,0.2)] transition-all group relative overflow-hidden min-h-[230px]`}>
                            <div className={`absolute top-0 left-0 w-full h-1 ${isPredicted ? 'bg-gradient-to-r from-emerald-500/20 via-emerald-400/60 to-emerald-500/20' : 'bg-gradient-to-r from-transparent via-green-500/20 to-transparent'}`}></div>

                            <div className="flex justify-between items-center mb-6 relative z-10">
                                <div className="flex gap-2 items-center flex-wrap">
                                    <span className="bg-black/40 px-3 sm:px-4 py-1.5 rounded-md border border-green-800/60 text-[11px] sm:text-[12px] font-mono text-emerald-300 uppercase shadow-inner">
                                        {new Date(match.matchDate).toLocaleDateString('es-UY', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    {isPredicted && (
                                        <span className="bg-emerald-900/80 text-emerald-300 border border-emerald-500/50 px-2 py-1 rounded-md text-[9px] font-black uppercase flex items-center gap-1 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                                            <CheckCircle2 className="w-3 h-3" /> LISTO
                                        </span>
                                    )}
                                </div>
                                <span className="text-[10px] sm:text-xs font-black text-yellow-400 uppercase tracking-tighter bg-yellow-400/10 px-3 py-1.5 rounded-md border border-yellow-400/30 text-right ml-2 shrink-0 shadow-inner">
                                    {match.groupName.replace('_', ' ')}
                                </span>
                            </div>

                            <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-2 sm:gap-4 mb-8 relative z-10 w-full">
                                {/* Local */}
                                <div className="flex flex-col items-center justify-start gap-2">
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 overflow-hidden rounded-full border-[3px] border-green-950 shadow-[0_0_15px_rgba(0,0,0,0.6)] bg-black shrink-0 mt-1">
                                        <img
                                            src={`https://flagcdn.com/w160/${getCountryCode(match.homeTeam)}.png`}
                                            alt={match.homeTeam}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    {/* Nombre completo debajo, traducido */}
                                    <span className="font-black text-white text-[13px] sm:text-[15px] tracking-tight drop-shadow-md text-center leading-tight px-1 w-full uppercase break-words">
                                        {translateCountryName(match.homeTeam)}
                                    </span>
                                </div>

                                {/* Marcador estilo Tablero Electrónico */}
                                <div className="flex flex-col items-center justify-start pt-2 sm:pt-4">
                                    <div className="flex items-center gap-2 bg-black/50 p-2 sm:p-3 rounded-2xl border-2 border-green-950 shadow-inner">
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            value={score.home}
                                            onChange={(e) => handleScoreChange(match.id, 'home', e.target.value)}
                                            disabled={isFinished}
                                            className="w-10 h-12 sm:w-12 sm:h-14 bg-black/60 rounded-lg text-center text-2xl sm:text-3xl font-mono font-bold text-yellow-400 focus:ring-2 focus:ring-yellow-500 transition-all outline-none shadow-inner"
                                        />
                                        <span className="text-green-800 font-black text-lg sm:text-xl px-0.5">:</span>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            value={score.away}
                                            onChange={(e) => handleScoreChange(match.id, 'away', e.target.value)}
                                            disabled={isFinished}
                                            className="w-10 h-12 sm:w-12 sm:h-14 bg-black/60 rounded-lg text-center text-2xl sm:text-3xl font-mono font-bold text-yellow-400 focus:ring-2 focus:ring-yellow-500 transition-all outline-none shadow-inner"
                                        />
                                    </div>
                                </div>

                                {/* Visitante */}
                                <div className="flex flex-col items-center justify-start gap-2">
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 overflow-hidden rounded-full border-[3px] border-green-950 shadow-[0_0_15px_rgba(0,0,0,0.6)] bg-black shrink-0 mt-1">
                                        <img
                                            src={`https://flagcdn.com/w160/${getCountryCode(match.awayTeam)}.png`}
                                            alt={match.awayTeam}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    {/* Nombre completo debajo, traducido */}
                                    <span className="font-black text-white text-[13px] sm:text-[15px] tracking-tight drop-shadow-md text-center leading-tight px-1 w-full uppercase break-words">
                                        {translateCountryName(match.awayTeam)}
                                    </span>
                                </div>
                            </div>

                            {isFinished ? (
                                <div className="w-full py-3 sm:py-3.5 bg-red-950/50 rounded-xl border border-red-900/60 text-center text-xs sm:text-sm font-black text-red-400 uppercase flex items-center justify-center gap-2 tracking-widest relative z-10 shadow-inner">
                                    <Lock className="w-4 sm:w-5 h-4 sm:h-5" /> Finalizado
                                </div>
                            ) : (
                                <button
                                    onClick={() => handleSavePrediction(match.id)}
                                    className={`w-full py-3 sm:py-4 rounded-xl font-black text-xs sm:text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 sm:gap-3 active:scale-95 relative z-10 ${isSaved
                                        ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)] border border-emerald-400'
                                        : isPredicted
                                            ? 'bg-green-950/80 text-yellow-400 border-2 border-green-700/80 hover:bg-green-900/80'
                                            : 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-green-950 hover:from-yellow-300 hover:to-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_30px_rgba(234,179,8,0.5)]'
                                        }`}
                                >
                                    {isSaved ? <CheckCircle2 className="w-4 sm:w-5 h-4 sm:h-5" /> : (isPredicted ? <CheckCircle2 className="w-4 sm:w-5 h-4 sm:h-5" /> : <Save className="w-4 sm:w-5 h-4 sm:h-5" />)}
                                    {isSaved ? 'Guardado' : (isPredicted ? 'Actualizar' : 'Guardar Pronóstico')}
                                </button>
                            )}
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    );
};

export default Dashboard;