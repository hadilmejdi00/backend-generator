const express = require('express');
const router = express.Router();
const userController = require('../interfaces/controllers/UserController');

/**
 * @swagger
 * /api/user:
 *   post:
 *     summary: Créer un utilisateur
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Utilisateur créé
 *   get:
 *     summary: Récupérer tous les utilisateurs
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *
 * /api/user/{id}:
 *   get:
 *     summary: Récupérer un utilisateur par ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
 *       404:
 *         description: Utilisateur non trouvé
 *   put:
 *     summary: Modifier un utilisateur
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilisateur modifié
 *   delete:
 *     summary: Supprimer un utilisateur
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilisateur supprimé
 */

router.post('/', userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getByIdUsers);
router.put('/:id', userController.updateUsers);
router.delete('/:id', userController.deleteUsers);

module.exports = router;