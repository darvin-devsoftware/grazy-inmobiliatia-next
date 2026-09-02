import React, { useState } from 'react';
import { Logo } from '../common/Logo';
import { SystemUser } from '../../types';
import { login, forgotPassword, ApiError } from '../../lib/api';
import { Lock, Mail, ShieldCheck, X, Eye, EyeOff, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: SystemUser) => void;
}

type Mode = 'login' | 'forgot' | 'forgot-sent';

/**
 * Autenticación real contra el API (JWT).
 * El acceso rápido por rol de la plantilla se eliminó: permitía entrar
 * con cualquier correo y sin contraseña.
 */
export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [busy, setBusy] = useState(false);

  if (!isOpen) return null;

  const reset = () => {
    setErrorMsg('');
    setBusy(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password) {
      setErrorMsg('Completa el correo y la contraseña.');
      return;
    }

    setBusy(true);
    try {
      const user = await login(email.trim(), password);
      setPassword('');
      onLoginSuccess(user);
    } catch (err) {
      const e = err as ApiError;
      setErrorMsg(
        e.status === 401
          ? 'Correo o contraseña incorrectos.'
          : e.status === 429
            ? 'Demasiados intentos. Espera unos minutos.'
            : 'No pudimos conectar con el servidor. Verifica que el API esté encendido.'
      );
    } finally {
      setBusy(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim()) {
      setErrorMsg('Escribe el correo de tu cuenta.');
      return;
    }

    setBusy(true);
    try {
      await forgotPassword(email.trim());
      setMode('forgot-sent');
    } catch (err) {
      const e = err as ApiError;
      setErrorMsg(
        e.status === 429
          ? 'Demasiadas solicitudes. Intenta de nuevo en una hora.'
          : 'No pudimos conectar con el servidor.'
      );
    } finally {
      setBusy(false);
    }
  };

  const inputClass =
    'w-full pl-9 pr-3.5 py-2.5 bg-[#F7FAFC] border border-[#DBE3EE] rounded-xl focus:outline-none focus:border-[#03459C] text-xs font-medium';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#DBE3EE] overflow-hidden flex flex-col">

        {/* Cabecera */}
        <div className="bg-[#071B33] text-white p-6 flex flex-col items-center justify-center relative text-center">
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <Logo size="md" variant="light" />
          <p className="text-xs text-[#7A8AA3] font-semibold mt-2 uppercase tracking-widest">
            Portal administrativo
          </p>
        </div>

        <div className="p-6 space-y-5 text-xs">

          {errorMsg && (
            <div role="alert" className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {mode === 'forgot-sent' && (
            <div className="space-y-4 text-center py-4">
              <CheckCircle2 className="w-10 h-10 text-[#03459C] mx-auto" />
              <div className="space-y-2">
                <p className="text-sm font-bold text-[#1F2937]">Revisa tu correo</p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Si <strong>{email}</strong> corresponde a una cuenta activa, enviamos un enlace
                  para crear una contraseña nueva. Caduca en 45 minutos y solo sirve una vez.
                </p>
              </div>
              <button
                type="button"
                onClick={() => { setMode('login'); reset(); }}
                className="w-full py-3 bg-[#03459C] hover:bg-[#023277] text-white font-bold uppercase tracking-wider text-xs rounded-xl transition-colors"
              >
                Volver a iniciar sesión
              </button>
            </div>
          )}

          {mode === 'forgot' && (
            <form onSubmit={handleForgot} className="space-y-4">
              <button
                type="button"
                onClick={() => { setMode('login'); reset(); }}
                className="flex items-center gap-1.5 text-[11px] font-bold text-[#7A8AA3] hover:text-[#03459C] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Volver
              </button>

              <div>
                <label className="block font-semibold text-[#1F2937] mb-1">Correo de la cuenta</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#7A8AA3] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tucorreo@ejemplo.com"
                    className={inputClass}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full py-3 bg-[#03459C] hover:bg-[#023277] disabled:opacity-60 text-white font-bold uppercase tracking-wider text-xs rounded-xl shadow-md transition-all active:scale-98"
              >
                {busy ? 'Enviando…' : 'Enviar enlace de recuperación'}
              </button>
            </form>
          )}

          {mode === 'login' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold text-[#1F2937] mb-1">Correo electrónico</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#7A8AA3] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    autoFocus
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tucorreo@ejemplo.com"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#1F2937] mb-1">Contraseña</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#7A8AA3] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 bg-[#F7FAFC] border border-[#DBE3EE] rounded-xl focus:outline-none focus:border-[#03459C] text-xs font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A8AA3] hover:text-[#03459C]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full py-3 bg-[#03459C] hover:bg-[#023277] disabled:opacity-60 text-white font-bold uppercase tracking-wider text-xs rounded-xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{busy ? 'Verificando…' : 'Iniciar sesión'}</span>
              </button>

              <button
                type="button"
                onClick={() => { setMode('forgot'); reset(); }}
                className="w-full text-center text-[11px] font-bold text-[#7A8AA3] hover:text-[#03459C] transition-colors"
              >
                Olvidé mi contraseña
              </button>
            </form>
          )}

          <p className="text-[10px] text-center text-gray-500 pt-2 border-t border-[#DBE3EE]">
            Acceso restringido a personal autorizado.
          </p>
        </div>
      </div>
    </div>
  );
};
