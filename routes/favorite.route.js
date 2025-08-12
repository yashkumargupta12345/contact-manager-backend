import express from 'express'
import { addFavorite, getFavorites, removeFavorite } from '../controllers/favorite.controller.js'

const favoriteRouter = express.Router()

/**
 * @swagger
 * /user/favorites:
 *   get:
 *     summary: Get all favorite contacts
 *     tags: [Favorites]
 *     responses:
 *       200:
 *         description: Successfully retrieved favorite contacts
 *       404:
 *         description: No favorite contacts found
 *       500:
 *         description: Server error
 */
favoriteRouter.get('/favorites', getFavorites)


/**
 * @swagger
 * /user/favorites/{id}:
 *   put:
 *     summary: Add contact to favorites
 *     tags: [Favorites]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact ID
 *     responses:
 *       200:
 *         description: Contact added to favorites successfully
 *       400:
 *         description: Invalid contact ID
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Server error
 */
favoriteRouter.put('/favorites/:id', addFavorite)


/**
 * @swagger
 * /user/favorites/{id}:
 *   delete:
 *     summary: Remove contact from favorites
 *     tags: [Favorites]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact ID
 *     responses:
 *       200:
 *         description: Contact removed from favorites successfully
 *       400:
 *         description: Invalid contact ID
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Server error
 */
favoriteRouter.delete('/favorites/:id', removeFavorite)


export default favoriteRouter