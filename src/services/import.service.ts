import fs from 'fs';
import csv from 'csv-parser';
import prisma from '../config/database';
import { ContactStatus } from '@prisma/client';
import contactService from './contact.service';

export class ImportService {
  // Importar contatos de arquivo CSV
  async importFromCSV(filePath: string): Promise<string> {
    const importRecord = await prisma.import.create({
      data: {
        source: 'csv',
        filename: filePath.split('/').pop() || 'unknown',
        totalRows: 0,
        successRows: 0,
        errorRows: 0,
        status: 'processing',
      },
    });

    const results: any[] = [];
    const errors: any[] = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
          let successCount = 0;
          let errorCount = 0;

          for (const row of results) {
            try {
              // Validar email
              if (!row.email || !this.isValidEmail(row.email)) {
                throw new Error('Invalid email');
              }

              // Verificar se já existe
              const existing = await contactService.getContactByEmail(row.email);

              if (existing) {
                // Atualizar contato existente
                await contactService.updateContact(existing.id, {
                  firstName: row.first_name || existing.firstName,
                  lastName: row.last_name || existing.lastName,
                  streetAddress: row.street_address || existing.streetAddress,
                  city: row.city || existing.city,
                  state: row.state || existing.state,
                  zipCode: row.zip_code || existing.zipCode,
                  country: row.country || existing.country,
                  phoneNumber: row.phone_number || existing.phoneNumber,
                });
              } else {
                // Criar novo contato
                await contactService.createContact({
                  email: row.email,
                  firstName: row.first_name,
                  lastName: row.last_name,
                  status: this.parseStatus(row.status),
                  streetAddress: row.street_address,
                  city: row.city,
                  state: row.state,
                  zipCode: row.zip_code,
                  country: row.country,
                  phoneNumber: row.phone_number,
                  source: 'csv',
                });
              }

              successCount++;
            } catch (error: any) {
              errorCount++;
              errors.push({
                row: row,
                error: error.message,
              });
            }
          }

          // Atualizar registro de importação
          await prisma.import.update({
            where: { id: importRecord.id },
            data: {
              totalRows: results.length,
              successRows: successCount,
              errorRows: errorCount,
              errors: errors.length > 0 ? errors : null,
              status: 'completed',
              completedAt: new Date(),
            },
          });

          resolve(importRecord.id);
        })
        .on('error', async (error) => {
          await prisma.import.update({
            where: { id: importRecord.id },
            data: {
              status: 'failed',
              errors: [{ error: error.message }],
              completedAt: new Date(),
            },
          });
          reject(error);
        });
    });
  }

  // Obter status de importação
  async getImportStatus(importId: string) {
    return await prisma.import.findUnique({
      where: { id: importId },
    });
  }

  // Listar todas as importações
  async listImports(limit?: number, offset?: number) {
    return await prisma.import.findMany({
      take: limit || 50,
      skip: offset || 0,
      orderBy: { createdAt: 'desc' },
    });
  }

  // Validar email
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Parse status do CSV
  private parseStatus(status?: string): ContactStatus {
    if (!status) return ContactStatus.PENDING;

    const normalized = status.toUpperCase();
    if (normalized in ContactStatus) {
      return ContactStatus[normalized as keyof typeof ContactStatus];
    }

    return ContactStatus.PENDING;
  }
}

export default new ImportService();
