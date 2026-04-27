import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Download, Zap, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GeneratorPage = () => {
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState('');
  const [entities, setEntities] = useState([
    {
      name: '',
      fields: [{ name: '', type: 'String', required: true, relation: 'One-to-One' }]
    }
  ]);
  const [error, setError] = useState('');

  const primitiveTypes = ['String', 'Number', 'Boolean', 'Date'];

  const getFieldTypes = (currentEntityIndex) => {
    const entityTypes = entities
      .filter((_, i) => i !== currentEntityIndex)
      .map(e => e.name)
      .filter(name => name !== '');
    return [...primitiveTypes, ...entityTypes];
  };

  const addEntity = () => {
    setEntities([...entities, {
      name: '',
      fields: [{ name: '', type: 'String', required: true, relation: 'One-to-One' }]
    }]);
  };

  const removeEntity = (index) => {
    setEntities(entities.filter((_, i) => i !== index));
  };

  const addField = (entityIndex) => {
    const updated = [...entities];
    updated[entityIndex].fields.push({ name: '', type: 'String', required: false, relation: 'One-to-One' });
    setEntities(updated);
  };

  const removeField = (entityIndex, fieldIndex) => {
    const updated = [...entities];
    updated[entityIndex].fields = updated[entityIndex].fields.filter((_, i) => i !== fieldIndex);
    setEntities(updated);
  };

  const updateEntity = (index, key, value) => {
    const updated = [...entities];
    updated[index][key] = value;
    setEntities(updated);
  };

  const updateField = (entityIndex, fieldIndex, key, value) => {
    const updated = [...entities];
    updated[entityIndex].fields[fieldIndex][key] = value;
    setEntities(updated);
  };

  const handleGenerate = () => {
    setError('');
    if (!projectName) return setError('Le nom du projet est requis');
    if (entities.some(e => !e.name)) return setError('Toutes les entités doivent avoir un nom');
    if (entities.some(e => e.fields.some(f => !f.name))) return setError('Tous les champs doivent avoir un nom');
    navigate('/preview', { state: { model: { projectName, entities } } });
  };

  return (
    <div className="min-h-screen bg-dark">
      {/* Navbar */}
      <nav className="border-b border-border px-8 py-4 flex justify-between items-center">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <Zap className="text-primary" size={28} />
          <span className="text-xl font-bold text-white">BackendGen</span>
        </div>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-all"
        >
          <ArrowLeft size={18} /> Retour
        </button>
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-white mb-2">Générateur de Backend</h1>
          <p className="text-gray-400 mb-10">Définis tes entités et génère ton projet Clean Architecture</p>

          {/* Project Name */}
          <div className="bg-card border border-border rounded-xl p-6 mb-6">
            <label className="text-white font-semibold mb-3 block">Nom du projet</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="ex: my-awesome-backend"
              className="w-full bg-dark border border-border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-all"
            />
          </div>

          {/* Entities */}
          {entities.map((entity, entityIndex) => (
            <motion.div
              key={entityIndex}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-card border border-border rounded-xl p-6 mb-6"
            >
              <div className="flex justify-between items-center mb-4">
                <input
                  type="text"
                  value={entity.name}
                  onChange={(e) => updateEntity(entityIndex, 'name', e.target.value)}
                  placeholder="Nom de l'entité (ex: Product)"
                  className="bg-dark border border-border rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-all w-2/3"
                />
                {entities.length > 1 && (
                  <button
                    onClick={() => removeEntity(entityIndex)}
                    className="text-red-400 hover:text-red-300 transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {entity.fields.map((field, fieldIndex) => {
                  const isRelation = !primitiveTypes.includes(field.type) && field.type !== '';
                  return (
                    <div key={fieldIndex} className="flex gap-3 items-center flex-wrap">
                      <input
                        type="text"
                        value={field.name}
                        onChange={(e) => updateField(entityIndex, fieldIndex, 'name', e.target.value)}
                        placeholder="Nom du champ"
                        className="flex-1 bg-dark border border-border rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-all"
                      />
                      <select
                        value={field.type}
                        onChange={(e) => updateField(entityIndex, fieldIndex, 'type', e.target.value)}
                        className="bg-dark border border-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary transition-all"
                      >
                        <optgroup label="Types primitifs">
                          {primitiveTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </optgroup>
                        {getFieldTypes(entityIndex).filter(t => !primitiveTypes.includes(t)).length > 0 && (
                          <optgroup label="Entités (Relations)">
                            {getFieldTypes(entityIndex)
                              .filter(t => !primitiveTypes.includes(t))
                              .map(type => (
                                <option key={type} value={type}>🔗 {type}</option>
                              ))}
                          </optgroup>
                        )}
                      </select>

                      {/* Type de relation */}
                      {isRelation && (
                        <motion.select
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          value={field.relation || 'One-to-One'}
                          onChange={(e) => updateField(entityIndex, fieldIndex, 'relation', e.target.value)}
                          className="bg-dark border border-primary rounded-lg px-3 py-2 text-primary focus:outline-none transition-all text-sm"
                        >
                          <option value="One-to-One">1-1 One-to-One</option>
                          <option value="One-to-Many">1-N One-to-Many</option>
                        </motion.select>
                      )}

                      <label className="flex items-center gap-2 text-gray-400 text-sm">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) => updateField(entityIndex, fieldIndex, 'required', e.target.checked)}
                          className="accent-primary"
                        />
                        Requis
                      </label>
                      {entity.fields.length > 1 && (
                        <button
                          onClick={() => removeField(entityIndex, fieldIndex)}
                          className="text-red-400 hover:text-red-300 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => addField(entityIndex)}
                className="mt-4 flex items-center gap-2 text-primary hover:text-white transition-all text-sm"
              >
                <Plus size={16} /> Ajouter un champ
              </button>
            </motion.div>
          ))}

          {/* Add Entity */}
          <button
            onClick={addEntity}
            className="w-full border-2 border-dashed border-border hover:border-primary text-gray-400 hover:text-primary rounded-xl py-4 flex items-center justify-center gap-2 transition-all duration-200 mb-8"
          >
            <Plus size={20} /> Ajouter une entité
          </button>

          {/* Error */}
          {error && (
            <div className="bg-red-900/30 border border-red-500 text-red-400 rounded-xl p-4 mb-6">
              {error}
            </div>
          )}

          {/* Generate Button */}
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(124,58,237,0.5)' }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerate}
            className="w-full bg-gradient-to-r from-primary to-purple-500 text-white py-4 rounded-xl text-lg font-semibold flex items-center justify-center gap-3 transition-all duration-200"
          >
            <Download size={22} />
            Prévisualiser et Générer
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default GeneratorPage;