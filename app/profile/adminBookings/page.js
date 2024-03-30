'use client'
import { HeaderMegaMenu } from '@/components/HeaderMegaMenu/HeaderMegaMenu';
import { useRouter } from 'next/navigation';
import { user as initUser } from '@/app/fb';
import { useEffect, useState } from 'react';
import { SideNavbar } from '@/components/SideNavbar/SideNavbar';
import { Container } from '@mantine/core';
import { Loader, Center } from '@mantine/core';
import classes from "./Admin.module.css";
import { Text, Paper, Grid, Table } from '@mantine/core';
import { httpsCallable } from "firebase/functions";
import { functions } from "@/app/fb";


const listAdminBookedSlots = httpsCallable(functions, 'listAdminBookedSlots');


export default function AdminBookingsPage() {
    const [user, changeUser] = useState(initUser);
    const [bookedSlots, setBookedSlots] = useState()
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

        listAdminBookedSlots().then((result) => {
            setBookedSlots(result.data)
        })


    }, [])

    function Slots() {
        if (bookedSlots === undefined) {
            return <Table.Tr><Table.Td><Loader /></Table.Td></Table.Tr>
        }

        if (bookedSlots.length === 0) {
            return <Table.Tr><Table.Td>No lesson booked</Table.Td></Table.Tr>
        }

        bookedSlots.sort((a, b)=>{
            let dateA = new Date(a.date)
            dateA.setHours(a.start)

            let dateB = new Date(b.date)
            dateB.setHours(b.start)

            let timeA = dateA.getTime();
            let timeB = dateB.getTime();

            return timeA === timeB ? 0 : timeA - timeB
        })

        return bookedSlots.map((element, index) => {
            let d = new Date(element.date)
            let hourStart = (element.start % 12) || 12;
            let ampmStart = element.start >= 12 ? " pm" : " am";
            let hourEnd = (element.end % 12) || 12;
            let ampmEnd = element.end >= 12 ? " pm" : " am";
            let minuteStart = element.startMinute == 0 ? ":00" : ":"+element.startMinute
            let minuteEnd = element.endMinute == 0 ? ":00" : ":"+element.endMinute

            return <Table.Tr key={index}>
                <Table.Td>{d.toLocaleDateString()}</Table.Td>
                <Table.Td>{element.name}</Table.Td>
                <Table.Td>{hourStart + minuteStart + ampmStart}</Table.Td>
                <Table.Td>{hourEnd + minuteEnd + ampmEnd}</Table.Td>
            </Table.Tr>
        })
    }




    return <Container size="responsive" className={classes.mainContainer} my="md">
        {user == null ? <Center h="100%"><Loader color="blue" /></Center> :
            <Grid grow>
                <Grid.Col span={{ base: 12, xs: 12 }}>
                    <Paper className={classes.paper} withBorder>
                        <Grid grow>
                            <Grid.Col span={{ base: 12, xs: 12 }}>
                                <div style={{ display: 'flex' }}>


                                    <div className={classes.userInfo}>
                                        <Text size="xl" fw={700}>
                                            All bookings from users
                                        </Text>
                                    </div>
                                </div>
                            </Grid.Col>
                        </Grid>
                    </Paper>
                    <Table>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Booked Dates</Table.Th>
                                <Table.Th>Name</Table.Th>
                                <Table.Th>Begin time</Table.Th>
                                <Table.Th>End time</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody><Slots /></Table.Tbody>
                    </Table>
                </Grid.Col>
            </Grid>
        }
    </Container>
}