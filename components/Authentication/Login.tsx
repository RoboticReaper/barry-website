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
import Link from 'next/link';
import { useState } from 'react';
import { Forgot } from './Forgot';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { setUser } from '@/app/fb';
import { notifications } from '@mantine/notifications';

export function Login() {
  const [openedForgot, setOpenedForgot] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)

  const auth = getAuth();

  const LogInUser = () => {
    if (email == "" || !email.includes("@")) {
      setEmailError(true);
      return;
    } else if (password == "") {
      setPasswordError(true);
      return;
    }

    signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
      const user = userCredential.user;
      console.log("Successfully logged in");
      setUser(user);
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
      // ..
    });
  }


  return (
    <Container size={420} my={40}>
      <Modal overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }} opened={openedForgot} onClose={() => { setOpenedForgot(false) }} withCloseButton={false}>
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
        <form onSubmit={(e)=>{e.preventDefault();LogInUser()}}>
          <FocusTrap active>
            <div>
              <TextInput label="Email" placeholder="Your email" required value={email} onChange={(e) => { setEmail(e.currentTarget.value); setEmailError(false); }} error={emailError} />
              <PasswordInput label="Password" placeholder="Your password" required mt="md" value={password} onChange={(e) => { setPassword(e.currentTarget.value); setPasswordError(false); }} error={passwordError} />
            </div>
          </FocusTrap>
          <Group justify="space-between" mt="lg">
            <Anchor size="sm" onClick={() => { setOpenedForgot(true) }}>
              Forgot password?
            </Anchor>
          </Group>
          <Button fullWidth mt="xl" type="submit">
            Log in
          </Button>
        </form>
      </Paper>
    </Container>
  );
}