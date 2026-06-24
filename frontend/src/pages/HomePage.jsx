import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Code, Download, Brain, ArrowRight, LogOut, CheckCircle, Layers, GitBranch, Sun, Moon, Shield, Database, TestTube, FileCode2, MessageCircle, Zap as ZapIcon } from 'lucide-react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { useTheme } from '../context/ThemeContext';

const Counter = ({ target, suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target]);

  return <span>{count}{suffix}</span>;
};

const HomePage = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [, setParticlesLoaded] = useState(false);
  const containerRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
    setParticlesLoaded(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth');
  };

  const features = [
    {
      icon: <Code size={28} />,
      title: 'Clean Architecture',
      description: 'Génère automatiquement une architecture propre respectant les principes SOLID',
      color: '#7C3AED',
      action: () => navigate('/generator')
    },
    {
      icon: <ZapIcon size={28} />,
      title: 'Génération Instantanée',
      description: 'Crée ton backend complet en quelques secondes avec toutes les couches',
      color: '#6D28D9',
      action: () => navigate('/generator')
    },
    {
      icon: <Brain size={28} />,
      title: 'IA Intégrée',
      description: 'Décris ton projet en langage naturel, l\'IA génère le modèle automatiquement',
      color: '#5B21B6',
      action: () => navigate('/chat')
    },
    {
      icon: <Download size={28} />,
      title: 'Export ZIP',
      description: 'Télécharge ton projet prêt à être compilé et déployé immédiatement',
      color: '#4C1D95',
      action: () => navigate('/generator')
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Définis tes entités',
      description: 'Crée tes entités métier avec leurs champs et relations',
      icon: <Layers size={24} />
    },
    {
      number: '02',
      title: 'Prévisualise la structure',
      description: 'Vois la structure Clean Architecture avant de générer',
      icon: <GitBranch size={24} />
    },
    {
      number: '03',
      title: 'Génère et télécharge',
      description: 'Télécharge ton projet ZIP prêt à être compilé',
      icon: <Download size={24} />
    },
    {
      number: '04',
      title: 'Code immédiatement',
      description: 'Commence à coder sans perdre de temps sur la structure',
      icon: <CheckCircle size={24} />
    }
  ];

  const techStack = [
    { name: 'React.js', color: '#61DAFB' },
    { name: 'Express.js', color: '#7C3AED' },
    { name: 'MongoDB', color: '#47A248' },
    { name: 'Gemini AI', color: '#4285F4' },
    { name: 'JWT', color: '#F59E0B' },
    { name: 'Tailwind', color: '#06B6D4' },
    { name: 'Jest', color: '#C21325' },
    { name: 'Swagger', color: '#85EA2D' },
  ];

  const architectureStats = [
    { icon: <Layers size={22} />, value: 4, label: 'Couches Clean Architecture', color: '#7C3AED' },
    { icon: <FileCode2 size={22} />, value: 11, label: 'Méthodes de génération', color: '#6D28D9' },
    { icon: <Shield size={22} />, value: 4, label: 'Niveaux de sécurité', color: '#5B21B6' },
    { icon: <TestTube size={22} />, value: 10, label: 'Tests unitaires Jest', color: '#4C1D95' },
    { icon: <Database size={22} />, value: 2, label: 'Types de relations', color: '#7C3AED' },
    { icon: <Code size={22} />, value: 5, label: 'Use Cases par entité', color: '#6D28D9' },
  ];

  return (
    <div className="min-h-screen bg-dark overflow-hidden relative" ref={containerRef}>

      {/* Cursor light effect */}
      <motion.div
        className="fixed w-96 h-96 rounded-full pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)',
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
          top: '50%',
          left: '50%',
        }}
      />

      {/* Particles */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: { color: { value: 'transparent' } },
          fpsLimit: 60,
          particles: {
            color: { value: '#7C3AED' },
            links: { color: '#7C3AED', distance: 150, enable: true, opacity: 0.2, width: 1 },
            move: { enable: true, speed: 1, direction: 'none', random: true, outModes: { default: 'bounce' } },
            number: { value: 60, density: { enable: true, area: 800 } },
            opacity: { value: 0.3 },
            shape: { type: 'circle' },
            size: { value: { min: 1, max: 3 } }
          },
          detectRetina: true
        }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
      />

      {/* Gradient blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary opacity-10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-900 opacity-10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Content */}
      <div className="relative z-10">

        {/* Navbar */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="border-b border-border px-8 py-4 flex justify-between items-center backdrop-blur-sm bg-dark/50 sticky top-0 z-50"
        >
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <ZapIcon className="text-primary" size={28} />
            </motion.div>
            <span className="text-xl font-bold text-white">BackendGen</span>
          </div>

          <div className="flex items-center gap-5">
            {user.name && (
              <span className="text-gray-400 text-sm hidden md:flex items-center gap-1.5">
                {user.name}
              </span>
            )}

            <div className="w-px h-6 bg-border hidden md:block" />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="border border-border text-gray-400 hover:text-white w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
            >
              {isDark ? <Sun size={17} /> : <Moon size={17} />}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard')}
              className="border border-border text-gray-300 hover:border-primary hover:text-primary px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium hidden sm:flex items-center gap-2"
            >
              <Layers size={16} />
              Dashboard
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(124,58,237,0.5)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/generator')}
              className="bg-primary hover:bg-secondary text-white px-5 py-2 rounded-lg transition-all duration-200 text-sm font-medium"
            >
              Commencer
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, color: '#EF4444' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="text-gray-500 hover:text-red-400 w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
              title="Déconnexion"
            >
              <LogOut size={18} />
            </motion.button>
          </div>
        </motion.nav>

        {/* Hero — refait, sobre */}
        <div className="flex flex-col items-center justify-center text-center px-8 py-20">

          {/* Badge unique discret */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full mb-7"
          >
            <motion.span
              className="w-1.5 h-1.5 bg-green-400 rounded-full flex-shrink-0"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-gray-400 text-sm">Déployé en production</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-6xl font-bold text-white mb-6 leading-tight tracking-tight"
          >
            Génère ton backend
            <br />
            <span
              className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-primary"
              style={{ filter: 'drop-shadow(0 0 30px rgba(124,58,237,0.5))' }}
            >
              Clean Architecture
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-gray-400 text-lg mb-9 max-w-xl"
          >
            Définis tes entités métier et génère automatiquement un backend complet respectant les principes SOLID
          </motion.p>

          {/* Buttons — sans emoji */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex gap-3 justify-center mb-16"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(124,58,237,0.6)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/generator')}
              className="bg-primary hover:bg-secondary text-white px-7 py-3.5 rounded-xl text-base font-medium flex items-center gap-2 transition-all duration-200"
            >
              Générer mon backend
              <ArrowRight size={18} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, borderColor: '#7C3AED', color: '#A78BFA' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/chat')}
              className="border border-border text-gray-300 px-7 py-3.5 rounded-xl text-base font-medium transition-all duration-200 flex items-center gap-2"
            >
              <MessageCircle size={18} />
              Utiliser l'IA
            </motion.button>
          </motion.div>

          {/* Stats — séparées par traits verticaux */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="flex items-center gap-10 mb-20"
          >
            {[
              { value: 100, suffix: '%', label: 'Clean Architecture' },
              { value: 10, suffix: '+', label: 'Fichiers générés' },
              { value: 5, suffix: 's', label: 'Temps de génération' },
            ].map((stat, index) => (
              <React.Fragment key={index}>
                {index > 0 && <div className="w-px h-10 bg-border" />}
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    <Counter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-gray-500 text-xs mt-0.5">{stat.label}</div>
                </div>
              </React.Fragment>
            ))}
          </motion.div>

          {/* Stack technique */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            className="mb-20 w-full max-w-4xl"
          >
            <p className="text-gray-500 text-sm uppercase tracking-wider mb-4">
              Stack technique utilisée
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {techStack.map((tech, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + index * 0.05 }}
                  whileHover={{ scale: 1.1, y: -3 }}
                  className="bg-card/60 border border-border px-4 py-2 rounded-full flex items-center gap-2"
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: tech.color }}
                  />
                  <span className="text-gray-300 text-sm font-medium">{tech.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full mb-24">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 + index * 0.15 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: `0 0 30px ${feature.color}40`,
                  borderColor: feature.color
                }}
                onClick={feature.action}
                className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6 text-left cursor-pointer transition-all duration-200"
              >
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.2 }}
                  className="text-primary mb-4 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center"
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{feature.description}</p>
                <div className="text-primary text-sm flex items-center gap-1">
                  Essayer <ArrowRight size={14} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* How it works */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.4 }}
            className="max-w-6xl w-full mb-24"
          >
            <h2 className="text-4xl font-bold text-white text-center mb-4">
              Comment ça <span className="text-primary">marche ?</span>
            </h2>
            <p className="text-gray-400 text-center mb-12">En 4 étapes simples</p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.6 + index * 0.15 }}
                  whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(124,58,237,0.2)' }}
                  className="bg-card/80 border border-border rounded-xl p-6 text-center relative"
                >
                  <div className="text-5xl font-bold text-primary/20 mb-4">{step.number}</div>
                  <div className="text-primary mb-3 flex justify-center">{step.icon}</div>
                  <h3 className="text-white font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-400 text-sm">{step.description}</p>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute -right-3 top-1/2 transform -translate-y-1/2 text-primary z-10">
                      <ArrowRight size={20} />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Architecture en chiffres */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.7 }}
            className="max-w-6xl w-full mb-24"
          >
            <h2 className="text-4xl font-bold text-white text-center mb-4">
              L'architecture en <span className="text-primary">chiffres</span>
            </h2>
            <p className="text-gray-400 text-center mb-12">Une Clean Architecture rigoureuse et testée</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {architectureStats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.8 + index * 0.1 }}
                  whileHover={{ scale: 1.05, boxShadow: `0 0 25px ${stat.color}30` }}
                  className="bg-card/80 border border-border rounded-xl p-6 flex items-center gap-4"
                >
                  <div
                    className="p-3 rounded-lg flex-shrink-0"
                    style={{ backgroundColor: `${stat.color}20`, color: stat.color }}
                  >
                    {stat.icon}
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white">
                      <Counter target={stat.value} />
                    </div>
                    <div className="text-gray-400 text-xs">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Citation Clean Architecture */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.9 }}
            className="max-w-3xl w-full mb-24 text-center"
          >
            <div className="text-6xl text-primary/20 font-serif mb-2">"</div>
            <p className="text-2xl text-white font-medium italic mb-4">
              Une bonne architecture permet aux décisions de se prendre le plus tard possible.
            </p>
            <p className="text-gray-500 text-sm">— Robert C. Martin, Clean Architecture</p>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 2 }}
            className="max-w-3xl w-full bg-gradient-to-r from-primary/20 to-purple-900/20 border border-primary/30 rounded-2xl p-12 text-center mb-24"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Prêt à générer ton backend ?
            </h2>
            <p className="text-gray-400 mb-8">
              Commence maintenant et génère ton projet Clean Architecture en quelques secondes
            </p>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 35px rgba(124,58,237,0.7)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/generator')}
              className="bg-gradient-to-r from-primary to-purple-500 text-white px-12 py-4 rounded-xl text-lg font-semibold inline-flex items-center gap-2"
            >
              Commencer maintenant
              <ArrowRight size={20} />
            </motion.button>
          </motion.div>

          {/* Footer */}
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 2.2 }}
            className="w-full border-t border-border pt-8 pb-4 text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <ZapIcon className="text-primary" size={20} />
              <span className="text-white font-bold">BackendGen</span>
            </div>
            <p className="text-gray-500 text-sm">
              Générateur Automatique de Backend Clean Architecture © 2026
            </p>
            <p className="text-gray-600 text-xs mt-2">
              Développé avec ❤️ — Projet de Fin d'Études TEKSIGHT
            </p>
          </motion.footer>
        </div>
      </div>
    </div>
  );
};

export default HomePage;