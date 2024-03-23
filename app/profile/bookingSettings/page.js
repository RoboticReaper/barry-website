'use client';
import { HeaderMegaMenu } from '@/components/HeaderMegaMenu/HeaderMegaMenu';
import { useRouter } from 'next/navigation';
import { user as initUser } from '@/app/fb';
import { useEffect, useState } from 'react';
import { SideNavbar } from '@/components/SideNavbar/SideNavbar';
import { Button, Container } from '@mantine/core';
import { Loader, Center, Collapse } from '@mantine/core';
import classes from "./BookingSettings.module.css";
import { Text, Paper, Grid } from '@mantine/core';
import { TextInput, NumberInput } from '@mantine/core';
import { AspectRatio, Image, rem } from '@mantine/core';
import { updateEmail, updateProfile } from 'firebase/auth';
import { User } from 'firebase/auth';
import { db } from '@/app/fb';
import { doc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import { notifications } from '@mantine/notifications';

export default function GalleryEditPage() {

    useEffect(()=>{
        getDoc(doc(db, "public", "bookingSetting")).then((d)=>{
            d = d.data();

            setDaysAhead(d.daysAhead)
            setStartTime(d.startTime)
            setEndTime(d.endTime);

            setReady(true)
        })
    }, [])

    const [ready, setReady] = useState(false);
    const [daysAhead, setDaysAhead] = useState();
    const [endTime, setEndTime] = useState();
    const [startTime, setStartTime] = useState();

    function saveData(){
        updateDoc(doc(db, "public", "bookingSetting"), {
            daysAhead,
            endTime,
            startTime,
        }).then(()=>{
            notifications.show({
                color: "green",
                title: "Saved",
                message: "All data has been saved",
            });
        })
    }

    return <Container size="responsive" className={classes.mainContainer} my="md">
    {!ready ? <Center h="100%"><Loader color="blue" /></Center> :
        <Grid grow>
            <Grid.Col span={{ base: 12, xs: 12 }}>
                <Paper className={classes.paper} withBorder>
                    <b>Setting for generating booking time slots</b>
                    <div>Time slots will generate at every midnight based on these settings.</div>
                    <Grid grow>
                        <Grid.Col span={{ base: 12, xs: 4 }}>
                            <NumberInput
                                radius="sm"
                                label="Max days ahead"
                                value={daysAhead}
                                onChange={(e) => { if(e >= 0){setDaysAhead(e)} }}
                                withAsterisk
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, xs: 4 }}>
                            <NumberInput
                                radius="sm"
                                label="Start time (24-hour clock)"
                                value={startTime}
                                withAsterisk
                                onChange={(e)=>{if(e >= 0 && e <= 24){setStartTime(e)}}}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, xs: 4 }}>
                            <NumberInput
                                radius="sm"
                                label="End time (24-hour clock)"
                                value={endTime}
                                onChange={(e)=>{if(e >= 0 && e <= 24){setEndTime(e)}}}
                                withAsterisk
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