'use client';

import {
    Badge,
    Group,
    Title,
    Text,
    Card,
    SimpleGrid,
    Container,
    rem,
    useMantineTheme,
  } from '@mantine/core';
  import { IconGauge, IconUser, IconCookie } from '@tabler/icons-react';
  import classes from './FeaturesSection.module.css';
  
  const mockdata = [
    {
      title: 'Extreme performance',
      description:
        'You run non-stop the whole time',
      icon: IconGauge,
    },
    {
      title: 'Personalized training',
      description:
        'You can get what you need',
      icon: IconUser,
    },
    {
      title: 'Snacks during lesson',
      description:
        'Just kidding! Only water',
      icon: IconCookie,
    },
  ];
  
  export function FeaturesSection() {
    const theme = useMantineTheme();
    const features = mockdata.map((feature) => (
      <Card key={feature.title} shadow="md" radius="md" className={classes.card} padding="xl">
        <feature.icon
          style={{ width: rem(50), height: rem(50) }}
          stroke={2}
          color={theme.colors.blue[6]}
        />
        <Text fz="lg" fw={500} className={classes.cardTitle} mt="md">
          {feature.title}
        </Text>
        <Text fz="sm" c="dimmed" mt="sm">
          {feature.description}
        </Text>
      </Card>
    ));
  
    return (
      <Container size="lg" py="xl">
        <Group justify="center">
          <Badge variant="filled" size="lg">
            Best coach ever
          </Badge>
        </Group>
  
        <Title order={2} className={classes.title} ta="center" mt="sm">
          Learn the skills lightning fast
        </Title>
  
        <Text c="dimmed" className={classes.description} ta="center" mt="md">
          Never forget what you learned! Here are some characteristics of my lesson that will help you improve:
        </Text>
  
        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl" mt={50}>
          {features}
        </SimpleGrid>
      </Container>
    );
  }