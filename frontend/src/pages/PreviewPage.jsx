import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Zap, ArrowLeft, Download, Folder, FileCode, ChevronRight, CheckCircle } from 'lucide-react';
import { generateProject } from '../services/api';
import toast from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const FileTree = ({ structure, depth = 0 }) => {
  return (
    <div style={{ marginLeft: depth * 20 }}>
      {Object.entries(structure).map(([key, value], index) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 + depth * 0.1 }}
        >
          {typeof value === 'object' ? (
            <div>
              <div className="flex items-center gap-2 py-1 text-purple-300 font-medium">
                <Folder size={16} className="text-primary" />
                <span>{key}/</span>
              </div>
              <FileTree structure={value} depth={depth + 1} />
            </div>
          ) : (
            <div className="flex items-center gap-2 py-1 text-gray-400 hover:text-white transition-all">
              <FileCode size={14} className="text-gray-500" />
              <span className="text-sm">{key}</span>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

const LayerCard = ({ title, color, files, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.02, boxShadow: `0 0 20px ${color}40` }}
    className="bg-card border rounded-xl p-5"
    style={{ borderColor: color + '60' }}
  >
    <div className="flex items-center gap-2 mb-3">
      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
      <h3 className="text-white font-semibold">{title}</h3>
    </div>
    <p className="text-gray-400 text-xs mb-3">{description}</p>
    <div className="space-y-1">
      {files.map((file, i) => (
        <div key={i} className="flex items-center gap-2 text-gray-400 text-xs">
          <ChevronRight size={12} style={{ color }} />
          <span>{file}</span>
        </div>
      ))}
    </div>
  </motion.div>
);

const GenerationProgress = ({ steps, currentStep }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-card border border-border rounded-xl p-6 mb-6"
  >
    <h3 className="text-white font-semibold mb-4 text-center">
      ⚙️ Génération en cours...
    </h3>
    <div className="space-y-3">
      {steps.map((step, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center gap-3"
        >
          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
            index < currentStep ? 'bg-green-500' :
            index === currentStep ? 'bg-primary animate-pulse' :
            'bg-border'
          }`}>
            {index < currentStep ? (
              <CheckCircle size={14} className="text-white" />
            ) : (
              <span className="text-white text-xs">{index + 1}</span>
            )}
          </div>
          <span className={`text-sm ${
            index < currentStep ? 'text-green-400' :
            index === currentStep ? 'text-primary' :
            'text-gray-500'
          }`}>
            {step}
          </span>
          {index === currentStep && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="ml-auto"
            >
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
            </motion.div>
          )}
          {index < currentStep && (
            <span className="ml-auto text-green-400 text-xs">✅</span>
          )}
        </motion.div>
      ))}
    </div>

    {/* Progress bar globale */}
    <div className="mt-4">
      <div className="bg-dark border border-border rounded-full h-2 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-purple-400 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / steps.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <p className="text-gray-400 text-xs text-center mt-2">
        {Math.round((currentStep / steps.length) * 100)}% complété
      </p>
    </div>
  </motion.div>
);

const PreviewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const model = location.state?.model;
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showProgress, setShowProgress] = useState(false);

  const generationSteps = [
    'Validation du modèle...',
    'Génération des entités Domain...',
    'Génération des interfaces Repository...',
    'Génération des Use Cases...',
    'Génération des Controllers...',
    'Génération des Routes...',
    'Génération des DTOs...',
    'Génération de app.js...',
    'Compression en ZIP...',
    'Sauvegarde dans MongoDB...',
    'Téléchargement...'
  ];

  if (!model) {
    navigate('/generator');
    return null;
  }

  const { projectName, entities } = model;

  const buildStructure = () => {
    const structure = {
      'app.js': 'file',
      'package.json': 'file',
      'README.md': 'file',
      application: { interfaces: {}, usecases: {}, dtos: {} },
      domain: { entities: {} },
      infrastructure: { models: {}, repositories: {} },
      interfaces: { controllers: {} },
      routes: {}
    };

    entities.forEach(entity => {
      const name = entity.name;
      structure.domain.entities[`${name}.js`] = 'file';
      structure.application.interfaces[`I${name}Repository.js`] = 'file';
      structure.application.dtos[`Create${name}Dto.js`] = 'file';
      structure.application.dtos[`Update${name}Dto.js`] = 'file';
      ['Create', 'Update', 'Delete', 'GetAll', 'GetById'].forEach(action => {
        structure.application.usecases[`${action}${name}.js`] = 'file';
      });
      structure.infrastructure.models[`${name}Model.js`] = 'file';
      structure.infrastructure.repositories[`${name}Repository.js`] = 'file';
      structure.interfaces.controllers[`${name}Controller.js`] = 'file';
      structure.routes[`${name}Routes.js`] = 'file';
    });

    return structure;
  };

  const layers = entities.flatMap(entity => [
    {
      title: `Domain — ${entity.name}`,
      color: '#7C3AED',
      description: 'Entités métier pures sans dépendances externes',
      files: [`${entity.name}.js`]
    },
    {
      title: `Application — ${entity.name}`,
      color: '#6D28D9',
      description: 'Use Cases et interfaces Repository',
      files: [
        `I${entity.name}Repository.js`,
        `Create${entity.name}.js`,
        `Update${entity.name}.js`,
        `Delete${entity.name}.js`,
        `GetAll${entity.name}.js`,
        `GetById${entity.name}.js`
      ]
    },
    {
      title: `Infrastructure — ${entity.name}`,
      color: '#5B21B6',
      description: 'Implémentations concrètes et modèles MongoDB',
      files: [`${entity.name}Model.js`, `${entity.name}Repository.js`]
    },
    {
      title: `Interface — ${entity.name}`,
      color: '#4C1D95',
      description: 'Controllers REST et Routes Express',
      files: [`${entity.name}Controller.js`, `${entity.name}Routes.js`]
    }
  ]);

  const simulateProgress = async () => {
    for (let i = 0; i <= generationSteps.length; i++) {
      setCurrentStep(i);
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setShowProgress(true);
    setCurrentStep(0);

    const toastId = toast.loading('Génération en cours...');

    try {
      // Simule la progression en parallèle
      simulateProgress();

      // Sauvegarde dans MongoDB
      await fetch(`${API_URL}/api/project/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(model)
      });

      // Génère et télécharge le ZIP
      await generateProject(model);

      setCurrentStep(generationSteps.length);
      setSuccess(true);
      toast.success('Projet généré avec succès ! 🎉', { id: toastId });
    } catch (err) {
      toast.error('Erreur lors de la génération ❌', { id: toastId });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark">
      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-border px-8 py-4 flex justify-between items-center"
      >
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <Zap className="text-primary" size={28} />
          <span className="text-xl font-bold text-white">BackendGen</span>
          <span className="text-gray-400 text-sm ml-2">— Prévisualisation</span>
        </div>
        <button
          onClick={() => navigate('/generator')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-all"
        >
          <ArrowLeft size={18} /> Retour
        </button>
      </motion.nav>

      <div className="max-w-6xl mx-auto px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Prévisualisation — <span className="text-primary">{projectName}</span>
          </h1>
          <p className="text-gray-400">
            {entities.length} entité(s) • {entities.reduce((acc, e) => acc + e.fields.length, 0)} champs au total
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* File Tree */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Folder size={18} className="text-primary" />
              Structure des fichiers
            </h2>
            <div className="font-mono text-sm">
              <div className="flex items-center gap-2 text-white font-bold mb-2">
                <Folder size={16} className="text-primary" />
                {projectName}/
              </div>
              <FileTree structure={buildStructure()} depth={1} />
            </div>
          </motion.div>

          {/* Layers */}
          <div className="space-y-4">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-white font-semibold flex items-center gap-2"
            >
              <FileCode size={18} className="text-primary" />
              Couches Clean Architecture
            </motion.h2>
            <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto pr-2">
              {layers.map((layer, index) => (
                <LayerCard key={index} {...layer} />
              ))}
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-10">
          <AnimatePresence>
            {showProgress && (
              <GenerationProgress
                steps={generationSteps}
                currentStep={currentStep}
              />
            )}
          </AnimatePresence>

          {/* Success */}
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-900/30 border border-green-500 text-green-400 rounded-xl p-4 mb-6 text-center"
            >
              🎉 Projet généré et téléchargé avec succès !
            </motion.div>
          )}

          {/* Generate Button */}
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(124,58,237,0.5)' }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-purple-500 text-white py-4 rounded-xl text-lg font-semibold flex items-center justify-center gap-3 disabled:opacity-50 transition-all"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                Génération en cours...
              </>
            ) : (
              <>
                <Download size={22} />
                Générer et Télécharger le ZIP
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default PreviewPage;