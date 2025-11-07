import prisma from '../config/database';
import { CreateContactDTO, UpdateContactDTO } from '../types';
import { ContactStatus } from '@prisma/client';

export class ContactService {
  // Criar novo contato
  async createContact(data: CreateContactDTO) {
    return await prisma.contact.create({
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        status: data.status || ContactStatus.PENDING,
        streetAddress: data.streetAddress,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        country: data.country,
        phoneNumber: data.phoneNumber,
        ipAddress: data.ipAddress,
        source: data.source || 'manual',
      },
    });
  }

  // Buscar contato por ID
  async getContactById(id: string) {
    return await prisma.contact.findUnique({
      where: { id },
      include: {
        lists: {
          include: {
            list: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        customFields: {
          include: {
            customField: true,
          },
        },
      },
    });
  }

  // Buscar contato por email
  async getContactByEmail(email: string) {
    return await prisma.contact.findUnique({
      where: { email },
    });
  }

  // Listar todos os contatos com filtros
  async listContacts(filters?: {
    status?: ContactStatus;
    listId?: string;
    tagId?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.search) {
      where.OR = [
        { email: { contains: filters.search, mode: 'insensitive' } },
        { firstName: { contains: filters.search, mode: 'insensitive' } },
        { lastName: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters?.listId) {
      where.lists = {
        some: {
          listId: filters.listId,
        },
      };
    }

    if (filters?.tagId) {
      where.tags = {
        some: {
          tagId: filters.tagId,
        },
      };
    }

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        take: filters?.limit || 50,
        skip: filters?.offset || 0,
        orderBy: { createdAt: 'desc' },
        include: {
          lists: {
            include: {
              list: true,
            },
          },
          tags: {
            include: {
              tag: true,
            },
          },
        },
      }),
      prisma.contact.count({ where }),
    ]);

    return { contacts, total };
  }

  // Atualizar contato
  async updateContact(id: string, data: UpdateContactDTO) {
    return await prisma.contact.update({
      where: { id },
      data,
    });
  }

  // Deletar contato
  async deleteContact(id: string) {
    return await prisma.contact.delete({
      where: { id },
    });
  }

  // Adicionar contato a uma lista
  async addContactToList(contactId: string, listId: string) {
    return await prisma.contactList.create({
      data: {
        contactId,
        listId,
      },
    });
  }

  // Remover contato de uma lista
  async removeContactFromList(contactId: string, listId: string) {
    return await prisma.contactList.deleteMany({
      where: {
        contactId,
        listId,
      },
    });
  }

  // Adicionar tag a um contato
  async addTagToContact(contactId: string, tagId: string) {
    return await prisma.contactTag.create({
      data: {
        contactId,
        tagId,
      },
    });
  }

  // Remover tag de um contato
  async removeTagFromContact(contactId: string, tagId: string) {
    return await prisma.contactTag.deleteMany({
      where: {
        contactId,
        tagId,
      },
    });
  }

  // Atualizar dados WooCommerce
  async updateWooCommerceData(
    contactId: string,
    data: {
      wooCustomerId?: number;
      totalSpent?: number;
      lastOrderDate?: Date;
      lifetimeValue?: number;
      customerSince?: Date;
      orderCount?: number;
    }
  ) {
    return await prisma.contact.update({
      where: { id: contactId },
      data,
    });
  }

  // Registrar atividade do contato
  async logActivity(
    contactId: string,
    activityType: string,
    description?: string,
    metadata?: any
  ) {
    return await prisma.contactActivity.create({
      data: {
        contactId,
        activityType,
        description,
        metadata,
      },
    });
  }
}

export default new ContactService();
