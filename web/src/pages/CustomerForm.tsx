import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from '@mantine/form';
import {
  TextInput,
  Button,
  Group,
  Container,
  Paper,
  Title,
  Text,
  Stack,
  Select,
  Alert
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useMediaQuery } from '@mantine/hooks';
import { IconAlertCircle } from '@tabler/icons-react';
import type { CustomerForm, CustomerCreateRequest } from '../types/customer';
import { createCustomer } from '../api/customerService';
import { customerErrorAtom } from '../atoms/customerAtom';
import { useAtom } from 'jotai';

const CustomerFormPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useAtom(customerErrorAtom);

  const isMobile = useMediaQuery('(max-width: 768px)');
  const line_id = searchParams.get('line_id');
  console.log('LINE ID:', line_id);

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
    },
    validate: {
      lastName: (value) => (!value ? '姓を入力してください' : null),
      firstName: (value) => (!value ? '名を入力してください' : null),
      lastNameKana: (value) => {
        if (!value) return '姓（カナ）を入力してください';
        if (!/^[ァ-ヶー]+$/.test(value)) return 'カタカナで入力してください';
        return null;
      },
      firstNameKana: (value) => {
        if (!value) return '名（カナ）を入力してください';
        if (!/^[ァ-ヶー]+$/.test(value)) return 'カタカナで入力してください';
        return null;
      },
      phone: (value) => {
        if (!value) return '電話番号を入力してください';
        const phoneRegex = /^0\d{1,4}-\d{1,4}-\d{4}$/;
        if (!phoneRegex.test(value)) return '正しい電話番号を入力してください (例:090-1234-5678)';
        return null;
      },
      email: (value) => {
        if (!value) return 'メールアドレスを入力してください';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return '正しいメールアドレスを入力してください';
        return null;
      },
      birthday: (value) => (!value ? '生年月日を選択してください' : null)
    }
  });

  const yearOptions = Array.from({ length: 61 }, (_, i) => {
    const year = 2010 - i;
    return { value: year.toString(), label: `${year}年` };
  });

  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    return { value: month.toString().padStart(2, '0'), label: `${month}月` };
  });

  const getDayOptions = () => {
    const year = parseInt(form.values.birthdayYear || '2000');
    const month = parseInt(form.values.birthdayMonth || '1');
    const daysInMonth = new Date(year, month, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      return { value: day.toString().padStart(2, '0'), label: `${day}日` };
    });
  };

  const updateBirthdayFromMobile = () => {
    const { birthdayYear, birthdayMonth, birthdayDay } = form.values;
    if (birthdayYear && birthdayMonth && birthdayDay) {
      const date = new Date(parseInt(birthdayYear), parseInt(birthdayMonth) - 1, parseInt(birthdayDay));
      form.setFieldValue('birthday', date);
    } else {
      form.setFieldValue('birthday', null);
    }
  };

  const handleMobileDateChange = (field: 'birthdayYear' | 'birthdayMonth' | 'birthdayDay', value: string | null) => {
    form.setFieldValue(field, value || '');
    setTimeout(updateBirthdayFromMobile, 0);
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
        line_id: line_id,
        lastName: values.lastName,
        firstName: values.firstName,
        lastNameKana: values.lastNameKana,
        firstNameKana: values.firstNameKana,
        phone: formattedPhone,
        email: values.email,
        birthday: birthdayString
      };

      await createCustomer(customerData);
      navigate('/menu');
    } catch (err) {
      console.error('Error creating customer:', err);
      setError('登録に失敗しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="sm" py="xl">
      <Paper shadow="md" radius="lg" p="xl">
        <Stack gap="lg">
          <Title order={2} ta="center" c="pink.6">お客様情報登録</Title>
          <Text ta="center" c="dimmed">初回のご利用前に、お客様情報をご登録ください</Text>

          {error && (
            <Alert icon={<IconAlertCircle size="1rem" />} color="red">{error}</Alert>
          )}

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <Group grow>
                <TextInput label="姓" placeholder="山田" required {...form.getInputProps('lastName')} />
                <TextInput label="名" placeholder="太郎" required {...form.getInputProps('firstName')} />
              </Group>

              <Group grow>
                <TextInput label="姓（カナ）" placeholder="ヤマダ" required {...form.getInputProps('lastNameKana')} />
                <TextInput label="名（カナ）" placeholder="タロウ" required {...form.getInputProps('firstNameKana')} />
              </Group>

              <TextInput label="電話番号" placeholder="090-1234-5678" required {...form.getInputProps('phone')} />
              <TextInput label="メールアドレス" placeholder="example@email.com" type="email" required {...form.getInputProps('email')} />

              {isMobile ? (
                <Stack gap="xs">
                  <Text size="sm" fw={500}>生年月日 <Text span c="red">*</Text></Text>
                  <Group grow>
                    <Select placeholder="年" data={yearOptions} searchable value={form.values.birthdayYear} onChange={(v) => handleMobileDateChange('birthdayYear', v)} />
                    <Select placeholder="月" data={monthOptions} value={form.values.birthdayMonth} onChange={(v) => handleMobileDateChange('birthdayMonth', v)} />
                    <Select placeholder="日" data={getDayOptions()} value={form.values.birthdayDay} onChange={(v) => handleMobileDateChange('birthdayDay', v)} />
                  </Group>
                  {form.errors.birthday && <Text size="xs" c="red">{form.errors.birthday}</Text>}
                </Stack>
              ) : (
                <DateInput label="生年月日" placeholder="生年月日を選択してください" required maxDate={new Date()} {...form.getInputProps('birthday')} />
              )}

              <Button type="submit" color="pink" size="lg" radius="md" loading={loading}>登録する</Button>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Container>
  );
};

export default CustomerFormPage;
