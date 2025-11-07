import { Request, Response } from 'express';
import segmentService from '../services/segment.service';
import { CreateSegmentDTO } from '../types';

export class SegmentController {
  // Criar novo segmento
  async create(req: Request, res: Response) {
    try {
      const data: CreateSegmentDTO = req.body;
      const segment = await segmentService.createSegment(data);
      res.status(201).json(segment);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Buscar segmento por ID
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const segment = await segmentService.getSegmentById(id);

      if (!segment) {
        return res.status(404).json({ error: 'Segment not found' });
      }

      res.json(segment);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Listar todos os segmentos
  async list(req: Request, res: Response) {
    try {
      const segments = await segmentService.listSegments();
      res.json(segments);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Atualizar segmento
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data: Partial<CreateSegmentDTO> = req.body;
      const segment = await segmentService.updateSegment(id, data);
      res.json(segment);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Deletar segmento
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await segmentService.deleteSegment(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Obter contatos de um segmento
  async getContacts(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { limit = '50', offset = '0' } = req.query;

      const result = await segmentService.getSegmentContacts(
        id,
        parseInt(limit as string),
        parseInt(offset as string)
      );

      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Contar contatos em um segmento
  async countContacts(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const count = await segmentService.countSegmentContacts(id);
      res.json({ count });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new SegmentController();
