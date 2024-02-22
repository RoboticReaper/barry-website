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
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import '@/app/fb';
import { setUser } from '@/app/fb';
import { notifications } from '@mantine/notifications';

export function Signup() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [emailError, setEmailError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [nameError, setNameError] = useState(false)


  const createUser = () => {
    if (name == "") {
      setNameError(true);
      return;
    } else if (email == "" || !email.includes("@")) {
      setEmailError(true);
      return;
    } else if (password == "") {
      setPasswordError(true);
      return;
    }

    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        updateProfile(user, {
          displayName: name,
        }).then(() => {
          console.log("Successfully Signed up")
          setUser(user);
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
        // ..
      });

  }

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
        <form onSubmit={()=>{createUser()}}>
          <FocusTrap active>
            <div>
              <TextInput label="Name" placeholder="Your name" required value={name} onChange={(e) => { setName(e.currentTarget.value); setNameError(false); }} error={nameError} />
              <TextInput label="Email" placeholder="Your email" required mt="md" value={email} onChange={(e) => { setEmail(e.currentTarget.value); setEmailError(false); }} error={emailError} />
              <PasswordInput label="Password" placeholder="Your password" required mt="md" value={password} onChange={(e) => { setPassword(e.currentTarget.value); setPasswordError(false); }} error={passwordError} />
            </div>
          </FocusTrap>

          <Button fullWidth mt="xl" onClick={createUser} type="submit">
            Sign up
          </Button>
        </form>
      </Paper>
    </Container>
  );
}