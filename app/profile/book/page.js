'use client'

import { Button, Center, Container, Modal, Loader, Stepper, Group, Table, Checkbox } from "@mantine/core";
import { DatePicker } from '@mantine/dates'
import classes from "./Book.module.css";
import { httpsCallable } from "firebase/functions";
import { functions } from "@/app/fb";
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDisclosure } from '@mantine/hooks';
import { db } from "@/app/fb";
import { getDoc, doc } from "firebase/firestore";
import '@mantine/dates/styles.css';
import { notifications } from '@mantine/notifications';

const stripePromise = loadStripe(
    // @ts-ignore
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
)

const createTennisCheckout = httpsCallable(functions, 'createTennisCheckoutSession')

export default function BookPage() {
    const router = useRouter();
    const [status, setStatus] = useState("unknown")
    const [opened, { open, close }] = useDisclosure(false);
    const [loading, setLoading] = useState(false);
    const [active, setActive] = useState(0);
    const [availabilities, setAvailabilities] = useState()
    const [selectedDate, setSelectedDate] = useState()
    const [availabilitiesKey, setAvailabilitiesKey] = useState([])
    const [maxD, setMaxD] = useState()
    const [selectedRow, setSelectedRow] = useState()
    const [minD, setMinD] = useState()

    const nextStep = () => {
        if (active == 1) {
            // check for selected row
            if (selectedRow === undefined) {
                notifications.show({
                    color: "red",
                    title: "Select a time to proceed",
                    message: "Click the checkbox to select."
                });
                return;
            }
        }
        setActive((current) => (current < 3 ? current + 1 : current));
    }
    const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

    function tennisCheckout(price_id) {
        setLoading(true);
        createTennisCheckout({
            origin: window.location.origin + window.location.pathname,
            price_id: price_id,
            day: selectedDate.getTime() + 2000,
            time: getSelectedDateSlots(availabilitiesKey, selectedDate, availabilities)[selectedRow]
        }).then((result) => {
            const url = result.data.checkoutURL;
            router.push(url);
        }).catch((err) => {
            console.log(err)
            setLoading(false);
        })
    }

    function compareSlots(a, b){
        return a.start - b.start
    }

    function getSelectedDateSlots(availabilitiesKey, selectedDate, availabilities) {


        let selectedDateKey;
        // get the right key for selected date
        for (let i = 0; i < availabilitiesKey.length; i++) {
            let potentialKey = availabilitiesKey[i]
            let d1 = new Date(potentialKey)
            if (d1.getFullYear() === selectedDate.getFullYear() && d1.getMonth() === selectedDate.getMonth() && d1.getDate() === selectedDate.getDate()) {
                selectedDateKey = potentialKey;
                break;
            }
        }
        console.log(selectedDate)
        // sort availabilities[selectedDateKey] based on start time
        let sorted = availabilities[selectedDateKey].sort(compareSlots)
        return sorted
    }

    useEffect(() => {
        // Check to see if this is a redirect back from Checkout
        const query = new URLSearchParams(window.location.search);
        if (query.get('success')) {
            // get rid of search params
            router.replace(window.location.origin + window.location.pathname)
            setStatus("success! You will see your booked lessons on \"Home\" tab of your profile.")
            open();
        }

        if (query.get('canceled')) {
            // get rid of search params
            router.replace(window.location.origin + window.location.pathname)
            setStatus('canceled. You can still pay by clicking the back button. After 30 min, the link will expire and the time slot will be publicly available again.')
            open();
        }

        getDoc(doc(db, "public", "bookingAvailabilities")).then((docSnap) => {
            if (docSnap.exists()) {
                let d = docSnap.data();
                console.log(d)
                let newAvailabilitiesKey = []
                Object.keys(d).forEach((day) => {
                    newAvailabilitiesKey.push(parseInt(day))
                })

                setAvailabilitiesKey(newAvailabilitiesKey)
                let max = new Date(Math.max(...newAvailabilitiesKey))
                let min = new Date(Math.min(...newAvailabilitiesKey))
                setMaxD(max)
                setMinD(min)
                setAvailabilities(d);
                setSelectedDate(min)

            }
        })
    }, []);


    return <Container size="responsive" className={classes.mainContainer} my="md">
        <Modal opened={opened} onClose={close} centered withCloseButton={false}>
            Payment {status}
        </Modal>

        <Stepper active={active} onStepClick={setActive} allowNextStepsSelect={false}>
            <Stepper.Step label="First step" description="Select a day">
                <Center><div style={{ margin: "10px" }}>Step 1: Select a day</div></Center>
                <Center>
                    {availabilities === undefined ? <Loader /> : <DatePicker
                        value={selectedDate}
                        onChange={(e) => {
                            setSelectedDate(e)
                            setSelectedRow(undefined)
                        }}
                        weekendDays={[]}
                        minDate={minD}
                        maxDate={maxD}
                    />}
                </Center>
            </Stepper.Step>
            <Stepper.Step label="Second step" description="Choose a time">
                <Center><div style={{ margin: "10px" }}>Step 2: Choose a time</div></Center>
                <Table>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Selected</Table.Th>
                            <Table.Th>Start time</Table.Th>
                            <Table.Th>End time</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{(availabilitiesKey.length === 0 || selectedDate === undefined || availabilities === undefined) ? null :
                        getSelectedDateSlots(availabilitiesKey, selectedDate, availabilities).map((slot, index) => {
                            let hourStart = (slot.start % 12) || 12;
                            let ampmStart = slot.start >= 12 ? " pm" : " am";
                            let hourEnd = (slot.end % 12) || 12;
                            let ampmEnd = slot.end >= 12 ? " pm" : " am";

                            return <Table.Tr
                                key={index}
                                bg={selectedRow == index ? 'var(--mantine-color-blue-light)' : undefined}
                            >
                                <Table.Td>
                                    <Checkbox
                                        aria-label="Select time slot"
                                        checked={selectedRow == index}
                                        onChange={(event) => {
                                            if (event.currentTarget.checked) {
                                                setSelectedRow(index)
                                            }
                                        }
                                        }
                                    />
                                </Table.Td>
                                <Table.Td>{hourStart + ampmStart}</Table.Td>
                                <Table.Td>{hourEnd + ampmEnd}</Table.Td>
                            </Table.Tr>
                        })
                    }</Table.Tbody>
                </Table>
            </Stepper.Step>
            <Stepper.Step label="Final step" description="Review info">
                <div style={{ textAlign: "center" }}>
                    <div style={{ margin: "10px" }}>Final step: Review info</div>
                    <div style={{ margin: "10px" }}>Selected time: {active !== 2 ? null : [1].map(() => {
                        let slot = getSelectedDateSlots(availabilitiesKey, selectedDate, availabilities)[selectedRow]
                        let hourStart = (slot.start % 12) || 12;
                        let ampmStart = slot.start >= 12 ? " PM" : " AM";
                        let hourEnd = (slot.end % 12) || 12;
                        let ampmEnd = slot.end >= 12 ? " PM" : " AM";
                        return selectedDate.toLocaleDateString() + " " + hourStart + ampmStart + " - " + hourEnd + ampmEnd
                    })}</div>
                </div>
            </Stepper.Step>
            <Stepper.Completed>
                <Center>
                    <Button onClick={() => { tennisCheckout("price_1OodnFEDoq2Jukn9dJIPfh1I") }} loaderProps={{ type: "oval" }} loading={loading}>Order 1 on 1 lesson</Button>
                </Center>
                
                <div style={{ margin: "10px", textAlign:"center" }}>The selected time will be reserved and the payment link will be valid for 30 min.</div>
            </Stepper.Completed>
        </Stepper>

        <Group justify="center" mt="xl">
            <Button variant="default" onClick={prevStep}>Back</Button>
            <Button onClick={nextStep}>Next step</Button>
        </Group>




    </Container>
}