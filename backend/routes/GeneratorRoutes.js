const express = require('express');
const router = express.Router();
const GeneratorEngine = require('../generator/GeneratorEngine');
const ZipExporter = require('../generator/ZipExporter');

router.post('/generate', (req, res) => {
  try {
    const model = req.body;
    const engine = new GeneratorEngine(model);
    const files = engine.generate();
    const zipExporter = new ZipExporter();
    zipExporter.exportToZip(files, res, model.projectName);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;