import axios from 'axios';
import type { CustomerCreateRequest } from '@/types/customer';

const API_URL = "http://localhost:8000/api/customers/user_form";

export const createCustomer = async (customerData: CustomerCreateRequest) => {
  const response = await axios.post(API_URL, customerData);
  return response.data;
};

// temp api
export const getCustomerByLineId = async (line_id: string) => {
  const response = await axios.get(`http://localhost:8000/api/customers/${line_id}`);
  return response.data;
};

export const updateCustomer = async (line_id: string, customerData: CustomerCreateRequest) => {
  const response = await axios.put(`http://localhost:8000/api/customers/${line_id}`, customerData);
  return response.data;
};