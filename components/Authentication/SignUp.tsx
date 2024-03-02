'use client'
import {
  TextInput,
  PasswordInput,
  NumberInput,
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
import { setUser, db } from '@/app/fb';
import { doc, setDoc } from "firebase/firestore";
import { notifications } from '@mantine/notifications';


export function Signup() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState<string | number>("");


  const createUser = () => {

    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        updateProfile(user, {
          displayName: name,
        }).then(() => {
          setDoc(doc(db, "users", user.uid), {
            phoneNumber: phone,
            displayName: name,
            email: email,
          })
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
        <form onSubmit={(e)=>{e.preventDefault();createUser()}}>
          <FocusTrap active>
            <div>
              <TextInput label="Name" placeholder="First and last name" required value={name} onChange={(e) => { setName(e.currentTarget.value); }}  />
              <NumberInput label="Phone" placeholder="Phone number" required mt="md" value={phone} onChange={setPhone} />
              <TextInput label="Email" placeholder="Your email" required mt="md" value={email} onChange={(e) => { setEmail(e.currentTarget.value);}}  />
              <PasswordInput label="Password" placeholder="Your password" required mt="md" value={password} onChange={(e) => { setPassword(e.currentTarget.value);}} />
            </div>
          </FocusTrap>

          <Button fullWidth mt="xl" type="submit">
            Sign up
          </Button>
        </form>
      </Paper>
    </Container>
  );
}