'use client'
import { HeaderMegaMenu } from '@/components/HeaderMegaMenu/HeaderMegaMenu';
import { useRouter } from 'next/navigation';
import { user as initUser } from '@/app/fb';
import { useEffect, useState } from 'react';
import { SideNavbar } from '@/components/SideNavbar/SideNavbar';
import { Container } from '@mantine/core';
import { Loader, Center } from '@mantine/core';
import classes from "./Profile.module.css";
import { Text, Paper, Grid, Table } from '@mantine/core';
import { httpsCallable } from "firebase/functions";
import { functions } from "@/app/fb";

import { AspectRatio, Image, rem } from '@mantine/core';

const listBookedSlots = httpsCallable(functions, 'listBookedSlots');

export default function ProfilePage() {
    const [user, changeUser] = useState(initUser);
    const [bookedSlots, setBookedSlots] = useState([])
    const router = useRouter();

    useEffect(() => {
        // listen to user data event
        document.addEventListener('userChanged', (u) => {

            // @ts-ignore
            var newUser = u.detail.newUser;
            changeUser(newUser);
            if (newUser == null) {
                router.replace("/");


            }
        })

        listBookedSlots().then((result) => {
            console.log(result.data)
            setBookedSlots(result.data)
        })


    }, [])




    return <Container size="responsive" className={classes.mainContainer} my="md">
        {user == null ? <Center h="100%"><Loader color="blue" /></Center> :
            <Grid grow>
                <Grid.Col span={{ base: 12, xs: 12 }}>
                    <Paper className={classes.paper} withBorder>
                        <Grid grow>
                            <Grid.Col span={{ base: 12, xs: 12 }}>
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
                            {/* <Grid.Col span={{ base: 12, xs: 4 }}>
                                <div className={classes.right}>
                                    Auto billing: on/off
                                </div>
                            </Grid.Col> */}
                        </Grid>
                    </Paper>
                    <Table>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Booked Dates</Table.Th>
                                <Table.Th>Begin time</Table.Th>
                                <Table.Th>End time</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{bookedSlots.length === 0 ? <Table.Tr><Table.Td>No lesson booked</Table.Td></Table.Tr> : bookedSlots.map((element) => {
                            let d = new Date(element.date)
                            let hourStart = (element.start % 12) || 12;
                            let ampmStart = element.start >= 12 ? " pm" : " am";
                            let hourEnd = (element.end % 12) || 12;
                            let ampmEnd = element.end >= 12 ? " pm" : " am";

                            return <Table.Tr key={element.date}>
                                <Table.Td>{d.toLocaleDateString()}</Table.Td>
                                <Table.Td>{hourStart + ampmStart}</Table.Td>
                                <Table.Td>{hourEnd + ampmEnd}</Table.Td>
                            </Table.Tr>
                        })}</Table.Tbody>
                    </Table>
                </Grid.Col>
            </Grid>
        }
    </Container>
}