import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { selectedServiceAtom, setSelectedServiceAtom } from '../atoms/serviceAtom';
import {
    Paper,
    Title,
    Text,
    Stack,
    Card,
    Group,
    Badge,
    SimpleGrid,
    Collapse,
    Button,
    Divider
} from '@mantine/core';
import { IconClock, IconCurrencyYen, IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { services } from '@/data/service';

const MenuSelection: React.FC = () => {
    const navigate = useNavigate();
    const [selectedService] = useAtom(selectedServiceAtom);
    const [, setSelectedService] = useAtom(setSelectedServiceAtom); // 永続化用

    const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
        'ハンド': false,
        'フット': false,
        'オプション': false
    });

    const handleServiceSelect = (service: typeof services[number]) => {
        if (selectedService.some((s) => s.id === service.id)) {
            setSelectedService(selectedService.filter((s) => s.id !== service.id));
        } else {
            setSelectedService([...selectedService, service]);
        }
    };

    const handleNext = () => {
        if (selectedService.length > 0) {
            navigate('/datetime');
        }
    };

    const toggleCategory = (category: string) => {
        setOpenCategories(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
        case 'ハンド': return 'pink';
        case 'フット': return 'blue';
        case 'オプション': return 'green';
        default: return 'gray';
        }
    };

    const servicesByCategory = services.reduce((acc, service) => {
        if (!acc[service.category]) acc[service.category] = [];
        acc[service.category].push(service);
        return acc;
    }, {} as Record<string, typeof services>);

    const categories = ['ハンド', 'フット', 'オプション'];

    return (
        <Stack gap="lg">
            <div>
                <Title order={2} ta="center" c="pink.6" mb="xs">
                    メニュー選択
                </Title>
                <Text ta="center" c="dimmed">
                    ご希望のサービスをお選びください
                </Text>
            </div>

            {categories.map((category) => (
                <Paper key={category} shadow="sm" radius="md" withBorder>
                    <Group
                        justify="space-between"
                        p="md"
                        style={{ cursor: 'pointer' }}
                        onClick={() => toggleCategory(category)}
                    >
                        <Stack gap="sm">
                            <Badge color={getCategoryColor(category)} size="lg" variant="filled">
                                {category}
                            </Badge>
                            <Text fw={600} size="lg">{category}メニュー</Text>
                        </Stack>
                        {openCategories[category] ? <IconChevronUp size={20} /> : <IconChevronDown size={20} />}
                    </Group>

                    <Collapse in={openCategories[category]}>
                        <Divider />
                        <div style={{ padding: '1rem' }}>
                            <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
                                {servicesByCategory[category]?.map((service) => (
                                    <Card
                                        key={service.id}
                                        shadow="sm"
                                        padding="lg"
                                        radius="md"
                                        withBorder
                                        style={{
                                            cursor: 'pointer',
                                            border: selectedService.some((s) => s.id === service.id) 
                                                ? `2px solid var(--mantine-color-${getCategoryColor(category)}-6)` 
                                                : undefined,
                                            backgroundColor: selectedService.some((s) => s.id === service.id) 
                                                ? `var(--mantine-color-${getCategoryColor(category)}-0)` 
                                                : undefined,
                                        }}
                                        onClick={() => handleServiceSelect(service)}
                                    >
                                        <Stack gap="sm">
                                            <div>
                                                <Text fw={600} size="lg">{service.name}</Text>
                                                <Text size="sm" c="dimmed" mt={4}>{service.description}</Text>
                                            </div>

                                            <Group justify="space-between" mt="md">
                                                <Group gap="xs">
                                                    <IconClock size={16} color="var(--mantine-color-gray-6)" />
                                                    <Text size="sm" c="dimmed">{service.duration}分</Text>
                                                </Group>
                                                <Group gap="xs">
                                                    <IconCurrencyYen size={16} color="var(--mantine-color-gray-6)" />
                                                    <Text size="sm" fw={600}>{service.price.toLocaleString()}円</Text>
                                                </Group>
                                            </Group>
                                        </Stack>
                                    </Card>
                                ))}
                            </SimpleGrid>
                        </div>
                    </Collapse>
                </Paper>
            ))}

            {selectedService.length > 0 && (
                <Paper p="md" bg="pink.0" radius="md" withBorder>
                    <Stack gap="xs">
                        <Text fw={600} c="pink.8" size="lg">選択中のサービス</Text>
                        {selectedService.map((s) => (
                            <Group key={s.id} justify="space-between">
                                <Text>{s.name}</Text>
                                <Text fw={600}>¥{s.price.toLocaleString()}</Text>
                            </Group>
                        ))}
                        <Divider my="sm" />
                        <Group justify="space-between">
                            <Text fw={700} size="lg">合計</Text>
                            <Text fw={700} size="lg" c="pink.8">
                                ¥{selectedService.reduce((acc, s) => acc + s.price, 0).toLocaleString()}
                            </Text>
                        </Group>
                        <Button fullWidth mt="md" color="pink" size="lg" onClick={handleNext}>
                            次へ進む
                        </Button>
                    </Stack>
                </Paper>
            )}
        </Stack>
    );
};

export default MenuSelection;
