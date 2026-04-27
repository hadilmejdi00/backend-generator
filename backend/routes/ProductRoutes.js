const express = require('express');
const ProductController = require('../interfaces/controllers/ProductController');
const router = express.Router();

/**
 * @swagger
 * /api/product:
 *   post:
 *     summary: Créer un produit
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Produit créé
 *   get:
 *     summary: Récupérer tous les produits
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: Liste des produits
 * 
 * /api/product/{id}:
 *   get:
 *     summary: Récupérer un produit par ID
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Produit trouvé
 *       404:
 *         description: Produit non trouvé
 *   put:
 *     summary: Modifier un produit
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Produit modifié
 *   delete:
 *     summary: Supprimer un produit
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Produit supprimé
 */

router.post('/', ProductController.createProduct);
router.get('/', ProductController.getAllProduct);
router.get('/:id', ProductController.getByIdProduct);
router.put('/:id', ProductController.updateProduct);
router.delete('/:id', ProductController.deleteProduct);

module.exports = router;