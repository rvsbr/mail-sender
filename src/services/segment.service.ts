import prisma from '../config/database';
import { CreateSegmentDTO, SegmentFilter } from '../types';
import { ContactStatus } from '@prisma/client';

export class SegmentService {
  // Criar novo segmento
  async createSegment(data: CreateSegmentDTO) {
    return await prisma.segment.create({
      data: {
        name: data.name,
        description: data.description,
        filters: data.filters as any,
      },
    });
  }

  // Buscar segmento por ID
  async getSegmentById(id: string) {
    return await prisma.segment.findUnique({
      where: { id },
    });
  }

  // Listar todos os segmentos
  async listSegments() {
    return await prisma.segment.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // Atualizar segmento
  async updateSegment(id: string, data: Partial<CreateSegmentDTO>) {
    return await prisma.segment.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.filters && { filters: data.filters as any }),
      },
    });
  }

  // Deletar segmento
  async deleteSegment(id: string) {
    return await prisma.segment.delete({
      where: { id },
    });
  }

  // Obter contatos de um segmento (aplicando filtros dinâmicos)
  async getSegmentContacts(segmentId: string, limit?: number, offset?: number) {
    const segment = await this.getSegmentById(segmentId);
    if (!segment) {
      throw new Error('Segment not found');
    }

    const filters = segment.filters as SegmentFilter[];
    const where = this.buildWhereClause(filters);

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        take: limit || 50,
        skip: offset || 0,
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

  // Construir cláusula WHERE baseada nos filtros
  private buildWhereClause(filters: SegmentFilter[]): any {
    const where: any = {
      AND: [],
    };

    filters.forEach((filter) => {
      const condition: any = {};

      switch (filter.operator) {
        case 'equals':
          condition[filter.field] = filter.value;
          break;

        case 'contains':
          condition[filter.field] = {
            contains: filter.value,
            mode: 'insensitive',
          };
          break;

        case 'greater_than':
          condition[filter.field] = {
            gt: filter.value,
          };
          break;

        case 'less_than':
          condition[filter.field] = {
            lt: filter.value,
          };
          break;

        case 'between':
          if (Array.isArray(filter.value) && filter.value.length === 2) {
            condition[filter.field] = {
              gte: filter.value[0],
              lte: filter.value[1],
            };
          }
          break;

        case 'in':
          if (Array.isArray(filter.value)) {
            condition[filter.field] = {
              in: filter.value,
            };
          }
          break;
      }

      where.AND.push(condition);
    });

    return where.AND.length > 0 ? where : {};
  }

  // Contar contatos em um segmento
  async countSegmentContacts(segmentId: string) {
    const segment = await this.getSegmentById(segmentId);
    if (!segment) {
      throw new Error('Segment not found');
    }

    const filters = segment.filters as SegmentFilter[];
    const where = this.buildWhereClause(filters);

    return await prisma.contact.count({ where });
  }
}

export default new SegmentService();
