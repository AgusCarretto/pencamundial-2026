import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { Trophy, User, Lock } from 'lucide-react';

const LoginPage = () => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await authService.login(userName, password);
            navigate('/dashboard');
        } catch (err: any) {
            setError('Credenciales incorrectas. Revisá tu usuario y contraseña.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-blue-600 p-3 rounded-full mb-4 shadow-[0_0_20px_rgba(37,99,235,0.5)]">
                        <Trophy className="text-white w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight">PENCA MUNDIAL</h1>
                    <p className="text-slate-500 mt-2">Iniciá sesión para empezar a predecir</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Usuario</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 w-5 h-5 text-slate-600" />
                            <input
                                type="text"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 pl-11 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                                placeholder="Tu nombre de usuario"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Contraseña</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-600" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 pl-11 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg shadow-lg transition-all active:scale-95"
                    >
                        Entrar a la Cancha
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;