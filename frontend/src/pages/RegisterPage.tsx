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
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl w-full max-w-md">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-blue-600/20 p-4 rounded-2xl mb-4">
                        <UserPlus className="w-8 h-8 text-blue-500" />
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tighter">CREAR CUENTA</h2>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">Sumate a la Penca 2026</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Nombre de Usuario</label>
                        <div className="relative">
                            <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-600" />
                            <input
                                type="text"
                                required
                                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:border-blue-500 outline-none transition-all"
                                placeholder="Ej: agustin_dev"
                                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-600" />
                            <input
                                type="email"
                                required
                                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:border-blue-500 outline-none transition-all"
                                placeholder="tu@email.com"
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Contraseña</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-600" />
                            <input
                                type="password"
                                required
                                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:border-blue-500 outline-none transition-all"
                                placeholder="••••••••"
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-900/20 transition-all uppercase tracking-[0.2em] text-xs mt-4"
                    >
                        Registrarme
                    </button>
                </form>

                <p className="text-center text-slate-500 text-xs mt-8 font-bold">
                    ¿YA TENÉS CUENTA? <Link to="/login" className="text-blue-500 hover:underline">INICIÁ SESIÓN</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;