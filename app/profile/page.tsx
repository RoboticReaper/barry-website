'use client'
import { HeaderMegaMenu } from '@/components/HeaderMegaMenu/HeaderMegaMenu';
import { useRouter } from 'next/navigation';
import { user as initUser } from '@/app/fb';
import { useEffect, useState } from 'react';
import { SideNavbar } from '@/components/SideNavbar/SideNavbar';

export default function ProfilePage() {
    const [user, changeUser] = useState(initUser);
    const router = useRouter();

    useEffect(() => {
        // listen to user data event
        document.addEventListener('userChanged', (u) => {
            console.log("User changed")
            // @ts-ignore
            var newUser: User = u.detail.newUser;
            changeUser(newUser);
            if (newUser == null) {
                router.replace("/");
            }
        })


    }, [])



    return <div>
        <HeaderMegaMenu />
        <SideNavbar />
    </div>
}