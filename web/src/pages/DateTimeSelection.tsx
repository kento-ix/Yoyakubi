import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Title,
  Text,
  Stack,
  Group,
  Button,
  SimpleGrid,
  Container,
  Card,
  Badge,
  Alert
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { IconCalendar, IconClock, IconAlertCircle } from '@tabler/icons-react';

interface TimeSlot {
  time: string;
  available: boolean;
}

const DateTimeSelection: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<any>(null);

  // 時間スロット（サンプルデータ）
  const timeSlots: TimeSlot[] = [
    { time: '09:00', available: true },
    { time: '09:30', available: true },
    { time: '10:00', available: false },
    { time: '10:30', available: true },
    { time: '11:00', available: true },
    { time: '11:30', available: false },
    { time: '12:00', available: true },
    { time: '13:00', available: true },
    { time: '13:30', available: true },
    { time: '14:00', available: true },
    { time: '14:30', available: false },
    { time: '15:00', available: true },
    { time: '15:30', available: true },
    { time: '16:00', available: true },
    { time: '16:30', available: true },
    { time: '17:00', available: false },
    { time: '17:30', available: true },
    { time: '18:00', available: true }
  ];

  // 選択されたサービス情報を取得
  useEffect(() => {
    const serviceData = localStorage.getItem('selectedService');
    if (serviceData) {
      setSelectedService(JSON.parse(serviceData));
    }
  }, []);

  const handleDateSelect = (date: Date | null) => {
    setSelectedDate(date);
    setSelectedTime(null); // 日付が変わったら時間選択をリセット
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleNext = () => {
    if (selectedDate && selectedTime) {
      // 選択した日時情報を保存
      const reservationData = {
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime,
        service: selectedService
      };
      localStorage.setItem('reservationData', JSON.stringify(reservationData));
      navigate('/confirm');
    }
  };

  // 今日以降の日付のみ選択可能
  const minDate = new Date();
  
  // 日曜日を無効にする（サンプル）
  const isDateDisabled = (date: Date) => {
    return date.getDay() === 0; // 日曜日
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  return (
    <Container size="md">
      <Stack gap="lg">
        <div>
          <Title order={2} ta="center" c="pink.6" mb="xs">
            日時選択
          </Title>
          <Text ta="center" c="dimmed">
            ご希望の予約日時をお選びください
          </Text>
        </div>

        {/* 選択中のサービス表示 */}
        {selectedService && (
          <Paper p="md" bg="blue.0" radius="md">
            <Group justify="space-between" align="center">
              <div>
                <Text fw={600} c="blue.8">
                  選択中のサービス
                </Text>
                <Text size="sm">{selectedService.name}</Text>
              </div>
              <Group gap="md">
                <Badge variant="light" color="blue">
                  {selectedService.duration}分
                </Badge>
                <Text fw={600}>
                  ¥{selectedService.price.toLocaleString()}
                </Text>
              </Group>
            </Group>
          </Paper>
        )}

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
          {/* 日付選択 */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack gap="md">
              <Group gap="xs">
                <IconCalendar size={20} color="var(--mantine-color-pink-6)" />
                <Text fw={600} size="lg">
                  日付を選択
                </Text>
              </Group>
              
              <DatePicker
                value={selectedDate}
                onChange={handleDateSelect}
                minDate={minDate}
                getDayProps={(date) => ({
                  disabled: isDateDisabled(new Date(date))
                })}
                size="md"
                styles={{
                  day: {
                    '&[data-selected]': {
                      backgroundColor: 'var(--mantine-color-pink-6)',
                    },
                  },
                }}
              />
              
              {selectedDate && (
                <Paper p="sm" bg="pink.0" radius="sm">
                  <Text size="sm" c="pink.8" fw={500}>
                    選択日: {formatDate(selectedDate)}
                  </Text>
                </Paper>
              )}
            </Stack>
          </Card>

          {/* 時間選択 */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack gap="md">
              <Group gap="xs">
                <IconClock size={20} color="var(--mantine-color-pink-6)" />
                <Text fw={600} size="lg">
                  時間を選択
                </Text>
              </Group>

              {!selectedDate ? (
                <Alert icon={<IconAlertCircle size="1rem" />} color="gray">
                  まず日付を選択してください
                </Alert>
              ) : (
                <SimpleGrid cols={3} spacing="xs">
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot.time}
                      variant={selectedTime === slot.time ? 'filled' : 'light'}
                      color={selectedTime === slot.time ? 'pink' : 'gray'}
                      size="sm"
                      disabled={!slot.available}
                      onClick={() => handleTimeSelect(slot.time)}
                      style={{
                        opacity: slot.available ? 1 : 0.5
                      }}
                    >
                      {slot.time}
                    </Button>
                  ))}
                </SimpleGrid>
              )}

              {selectedTime && (
                <Paper p="sm" bg="pink.0" radius="sm">
                  <Text size="sm" c="pink.8" fw={500}>
                    選択時間: {selectedTime}
                  </Text>
                </Paper>
              )}
            </Stack>
          </Card>
        </SimpleGrid>

        {/* 選択内容の確認 */}
        {selectedDate && selectedTime && selectedService && (
          <Paper p="lg" bg="green.0" radius="md">
            <Stack gap="sm">
              <Text fw={600} c="green.8" size="lg">
                予約内容確認
              </Text>
              <Group justify="space-between">
                <Text>サービス:</Text>
                <Text fw={500}>{selectedService.name}</Text>
              </Group>
              <Group justify="space-between">
                <Text>日付:</Text>
                <Text fw={500}>{formatDate(selectedDate)}</Text>
              </Group>
              <Group justify="space-between">
                <Text>時間:</Text>
                <Text fw={500}>{selectedTime} - {
                  // 終了時間を計算
                  (() => {
                    const [hours, minutes] = selectedTime.split(':').map(Number);
                    const endTime = new Date();
                    endTime.setHours(hours, minutes + selectedService.duration);
                    return endTime.toTimeString().slice(0, 5);
                  })()
                }</Text>
              </Group>
              <Group justify="space-between">
                <Text>料金:</Text>
                <Text fw={600} size="lg">¥{selectedService.price.toLocaleString()}</Text>
              </Group>
            </Stack>
          </Paper>
        )}
      </Stack>
    </Container>
  );
};

export default DateTimeSelection;
