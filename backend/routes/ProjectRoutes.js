const express = require('express');
const router = express.Router();
const ProjectModel = require('../infrastructure/models/ProjectModel');

// Sauvegarder un projet
router.post('/save', async (req, res) => {
  try {
    const { projectName, entities } = req.body;
    const project = await ProjectModel.create({ projectName, entities });
    res.status(201).json({ message: 'Projet sauvegardé ✅', project });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Récupérer tous les projets
router.get('/', async (req, res) => {
  try {
    const projects = await ProjectModel.find().sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Supprimer un projet
router.delete('/:id', async (req, res) => {
  try {
    await ProjectModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Projet supprimé ✅' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;