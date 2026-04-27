import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Zap, ArrowLeft, Trash2, Download, Clock, Layers, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { generateProject } from '../services/api';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/project');
      const data = await response.json();
      setProjects(data);
    } catch (err) {
      toast.error('Erreur de chargement des projets');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/project/${id}`, {
        method: 'DELETE'
      });
      setProjects(projects.filter(p => p._id !== id));
      toast.success('Projet supprimé ✅');
    } catch (err) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleRegenerate = async (project) => {
    const toastId = toast.loading('Régénération en cours...');
    try {
      await generateProject({
        projectName: project.projectName,
        entities: project.entities
      });
      toast.success('Projet régénéré ! 🎉', { id: toastId });
    } catch (err) {
      toast.error('Erreur lors de la régénération', { id: toastId });
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
          <span className="text-gray-400 text-sm ml-2">— Tableau de bord</span>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/generator')}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
          >
            <Plus size={16} />
            Nouveau projet
          </motion.button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-all"
          >
            <ArrowLeft size={18} /> Retour
          </button>
        </div>
      </motion.nav>

      <div className="max-w-6xl mx-auto px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Tableau de <span className="text-primary">bord</span>
          </h1>
          <p className="text-gray-400">
            {projects.length} projet(s) généré(s) au total
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { label: 'Projets générés', value: projects.length, icon: <Layers size={24} /> },
            { label: 'Entités créées', value: projects.reduce((acc, p) => acc + p.entities.length, 0), icon: <Layers size={24} /> },
            { label: 'Champs définis', value: projects.reduce((acc, p) => acc + p.entities.reduce((a, e) => a + e.fields.length, 0), 0), icon: <Layers size={24} /> }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card border border-border rounded-xl p-6 flex items-center gap-4"
            >
              <div className="text-primary bg-primary/10 p-3 rounded-lg">
                {stat.icon}
              </div>
              <div>
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Projects List */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
          </div>
        ) : projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-gray-500 text-6xl mb-4">📭</div>
            <p className="text-gray-400 text-lg mb-6">Aucun projet généré pour l'instant</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/generator')}
              className="bg-primary text-white px-8 py-3 rounded-xl font-semibold"
            >
              Créer mon premier projet
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(124,58,237,0.2)' }}
                className="bg-card border border-border rounded-xl p-6"
              >
                {/* Project Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-white font-bold text-lg">{project.projectName}</h3>
                    <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                      <Clock size={12} />
                      <span>{formatDate(project.createdAt)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="text-red-400 hover:text-red-300 transition-all p-1"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* Entities */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.entities.map((entity, i) => (
                    <span
                      key={i}
                      className="bg-primary/10 border border-primary/30 text-primary text-xs px-3 py-1 rounded-full"
                    >
                      {entity.name} ({entity.fields.length} champs)
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex gap-4 text-gray-400 text-xs mb-4">
                  <span>📦 {project.entities.length} entité(s)</span>
                  <span>🔧 {project.entities.reduce((acc, e) => acc + e.fields.length, 0)} champ(s)</span>
                </div>

                {/* Regenerate Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleRegenerate(project)}
                  className="w-full bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/30 hover:border-primary py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200"
                >
                  <Download size={16} />
                  Régénérer le ZIP
                </motion.button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;