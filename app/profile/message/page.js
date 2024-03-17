'use client'
import classes from "./Message.module.css";
import { UnstyledButton, Center, Container, Loader, ScrollArea, Indicator, TextInput, ActionIcon, Group } from '@mantine/core';
import { doc, updateDoc, getDoc, setDoc, collection, query, limit, orderBy, getDocs, onSnapshot, arrayUnion, Timestamp } from "firebase/firestore";
import { useEffect, useState, useRef } from "react";
import { db } from '@/app/fb';
import { user as initUser } from '@/app/fb';
import { IconSend } from "@tabler/icons-react";


export let unsub;

export default function Message() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [user, changeUser] = useState(initUser);
    const [channelIDs, setChannelIDs] = useState();
    const [unread, setUnread] = useState();
    const [activeName, setActiveName] = useState();
    const [activeID, setActiveID] = useState();
    const [channelNames, setChannelNames] = useState();
    const [messages, setMessages] = useState();

    const viewport = useRef(null);



    function setNewUser(use) {
        getDoc(doc(db, "users", use.uid)).then((docSnap) => {
            if (docSnap.data().admin == true) {
                setIsAdmin(true);

                // load all the people that the admin can send messages to
                onSnapshot(query(collection(db, "messages"), orderBy("lastSent", "desc"), limit(10)), (querySnapshot) => {
                    let resultIDs = []
                    let namePromises = []
                    let resultUnread = []
                    let resultNames = []

                    querySnapshot.forEach((resultDoc) => {
                        resultIDs.push(resultDoc.id)
                        resultUnread.push(resultDoc.data().adminUnread)
                        namePromises.push(getDoc(doc(db, "users", resultDoc.id)))
                    })

                    setChannelIDs(resultIDs)
                    setUnread(resultUnread)
                    Promise.all(namePromises).then((results) => {
                        results.forEach((result) => {
                            resultNames.push(result.data().displayName)
                        })

                        setChannelNames(resultNames)
                    })
                })
            } else {
                // chat in their own channel only
                setActiveID(use.uid)
                setActiveName("Barry")
            }
        })
    }

    useEffect(() => {
        if (initUser != null) {
            setNewUser(initUser);
        }

        // listen to user data event
        document.addEventListener('userChanged', (u) => {
            console.log("User changed")
            // @ts-ignore
            var newUser = u.detail.newUser;
            if (newUser == null) {
                if (unsub !== undefined) {
                    unsub();
                }
                router.replace("/");
            } else {
                setNewUser(newUser);
            }
            changeUser(newUser);

        })

        
    }, [])

    useEffect(() => {
        if (unsub !== undefined) {
            unsub();
        }
        if (activeID === undefined) {
            return;
        }

        unsub = onSnapshot(doc(db, "messages", activeID), (d) => {
            let data = d.data();

            if (data.messages === undefined) {
                data.messages = []
            }
            setMessages(data.messages)

            if(isAdmin){
                updateDoc(doc(db, "messages", activeID), {
                    adminUnread: false,
                })
            } else {
                updateDoc(doc(db, "messages", activeID), {
                    userUnread: false,
                })
            }
        })
    }, [activeID])

    useEffect(() => {
        if (viewport.current) {
            viewport.current.scrollTo({ top: viewport.current.scrollHeight, behavior: "auto" });
        }

    }, [ChatBox]);

    function sendMessage() {
        let msg = document.getElementById("messageInput").value.trim()

        if (msg === "") {
            document.getElementById("messageInput").value = ""
        } else {
            getDoc(doc(db, "messages", activeID)).then((docSnap) => {
                if (docSnap.exists()) {
                    updateDoc(doc(db, "messages", activeID), {
                        messages: arrayUnion({
                            message: msg,
                            uid: user.uid,
                            sent: Timestamp.now()
                        }),
                        adminUnread: true,
                        lastSent: Timestamp.now()
                    })
                } else {
                    setDoc(doc(db, "messages", activeID), {
                        messages: [{
                            message: msg,
                            uid: user.uid,
                            sent: Timestamp.now()
                        }],
                        userUnread: false,
                        adminUnread: true,
                        lastSent: Timestamp.now()
                    })
                }
            })



            document.getElementById("messageInput").value = ""
        }
    }

    function ChatBar() {
        return <ScrollArea className={classes.scrollArea}>
            <div className={classes.navbar}>
                <div className={classes.navbarMain}>
                    {channelNames === undefined ? <Loader /> : channelNames.map((name, index) => {
                        return <UnstyledButton
                            className={classes.link}
                            data-active={name === activeName || undefined}
                            onClick={() => { setActiveID(channelIDs[index]); setActiveName(channelNames[index]) }}
                            key={index}
                        >
                            <Indicator size={10} withBorder position="top-start" disabled={!unread[index]}>{name}</Indicator>
                        </UnstyledButton>
                    })}

                </div>
            </div>

        </ScrollArea>
    }

    function ChatBox() {
        if (activeID === undefined) {
            return null;
        }

        const messageArea = messages === undefined ? <Loader /> : <div className={classes.messageWrapper}>{messages.map((msg, index) => {
            let role;
            let date = msg.sent.toDate()
            let time = date.toLocaleDateString() + " " + date.toLocaleTimeString()

            if (msg.uid !== user.uid) {
                role = activeName;
            } else {
                role = "You";
            }

            return <div key={index} style={{ padding: "10px" }}>{role + ", " + time + ": " + msg.message}<br /></div>
        })}</div>



        return <div className={classes.chatBox} key="test">
            <div className={classes.chatTitle}>{activeName}</div>
            <ScrollArea scrollbars='y' className={classes.chatArea} viewportRef={viewport}>{messageArea}</ScrollArea>

            <form onSubmit={(e) => { e.preventDefault(); sendMessage() }} className={classes.chatInput}>
                <TextInput autoFocus style={{ flex: 1 }} id="messageInput" size="md" placeholder="Type your message here" />
                <ActionIcon size="input-md" type="submit">
                    <IconSend />
                </ActionIcon>
            </form>
        </div>
    }

    function ChatInterface() {
        return !isAdmin ? <ChatBox /> : <div style={{ display: "flex", flexDirection: "row", flexWrap: "nowrap" }}>
            <ChatBar />
            <ChatBox />
        </div>
    }


    return user ? <div className={classes.mainContainer}><ChatInterface /></div> : <div className={classes.mainContainer}><Center><Loader /></Center></div>
}