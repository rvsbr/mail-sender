import { Router } from 'express';
import tagController from '../controllers/tag.controller';

const router = Router();

// CRUD de tags
router.post('/', tagController.create);
router.get('/', tagController.list);
router.get('/:id', tagController.getById);
router.put('/:id', tagController.update);
router.delete('/:id', tagController.delete);

// Gerenciamento de contatos nas tags
router.get('/:id/contacts', tagController.getContacts);
router.post('/:id/contacts', tagController.addContacts);
router.delete('/:id/contacts', tagController.removeContacts);

export default router;
