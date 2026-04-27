class FileWriter {

  generateEntity(name, fields) {
    const fieldsList = fields.map(f => `this.${f.name} = data.${f.name};`).join('\n    ');
    const validations = fields
      .filter(f => f.required)
      .map(f => `if (!this.${f.name}) throw new Error('${f.name} is required');`)
      .join('\n    ');

    return `class ${name} {
  constructor(data) {
    ${fieldsList}
  }

  validate() {
    ${validations}
  }
}

module.exports = ${name};`;
  }

  generateInterface(name) {
    return `class I${name}Repository {
  async create(${name.toLowerCase()}) { throw new Error("Not implemented"); }
  async findAll() { throw new Error("Not implemented"); }
  async findById(id) { throw new Error("Not implemented"); }
  async update(id, ${name.toLowerCase()}) { throw new Error("Not implemented"); }
  async delete(id) { throw new Error("Not implemented"); }
}

module.exports = I${name}Repository;`;
  }

  generateUseCase(action, name) {
    const lower = name.toLowerCase();

    const params = action === 'Create' ? 'data' :
                   action === 'Update' ? 'id, data' :
                   action === 'GetAll' ? '' : 'id';

    const logic = action === 'Create' ? `return await this.${lower}Repository.create(data);` :
                  action === 'GetAll' ? `return await this.${lower}Repository.findAll();` :
                  action === 'GetById' ? `return await this.${lower}Repository.findById(id);` :
                  action === 'Update' ? `return await this.${lower}Repository.update(id, data);` :
                  `return await this.${lower}Repository.delete(id);`;

    return `class ${action}${name} {
  constructor(${lower}Repository) {
    this.${lower}Repository = ${lower}Repository;
  }

  async execute(${params}) {
    ${logic}
  }
}

module.exports = ${action}${name};`;
  }

  generateRepository(name) {
    const lower = name.toLowerCase();
    return `const I${name}Repository = require('../../application/interfaces/I${name}Repository');
const ${name}Model = require('../models/${name}Model');

class ${name}Repository extends I${name}Repository {
  async create(${lower}) {
    const newItem = new ${name}Model(${lower});
    return await newItem.save();
  }

  async findAll() {
    return await ${name}Model.find();
  }

  async findById(id) {
    return await ${name}Model.findById(id);
  }

  async update(id, ${lower}) {
    return await ${name}Model.findByIdAndUpdate(id, ${lower}, { new: true });
  }

  async delete(id) {
    return await ${name}Model.findByIdAndDelete(id);
  }
}

module.exports = ${name}Repository;`;
  }

 generateModel(name, fields) {
  const schemaFields = fields.map(f => {
    const validPrimitives = ['String', 'Number', 'Boolean', 'Date'];

    if (validPrimitives.includes(f.type)) {
      return `  ${f.name}: { type: ${f.type}, required: ${f.required || false} }`;
    } else {
      if (f.relation === 'One-to-Many') {
        return `  ${f.name}: [{ type: mongoose.Schema.Types.ObjectId, ref: '${f.type}', required: ${f.required || false} }]`;
      } else {
        return `  ${f.name}: { type: mongoose.Schema.Types.ObjectId, ref: '${f.type}', required: ${f.required || false} }`;
      }
    }
  }).join(',\n');

  return `const mongoose = require('mongoose');

const ${name.toLowerCase()}Schema = new mongoose.Schema({
${schemaFields}
});

module.exports = mongoose.models.${name} || mongoose.model('${name}', ${name.toLowerCase()}Schema);`;
}

  generateController(name) {
    const lower = name.toLowerCase();
    return `const ${name}Repository = require('../../infrastructure/repositories/${name}Repository');
const Create${name} = require('../../application/usecases/Create${name}');
const GetAll${name} = require('../../application/usecases/GetAll${name}');
const GetById${name} = require('../../application/usecases/GetById${name}');
const Update${name} = require('../../application/usecases/Update${name}');
const Delete${name} = require('../../application/usecases/Delete${name}');

const ${lower}Repository = new ${name}Repository();

exports.create${name} = async (req, res) => {
  try {
    const usecase = new Create${name}(${lower}Repository);
    const result = await usecase.execute(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAll${name} = async (req, res) => {
  try {
    const usecase = new GetAll${name}(${lower}Repository);
    const result = await usecase.execute();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById${name} = async (req, res) => {
  try {
    const usecase = new GetById${name}(${lower}Repository);
    const result = await usecase.execute(req.params.id);
    if (!result) return res.status(404).json({ error: '${name} not found' });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update${name} = async (req, res) => {
  try {
    const usecase = new Update${name}(${lower}Repository);
    const result = await usecase.execute(req.params.id, req.body);
    if (!result) return res.status(404).json({ error: '${name} not found' });
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.delete${name} = async (req, res) => {
  try {
    const usecase = new Delete${name}(${lower}Repository);
    await usecase.execute(req.params.id);
    res.status(200).json({ message: '${name} deleted successfully ✅' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};`;
  }

  generateRoutes(name) {
    const lower = name.toLowerCase();
    return `const express = require('express');
const router = express.Router();
const ${name}Controller = require('../interfaces/controllers/${name}Controller');

router.post('/', ${name}Controller.create${name});
router.get('/', ${name}Controller.getAll${name});
router.get('/:id', ${name}Controller.getById${name});
router.put('/:id', ${name}Controller.update${name});
router.delete('/:id', ${name}Controller.delete${name});

module.exports = router;`;
  }

  generateDto(action, name, fields) {
    const fieldsList = fields.map(f => `this.${f.name} = data.${f.name};`).join('\n    ');
    const validations = action === 'Create'
      ? fields.filter(f => f.required).map(f => `if (!this.${f.name}) throw new Error('${f.name} is required');`).join('\n    ')
      : '';

    return `class ${action}${name}Dto {
  constructor(data) {
    ${fieldsList}
  }

  validate() {
    ${validations}
  }
}

module.exports = ${action}${name}Dto;`;
  }

  generateAppJs(model) {
    return `const fs = require('fs');
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connecté ✅'))
  .catch(err => console.log('Erreur MongoDB :', err));

app.get('/', (req, res) => res.send('${model.projectName} is running 🚀'));

const routesPath = path.join(__dirname, 'routes');
fs.readdirSync(routesPath).forEach(file => {
  if (file.endsWith('Routes.js')) {
    const route = require(\`./routes/\${file}\`);
    const routeName = file.replace('Routes.js', '').toLowerCase();
    app.use(\`/api/\${routeName}\`, route);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));`;
  }

  generatePackageJson(projectName) {
    return JSON.stringify({
      name: projectName.toLowerCase(),
      version: '1.0.0',
      main: 'app.js',
      scripts: {
        start: 'node app.js',
        dev: 'nodemon app.js'
      },
      dependencies: {
        express: '^4.18.2',
        mongoose: '^7.0.0',
        dotenv: '^16.0.0',
        cors: '^2.8.5'
      }
    }, null, 2);
  }

  generateReadme(projectName, entities) {
    const entityList = entities.map(e => `- ${e.name}`).join('\n');
    return `# ${projectName}

Generated with Clean Architecture Backend Generator 🚀

## Entities
${entityList}

## Installation
\`\`\`
npm install
\`\`\`

## Run
\`\`\`
npm start
\`\`\`

## API Routes
${entities.map(e => `### ${e.name}
- POST /api/${e.name.toLowerCase()}
- GET /api/${e.name.toLowerCase()}
- GET /api/${e.name.toLowerCase()}/:id
- PUT /api/${e.name.toLowerCase()}/:id
- DELETE /api/${e.name.toLowerCase()}/:id`).join('\n\n')}`;
  }
}

module.exports = FileWriter;