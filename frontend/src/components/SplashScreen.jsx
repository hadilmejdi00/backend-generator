import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const SplashScreen = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState('Initialisation...');

  useEffect(() => {
    const messages = [
      'Initialisation...',
      'Chargement de l\'architecture...',
      'Préparation du générateur...',
      'Connexion à la base de données...',
      'Prêt !'
    ];

    let current = 0;
    const interval = setInterval(() => {
      current += 20;
      setProgress(current);
      setText(messages[Math.floor(current / 20) - 1] || 'Prêt !');
      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => onFinish(), 500);
      }
    }, 400);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 bg-dark flex flex-col items-center justify-center z-50"
    >
      {/* Gradient blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary opacity-10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-900 opacity-10 rounded-full blur-3xl animate-pulse" />

      {/* Logo */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, type: 'spring' }}
        className="flex items-center gap-3 mb-8"
      >
        <motion.div
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Zap className="text-primary" size={48} />
        </motion.div>
        <span className="text-4xl font-bold text-white">BackendGen</span>
      </motion.div>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-gray-400 text-lg mb-12"
      >
        Générateur Automatique de Backend Clean Architecture
      </motion.p>

      {/* Progress bar */}
      <div className="w-64">
        <div className="bg-card border border-border rounded-full h-2 mb-3 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-purple-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <motion.p
          key={text}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-500 text-sm text-center"
        >
          {text}
        </motion.p>
      </div>

      {/* Progress percentage */}
      <motion.p
        className="text-primary font-bold text-2xl mt-6"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        {progress}%
      </motion.p>
    </motion.div>
  );
};

export default SplashScreen;