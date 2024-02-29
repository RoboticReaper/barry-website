'use client'
import '@mantine/dropzone/styles.css';
import { Group, Text, rem, Loader, ActionIcon, Button, Collapse } from '@mantine/core';
import { IconUpload, IconPhoto, IconX, IconTrash } from '@tabler/icons-react';
import { Dropzone } from '@mantine/dropzone';
import classes from '../galleryEdit/GalleryEdit.module.css'
import { useEffect, useState } from "react"
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import cx from 'clsx';
import { Center } from '@mantine/core';
import { useDisclosure, useListState } from '@mantine/hooks';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import classes2 from '@/components/DragDrop/DragDrop.module.css';
import { notifications } from '@mantine/notifications';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db } from '@/app/fb';

export default function GalleryEditVideosPage() {
    const [videoLinks, setvideoLinks] = useState<string[]>();
    const [videoNames, setvideoNames] = useState<string[]>();
    const [opened, { toggle }] = useDisclosure(true)

    useEffect(() => {
        const docRef = doc(db, "public", "gallery");
        getDoc(docRef).then((docSnap) => {
            if (docSnap.exists()) {
                const names = JSON.parse(docSnap.data().videoNames)

                const storage = getStorage();
                var promises = []
                for (var i = 0; i < names.length; i++) {
                    promises.push(getDownloadURL(ref(storage, 'galleryVideos/' + names[i])));
                }

                Promise.all(promises).then((readyLinks) => {
                    setvideoLinks(readyLinks)
                    setvideoNames(names)
                })
            }
        })
    }, [])

    function reorderFirestore(s:any) {
        var names = []
        for (var i = 0; i < s.length; i++) {
            names.push(s[i].videoNames)
        }
        updateDoc(doc(db, "public", "gallery"), { videoNames: JSON.stringify(names) }).then(() => {
            notifications.show({
                color: "green",
                title: "Saved",
                message: "Video order has been saved",
            });
        })
    }

    function deleteVideo(index:number, state: any) {
        const storage = getStorage();
        const deleteRef = ref(storage, 'galleryVideos/' + state[index].videoNames)
        deleteObject(deleteRef).then(() => {
            if(videoNames === undefined || videoLinks === undefined){
                return;
            }
            var tempName = videoNames.filter((val) => {
                return val !== state[index].videoNames
            })

            updateDoc(doc(db, "public", "gallery"), { videoNames: JSON.stringify(tempName) }).then(() => {
                setvideoNames(tempName)
                var tempLink = videoLinks.filter((val) => {
                    return val !== state[index].videoLinks
                })
                setvideoLinks(tempLink)
            })

        })
    }

    function processNewFile(files:File[]) {
        if (files.length > 1) {
            notifications.show({
                color: "Red",
                title: "One file only",
                message: "Only one file has been saved",
            });
        }
        var file = files[0]
        console.log(file);
        // Create a root reference
        const storage = getStorage();


        // Create a reference to video
        const videoRef = ref(storage, 'galleryVideos/' + file.name);

        uploadBytes(videoRef, file).then((snapshot) => {
            getDownloadURL(videoRef).then((url) => {
                if(videoNames === undefined || videoLinks === undefined){
                    return;
                }
                updateDoc(doc(db, "public", "gallery"), {
                    videoNames: JSON.stringify([...videoNames, file.name])
                })
                setvideoLinks([...videoLinks, url])
                setvideoNames([...videoNames, file.name])
            })
        })

    }

    function DragDrop() {
        if(videoNames === undefined || videoLinks === undefined){
            return;
        }
        var d = []
        for (var i = 0; i < videoLinks.length; i++) {
            d.push({ videoLinks: videoLinks[i], videoNames: videoNames[i] })
        }
        const [state, handlers] = useListState(d);

        useEffect(() => {
            reorderFirestore(state);
        }, [state])

        const items = state.map((item, index) => (
            <Center key={item.videoLinks}>
                <Draggable index={index} draggableId={item.videoLinks}>
                    {(provided, snapshot) => (
                        <div
                            className={cx(classes2.item, { [classes2.itemDragging]: snapshot.isDragging })}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                        >
                            <video className={classes.video} controls>
                                <source src={item.videoLinks} type="video/mp4"/>
                                <source src={item.videoLinks} type="video/webm"/>
                                <source src={item.videoLinks} type="video/ogg"/>
                            </video>
                            <Text ml="xs" mr="xs" size="xs">{item.videoNames}</Text>
                            <ActionIcon
                                variant='filled'
                                size="md"
                                color="red"
                                aria-label="Delete video"
                                onClick={() => { deleteVideo(index, state) }}
                            >
                                <IconTrash />
                            </ActionIcon>
                        </div>
                    )}
                </Draggable>
            </Center>
        ));

        return (
            <DragDropContext
                onDragEnd={({ destination, source }) => {
                    handlers.reorder({ from: source.index, to: destination?.index || 0 })
                }
                }
            >
                <Droppable droppableId="dnd-list" direction="vertical">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {items}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        );
    }


    return <div className={classes.mainContainer}>
        <div style={{ textAlign: "center" }}>
            <Text size="md" m="xs">
                <b>Drag to arrange video order</b>
            </Text>
            <Button onClick={toggle} mb="sm">{opened ? "Hide" : "Show"} videos</Button>
        </div>
        {
            //@ts-ignore
            videoLinks != undefined ? <Collapse in={opened}><DragDrop /></Collapse> : <Center><Loader color='blue' /></Center>}

        <div style={{ textAlign: "center" }}>
            <Text size="md" m="xs">
                <b>Video upload</b>
            </Text>
        </div>
        <Dropzone
            onDrop={(files) => processNewFile(files)}
            onReject={(files) => console.log('rejected files', files)}
            maxSize={10 * 1024 ** 3}
            accept={[
                'video/mp4',
                'video/webm',
                'video/ogg'
            ]}
        >
            <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
                <Dropzone.Accept>
                    <IconUpload
                        style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }}
                        stroke={1.5}
                    />
                </Dropzone.Accept>
                <Dropzone.Reject>
                    <IconX
                        style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }}
                        stroke={1.5}
                    />
                </Dropzone.Reject>
                <Dropzone.Idle>
                    <IconPhoto
                        style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }}
                        stroke={1.5}
                    />
                </Dropzone.Idle>

                <div>
                    <Text size="xl" inline>
                        Drag an video here or click to select
                    </Text>
                    <Text size="sm" c="dimmed" inline mt={7}>
                        Attach a file that does not exceed 10gb.
                    </Text>
                    <Text size="sm" c="dimmed" inline mt={7} >
                        DO NOT have duplicate names!
                    </Text>
                </div>
            </Group>
        </Dropzone>


    </div>
}
