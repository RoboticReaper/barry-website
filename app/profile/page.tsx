'use client'
import { HeaderMegaMenu } from '@/components/HeaderMegaMenu/HeaderMegaMenu';
import { useRouter } from 'next/navigation';
import { user as initUser } from '@/app/fb';
import { useEffect, useState } from 'react';
import { SideNavbar } from '@/components/SideNavbar/SideNavbar';
import { Container } from '@mantine/core';
import { Loader, Center } from '@mantine/core';
import classes from "./Profile.module.css";
import { Text, Paper, Grid } from '@mantine/core';
import { getFunctions, httpsCallable } from "firebase/functions";
import { AspectRatio, Image, rem } from '@mantine/core';

export default function ProfilePage() {
    const [user, changeUser] = useState(initUser);
    const router = useRouter();

    useEffect(() => {
        // listen to user data event
        document.addEventListener('userChanged', (u) => {
            console.log("User changed")
            // const functions = getFunctions();
            // const plusone = httpsCallable(
            //     functions, 'plusone'
            // )
            // plusone().then((result) => {
            //     console.log(result.data)
            // })
            // const plusone = httpsCallable(
            //     functions, 'hello'
            // )
            // plusone().then((result) => {
            //     console.log(result.data)
            // })
            // @ts-ignore
            var newUser: User = u.detail.newUser;
            changeUser(newUser);
            if (newUser == null) {
                router.replace("/");


            }
        })


    }, [])




    return <Container size="responsive" className={classes.mainContainer} my="md">
        {user == null ? <Center h="100%"><Loader color="blue" /></Center> :
            <Grid grow>
                <Grid.Col span={{ base: 12, xs: 12 }}>
                    <Paper className={classes.paper} withBorder>
                        <Grid grow>
                            <Grid.Col span={{ base: 12, xs: 8 }}>
                                <div style={{ display: 'flex' }}>

                                    <AspectRatio ratio={1} className={classes.photo}><Image
                                        src={user.photoURL}
                                        alt="Avatar"
                                        className={classes.photo}
                                        fallbackSrc="/blankAvatar.png"

                                    /></AspectRatio>


                                    <div className={classes.userInfo}>
                                        <Text size="xl" fw={700}>
                                            {user.displayName}
                                        </Text>
                                        <Text size="xs" fw={400}>
                                            {user.email}
                                        </Text>
                                    </div>
                                </div>
                            </Grid.Col>
                            <Grid.Col span={{ base: 12, xs: 4 }}>
                                <div className={classes.right}>
                                    Auto-billing: (on/off)
                                </div>
                            </Grid.Col>
                        </Grid>
                    </Paper>
                </Grid.Col>
            </Grid>
        }
    </Container>
}