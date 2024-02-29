'use client'

import { Button, Container, Modal } from "@mantine/core";
import classes from "./Book.module.css";
import { httpsCallable } from "firebase/functions";
import { functions } from "@/app/fb";
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDisclosure } from '@mantine/hooks';

const stripePromise = loadStripe(
    // @ts-ignore
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const createTennisCheckout = httpsCallable(functions, 'createTennisCheckoutSession')

export default function BookPage() {
    const router = useRouter();
    const [status, setStatus] = useState("unknown")
    const [opened, { open, close }] = useDisclosure(false);
    const [loading, setLoading] = useState(false);

    function tennisCheckout() {
        setLoading(true);
        createTennisCheckout({ origin: window.location.origin + window.location.pathname }).then((result) => {
            // @ts-ignore
            const url = result.data.checkoutURL;
            router.push(url);
        }).catch((err) => {
            console.log(err)
            setLoading(false);
        })
    }

    useEffect(() => {
        // Check to see if this is a redirect back from Checkout
        const query = new URLSearchParams(window.location.search);
        if (query.get('success')) {
            // get rid of search params
            router.replace(window.location.origin + window.location.pathname)
            setStatus("success!")
            open();
        }

        if (query.get('canceled')) {
            // get rid of search params
            router.replace(window.location.origin + window.location.pathname)
            setStatus('canceled.')
            open();
        }
    }, []);

    return <Container size="responsive" className={classes.mainContainer} my="md">
        <Modal opened={opened} onClose={close} centered withCloseButton={false}>
            Payment {status}
        </Modal>
        <Button onClick={() => { tennisCheckout() }} loaderProps={{type:"oval"}} loading={loading}>Order</Button>
    </Container>
}