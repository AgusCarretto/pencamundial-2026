import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { UserPlus, Phone, Lock, User } from 'lucide-react';

const RegisterPage = () => {
    const [formData, setFormData] = useState({ userName: '', phoneNumber: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false); // <-- Nuevo estado
    const [showSuccess, setShowSuccess] = useState(false); // <-- Nuevo estado para el éxito
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true); // Prendemos el loader

        try {
            await authService.register(formData.userName, formData.phoneNumber, formData.password);

            // Apagamos el loader y mostramos el cartel de éxito
            setIsLoading(false);
            setShowSuccess(true);

            // Esperamos 2 segundos y lo mandamos al login
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            setIsLoading(false); // Apagamos el loader si hay error
            setError("Error al registrar usuario. Intentá con otro nombre o celular.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-950 via-emerald-900 to-green-950 p-4 relative overflow-hidden">

            {/* OVERLAY DE CARGA (Aparece solo si isLoading es true) */}
            {isLoading && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-green-950/80 backdrop-blur-sm transition-all">
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(234,179,8,0.5)]"></div>
                        <p className="mt-4 text-yellow-400 font-black tracking-[0.2em] uppercase text-sm drop-shadow-md">
                            Fichando jugador...
                        </p>
                    </div>
                </div>
            )}

            {/* Field lines decoration */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-4 border-white rounded-full"></div>
                <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-white"></div>
            </div>

            <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-2xl relative z-10 my-8">

                {showSuccess ? (
                    // PANTALLA DE ÉXITO REEMPLAZANDO EL FORMULARIO
                    <div className="flex flex-col items-center text-center py-8 animate-fade-in">
                        <div className="w-20 h-20 bg-gradient-to-tr from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(234,179,8,0.6)]">
                            <svg className="w-10 h-10 text-green-950" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <h3 className="text-2xl font-black text-white uppercase tracking-wider mb-2">¡Bienvenido!</h3>
                        <p className="text-emerald-100 font-bold">Registro completado con éxito.<br />Redirigiendo al vestuario...</p>
                    </div>
                ) : (
                    // FORMULARIO NORMAL
                    <>
                        <div className="flex flex-col items-center mb-8">
                            <div className="bg-gradient-to-b from-yellow-300 to-yellow-500 p-3 rounded-full mb-4 shadow-[0_0_20px_rgba(234,179,8,0.5)]">
                                <UserPlus className="text-green-950 w-8 h-8" />
                            </div>
                            <h2 className="text-3xl font-black text-white tracking-tighter drop-shadow-md">CREAR CUENTA</h2>
                            <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest mt-2">Sumate a la Penca 2026</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-emerald-50 uppercase ml-2 drop-shadow-sm">Nombre de Usuario</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-3.5 w-5 h-5 text-yellow-400" />
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-green-950/50 border border-green-800/50 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-emerald-200/30 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all backdrop-blur-sm"
                                        placeholder="Ej: agustin_dev"
                                        onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-emerald-50 uppercase ml-2 drop-shadow-sm">Celular</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-3.5 w-5 h-5 text-yellow-400" />
                                    <input
                                        type="tel"
                                        required
                                        className="w-full bg-green-950/50 border border-green-800/50 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-emerald-200/30 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all backdrop-blur-sm"
                                        placeholder="Ej: 099123456"
                                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-emerald-50 uppercase ml-2 drop-shadow-sm">Contraseña</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-3.5 w-5 h-5 text-yellow-400" />
                                    <input
                                        type="password"
                                        required
                                        className="w-full bg-green-950/50 border border-green-800/50 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-emerald-200/30 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all backdrop-blur-sm"
                                        placeholder="••••••••"
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 backdrop-blur-sm">
                                    <p className="text-red-200 text-xs font-bold text-center">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-green-950 font-black py-4 rounded-2xl shadow-[0_0_15px_rgba(234,179,8,0.4)] hover:shadow-[0_0_25px_rgba(234,179,8,0.6)] transition-all active:scale-95 uppercase tracking-[0.2em] text-xs mt-4 disabled:opacity-50"
                            >
                                Registrarme
                            </button>
                        </form>

                        <p className="text-center text-emerald-100 text-xs mt-8 font-bold">
                            ¿YA TENÉS CUENTA? <Link to="/login" className="text-yellow-400 hover:text-yellow-300 hover:underline ml-1">INICIÁ SESIÓN</Link>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default RegisterPage;