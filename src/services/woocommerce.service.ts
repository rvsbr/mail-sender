import axios, { AxiosInstance } from 'axios';
import prisma from '../config/database';
import contactService from './contact.service';
import { WooCommerceCustomer } from '../types';
import { ContactStatus } from '@prisma/client';

export class WooCommerceService {
  private api: AxiosInstance;

  constructor() {
    const wooUrl = process.env.WOOCOMMERCE_URL;
    const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY;
    const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET;

    if (!wooUrl || !consumerKey || !consumerSecret) {
      console.warn('WooCommerce credentials not configured');
    }

    this.api = axios.create({
      baseURL: `${wooUrl}/wp-json/wc/v3`,
      auth: {
        username: consumerKey || '',
        password: consumerSecret || '',
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Sincronizar todos os clientes do WooCommerce
  async syncCustomers(): Promise<string> {
    const importRecord = await prisma.import.create({
      data: {
        source: 'woocommerce',
        totalRows: 0,
        successRows: 0,
        errorRows: 0,
        status: 'processing',
      },
    });

    try {
      let page = 1;
      let hasMore = true;
      let totalCustomers = 0;
      let successCount = 0;
      let errorCount = 0;
      const errors: any[] = [];

      while (hasMore) {
        const response = await this.api.get('/customers', {
          params: {
            per_page: 100,
            page,
          },
        });

        const customers: WooCommerceCustomer[] = response.data;

        if (customers.length === 0) {
          hasMore = false;
          break;
        }

        for (const customer of customers) {
          try {
            await this.syncCustomer(customer);
            successCount++;
          } catch (error: any) {
            errorCount++;
            errors.push({
              customerId: customer.id,
              email: customer.email,
              error: error.message,
            });
          }
        }

        totalCustomers += customers.length;
        page++;
      }

      // Atualizar registro de importação
      await prisma.import.update({
        where: { id: importRecord.id },
        data: {
          totalRows: totalCustomers,
          successRows: successCount,
          errorRows: errorCount,
          errors: errors.length > 0 ? errors : null,
          status: 'completed',
          completedAt: new Date(),
        },
      });

      return importRecord.id;
    } catch (error: any) {
      await prisma.import.update({
        where: { id: importRecord.id },
        data: {
          status: 'failed',
          errors: [{ error: error.message }],
          completedAt: new Date(),
        },
      });
      throw error;
    }
  }

  // Sincronizar um cliente específico
  async syncCustomer(customer: WooCommerceCustomer) {
    // Verificar se o contato já existe
    let contact = await contactService.getContactByEmail(customer.email);

    if (contact) {
      // Atualizar contato existente
      await contactService.updateContact(contact.id, {
        firstName: customer.first_name,
        lastName: customer.last_name,
        streetAddress: customer.billing.address_1,
        city: customer.billing.city,
        state: customer.billing.state,
        zipCode: customer.billing.postcode,
        country: customer.billing.country,
        phoneNumber: customer.billing.phone,
      });

      // Atualizar dados WooCommerce
      const stats = await this.getCustomerStats(customer.id);
      await contactService.updateWooCommerceData(contact.id, {
        wooCustomerId: customer.id,
        customerSince: new Date(customer.date_created),
        ...stats,
      });
    } else {
      // Criar novo contato
      contact = await contactService.createContact({
        email: customer.email,
        firstName: customer.first_name,
        lastName: customer.last_name,
        status: ContactStatus.ACTIVE,
        streetAddress: customer.billing.address_1,
        city: customer.billing.city,
        state: customer.billing.state,
        zipCode: customer.billing.postcode,
        country: customer.billing.country,
        phoneNumber: customer.billing.phone,
        source: 'woocommerce',
      });

      // Adicionar dados WooCommerce
      const stats = await this.getCustomerStats(customer.id);
      await contactService.updateWooCommerceData(contact.id, {
        wooCustomerId: customer.id,
        customerSince: new Date(customer.date_created),
        ...stats,
      });
    }

    return contact;
  }

  // Obter estatísticas do cliente (pedidos, total gasto, etc)
  async getCustomerStats(customerId: number) {
    try {
      // Buscar pedidos do cliente
      const ordersResponse = await this.api.get('/orders', {
        params: {
          customer: customerId,
          per_page: 100,
        },
      });

      const orders = ordersResponse.data;

      let totalSpent = 0;
      let lastOrderDate: Date | undefined;
      let orderCount = orders.length;

      orders.forEach((order: any) => {
        if (order.status === 'completed' || order.status === 'processing') {
          totalSpent += parseFloat(order.total);

          const orderDate = new Date(order.date_created);
          if (!lastOrderDate || orderDate > lastOrderDate) {
            lastOrderDate = orderDate;
          }
        }
      });

      return {
        totalSpent,
        lastOrderDate,
        lifetimeValue: totalSpent, // Pode ser calculado de forma diferente
        orderCount,
      };
    } catch (error) {
      console.error('Error fetching customer stats:', error);
      return {
        totalSpent: 0,
        orderCount: 0,
      };
    }
  }

  // Sincronizar cliente por ID
  async syncCustomerById(customerId: number) {
    const response = await this.api.get(`/customers/${customerId}`);
    const customer: WooCommerceCustomer = response.data;
    return await this.syncCustomer(customer);
  }

  // Webhook handler para novos pedidos
  async handleOrderWebhook(orderData: any) {
    if (!orderData.customer_id) {
      return;
    }

    // Sincronizar dados do cliente quando houver um novo pedido
    await this.syncCustomerById(orderData.customer_id);
  }
}

export default new WooCommerceService();
