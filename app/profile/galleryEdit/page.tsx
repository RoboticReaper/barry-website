
'use client'
import '@mantine/dropzone/styles.css';
import { Group, Text, rem, Loader, ActionIcon, Button, Collapse } from '@mantine/core';
import { IconUpload, IconPhoto, IconX, IconTrash } from '@tabler/icons-react';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import classes from './GalleryEdit.module.css'
import { useEffect, useState } from "react"
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import cx from 'clsx';
import { Image, Center } from '@mantine/core';
import { useDisclosure, useListState } from '@mantine/hooks';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import classes2 from '@/components/DragDrop/DragDrop.module.css';
import { notifications } from '@mantine/notifications';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db } from '@/app/fb';

export default function GalleryEditPage() {
    const [imageLinks, setimageLinks] = useState<string[]>([]);
    const [imageNames, setimageNames] = useState<string[]>([]);
    const [opened, { toggle }] = useDisclosure(true)

    useEffect(() => {
        const docRef = doc(db, "public", "gallery");
        getDoc(docRef).then((docSnap) => {
            if (docSnap.exists()) {
                const names = JSON.parse(docSnap.data().imageNames)

                const storage = getStorage();
                var promises = []
                for (var i = 0; i < names.length; i++) {
                    promises.push(getDownloadURL(ref(storage, 'galleryPhotos/' + names[i])));
                }

                Promise.all(promises).then((readyLinks) => {
                    setimageLinks(readyLinks)
                    setimageNames(names)
                })
            }
        })
    }, [])

    function reorderFirestore(s) {
        var names = []
        for (var i = 0; i < s.length; i++) {
            names.push(s[i].imageNames)
        }
        updateDoc(doc(db, "public", "gallery"), { imageNames: JSON.stringify(names) }).then(() => {
            notifications.show({
                color: "green",
                title: "Saved",
                message: "Image order has been saved",
            });
        })
    }

    function deletePhoto(index, state) {
        const storage = getStorage();
        const deleteRef = ref(storage, 'galleryPhotos/' + state[index].imageNames)
        deleteObject(deleteRef).then(() => {

            var tempName = imageNames.filter((val) => {
                return val !== state[index].imageNames
            })

            var tempLink = imageLinks.filter((val) => {
                return val !== state[index].imageLinks
            })

            updateDoc(doc(db, "public", "gallery"), { imageNames: JSON.stringify(tempName) }).then(() => {
                setimageNames(tempName)
                var tempLink = imageLinks.filter((val) => {
                    return val !== state[index].imageLinks
                })
                setimageLinks(tempLink)
            })

        })
    }

    function processNewFile(files) {
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


        // Create a reference to image
        const imageRef = ref(storage, 'galleryPhotos/' + file.name);

        uploadBytes(imageRef, file).then((snapshot) => {
            getDownloadURL(imageRef).then((url) => {
                console.log(url)
                updateDoc(doc(db, "public", "gallery"), {
                    imageNames: JSON.stringify([...imageNames, file.name])
                })
                setimageLinks([...imageLinks, url])
                setimageNames([...imageNames, file.name])
            })
        })

    }

    function DragDrop() {
        var d = []
        for (var i = 0; i < imageLinks.length; i++) {
            d.push({ imageLinks: imageLinks[i], imageNames: imageNames[i] })
        }
        const [state, handlers] = useListState(d);

        useEffect(() => {
            reorderFirestore(state);
        }, [state])

        const items = state.map((item, index) => (
            <Center key={item.imageLinks}>
                <Draggable index={index} draggableId={item.imageLinks}>
                    {(provided, snapshot) => (
                        <div
                            className={cx(classes2.item, { [classes2.itemDragging]: snapshot.isDragging })}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                        >
                            <Image src={item.imageLinks} mah={100} maw={100} />
                            <Text ml="xs" mr="xs" size="xs">{item.imageNames}</Text>
                            <ActionIcon
                                variant='filled'
                                size="md"
                                color="red"
                                aria-label="Delete Image"
                                onClick={() => { deletePhoto(index, state) }}
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
                <b>Drag to arrange photo order</b>
            </Text>
            <Button onClick={toggle} mb="sm">{opened ? "Hide" : "Show"} photos</Button>
        </div>
        {
            //@ts-ignore
            imageLinks != undefined ? <Collapse in={opened}><DragDrop /></Collapse> : <Center><Loader color='blue' /></Center>}

        <div style={{ textAlign: "center" }}>
            <Text size="md" m="xs">
                <b>Photo upload</b>
            </Text>
        </div>
        <Dropzone
            onDrop={(files) => processNewFile(files)}
            onReject={(files) => console.log('rejected files', files)}
            maxSize={10 * 1024 ** 2}
            accept={IMAGE_MIME_TYPE}
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
                        Drag an image here or click to select
                    </Text>
                    <Text size="sm" c="dimmed" inline mt={7}>
                        Attach a file that does not exceed 10mb.
                    </Text>
                    <Text size="sm" c="dimmed" inline mt={7} >
                        DO NOT have duplicate names!
                    </Text>
                </div>
            </Group>
        </Dropzone>


    </div>
}