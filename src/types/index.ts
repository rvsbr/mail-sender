import { ContactStatus } from '@prisma/client';

export interface CreateContactDTO {
  email: string;
  firstName?: string;
  lastName?: string;
  status?: ContactStatus;
  streetAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  phoneNumber?: string;
  ipAddress?: string;
  source?: string;
}

export interface UpdateContactDTO {
  firstName?: string;
  lastName?: string;
  status?: ContactStatus;
  streetAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  phoneNumber?: string;
  ipAddress?: string;
}

export interface WooCommerceCustomer {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  billing: {
    address_1: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    phone: string;
  };
  date_created: string;
}

export interface SegmentFilter {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between' | 'in';
  value: any;
}

export interface CreateSegmentDTO {
  name: string;
  description?: string;
  filters: SegmentFilter[];
}

export interface CSVContactRow {
  email: string;
  first_name?: string;
  last_name?: string;
  status?: string;
  street_address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  phone_number?: string;
}
