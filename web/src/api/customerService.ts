import axios from 'axios';
import type { CustomerCreateRequest } from '@/types/customer';

const API_URL = "http://localhost:8000/api/customers/user_form";

export const createCustomer = async (customerData: CustomerCreateRequest) => {
  const response = await axios.post(API_URL, customerData);
  return response.data;
};
