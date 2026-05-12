import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { UserPlus, Mail, Lock, User } from 'lucide-react';

const RegisterPage = () => {
    const [formData, setFormData] = useState({ userName: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await authService.register(formData.userName, formData.email, formData.password);
            alert("¡Registro exitoso! Ahora podés iniciar sesión.");
            navigate('/login');
        } catch (err) {
            setError("Error al registrar usuario. Intentá con otro nombre o email.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-950 via-emerald-900 to-green-950 p-4 relative overflow-hidden">
            {/* Field lines decoration */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-4 border-white rounded-full"></div>
                <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-white"></div>
            </div>

            <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-2xl relative z-10 my-8">
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
                        <label className="text-[10px] font-black text-emerald-50 uppercase ml-2 drop-shadow-sm">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-3.5 w-5 h-5 text-yellow-400" />
                            <input
                                type="email"
                                required
                                className="w-full bg-green-950/50 border border-green-800/50 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-emerald-200/30 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all backdrop-blur-sm"
                                placeholder="tu@email.com"
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                        className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-green-950 font-black py-4 rounded-2xl shadow-[0_0_15px_rgba(234,179,8,0.4)] hover:shadow-[0_0_25px_rgba(234,179,8,0.6)] transition-all active:scale-95 uppercase tracking-[0.2em] text-xs mt-4"
                    >
                        Registrarme
                    </button>
                </form>

                <p className="text-center text-emerald-100 text-xs mt-8 font-bold">
                    ¿YA TENÉS CUENTA? <Link to="/login" className="text-yellow-400 hover:text-yellow-300 hover:underline ml-1">INICIÁ SESIÓN</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;