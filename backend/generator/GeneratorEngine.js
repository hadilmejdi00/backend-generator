const FileWriter = require('./FileWriter');
const ModelValidator = require('./ModelValidator');

class GeneratorEngine {
  constructor(model) {
    this.model = model;
    this.fileWriter = new FileWriter();
    this.validator = new ModelValidator();
  }

  generate() {
    // Validation du modèle
    const errors = this.validator.validate(this.model);
    if (errors.length > 0) {
      throw new Error(`Validation errors:\n${errors.join('\n')}`);
    }

    const { projectName, entities } = this.model;
    const files = [];

    entities.forEach(entity => {
      const name = entity.name;
      const fields = entity.fields;

      // Domain Entity
      files.push({
        path: `${projectName}/domain/entities/${name}.js`,
        content: this.fileWriter.generateEntity(name, fields)
      });

      // Interface Repository
      files.push({
        path: `${projectName}/application/interfaces/I${name}Repository.js`,
        content: this.fileWriter.generateInterface(name)
      });

      // Use Cases
      ['Create', 'Update', 'Delete', 'GetAll', 'GetById'].forEach(action => {
        files.push({
          path: `${projectName}/application/usecases/${action}${name}.js`,
          content: this.fileWriter.generateUseCase(action, name)
        });
      });

      // Repository
      files.push({
        path: `${projectName}/infrastructure/repositories/${name}Repository.js`,
        content: this.fileWriter.generateRepository(name)
      });

      // Model
      files.push({
        path: `${projectName}/infrastructure/models/${name}Model.js`,
        content: this.fileWriter.generateModel(name, fields)
      });

      // Controller
      files.push({
        path: `${projectName}/interfaces/controllers/${name}Controller.js`,
        content: this.fileWriter.generateController(name)
      });

      // Routes
      files.push({
        path: `${projectName}/routes/${name}Routes.js`,
        content: this.fileWriter.generateRoutes(name)
      });

      // DTOs
      files.push({
        path: `${projectName}/application/dtos/Create${name}Dto.js`,
        content: this.fileWriter.generateDto('Create', name, fields)
      });
      files.push({
        path: `${projectName}/application/dtos/Update${name}Dto.js`,
        content: this.fileWriter.generateDto('Update', name, fields)
      });
    });

    // app.js
    files.push({
      path: `${projectName}/app.js`,
      content: this.fileWriter.generateAppJs(this.model)
    });

    // package.json
    files.push({
      path: `${projectName}/package.json`,
      content: this.fileWriter.generatePackageJson(projectName)
    });

    // README
    files.push({
      path: `${projectName}/README.md`,
      content: this.fileWriter.generateReadme(projectName, entities)
    });

    return files;
  }
}

module.exports = GeneratorEngine;