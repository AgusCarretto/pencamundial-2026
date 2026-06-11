import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/authService";
import {
  Trophy,
  User,
  Lock,
  MessageCircle,
  X,
  AlertCircle,
} from "lucide-react";

const LoginPage = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotUser, setForgotUser] = useState("");
  const [forgotError, setForgotError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await authService.login(userName, password);
      setIsLoading(false);
      navigate("/dashboard");
    } catch (err: any) {
      setIsLoading(false);
      setError("Credenciales incorrectas. Revisá tu usuario y contraseña.");
    }
  };

  const handleSolicitarClave = () => {
    // Validamos que no esté vacío
    if (!forgotUser.trim()) {
      setForgotError("Por favor, ingresá tu usuario.");
      return;
    }

    // Armamos el mensaje
    const mensaje = `¡Buenas! Me olvidé la clave de la penca. Mi usuario es '${forgotUser.trim()}'. ¿Me la reseteás?`;

    const numeroAdmin = "59892114480";

    // Creamos y abrimos el link de WhatsApp
    const whatsappUrl = `https://wa.me/${numeroAdmin}?text=${encodeURIComponent(mensaje)}`;
    window.open(whatsappUrl, "_blank");

    // Cerramos el modal y limpiamos todo
    setShowForgotModal(false);
    setForgotUser("");
    setForgotError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-950 via-emerald-900 to-green-950 p-4 relative overflow-hidden">
      {/* OVERLAY DE CARGA */}
      {isLoading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-green-950/90 backdrop-blur-md transition-all">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(234,179,8,0.5)]"></div>
            <p className="mt-4 text-yellow-400 font-black tracking-[0.2em] uppercase text-sm drop-shadow-md">
              Entrando a la cancha...
            </p>
          </div>
        </div>
      )}

      {/* Field lines decoration */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-4 border-white rounded-full"></div>
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-white"></div>
      </div>

      <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-2xl relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gradient-to-b from-yellow-300 to-yellow-500 p-3 rounded-full mb-4 shadow-[0_0_20px_rgba(234,179,8,0.5)]">
            <Trophy className="text-green-950 w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight drop-shadow-md">
            PENCA MUNDIAL
          </h1>
          <p className="text-emerald-100 mt-2 font-medium">
            Iniciá sesión para empezar a predecir
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-emerald-50 mb-2 drop-shadow-sm">
              Usuario
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-yellow-400" />
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-green-950/50 border border-green-800/50 rounded-lg py-2.5 pl-11 pr-4 text-white placeholder-emerald-200/30 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all backdrop-blur-sm"
                placeholder="Tu nombre de usuario"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-emerald-50 mb-2 drop-shadow-sm">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-yellow-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-green-950/50 border border-green-800/50 rounded-lg py-2.5 pl-11 pr-4 text-white placeholder-emerald-200/30 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all backdrop-blur-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 backdrop-blur-sm">
              <p className="text-red-200 text-sm text-center font-bold">
                Usuario o contraseña incorrectos
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:cursor-pointer from-yellow-300 hover:to-yellow-400 text-green-950 font-black py-3.5 rounded-lg shadow-[0_0_15px_rgba(234,179,8,0.4)] hover:shadow-[0_0_25px_rgba(234,179,8,0.6)] transition-all active:scale-95 uppercase tracking-wider disabled:opacity-50 disabled:pointer-events-none"
          >
            Entrar a la Cancha
          </button>
        </form>

        <div className="flex justify-center mt-6">
          <button
            type="button"
            onClick={() => setShowForgotModal(true)}
            className="text-sm font-bold text-emerald-400 hover:text-yellow-400 cursor-pointer transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <p className="text-center text-emerald-100 text-xs mt-6 font-bold">
          ¿NO TENÉS CUENTA?{" "}
          <Link
            to="/register"
            className="text-yellow-400 hover:text-yellow-300 hover:underline ml-1"
          >
            REGISTRATE ACÁ
          </Link>
        </p>
      </div>

      {/* MODAL DE RECUPERACIÓN DE CONTRASEÑA */}
      {showForgotModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-green-950/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-green-900 border border-green-700 p-8 rounded-3xl shadow-2xl max-w-sm w-full relative overflow-hidden">
            {/* Botón para cerrar (X) */}
            <button
              onClick={() => {
                setShowForgotModal(false);
                setForgotError("");
              }}
              className="absolute top-4 right-4 text-emerald-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="bg-emerald-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/50">
              <MessageCircle className="text-emerald-400 w-8 h-8" />
            </div>

            <h3 className="text-xl font-black text-white text-center tracking-tight mb-2">
              Recuperar Acceso
            </h3>

            <p className="text-emerald-100/70 text-sm text-center mb-6">
              Ingresá tu usuario y te va a redirigir a WhatsApp para pedirme una
              clave nueva.
            </p>

            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  value={forgotUser}
                  onChange={(e) => {
                    setForgotUser(e.target.value);
                    setForgotError(""); // Limpiamos el error al escribir
                  }}
                  placeholder="Tu nombre de usuario"
                  className="w-full bg-green-950/50 border border-green-700 rounded-xl px-4 py-3 text-white placeholder-emerald-100/30 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {forgotError && (
                  <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {forgotError}
                  </p>
                )}
              </div>

              <button
                onClick={handleSolicitarClave}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-green-950 font-black py-3 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Pedir blanqueo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
