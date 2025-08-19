import express from 'express'
import { validateTag, validateUpdateTag } from '../middlewares/tagMiddleware.js'
import { createTag, deleteTag, getTags, updateTag, getContactsByTag,
    addContactToTag,
    removeContactFromTag,
    addMultipleContactsToTag,
    getContactsNotInTag } from '../controllers/tag.controller.js'

const tagRouter = express.Router()



/**
 * @swagger
 * /user/tags:
 *   get:
 *     summary: Get all tags for the authenticated user
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved tags
 *       404:
 *         description: No tags found
 *       500:
 *         description: Server error
 */
tagRouter.get('/tags', getTags)


/**
 * @swagger
 * /user/tags:
 *   post:
 *     summary: Create a new tag
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Work"
 *               color:
 *                 type: string
 *                 example: "#FF5733"
 *     responses:
 *       201:
 *         description: Tag created successfully
 *       400:
 *         description: Validation error or tag already exists
 *       500:
 *         description: Server error
 */
tagRouter.post('/tags', validateTag, createTag)


/**
 * @swagger
 * /user/tags/{id}:
 *   put:
 *     summary: Update a tag
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tag ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Work"
  *               color:
 *                 type: string
 *                 example: "#FF5733"
 *     responses:
 *       200:
 *         description: Tag updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Tag not found
 *       500:
 *         description: Server error
   */
tagRouter.put('/tags/:id', validateUpdateTag, updateTag)


/**
 * @swagger
 * /user/tags/{id}:
 *   delete:
 *     summary: Delete a tag
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tag ID
 *     responses:
 *       200:
 *         description: Tag deleted successfully
 *       404:
 *         description: Tag not found
 *       500:
 *         description: Server error
 */
tagRouter.delete('/tags/:id', deleteTag)


/**
 * @swagger
 * /user/tags/{id}/contacts:
 *   get:
 *     summary: Get all contacts with a specific tag
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tag ID
 *     responses:
 *       200:
 *         description: Successfully retrieved contacts with the tag
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Contacts with tag 'Work'"
 *                 tag:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     color:
 *                       type: string
 *                     usageCount:
 *                       type: number
 *                 count:
 *                   type: number
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Contact'
 *       400:
 *         description: Invalid tag ID
 *       404:
 *         description: Tag not found or no contacts with this tag
 *       500:
 *         description: Server error
  */
 tagRouter.get('/tags/:id/contacts', getContactsByTag)



/**
 * @swagger
 * /user/tags/{tagId}/contacts:
 *   post:
 *     summary: Add a contact to a tag
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: string
 *         description: Tag ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - contactId
 *             properties:
 *               contactId:
 *                 type: string
 *                 example: "60f7b1b3b3f3b3f3b3f3b3f3"
 *     responses:
 *       200:
 *         description: Contact added to tag successfully
 *       400:
 *         description: Invalid ID or tag already assigned
 *       404:
 *         description: Tag or contact not found
 *       500:
 *         description: Server error
 */
tagRouter.post('/tags/:tagId/contacts', addContactToTag);

/**
 * @swagger
 * /user/tags/{tagId}/contacts/bulk:
 *   post:
 *     summary: Add multiple contacts to a tag
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: string
 *         description: Tag ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - contactIds
 *             properties:
 *               contactIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["60f7b1b3b3f3b3f3b3f3b3f3", "60f7b1b3b3f3b3f3b3f3b3f4"]
 *     responses:
 *       200:
 *         description: Contacts processed successfully
 *       400:
 *         description: Invalid input or IDs
 *       404:
 *         description: Tag not found
 *       500:
 *         description: Server error
 */
tagRouter.post('/tags/:tagId/contacts/bulk', addMultipleContactsToTag);

/**
 * @swagger
 * /user/tags/{tagId}/contacts/{contactId}:
 *   delete:
 *     summary: Remove a contact from a tag
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: string
 *         description: Tag ID
 *       - in: path
 *         name: contactId
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact ID
 *     responses:
 *       200:
 *         description: Contact removed from tag successfully
 *       400:
 *         description: Invalid ID or tag not assigned
 *       404:
 *         description: Tag or contact not found
 *       500:
 *         description: Server error
 */
tagRouter.delete('/tags/:tagId/contacts/:contactId', removeContactFromTag);

/**
 * @swagger
 * /user/tags/{tagId}/available-contacts:
 *   get:
 *     summary: Get contacts that don't have this tag (for selection)
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: string
 *         description: Tag ID
 *     responses:
 *       200:
 *         description: Successfully retrieved available contacts
 *       404:
 *         description: Tag not found
 *       500:
 *         description: Server error
 */
tagRouter.get('/tags/:tagId/available-contacts', getContactsNotInTag);


export default tagRouter
