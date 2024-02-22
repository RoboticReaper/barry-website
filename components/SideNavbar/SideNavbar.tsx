
import { useState } from 'react';
import { Group, Code, UnstyledButton, Text } from '@mantine/core';
import {
    IconBellRinging,
    IconFingerprint,
    IconKey,
    IconSettings,
    Icon2fa,
    IconDatabaseImport,
    IconReceipt2,
    IconSwitchHorizontal,
    IconLogout,
} from '@tabler/icons-react';
import { MantineLogo } from '@mantinex/mantine-logo';
import { getAuth, signOut } from "firebase/auth";
import classes from './SideNavbar.module.css';

const data = [
    { link: '', label: 'Notifications', icon: IconBellRinging },
    { link: '', label: 'Billing', icon: IconReceipt2 },
    { link: '', label: 'Security', icon: IconFingerprint },
    { link: '', label: 'Databases', icon: IconDatabaseImport },
    { link: '', label: 'Other Settings', icon: IconSettings },
];

export function SideNavbar() {
    const auth = getAuth();
    const [active, setActive] = useState('Billing');

    const links = data.map((item) => (
        <a
            className={classes.link}
            data-active={item.label === active || undefined}
            href={item.link}
            key={item.label}
            onClick={(event) => {
                event.preventDefault();
                setActive(item.label);
            }}
        >
            <item.icon className={classes.linkIcon} stroke={1.5} />
            <span className={classes.shorten}>{item.label}</span>
        </a>
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