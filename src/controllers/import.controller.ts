import { Request, Response } from 'express';
import importService from '../services/import.service';
import wooCommerceService from '../services/woocommerce.service';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configurar multer para upload de arquivos
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `import-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || path.extname(file.originalname) === '.csv') {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  },
});

export class ImportController {
  // Importar contatos de CSV
  async importCSV(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const importId = await importService.importFromCSV(req.file.path);

      res.status(202).json({
        message: 'Import started',
        importId,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Sincronizar com WooCommerce
  async syncWooCommerce(req: Request, res: Response) {
    try {
      const importId = await wooCommerceService.syncCustomers();

      res.status(202).json({
        message: 'WooCommerce sync started',
        importId,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Webhook do WooCommerce
  async wooCommerceWebhook(req: Request, res: Response) {
    try {
      const orderData = req.body;
      await wooCommerceService.handleOrderWebhook(orderData);
      res.status(200).json({ message: 'Webhook processed' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Obter status de importação
  async getImportStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const importRecord = await importService.getImportStatus(id);

      if (!importRecord) {
        return res.status(404).json({ error: 'Import not found' });
      }

      res.json(importRecord);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Listar importações
  async listImports(req: Request, res: Response) {
    try {
      const { limit = '50', offset = '0' } = req.query;

      const imports = await importService.listImports(
        parseInt(limit as string),
        parseInt(offset as string)
      );

      res.json(imports);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new ImportController();
