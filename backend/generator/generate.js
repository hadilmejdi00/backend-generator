// generate.js
const fs = require('fs');
const path = require('path');

// ⚡️ Définis ici ton modèle
const modelName = "Product"; // <- tu peux mettre "User" si tu veux générer pour User

// Liste des usecases à générer
const usecases = ["Create", "GetAll", "GetById", "Update", "Delete"];

// Chemin où les fichiers seront générés
const usecasesDir = path.join(__dirname, "../application/usecases");

// Créer le dossier s'il n'existe pas
if (!fs.existsSync(usecasesDir)) {
  fs.mkdirSync(usecasesDir, { recursive: true });
}

// Boucle pour générer chaque UseCase
usecases.forEach(action => {

  const params = action === "Create" ? "data" :
                 action === "Update" ? "id, data" :
                 action === "GetById" || action === "Delete" ? "id" : "";

  const logic = action === "Create" ? `return await ${modelName}.create(data);` :
                action === "GetAll" ? `return await ${modelName}.find();` :
                action === "GetById" ? `return await ${modelName}.findById(id);` :
                action === "Update" ? `return await ${modelName}.findByIdAndUpdate(id, data, { new: true });` :
                action === "Delete" ? `return await ${modelName}.findByIdAndDelete(id);` :
                "";

  const content = `
// ⚡️ ${action}${modelName} UseCase
const ${modelName} = require('../../domain/entities/${modelName}');

class ${action}${modelName} {
  async execute(${params}) {
    ${logic}
  }
}

module.exports = ${action}${modelName};
`.trim();

  // Écrire le fichier
  const filePath = path.join(usecasesDir, `${action}${modelName}.js`);
  fs.writeFileSync(filePath, content);

  console.log(`✅ UseCase ${action}${modelName} généré`);
});

console.log("🎉 Tous les UseCases ont été générés !");