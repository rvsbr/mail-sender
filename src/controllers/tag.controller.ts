import { Request, Response } from 'express';
import tagService from '../services/tag.service';

export class TagController {
  // Criar nova tag
  async create(req: Request, res: Response) {
    try {
      const { name, color } = req.body;
      const tag = await tagService.createTag(name, color);
      res.status(201).json(tag);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Buscar tag por ID
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const tag = await tagService.getTagById(id);

      if (!tag) {
        return res.status(404).json({ error: 'Tag not found' });
      }

      res.json(tag);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Listar todas as tags
  async list(req: Request, res: Response) {
    try {
      const tags = await tagService.listTags();
      res.json(tags);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Atualizar tag
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, color } = req.body;
      const tag = await tagService.updateTag(id, name, color);
      res.json(tag);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Deletar tag
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await tagService.deleteTag(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Obter contatos de uma tag
  async getContacts(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { limit = '50', offset = '0' } = req.query;

      const result = await tagService.getTagContacts(
        id,
        parseInt(limit as string),
        parseInt(offset as string)
      );

      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Adicionar múltiplos contatos a uma tag
  async addContacts(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { contactIds } = req.body;

      if (!Array.isArray(contactIds)) {
        return res.status(400).json({ error: 'contactIds must be an array' });
      }

      const result = await tagService.addContactsToTag(id, contactIds);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Remover múltiplos contatos de uma tag
  async removeContacts(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { contactIds } = req.body;

      if (!Array.isArray(contactIds)) {
        return res.status(400).json({ error: 'contactIds must be an array' });
      }

      await tagService.removeContactsFromTag(id, contactIds);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new TagController();
