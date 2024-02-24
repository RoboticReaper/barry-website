'use client'

import { GalleryHero } from "@/components/GalleryHero/GalleryHero"
import { Title, Center, Divider, Grid, AspectRatio, Loader } from "@mantine/core"
import { Footer } from "@/components/Footer/Footer"
import { useEffect, useState } from "react"
import { db } from '@/app/fb';
import { doc, getDoc } from "firebase/firestore";
import { HeaderMegaMenu } from "@/components/HeaderMegaMenu/HeaderMegaMenu"
import { getStorage, ref, getDownloadURL } from "firebase/storage";

export default function GalleryPage() {
    const [imgLinks, setImgLinks] = useState<string[]>();
    const [vidLinks, setVidLinks] = useState<string[]>();

    useEffect(() => {
        const docRef = doc(db, "public", "gallery");
        getDoc(docRef).then((docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                const names = JSON.parse(data.imageNames)
                const videos = JSON.parse(data.videos)

                const storage = getStorage();
                var promises = []
                for (var i = 0; i < names.length; i++) {
                    promises.push(getDownloadURL(ref(storage, 'galleryPhotos/' + names[i])));
                }

                setVidLinks(videos);

                Promise.all(promises).then((readyLinks) => {
                    setImgLinks(readyLinks);
                })
            }
        })
    }, [])

    return <div>
        <HeaderMegaMenu />
        <GalleryHero />
        <Center>
            <Title mt="xl" id="images">Images</Title>
        </Center>
        <Center>
            <Divider my="md" style={{ width: "50%" }} />
        </Center>
        <Grid p="xl" justify="center" >
            {
                //@ts-ignore
                imgLinks != undefined ? imgLinks.map((item) => {
                    return <Grid.Col span={{ base: 12, xs: 12, sm: 6, lg: 4 }} key={item}><AspectRatio ratio={16 / 9} mx="auto"><img src={item} /></AspectRatio></Grid.Col>
                }) : <Loader color='blue' />}

        </Grid>

        <Center>
            <Title mt="xl" id="videos">Videos</Title>
        </Center>
        <Center>
            <Divider my="md" style={{ width: "50%" }} />
        </Center>
        <Grid p="xl" justify="center" >
            {
                //@ts-ignore
                vidLinks != undefined ? vidLinks.map((item) => {
                    return <Grid.Col span={{ base: 12, xs: 12, sm: 6, lg: 4 }} key={item}><AspectRatio ratio={16 / 9} mx="auto">
                        <iframe src={"https://www.youtube.com/embed/"+item} style={{borderStyle:"none"}} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                    </AspectRatio></Grid.Col>
                }) : <Loader color='blue' />}

        </Grid>
        <Footer />
    </div>
}