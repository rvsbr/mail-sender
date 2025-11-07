import { Request, Response } from 'express';
import emailService from '../services/email.service';
import contactService from '../services/contact.service';
import segmentService from '../services/segment.service';
import listService from '../services/list.service';
import prisma from '../config/database';

export class CampaignController {
  // Enviar email de teste
  async sendTest(req: Request, res: Response) {
    try {
      const { to, subject, html } = req.body;

      const result = await emailService.sendEmail(to, subject, html);

      if (result.success) {
        res.json({
          message: 'Test email sent successfully',
          messageId: result.messageId,
        });
      } else {
        res.status(400).json({
          error: 'Failed to send email',
          details: result.error,
        });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Enviar campanha para lista
  async sendToList(req: Request, res: Response) {
    try {
      const { listId, subject, html } = req.body;

      // Buscar contatos da lista
      const { contacts } = await listService.getListContacts(listId, 10000);

      // Filtrar apenas contatos ativos
      const activeContacts = contacts.filter((c) => c.status === 'ACTIVE');

      // Enviar campanha
      const results = await emailService.sendCampaign(
        activeContacts,
        subject,
        html
      );

      res.json({
        message: 'Campaign sent',
        results,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Enviar campanha para segmento
  async sendToSegment(req: Request, res: Response) {
    try {
      const { segmentId, subject, html } = req.body;

      // Buscar contatos do segmento
      const { contacts } = await segmentService.getSegmentContacts(
        segmentId,
        10000
      );

      // Filtrar apenas contatos ativos
      const activeContacts = contacts.filter((c) => c.status === 'ACTIVE');

      // Enviar campanha
      const results = await emailService.sendCampaign(
        activeContacts,
        subject,
        html
      );

      res.json({
        message: 'Campaign sent to segment',
        results,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Enviar campanha para contatos específicos
  async sendToContacts(req: Request, res: Response) {
    try {
      const { contactIds, subject, html } = req.body;

      if (!Array.isArray(contactIds)) {
        return res.status(400).json({ error: 'contactIds must be an array' });
      }

      // Buscar contatos
      const contacts = await prisma.contact.findMany({
        where: {
          id: { in: contactIds },
          status: 'ACTIVE',
        },
      });

      // Enviar campanha
      const results = await emailService.sendCampaign(contacts, subject, html);

      res.json({
        message: 'Campaign sent',
        results,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Verificar configuração de email
  async verifyConfig(req: Request, res: Response) {
    try {
      const isValid = await emailService.verifyConnection();

      if (isValid) {
        res.json({
          status: 'ok',
          message: 'Email configuration is valid',
        });
      } else {
        res.status(400).json({
          status: 'error',
          message: 'Email configuration is invalid',
        });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new CampaignController();
