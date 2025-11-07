import { Router } from 'express';
import importController, { upload } from '../controllers/import.controller';

const router = Router();

// Importação de contatos
router.post('/csv', upload.single('file'), importController.importCSV);
router.post('/woocommerce', importController.syncWooCommerce);
router.post('/woocommerce/webhook', importController.wooCommerceWebhook);

// Status de importação
router.get('/', importController.listImports);
router.get('/:id', importController.getImportStatus);

export default router;
