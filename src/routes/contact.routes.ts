import { Router } from 'express';
import contactController from '../controllers/contact.controller';

const router = Router();

// CRUD de contatos
router.post('/', contactController.create);
router.get('/', contactController.list);
router.get('/:id', contactController.getById);
router.put('/:id', contactController.update);
router.delete('/:id', contactController.delete);

// Gerenciamento de listas
router.post('/:id/lists', contactController.addToList);
router.delete('/:id/lists', contactController.removeFromList);

// Gerenciamento de tags
router.post('/:id/tags', contactController.addTag);
router.delete('/:id/tags', contactController.removeTag);

export default router;
