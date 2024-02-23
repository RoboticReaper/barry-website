
import { useState } from 'react';
import { Group, Code, UnstyledButton, Text } from '@mantine/core';
import {
    IconBookmarks,
    IconUser,
    IconHistory,
    IconMessage,
    IconLogout,
    IconHome,
} from '@tabler/icons-react';
import Link from 'next/link';
import { getAuth, signOut } from "firebase/auth";
import classes from './SideNavbar.module.css';

const data = [
    { link: '/profile', label: 'Home', icon: IconHome },
    { link: '/account', label: 'Account', icon: IconUser },
    { link: '/message', label: 'Message', icon: IconMessage},
    { link: '/book', label: 'Book Lessons', icon: IconBookmarks },
    { link: '/history', label: 'History', icon: IconHistory },
];

export function SideNavbar({index = 0}) {
    const auth = getAuth();

    const links = data.map((item, i) => (
        <Link
            className={classes.link}
            data-active={index == i || undefined }
            href={item.link}
            key={item.label}
        >
            <item.icon className={classes.linkIcon} stroke={1.5} />
            <span className={classes.shorten}>{item.label}</span>
        </Link>
    ));

    return (
        <nav className={classes.navbar}>
            <div className={classes.navbarMain}>
                <Group className={classes.header} justify="space-between">
                    <Text size="lg" fw={700}>
                        Profile
                    </Text>
                </Group>
                {links}
            </div>

            <div className={classes.footer}>
                <UnstyledButton className={classes.link} component="a" onClick={()=>{signOut(auth).then(()=>{console.log("Successful")})}}>
                    <IconLogout className={classes.linkIcon} stroke={1.5} />
                    <span className={classes.shorten}>Logout</span>
                </UnstyledButton>
            </div>
        </nav>
    );
}