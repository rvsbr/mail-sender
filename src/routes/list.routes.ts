import { Router } from 'express';
import listController from '../controllers/list.controller';

const router = Router();

// CRUD de listas
router.post('/', listController.create);
router.get('/', listController.list);
router.get('/:id', listController.getById);
router.put('/:id', listController.update);
router.delete('/:id', listController.delete);

// Gerenciamento de contatos nas listas
router.get('/:id/contacts', listController.getContacts);
router.post('/:id/contacts', listController.addContacts);
router.delete('/:id/contacts', listController.removeContacts);

export default router;
