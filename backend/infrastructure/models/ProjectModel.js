const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  required: { type: Boolean, default: false }
});

const entitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  fields: [fieldSchema]
});

const projectSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  entities: [entitySchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Project || mongoose.model('Project', projectSchema);