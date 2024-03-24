'use client'

import { GalleryHero } from "@/components/GalleryHero/GalleryHero"
import { Title, Center, Divider, Grid, AspectRatio, Loader } from "@mantine/core"
import { Footer } from "@/components/Footer/Footer"
import { useEffect, useState } from "react"
import classes from './Gallery.module.css'
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
                const names = data.imageNames
                const videos = data.videoNames

                const storage = getStorage();
                var imgPromises = []
                for (var i = 0; i < names.length; i++) {
                    imgPromises.push(getDownloadURL(ref(storage, 'galleryPhotos/' + names[i])));
                }

                var vidPromises = []
                for (var i = 0; i < videos.length; i++) {
                    vidPromises.push(getDownloadURL(ref(storage, 'galleryVideos/' + videos[i])));
                }

                Promise.all(imgPromises).then((readyLinks) => {
                    setImgLinks(readyLinks);
                })

                Promise.all(vidPromises).then((vidReadyLinks) => {
                    setVidLinks(vidReadyLinks)
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
                    return <Grid.Col span={{ base: 12, xs: 6, sm: 6, md: 4, lg: 3 }} key={item}><img src={item} className={classes.image}/></Grid.Col>
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
                        <video controls>
                            <source src={item} type="video/mp4" />
                            <source src={item} type="video/webm" />
                            <source src={item} type="video/ogg" />
                        </video>
                    </AspectRatio></Grid.Col>
                }) : <Loader color='blue' />}

        </Grid>
        <Footer />
    </div>
}