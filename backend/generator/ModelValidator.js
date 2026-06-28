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
      const validPrimitiveTypes = ['String', 'Number', 'Boolean', 'Date'];
      const validRelationTypes = ['One-to-One', 'One-to-Many', 'Many-to-Many'];

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

            const isPrimitive = validPrimitiveTypes.includes(field.type);
            const isEntityRelation = entityNames.includes(field.type);

            // Vérifier type field — soit primitif, soit nom d'une entité existante
            if (!isPrimitive && !isEntityRelation) {
              errors.push(`Field ${field.name} in ${entity.name} has invalid type: ${field.type}. Valid types: ${validPrimitiveTypes.join(', ')} or an existing entity name`);
            }

            // Si c'est une relation vers une entité, vérifier le type de relation
            if (isEntityRelation) {
              if (field.type === entity.name) {
                errors.push(`Circular dependency detected in entity ${entity.name} (field ${field.name})`);
              }
              if (field.relation && !validRelationTypes.includes(field.relation)) {
                errors.push(`Invalid relation type ${field.relation} for field ${field.name} in ${entity.name}`);
              }
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