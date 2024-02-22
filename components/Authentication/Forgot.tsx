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
  Notification
} from '@mantine/core';
import { IconX, IconCheck } from '@tabler/icons-react';
import classes from './Forgot.module.css';
import { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { notifications } from '@mantine/notifications';


export function Forgot() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false)

  const xIcon = <IconX style={{ width: rem(20), height: rem(20) }} />;
  const checkIcon = <IconCheck style={{ width: rem(20), height: rem(20) }} />;

  function reset() {
    if (email == "" || !email.includes("@")) {
      setEmailError(true);
      return;
    }

    const auth = getAuth();
    sendPasswordResetEmail(auth, email).then(() => {
      notifications.show({
        color: "blue",
        title: "Password reset sent",
        message: "Please check your email for the reset link",
      })
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      notifications.show({
        color: "red",
        title: errorCode,
        message: errorMessage,
      })

      console.log(errorCode);
      console.log(errorMessage);
    });
  }

  return (
    <Container size={460} my={30}>
      <Title className={classes.title} ta="center">
        Forgot your password?
      </Title>
      <Text c="dimmed" fz="sm" ta="center">
        Enter your email to get a reset link
      </Text>

      <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
        <TextInput label="Your email" placeholder="Your email" required value={email} onChange={(e) => { setEmail(e.currentTarget.value); setEmailError(false); }} error={emailError} />
        <Group mt="lg" className={classes.controls}>
          <Button className={classes.control} fullWidth onClick={() => { reset() }}>Reset password</Button>
        </Group>
      </Paper>
    </Container>
  );
}