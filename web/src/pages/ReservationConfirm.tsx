import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Title,
  Text,
  Stack,
  Group,
  Button,
  Container,
  Card,
  Divider,
  Badge,
  Alert,
  Loader,
  Center
} from '@mantine/core';
import { 
  IconCalendar, 
  IconClock, 
  IconUser, 
  IconPhone, 
  IconMail,
  IconCheck,
  IconAlertCircle 
} from '@tabler/icons-react';

interface ReservationData {
  date: string;
  time: string;
  service: {
    id: string;
    name: string;
    description: string;
    duration: number;
    price: number;
    category: string;
  };
}

const ReservationConfirm: React.FC = () => {
  const navigate = useNavigate();
  const [reservationData, setReservationData] = useState<ReservationData | null>(null);
  const [customerData, setCustomerData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 予約データを取得
    const reservation = localStorage.getItem('reservationData');
    if (reservation) {
      setReservationData(JSON.parse(reservation));
    }

    // 顧客データを取得（実際の実装では API から取得）
    const mockCustomerData = {
      lastName: '山田',
      firstName: '太郎',
      phone: '090-1234-5678',
      email: 'yamada@example.com'
    };
    setCustomerData(mockCustomerData);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const calculateEndTime = (startTime: string, duration: number) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const endTime = new Date();
    endTime.setHours(hours, minutes + duration);
    return endTime.toTimeString().slice(0, 5);
  };

  const handleConfirm = async () => {
    if (!reservationData) return;

    setLoading(true);
    setError(null);

    try {
      // 実際の実装では API に予約データを送信
      await new Promise(resolve => setTimeout(resolve, 2000)); // シミュレーション

      // 予約完了後、完了ページに遷移
      navigate('/complete');
    } catch (err) {
      console.error('Reservation error:', err);
      setError('予約の確定に失敗しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate('/datetime');
  };

  if (!reservationData) {
    return (
      <Container size="md">
        <Center>
          <Alert icon={<IconAlertCircle size="1rem" />} color="red">
            予約データが見つかりません。最初からやり直してください。
          </Alert>
        </Center>
      </Container>
    );
  }

  return (
    <Container size="md">
      <Stack gap="lg">
        <div>
          <Title order={2} ta="center" c="pink.6" mb="xs">
            予約内容確認
          </Title>
          <Text ta="center" c="dimmed">
            以下の内容で予約を確定します
          </Text>
        </div>

        {error && (
          <Alert icon={<IconAlertCircle size="1rem" />} color="red">
            {error}
          </Alert>
        )}

        {/* サービス情報 */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <Group justify="space-between" align="flex-start">
              <div>
                <Text fw={600} size="lg">
                  {reservationData.service.name}
                </Text>
                <Text size="sm" c="dimmed" mt={4}>
                  {reservationData.service.description}
                </Text>
              </div>
              <Badge color="pink" variant="light">
                {reservationData.service.category}
              </Badge>
            </Group>

            <Group justify="space-between">
              <Group gap="xs">
                <IconClock size={16} color="var(--mantine-color-gray-6)" />
                <Text size="sm">
                  施術時間: {reservationData.service.duration}分
                </Text>
              </Group>
              <Text fw={600} size="lg" c="pink.6">
                ¥{reservationData.service.price.toLocaleString()}
              </Text>
            </Group>
          </Stack>
        </Card>

        {/* 予約日時 */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <Text fw={600} size="lg">
              予約日時
            </Text>
            
            <Group gap="md">
              <Group gap="xs">
                <IconCalendar size={20} color="var(--mantine-color-pink-6)" />
                <div>
                  <Text fw={500}>
                    {formatDate(reservationData.date)}
                  </Text>
                </div>
              </Group>
            </Group>

            <Group gap="xs">
              <IconClock size={20} color="var(--mantine-color-pink-6)" />
              <div>
                <Text fw={500}>
                  {reservationData.time} - {calculateEndTime(reservationData.time, reservationData.service.duration)}
                </Text>
                <Text size="sm" c="dimmed">
                  ({reservationData.service.duration}分間)
                </Text>
              </div>
            </Group>

            <Button
              variant="light"
              color="gray"
              size="sm"
              onClick={handleEdit}
              style={{ alignSelf: 'flex-start' }}
            >
              日時を変更
            </Button>
          </Stack>
        </Card>

        {/* 顧客情報 */}
        {customerData && (
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack gap="md">
              <Text fw={600} size="lg">
                お客様情報
              </Text>
              
              <Group gap="xs">
                <IconUser size={20} color="var(--mantine-color-pink-6)" />
                <Text>
                  {customerData.lastName} {customerData.firstName} 様
                </Text>
              </Group>

              <Group gap="xs">
                <IconPhone size={20} color="var(--mantine-color-pink-6)" />
                <Text>
                  {customerData.phone}
                </Text>
              </Group>

              <Group gap="xs">
                <IconMail size={20} color="var(--mantine-color-pink-6)" />
                <Text>
                  {customerData.email}
                </Text>
              </Group>
            </Stack>
          </Card>
        )}

        {/* 料金詳細 */}
        <Card shadow="sm" padding="lg" radius="md" withBorder bg="gray.0">
          <Stack gap="md">
            <Text fw={600} size="lg">
              料金詳細
            </Text>
            
            <Group justify="space-between">
              <Text>
                {reservationData.service.name}
              </Text>
              <Text>
                ¥{reservationData.service.price.toLocaleString()}
              </Text>
            </Group>

            <Divider />

            <Group justify="space-between">
              <Text fw={600} size="lg">
                合計金額
              </Text>
              <Text fw={600} size="xl" c="pink.6">
                ¥{reservationData.service.price.toLocaleString()}
              </Text>
            </Group>
          </Stack>
        </Card>

        {/* 注意事項 */}
        <Alert color="blue" variant="light">
          <Stack gap="xs">
            <Text fw={500}>ご予約にあたって</Text>
            <Text size="sm">
              • キャンセルは前日までにお願いします
            </Text>
            <Text size="sm">
              • 遅刻される場合は事前にご連絡ください
            </Text>
            <Text size="sm">
              • 当日の体調不良等による変更も承ります
            </Text>
          </Stack>
        </Alert>

        {/* 確定ボタン */}
        <Button
          size="lg"
          color="pink"
          onClick={handleConfirm}
          loading={loading}
          leftSection={<IconCheck size={20} />}
        >
          {loading ? '予約を確定中...' : '予約を確定する'}
        </Button>
      </Stack>
    </Container>
  );
};

export default ReservationConfirm;
