import axios from 'axios';

export const checkExistingUser = async (lineUserId: string) => {
  const res = await axios.get(`/api/customers/check/${lineUserId}`);
  return res.data;
};

export const createCustomer = async (data: any) => {
  return await axios.post('/api/customers', data);
};
