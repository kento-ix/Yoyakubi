import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { lineIdAtom } from '@/atoms/customerAtom';
import { initLiff, getUserProfile } from '@/api/liff';
import { selectedServiceAtom, setSelectedServiceAtom } from '@/atoms/serviceAtom';
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
    Divider,    
} from '@mantine/core';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { services } from '@/data/service';
import { useEffect } from 'react';

const MenuSelection: React.FC = () => {
    const navigate = useNavigate();
    const [selectedService] = useAtom(selectedServiceAtom);
    const [, setSelectedService] = useAtom(setSelectedServiceAtom);
    const [lineId, setLineId] = useAtom(lineIdAtom);

    useEffect(() => {
        const setupLineId = async () => {
            if(!lineId) {
                try {
                    await initLiff();
                    const profile = await getUserProfile();
                    setLineId(profile.userId);
                } catch (err) {
                    console.error("LIFF init/getProfile failed:", err);
                }
            }
        };
        setupLineId();
    }, [lineId, setLineId]);

    const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
        'ジェル': false,
        'マニキュア': false,
        'フットジェル': false,
        'フットマニキュア': false,
        'オフ': false,
        'その他': false
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

    const getCategoryColor = (categoryType: string) => {
        switch (categoryType) {
            case 'ジェル': return 'pink';
            case 'マニキュア': return 'pink';
            case 'フットジェル': return 'blue';
            case 'フットマニキュア': return 'blue';
            default: return 'green';
        }
    };

    const servicesByType = services.reduce((acc, service) => {
        if (service.category === 'オプション') return acc;
        if (!acc[service.type]) acc[service.type] = [];
        acc[service.type].push(service);
        return acc;
    }, {} as Record<string, typeof services>);

    const optionServices = services.filter(service => service.category === 'オプション');

    const categories = ['ジェル', 'マニキュア', 'フットジェル', 'フットマニキュア', 'オフ', 'その他'];

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

            {categories.map((categoryType) => (
                <Paper key={categoryType} shadow="sm" radius="md" withBorder>
                    <Group
                        justify="space-between"
                        p="md"
                        style={{ cursor: 'pointer' }}
                        onClick={() => toggleCategory(categoryType)}
                    >
                        <Stack gap="sm">
                            <Text fw={600} size="lg">{categoryType}</Text>
                        </Stack>

                        <Group>
                            {(categoryType === 'ジェル' || categoryType === 'マニキュア') && (
                            <Badge color="pink" size="lg">ハンド</Badge>
                            )}
                            {(categoryType === 'フットジェル' || categoryType === 'フットマニキュア') && (
                            <Badge color="blue" size="lg">フット</Badge>
                            )}

                            {openCategories[categoryType] ? <IconChevronUp size={20} /> : <IconChevronDown size={20} />}
                        </Group>

                    </Group>

                    <Collapse in={openCategories[categoryType]}>
                        <Divider />
                        <div style={{ padding: '1rem' }}>
                            <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
                                {servicesByType[categoryType]?.map((service) => (
                                    <Card
                                        key={service.id}
                                        shadow="sm"
                                        padding="lg"
                                        radius="md"
                                        withBorder
                                        style={{
                                            cursor: 'pointer',
                                            border: selectedService.some((s) => s.id === service.id) 
                                                ? `2px solid var(--mantine-color-${getCategoryColor(categoryType)}-6)` 
                                                : undefined,
                                            backgroundColor: selectedService.some((s) => s.id === service.id) 
                                                ? `var(--mantine-color-${getCategoryColor(categoryType)}-0)` 
                                                : undefined,
                                        }}
                                        onClick={() => handleServiceSelect(service)}
                                    >
                                        <Stack gap="sm">
                                            <div>
                                                <Text fw={600} size="lg">{service.service_name}</Text>
                                                <Text size="sm" fw={600}>￥{service.price.toLocaleString()}</Text>
                                            </div>
                                            <Group justify="flex-end" mt="sm">
                                                <Group gap="xs">
                                                    <Text size="sm" c="dimmed" mt={4}>{service.description}</Text>
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

            {/* Option components */}
            <Text fw={600} size="lg" ta="center" bg={'gray.2'} p={6} style={{ borderRadius: 8 }}>オプションメニュー</Text>
            {optionServices.length > 0 && (
                <Stack gap="sm">
                    {optionServices.map((service) => (
                        <Card
                            key={service.id}
                            shadow="sm"
                            padding="lg"
                            radius="md"
                            withBorder
                            style={{
                                cursor: 'pointer',
                                border: selectedService.some((s) => s.id === service.id)
                                    ? '2px solid var(--mantine-color-green-6)'
                                    : undefined,
                                backgroundColor: selectedService.some((s) => s.id === service.id)
                                    ? 'var(--mantine-color-green-0)'
                                    : undefined,
                            }}
                            onClick={() => handleServiceSelect(service)}
                        >
                            <Group>
                                <div>
                                    <Text fw={500}>{service.service_name}</Text>
                                    <Text size="sm" fw={600}>
                                        {service.price === 0 ? '' : `¥${service.price.toLocaleString()}`}
                                    </Text>
                                </div>
                                <Group gap="xs">
                                    <Text size="sm" c="dimmed">{service.description}</Text>
                                </Group>
                            </Group>
                        </Card>
                    ))}
                </Stack>
            )}


            {selectedService.length > 0 && (
                <Paper p="md" bg="pink.0" radius="md" withBorder>
                    <Stack gap="xs">
                        <Text fw={600} c="pink.8" size="lg">選択中のサービス</Text>
                        {selectedService.map((s) => (
                            <Group key={s.id} justify="space-between">
                                <Text>{s.service_name}</Text>
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
