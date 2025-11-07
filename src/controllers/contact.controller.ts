import { Request, Response } from 'express';
import contactService from '../services/contact.service';
import { CreateContactDTO, UpdateContactDTO } from '../types';

export class ContactController {
  // Criar novo contato
  async create(req: Request, res: Response) {
    try {
      const data: CreateContactDTO = req.body;
      const contact = await contactService.createContact(data);
      res.status(201).json(contact);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Buscar contato por ID
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const contact = await contactService.getContactById(id);

      if (!contact) {
        return res.status(404).json({ error: 'Contact not found' });
      }

      res.json(contact);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Listar contatos com filtros
  async list(req: Request, res: Response) {
    try {
      const {
        status,
        listId,
        tagId,
        search,
        limit = '50',
        offset = '0',
      } = req.query;

      const result = await contactService.listContacts({
        status: status as any,
        listId: listId as string,
        tagId: tagId as string,
        search: search as string,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      });

      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Atualizar contato
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data: UpdateContactDTO = req.body;
      const contact = await contactService.updateContact(id, data);
      res.json(contact);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Deletar contato
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await contactService.deleteContact(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Adicionar contato a uma lista
  async addToList(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { listId } = req.body;
      const result = await contactService.addContactToList(id, listId);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Remover contato de uma lista
  async removeFromList(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { listId } = req.body;
      await contactService.removeContactFromList(id, listId);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Adicionar tag a um contato
  async addTag(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { tagId } = req.body;
      const result = await contactService.addTagToContact(id, tagId);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Remover tag de um contato
  async removeTag(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { tagId } = req.body;
      await contactService.removeTagFromContact(id, tagId);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new ContactController();
