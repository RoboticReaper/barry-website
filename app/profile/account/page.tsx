'use client';
import { HeaderMegaMenu } from '@/components/HeaderMegaMenu/HeaderMegaMenu';
import { useRouter } from 'next/navigation';
import { user as initUser } from '@/app/fb';
import { useEffect, useState } from 'react';
import { SideNavbar } from '@/components/SideNavbar/SideNavbar';
import { Button, Container } from '@mantine/core';
import { Loader, Center, Collapse } from '@mantine/core';
import classes from "./Account.module.css";
import { Text, Paper, Grid } from '@mantine/core';
import { TextInput, NumberInput } from '@mantine/core';
import { AspectRatio, Image, rem } from '@mantine/core';
import { updateEmail, updateProfile } from 'firebase/auth';
import { User } from 'firebase/auth';
import { db } from '@/app/fb';
import { doc, updateDoc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { notifications } from '@mantine/notifications';

export default function AccountPage() {
    const [user, changeUser] = useState(initUser);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState<string | number>("");
    const [ready, setReady] = useState(false);
    const [profileEditable, setProfileEditable] = useState(false);
    const router = useRouter();


    async function setNewUser(use: User) {
        // @ts-ignore
        setName(use.displayName);
        // @ts-ignore
        setEmail(use.email);

        const docRef = doc(db, "users", use.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setPhone(docSnap.data().phoneNumber);
            
        }

        onSnapshot(doc(db, "users", use.uid), (snapshot)=>{
            if(snapshot.data()?.editable || snapshot.data()?.admin){
                setProfileEditable(true);
            } else {
                setProfileEditable(false);
            }
        })

        setReady(true);
    }

    function saveData() {
        updateDoc(doc(db, "users", user.uid), {
            phoneNumber: phone,
            displayName: name,
        }).then(() => {
            updateProfile(user, {
                displayName: name,
            }).then(() => {
                notifications.show({
                    color: "green",
                    title: "Saved",
                    message: "All data has been saved",
                });
            })
        }).catch((e) => {
            console.log(e)
            // setDoc(doc(db, "users", user.uid), {
            //     phoneNumber: phone,
            //     displayName: name,
            //     email: email,
            // }).then(() => {
            //     updateProfile(user, {
            //         displayName: name,
            //     }).then(() => {
            //         notifications.show({
            //             color: "green",
            //             title: "Saved",
            //             message: "All data has been saved",
            //         });
            //     })
            // })
        })
    }

    useEffect(() => {
        if (initUser != null) {
            setNewUser(initUser);
        }

        // listen to user data event
        document.addEventListener('userChanged', (u) => {
            console.log("User changed")
            // @ts-ignore
            var newUser: User = u.detail.newUser;
            if (newUser == null) {
                router.replace("/");
            } else {
                setNewUser(newUser);
            }
            changeUser(newUser);

        })

    }, [])

    return <Container size="responsive" className={classes.mainContainer} my="md">
        {!ready ? <Center h="100%"><Loader color="blue" /></Center> :
            <Grid grow>
                <Grid.Col span={{ base: 12, xs: 12 }}>
                    <Paper className={classes.paper} withBorder>
                        <b>Account information</b>
                        <Grid grow>
                            <Grid.Col span={{ base: 12, xs: 4 }}>
                                <TextInput
                                    radius="sm"
                                    label="Name"
                                    disabled={!profileEditable}
                                    value={name}
                                    onChange={(e) => { setName(e.currentTarget.value) }}
                                    withAsterisk
                                    placeholder="Your name"
                                />
                            </Grid.Col>
                            <Grid.Col span={{ base: 12, xs: 4 }}>
                                <TextInput
                                    radius="sm"
                                    label="Email"
                                    value={email}
                                    readOnly
                                    withAsterisk
                                    placeholder="Your email"
                                />
                            </Grid.Col>
                            <Grid.Col span={{ base: 12, xs: 4 }}>
                                <NumberInput
                                    radius="sm"
                                    label="Phone"
                                    value={phone}
                                    onChange={setPhone}
                                    withAsterisk
                                    disabled={!profileEditable}
                                    placeholder="Phone number"
                                />
                            </Grid.Col>

                        </Grid>
                    </Paper>
                </Grid.Col>
                <Grid.Col span={{ base: 12, xs: 12 }}><Center><Button onClick={() => { saveData() }}>Save</Button></Center></Grid.Col>
            </Grid>
        }
    </Container>

}