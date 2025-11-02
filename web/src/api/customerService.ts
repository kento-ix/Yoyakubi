import axios from 'axios';
import type { CustomerCreateRequest } from '@/types/customer';
import { API_URL } from './config';

export const createCustomer = async (customerData: CustomerCreateRequest) => {
  const response = await axios.post(`${API_URL}/api/customers/user_form`, customerData);
  return response.data;
};
