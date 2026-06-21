import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Eye, EyeOff, User, Mail, Lock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    const url = isLogin
      ? `${API_URL}/api/auth/login`
      : `${API_URL}/api/auth/register`;

    const body = isLogin
      ? { email: form.email, password: form.password }
      : { name: form.name, email: form.email, password: form.password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setSuccess(data.message);

      setTimeout(() => navigate('/'), 1500);

    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center relative overflow-hidden">

      {/* Gradient blobs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-primary opacity-10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-900 opacity-10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-card border border-border rounded-2xl p-8 w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div
          className="flex items-center gap-2 mb-8 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Zap className="text-primary" size={28} />
          </motion.div>
          <span className="text-xl font-bold text-white">BackendGen</span>
        </div>

        {/* Toggle */}
        <div className="flex bg-dark rounded-xl p-1 mb-8">
          <button
            onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${isLogin ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Connexion
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${!isLogin ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Inscription
          </button>
        </div>

        {/* Title */}
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? 'login' : 'register'}
            initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-2xl font-bold text-white mb-1">
              {isLogin ? 'Bon retour ! 👋' : 'Créer un compte 🚀'}
            </h1>
            <p className="text-gray-400 text-sm mb-6">
              {isLogin ? 'Connecte-toi pour continuer' : 'Rejoins BackendGen gratuitement'}
            </p>

            {/* Fields */}
            <div className="space-y-4">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="text-gray-400 text-sm mb-1 block">Nom complet</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      onKeyPress={handleKeyPress}
                      placeholder="Hadil Mejdi"
                      className="w-full bg-dark border border-border rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                </motion.div>
              )}

              <div>
                <label className="text-gray-400 text-sm mb-1 block">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    placeholder="hadil@example.com"
                    className="w-full bg-dark border border-border rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-1 block">Mot de passe</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    placeholder="••••••••"
                    className="w-full bg-dark border border-border rounded-lg pl-10 pr-10 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-all"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-all"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-900/30 border border-red-500 text-red-400 rounded-xl p-3 mt-4 text-sm"
              >
                ❌ {error}
              </motion.div>
            )}

            {/* Success */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-900/30 border border-green-500 text-green-400 rounded-xl p-3 mt-4 text-sm"
              >
                ✅ {success}
              </motion.div>
            )}

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(124,58,237,0.5)' }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-purple-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 mt-6 disabled:opacity-50 transition-all"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  {isLogin ? 'Connexion...' : 'Inscription...'}
                </>
              ) : (
                <>
                  {isLogin ? 'Se connecter' : "S'inscrire"}
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>

            {/* Switch */}
            <p className="text-gray-400 text-sm text-center mt-4">
              {isLogin ? "Pas encore de compte ? " : "Déjà un compte ? "}
              <button
                onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess(''); }}
                className="text-primary hover:underline font-semibold"
              >
                {isLogin ? "S'inscrire" : "Se connecter"}
              </button>
            </p>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AuthPage;