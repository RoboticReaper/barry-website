'use client'
import {
    TextInput,
    PasswordInput,
    Checkbox,
    Anchor,
    Paper,
    Title,
    Text,
    Container,
    Group,
    Button,
    Modal,
    FocusTrap,
  } from '@mantine/core';
  import classes from './Login.module.css';
  import { useDisclosure } from '@mantine/hooks';
  import Link from 'next/link';
  import { useState } from 'react';
  import { Forgot } from './Forgot';
  
  export function Login() {
    const [openedForgot, setOpenedForgot] = useState(false);

    return (
      <Container size={420} my={40}>
        <Modal overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }} opened={openedForgot} onClose={()=>{setOpenedForgot(false)}} withCloseButton={false}>
            <Forgot />
        </Modal>
        <Title ta="center" className={classes.title}>
          Welcome back!
        </Title>
        <Text c="dimmed" size="sm" ta="center" mt={5}>
          Do not have an account yet?{' '}
          <Anchor size="sm" component={Link} href="signup">
            Create account
          </Anchor>
        </Text>
  
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <FocusTrap active>
            <div>
                <TextInput label="Email" placeholder="Your email" required />
                <PasswordInput label="Password" placeholder="Your password" required mt="md" />
            </div>
          </FocusTrap>
          <Group justify="space-between" mt="lg">
            <Checkbox label="Remember me" />
            <Anchor component="button" size="sm" onClick={()=>{setOpenedForgot(true)}}>
              Forgot password?
            </Anchor>
          </Group>
          <Button fullWidth mt="xl">
            Log in
          </Button>
        </Paper>
      </Container>
    );
  }