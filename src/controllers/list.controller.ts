import { Request, Response } from 'express';
import listService from '../services/list.service';

export class ListController {
  // Criar nova lista
  async create(req: Request, res: Response) {
    try {
      const { name, description } = req.body;
      const list = await listService.createList(name, description);
      res.status(201).json(list);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Buscar lista por ID
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const list = await listService.getListById(id);

      if (!list) {
        return res.status(404).json({ error: 'List not found' });
      }

      res.json(list);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Listar todas as listas
  async list(req: Request, res: Response) {
    try {
      const lists = await listService.listLists();
      res.json(lists);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Atualizar lista
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      const list = await listService.updateList(id, name, description);
      res.json(list);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Deletar lista
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await listService.deleteList(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Obter contatos de uma lista
  async getContacts(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { limit = '50', offset = '0' } = req.query;

      const result = await listService.getListContacts(
        id,
        parseInt(limit as string),
        parseInt(offset as string)
      );

      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Adicionar múltiplos contatos a uma lista
  async addContacts(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { contactIds } = req.body;

      if (!Array.isArray(contactIds)) {
        return res.status(400).json({ error: 'contactIds must be an array' });
      }

      const result = await listService.addContactsToList(id, contactIds);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Remover múltiplos contatos de uma lista
  async removeContacts(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { contactIds } = req.body;

      if (!Array.isArray(contactIds)) {
        return res.status(400).json({ error: 'contactIds must be an array' });
      }

      await listService.removeContactsFromList(id, contactIds);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new ListController();
