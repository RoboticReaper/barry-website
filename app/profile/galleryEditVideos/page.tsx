
'use client'
import '@mantine/dropzone/styles.css';
import { Group, Text, rem, Loader, ActionIcon, Button, Collapse, AspectRatio, TextInput, Container } from '@mantine/core';
import { IconUpload, IconPhoto, IconX, IconTrash } from '@tabler/icons-react';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import classes from '../galleryEdit/GalleryEdit.module.css'
import { useEffect, useState } from "react"
import { doc, getDoc, updateDoc } from "firebase/firestore";
import cx from 'clsx';
import { Image, Center } from '@mantine/core';
import { useDisclosure, useListState } from '@mantine/hooks';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import classes2 from '@/components/DragDrop/DragDrop.module.css';
import { notifications } from '@mantine/notifications';
import { db } from '@/app/fb';

export default function GalleryEditVideosPage() {
    const [videoLinks, setvideoLinks] = useState<string[]>();
    const [newLink, setNewLink] = useState("")
    const [opened, { toggle }] = useDisclosure(true)

    useEffect(() => {
        const docRef = doc(db, "public", "gallery");
        getDoc(docRef).then((docSnap) => {
            if (docSnap.exists()) {
                const links = JSON.parse(docSnap.data().videos)
                setvideoLinks(links)
            }
        })
    }, [])

    function reorderFirestore(s:any) {
        updateDoc(doc(db, "public", "gallery"), { videos: JSON.stringify(s) }).then(() => {
            notifications.show({
                color: "green",
                title: "Saved",
                message: "Video order has been saved",
            });
        })
    }

    function deleteVideo(index:number, state:any) {
        if(videoLinks === undefined){
            return;
        }
        var tempLink = videoLinks.filter((val) => {
            return val !== videoLinks[index]
        })

        updateDoc(doc(db, "public", "gallery"), { videos: JSON.stringify(tempLink) }).then(() => {
            setvideoLinks(tempLink)
        })

    }

    function processNewVideo() {
        
        if(videoLinks === undefined || newLink.trim() === "" ){
            return;
        }
        var tempLink = [...videoLinks, newLink];

        updateDoc(doc(db, "public", "gallery"), { videos: JSON.stringify(tempLink) }).then(() => {
            setvideoLinks(tempLink);
        })
    }

    function DragDrop() {
        const [state, handlers] = useListState(videoLinks);

        useEffect(() => {
            reorderFirestore(state);
        }, [state])

        const items = state.map((item, index) => (
            <Center key={item}>
                <Draggable index={index} draggableId={item}>
                    {(provided, snapshot) => (
                        <div
                            className={cx(classes2.item, { [classes2.itemDragging]: snapshot.isDragging })}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                        >
                            <iframe src={"https://www.youtube.com/embed/" + item} style={{ borderStyle: "none"}} className={classes.video} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                            <ActionIcon
                                variant='filled'
                                size="md"
                                ml="xs"
                                color="red"
                                aria-label="Delete Image"
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
                <b>Add video</b>
            </Text>
            <Container size="sm">
                <TextInput label="YouTube video ID:" placeholder='Paste ID here' id="newLink" value={newLink} onChange={(e)=>{setNewLink(e.currentTarget.value)}} description="Right click video, Stats for nerds, Video ID" />
                <Button onClick={() => { processNewVideo() }} mt="sm">Add video</Button>
            </Container>
        </div>

    </div>
}