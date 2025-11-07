import { Router } from 'express';
import campaignController from '../controllers/campaign.controller';

const router = Router();

// Verificar configuração
router.get('/verify', campaignController.verifyConfig);

// Enviar email de teste
router.post('/test', campaignController.sendTest);

// Enviar campanhas
router.post('/send/list', campaignController.sendToList);
router.post('/send/segment', campaignController.sendToSegment);
router.post('/send/contacts', campaignController.sendToContacts);

export default router;
