import prisma from '../config/database';

export class TagService {
  // Criar nova tag
  async createTag(name: string, color?: string) {
    return await prisma.tag.create({
      data: {
        name,
        color,
      },
    });
  }

  // Buscar tag por ID
  async getTagById(id: string) {
    return await prisma.tag.findUnique({
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

  // Buscar tag por nome
  async getTagByName(name: string) {
    return await prisma.tag.findUnique({
      where: { name },
    });
  }

  // Listar todas as tags
  async listTags() {
    return await prisma.tag.findMany({
      include: {
        _count: {
          select: { contacts: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Atualizar tag
  async updateTag(id: string, name?: string, color?: string) {
    return await prisma.tag.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(color !== undefined && { color }),
      },
    });
  }

  // Deletar tag
  async deleteTag(id: string) {
    return await prisma.tag.delete({
      where: { id },
    });
  }

  // Obter contatos de uma tag
  async getTagContacts(tagId: string, limit?: number, offset?: number) {
    const contacts = await prisma.contactTag.findMany({
      where: { tagId },
      take: limit || 50,
      skip: offset || 0,
      include: {
        contact: {
          include: {
            lists: {
              include: {
                list: true,
              },
            },
          },
        },
      },
      orderBy: { addedAt: 'desc' },
    });

    const total = await prisma.contactTag.count({
      where: { tagId },
    });

    return {
      contacts: contacts.map((ct) => ct.contact),
      total,
    };
  }

  // Adicionar múltiplos contatos a uma tag
  async addContactsToTag(tagId: string, contactIds: string[]) {
    const data = contactIds.map((contactId) => ({
      contactId,
      tagId,
    }));

    return await prisma.contactTag.createMany({
      data,
      skipDuplicates: true,
    });
  }

  // Remover múltiplos contatos de uma tag
  async removeContactsFromTag(tagId: string, contactIds: string[]) {
    return await prisma.contactTag.deleteMany({
      where: {
        tagId,
        contactId: {
          in: contactIds,
        },
      },
    });
  }
}

export default new TagService();
