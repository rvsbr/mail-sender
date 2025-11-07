import prisma from '../config/database';

export class ListService {
  // Criar nova lista
  async createList(name: string, description?: string) {
    return await prisma.list.create({
      data: {
        name,
        description,
      },
    });
  }

  // Buscar lista por ID
  async getListById(id: string) {
    return await prisma.list.findUnique({
      where: { id },
      include: {
        contacts: {
          include: {
            contact: true,
          },
        },
      },
    });
  }

  // Listar todas as listas
  async listLists() {
    return await prisma.list.findMany({
      include: {
        _count: {
          select: { contacts: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Atualizar lista
  async updateList(id: string, name?: string, description?: string) {
    return await prisma.list.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
      },
    });
  }

  // Deletar lista
  async deleteList(id: string) {
    return await prisma.list.delete({
      where: { id },
    });
  }

  // Obter contatos de uma lista
  async getListContacts(listId: string, limit?: number, offset?: number) {
    const contacts = await prisma.contactList.findMany({
      where: { listId },
      take: limit || 50,
      skip: offset || 0,
      include: {
        contact: {
          include: {
            tags: {
              include: {
                tag: true,
              },
            },
          },
        },
      },
      orderBy: { addedAt: 'desc' },
    });

    const total = await prisma.contactList.count({
      where: { listId },
    });

    return {
      contacts: contacts.map((cl) => cl.contact),
      total,
    };
  }

  // Adicionar múltiplos contatos a uma lista
  async addContactsToList(listId: string, contactIds: string[]) {
    const data = contactIds.map((contactId) => ({
      contactId,
      listId,
    }));

    return await prisma.contactList.createMany({
      data,
      skipDuplicates: true,
    });
  }

  // Remover múltiplos contatos de uma lista
  async removeContactsFromList(listId: string, contactIds: string[]) {
    return await prisma.contactList.deleteMany({
      where: {
        listId,
        contactId: {
          in: contactIds,
        },
      },
    });
  }
}

export default new ListService();
