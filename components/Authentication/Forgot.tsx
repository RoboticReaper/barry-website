import {
    Paper,
    Title,
    Text,
    TextInput,
    Button,
    Container,
    Group,
    Anchor,
    Center,
    Box,
    rem,
  } from '@mantine/core';
  import { IconArrowLeft } from '@tabler/icons-react';
  import classes from './Forgot.module.css';
  
  export function Forgot() {
    return (
      <Container size={460} my={30}>
        <Title className={classes.title} ta="center">
          Forgot your password?
        </Title>
        <Text c="dimmed" fz="sm" ta="center">
          Enter your email to get a reset link
        </Text>
  
        <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
          <TextInput label="Your email" placeholder="Your email" required />
          <Group justify="space-between" mt="lg" className={classes.controls}>
            <Button className={classes.control}>Reset password</Button>
          </Group>
        </Paper>
      </Container>
    );
  }