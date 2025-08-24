import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Title,
  Text,
  Stack,
  Group,
  Button,
  Container,
  Card,
  Badge,
  Center,
  ThemeIcon,
  Divider
} from '@mantine/core';
import { 
  IconCheck,
  IconCalendar, 
  IconClock,  
  IconMail,
  IconHome,
  IconDownload
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

const ReservationComplete: React.FC = () => {
  const navigate = useNavigate();
  const [reservationData, setReservationData] = useState<ReservationData | null>(null);
  const [reservationId] = useState(() => 
    'RES' + Date.now().toString().slice(-8) // 簡易的な予約ID生成
  );

  useEffect(() => {
    // 予約データを取得
    const reservation = localStorage.getItem('reservationData');
    if (reservation) {
      setReservationData(JSON.parse(reservation));
    }

    // 予約完了後、一時的なデータをクリア
    return () => {
      localStorage.removeItem('selectedService');
      localStorage.removeItem('reservationData');
    };
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

  const handleNewReservation = () => {
    navigate('/menu');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleDownloadReceipt = () => {
    // 実際の実装では PDF 生成などを行う
    alert('予約確認書のダウンロード機能は実装中です');
  };

  if (!reservationData) {
    return (
      <Container size="md">
        <Center py="xl">
          <Text>予約データが見つかりません</Text>
        </Center>
      </Container>
    );
  }

  return (
    <Container size="md">
      <Stack gap="xl" py="xl">
        {/* 完了メッセージ */}
        <Center>
          <Stack align="center" gap="md">
            <ThemeIcon size={80} radius="xl" color="green" variant="light">
              <IconCheck size={40} />
            </ThemeIcon>
            <Title order={1} ta="center" c="green.6">
              予約が完了しました！
            </Title>
            <Text ta="center" c="dimmed" size="lg">
              ご予約ありがとうございます
            </Text>
          </Stack>
        </Center>

        {/* 予約番号 */}
        <Card shadow="sm" padding="lg" radius="md" withBorder bg="green.0">
          <Center>
            <Stack align="center" gap="xs">
              <Text fw={600} c="green.8">
                予約番号
              </Text>
              <Text size="xl" fw={700} c="green.6" style={{ letterSpacing: '0.1em' }}>
                {reservationId}
              </Text>
              <Text size="sm" c="dimmed">
                お問い合わせの際は、この番号をお伝えください
              </Text>
            </Stack>
          </Center>
        </Card>

        {/* 予約詳細 */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="lg">
            <Text fw={600} size="lg" c="pink.6">
              予約詳細
            </Text>

            {/* サービス情報 */}
            <Group justify="space-between" align="flex-start">
              <div style={{ flex: 1 }}>
                <Text fw={600} size="md">
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

            <Divider />

            {/* 日時情報 */}
            <Stack gap="md">
              <Group gap="xs">
                <IconCalendar size={20} color="var(--mantine-color-pink-6)" />
                <div>
                  <Text fw={500}>
                    {formatDate(reservationData.date)}
                  </Text>
                </div>
              </Group>

              <Group gap="xs">
                <IconClock size={20} color="var(--mantine-color-pink-6)" />
                <div>
                  <Text fw={500}>
                    {reservationData.time} - {calculateEndTime(reservationData.time, reservationData.service.duration)}
                  </Text>
                  <Text size="sm" c="dimmed">
                    施術時間: {reservationData.service.duration}分
                  </Text>
                </div>
              </Group>
            </Stack>

            <Divider />

            {/* 料金情報 */}
            <Group justify="space-between">
              <Text fw={500}>
                料金
              </Text>
              <Text fw={600} size="lg" c="pink.6">
                ¥{reservationData.service.price.toLocaleString()}
              </Text>
            </Group>
          </Stack>
        </Card>

        {/* 店舗情報 */}
        <Card shadow="sm" padding="lg" radius="md" withBorder bg="blue.0">
          <Stack gap="md">
            <Text fw={600} size="lg" c="blue.8">
              店舗情報
            </Text>
            
            <Stack gap="sm">
              <Text fw={500}>
                Beauty Salon Example
              </Text>
              <Text size="sm">
                〒123-4567 東京都渋谷区例1-2-3 例ビル2F
              </Text>
              <Text size="sm">
                TEL: 03-1234-5678
              </Text>
              <Text size="sm">
                営業時間: 9:00-19:00（定休日：日曜日）
              </Text>
            </Stack>
          </Stack>
        </Card>

        {/* 注意事項 */}
        <Card shadow="sm" padding="lg" radius="md" withBorder bg="yellow.0">
          <Stack gap="md">
            <Text fw={600} c="yellow.8">
              ご来店にあたって
            </Text>
            
            <Stack gap="xs">
              <Text size="sm">
                • ご予約時間の5分前にお越しください
              </Text>
              <Text size="sm">
                • キャンセル・変更は前日までにご連絡ください
              </Text>
              <Text size="sm">
                • 遅刻される場合は必ずお電話でご連絡ください
              </Text>
              <Text size="sm">
                • 当日の体調不良等でのキャンセルも承ります
              </Text>
            </Stack>
          </Stack>
        </Card>

        {/* アクションボタン */}
        <Stack gap="md">
          <Button
            size="lg"
            variant="light"
            color="gray"
            leftSection={<IconDownload size={20} />}
            onClick={handleDownloadReceipt}
          >
            予約確認書をダウンロード
          </Button>

          <Group grow>
            <Button
              size="lg"
              variant="light"
              color="pink"
              onClick={handleNewReservation}
            >
              新しい予約をする
            </Button>
            <Button
              size="lg"
              variant="filled"
              color="gray"
              leftSection={<IconHome size={20} />}
              onClick={handleGoHome}
            >
              ホームに戻る
            </Button>
          </Group>
        </Stack>

        {/* 確認メール送信通知 */}
        <Card shadow="sm" padding="md" radius="md" withBorder bg="gray.0">
          <Group gap="xs">
            <IconMail size={16} color="var(--mantine-color-gray-6)" />
            <Text size="sm" c="dimmed">
              予約確認メールを送信いたしました。メールが届かない場合は、迷惑メールフォルダをご確認ください。
            </Text>
          </Group>
        </Card>
      </Stack>
    </Container>
  );
};

export default ReservationComplete;
