'use client'
import { HeaderMegaMenu } from '@/components/HeaderMegaMenu/HeaderMegaMenu';
import { Login } from '@/components/Authentication/Login';
import { useRouter } from 'next/navigation';
import { user as initUser } from '@/app/fb';
import { useEffect, useState } from 'react';

export default function LoginPage(){
    const [user, changeUser] = useState(initUser);
    const router = useRouter();

    useEffect(() => {
        // listen to user data event
        document.addEventListener('userChanged', (u) => {
            // @ts-ignore
            var newUser: User = u.detail.newUser;
            changeUser(newUser);
        })


    }, [])

    if(user!=null){
        router.replace("/profile");
    }

    return <>
        <HeaderMegaMenu />
        <Login />
    </>
}