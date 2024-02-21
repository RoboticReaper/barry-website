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
    FocusTrap,
  } from '@mantine/core';
  import classes from './Login.module.css';
  import Link from 'next/link';
  import { useState } from 'react';
  
  export function Signup() {

    return (
      <Container size={420} my={40}>
        <Title ta="center" className={classes.title}>
          Creating account
        </Title>
        <Text c="dimmed" size="sm" ta="center" mt={5}>
          Already have an account?{' '}
          <Anchor size="sm" component={Link} href="login">
            Log in
          </Anchor>
        </Text>
  
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <FocusTrap active>
            <div>
                <TextInput label="Name" placeholder="Your name" required/>
                <TextInput label="Email" placeholder="Your email" required mt="md" />
                <PasswordInput label="Password" placeholder="Your password" required mt="md" />
            </div>
          </FocusTrap>
          
          <Button fullWidth mt="xl">
            Sign up
          </Button>
        </Paper>
      </Container>
    );
  }