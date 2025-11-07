import { Router } from 'express';
import segmentController from '../controllers/segment.controller';

const router = Router();

// CRUD de segmentos
router.post('/', segmentController.create);
router.get('/', segmentController.list);
router.get('/:id', segmentController.getById);
router.put('/:id', segmentController.update);
router.delete('/:id', segmentController.delete);

// Obter contatos do segmento
router.get('/:id/contacts', segmentController.getContacts);
router.get('/:id/contacts/count', segmentController.countContacts);

export default router;
