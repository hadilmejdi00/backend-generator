class ModelValidator {
  validate(model) {
    const errors = [];

    // Vérifier projectName
    if (!model.projectName) {
      errors.push('projectName is required');
    }

    // Vérifier entities
    if (!model.entities || model.entities.length === 0) {
      errors.push('At least one entity is required');
    } else {
      const entityNames = model.entities.map(e => e.name);

      model.entities.forEach(entity => {
        // Vérifier nom entité
        if (!entity.name) {
          errors.push('Entity name is required');
        }

        // Vérifier fields
        if (!entity.fields || entity.fields.length === 0) {
          errors.push(`Entity ${entity.name} must have at least one field`);
        } else {
          entity.fields.forEach(field => {
            // Vérifier nom field
            if (!field.name) {
              errors.push(`Entity ${entity.name} has a field without name`);
            }

            // Vérifier type field
            const validTypes = ['String', 'Number', 'Boolean', 'Date'];
            if (!validTypes.includes(field.type)) {
              errors.push(`Field ${field.name} in ${entity.name} has invalid type: ${field.type}. Valid types: ${validTypes.join(', ')}`);
            }
          });
        }

        // Vérifier relations
        if (entity.relations) {
          entity.relations.forEach(relation => {
            // Vérifier type relation
            const validRelations = ['One-to-One', 'One-to-Many', 'Many-to-One'];
            if (!validRelations.includes(relation.type)) {
              errors.push(`Invalid relation type ${relation.type} in entity ${entity.name}`);
            }

            // Vérifier que l'entité cible existe
            if (!entityNames.includes(relation.target)) {
              errors.push(`Relation target ${relation.target} in entity ${entity.name} does not exist`);
            }

            // Détecter dépendances circulaires
            if (relation.target === entity.name) {
              errors.push(`Circular dependency detected in entity ${entity.name}`);
            }
          });
        }
      });

      // Détecter noms dupliqués
      const duplicates = entityNames.filter((name, index) => entityNames.indexOf(name) !== index);
      if (duplicates.length > 0) {
        errors.push(`Duplicate entity names: ${duplicates.join(', ')}`);
      }
    }

    return errors;
  }
}

module.exports = ModelValidator;