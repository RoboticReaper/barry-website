'use client'
import { useState, useEffect } from 'react';
import { Group, Code, UnstyledButton, Text, Divider, Center } from '@mantine/core';
import {
    IconBookmarks,
    IconUser,
    IconHistory,
    IconMessage,
    IconLogout,
    IconHome,
    IconVideo,
    IconPhotoEdit,
} from '@tabler/icons-react';
import Link from 'next/link';
import { getAuth, signOut } from "firebase/auth";
import classes from './SideNavbar.module.css';
import { db } from '@/app/fb';
import { doc, getDoc } from "firebase/firestore";
import { usePathname } from 'next/navigation';
import { user as initUser } from '@/app/fb';
import { useRouter } from 'next/navigation';
import { User } from 'firebase/auth';

export function SideNavbar() {
    const auth = getAuth();
    const pathname = usePathname();
    const [active, setActive] = useState(pathname);
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setActive(pathname);
    }, [pathname])

    useEffect(() => {
        if (initUser != null) {
            setNewUser(initUser);
        }

        // listen to user data event
        document.addEventListener('userChanged', (u) => {
            console.log("User changed")
            // @ts-ignore
            var newUser: User = u.detail.newUser;
            if (newUser != null) {
                setNewUser(newUser);
            } else {
                router.replace('/')
            }

        })


    }, [])

    async function setNewUser(use: User) {

        const docRef = doc(db, "users", use.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            if (docSnap.data().admin) {
                setIsAdmin(true);
            }
        }
    }

    function AdminComponents() {
        return <div>
            <Divider my='md' />
            <div style={{ textAlign: "center" }}>
                <Text size="sm" mb="md">
                    Admin tools
                </Text>
            </div>
            <Link
                className={classes.link}
                data-active={active === "/profile/galleryEdit" || undefined}
                href='/profile/galleryEdit'
                key='Edit Gallery Photos'
            >
                <IconPhotoEdit className={classes.linkIcon} stroke={1.5} />
                <span className={classes.shorten}>Edit Gallery Photos</span>
            </Link>
            <Link
                className={classes.link}
                data-active={active === "/profile/galleryEditVideos" || undefined}
                href='/profile/galleryEditVideos'
                key='Edit Gallery Videos'
            >
                <IconVideo className={classes.linkIcon} stroke={1.5} />
                <span className={classes.shorten}>Edit Gallery Videos</span>
            </Link>
        </div>
    }


    return (
        <nav className={classes.navbar}>
            <div className={classes.navbarMain}>
                <Link
                    className={classes.link}
                    data-active={active === "/profile" || undefined}
                    href='/profile'
                    key='Home'
                >
                    <IconHome className={classes.linkIcon} stroke={1.5} />
                    <span className={classes.shorten}>Home</span>
                </Link>
                <Link
                    className={classes.link}
                    data-active={active === "/profile/account" || undefined}
                    href='/profile/account'
                    key='Account'
                >
                    <IconUser className={classes.linkIcon} stroke={1.5} />
                    <span className={classes.shorten}>Account</span>
                </Link>
                <Link
                    className={classes.link}
                    data-active={active === "/profile/message" || undefined}
                    href='/profile/message'
                    key='Message'
                >
                    <IconMessage className={classes.linkIcon} stroke={1.5} />
                    <span className={classes.shorten}>Message</span>
                </Link>
                <Link
                    className={classes.link}
                    data-active={active === "/profile/book" || undefined}
                    href='/profile/book'
                    key='Book lessons'
                >
                    <IconBookmarks className={classes.linkIcon} stroke={1.5} />
                    <span className={classes.shorten}>Book Lessons</span>
                </Link>
                <Link
                    className={classes.link}
                    data-active={active === "/profile/history" || undefined}
                    href='/profile/history'
                    key='History'
                >
                    <IconHistory className={classes.linkIcon} stroke={1.5} />
                    <span className={classes.shorten}>History</span>
                </Link>
                {isAdmin ? <AdminComponents /> : null}
            </div>

            <div className={classes.footer}>
                <UnstyledButton className={classes.link} onClick={() => { signOut(auth).then(() => { console.log("Successful") }) }}>
                    <IconLogout className={classes.linkIcon} stroke={1.5} />
                    <span className={classes.shorten}>Logout</span>
                </UnstyledButton>
            </div>
        </nav>
    );
}