
'use client'
import { loadStripe } from '@stripe/stripe-js';
import { httpsCallable } from "firebase/functions";
import { functions } from "@/app/fb";
import { useEffect } from 'react';
import { Button, Container } from '@mantine/core';
import cx from 'clsx';
import { useState } from 'react';
import { Table, ScrollArea } from '@mantine/core';
import classes from './History.module.css';

const stripePromise = loadStripe(
    // @ts-ignore
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const listPaymentIntents = httpsCallable(functions, 'listCustomerPaymentIntents');

export default function HistoryPage() {
    const [next_page, setNextPage] = useState()
    const [paymentIntents, setPaymentIntents] = useState([])
    const [lineItems, setLineItems] = useState([])
    const [scrolled, setScrolled] = useState(false);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if(paymentIntents.length != 0){
            return;
        }
        listPaymentIntents().then((result) => {
            processIntents(result)
        })
    }, []);

    const rows = paymentIntents.map((row, index) => (
        <Table.Tr key={row.id}>
            <Table.Td>{new Date(row.created*1000).toLocaleString()}</Table.Td>
            <Table.Td>{lineItems[index].description}</Table.Td>
            <Table.Td>{row.currency == "usd" ? (row.amount/100 + " USD") : (row.amount + " in the smallest unit of " + row.currency.toUpperCase())}</Table.Td>
            
        </Table.Tr>
    ));

    function processIntents(result) {
        const intents = result.data.paymentIntents
        const items = result.data.lineItems
        
        var newIntent = paymentIntents;
        var newLineItems = lineItems;
        for(var i = 0; i < intents.data.length; i++){
            newIntent.push(intents.data[i])
            newLineItems.push(items[i])
        }
        setPaymentIntents(newIntent)
        setLineItems(newLineItems)
        setNextPage(intents.next_page)
    }

    function nextPage() {
        setLoading(true)
        listPaymentIntents({ next_page: next_page }).then((result) => {
            processIntents(result)
            setLoading(false)
        })
    }


    return <Container size="responsive" className={classes.mainContainer} my="md">
        <ScrollArea.Autosize onScrollPositionChange={({ y }) => setScrolled(y !== 0)} className={classes.scroll}>
            <Table>
                <Table.Thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
                    <Table.Tr>
                        <Table.Th>Payment Date</Table.Th>
                        <Table.Th>Item</Table.Th>
                        <Table.Th>Amount</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </ScrollArea.Autosize>
        <Button onClick={nextPage} disabled={next_page == null} loading={loading} className={classes.load}>Load 10 more</Button>
    </Container>
}