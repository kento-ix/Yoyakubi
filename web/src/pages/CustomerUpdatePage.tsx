import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from '@mantine/form';
import {
  Button,
  Container,
  Title,
  Text,
  Stack,
  Alert
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import type { CustomerForm, CustomerCreateRequest } from '@/types/customer';
import { getCustomerByLineId, updateCustomer } from '@/api/customerService';
import { customerErrorAtom } from '@/atoms/customerAtom';
import { useAtom } from 'jotai';

const CustomerUpdatePage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useAtom(customerErrorAtom);
  const [searchParams] = useSearchParams();
  const line_id = searchParams.get('line_id');

  const form = useForm<CustomerForm>({
    initialValues: {
      line_id: '',
      lastName: '',
      firstName: '',
      lastNameKana: '',
      firstNameKana: '',
      phone: '',
      email: '',
      birthday: null,
      birthdayYear: '',
      birthdayMonth: '',
      birthdayDay: ''
    }
  });

  // useEffect の代わりに、「ユーザー操作でデータ取得」を想定
  const handleLoadCustomer = async () => {
    if (!line_id) {
      setError('LINE IDがURLに含まれていません');
      return;
    }
    try {
      setLoading(true);
      const data = await getCustomerByLineId(line_id);
      form.setValues({
        line_id: data.line_id,
        lastName: data.lastName,
        firstName: data.firstName,
        lastNameKana: data.lastNameKana,
        firstNameKana: data.firstNameKana,
        phone: data.phone,
        email: data.email,
        birthday: new Date(data.birthday),
        birthdayYear: data.birthday.split('-')[0],
        birthdayMonth: data.birthday.split('-')[1],
        birthdayDay: data.birthday.split('-')[2]
      });
    } catch (err) {
      console.error(err);
      setError('ユーザー情報の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: CustomerForm) => {
    if (!line_id) {
      setError('LINE IDがURLに含まれていません');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const formattedPhone = values.phone.replace(/-/g, '');
      const birthdayString = values.birthday ? values.birthday.toISOString().split('T')[0] : '';

      const customerData: CustomerCreateRequest = {
        line_id,
        lastName: values.lastName,
        firstName: values.firstName,
        lastNameKana: values.lastNameKana,
        firstNameKana: values.firstNameKana,
        phone: formattedPhone,
        email: values.email,
        birthday: birthdayString
      };

      await updateCustomer(line_id, customerData);
      navigate('/menu');
    } catch (err) {
      console.error(err);
      setError('更新に失敗しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="sm" py="xl">
      <Stack gap="lg">
        <Title order={2} ta="center" c="pink.6">お客様情報の更新</Title>
        <Text ta="center" c="dimmed">内容を編集して「更新する」を押してください</Text>

        {error && <Alert icon={<IconAlertCircle size="1rem" />} color="red">{error}</Alert>}

        <Button color="gray" variant="light" onClick={handleLoadCustomer}>
          登録情報を読み込む
        </Button>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          {/* 入力フィールドは CustomerFormPage と同じ */}
          {/* ...同じ構造を再利用... */}
          <Button type="submit" color="pink" size="lg" radius="md" loading={loading}>
            更新する
          </Button>
        </form>
      </Stack>
    </Container>
  );
};

export default CustomerUpdatePage;
