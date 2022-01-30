import { useState } from "react";
import classes from "./ChatRoom.module.css";
import Navbar from "../Navbar/Navbar";
import Paper from "@mui/material/Paper";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import Text from "./Text";
import { Avatar, IconButton, InputAdornment, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import React, { useEffect, useRef } from "react";
import { deleteDoc, doc, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { v4 as uuid } from "uuid";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import Messages from "./Messages";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import { Group, DM } from "../../models";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { dataActions } from "../../store/data-slice";
import { useRouter } from "next/router";

const ChatRoom: React.FC = () => {
  let curChatRoom: any;
  let others: any;
  const users = useAppSelector((state) => state.data.users);
  const chatRoomID = useAppSelector((state) => state.data.curChatRoomID);
  const curUser = useAppSelector((state) => state.auth.curUser);
  const dms = useAppSelector((state) => state.data.dms);
  const groups = useAppSelector((state) => state.data.groups);
  const messageInputRef = useRef<HTMLInputElement>();
  const curUserProfile = useAppSelector((state) => state.data.users).find(
    (each) => each.id === curUser.uid
  );
  const dispatch = useAppDispatch();
  const router = useRouter();

  const dmIDs = dms.map((each) => each.id);
  if (dmIDs.includes(chatRoomID)) {
    curChatRoom = dms.find((each) => each.id === chatRoomID);
    others = curChatRoom?.people.find(
      (each: any) => each.name !== curUser.displayName
    );
  } else {
    curChatRoom = groups.find((each) => each.id == chatRoomID);
    others = curChatRoom?.people.filter(
      (each: any) => each.name !== curUser.displayName
    );
  }

  //Adding A message
  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const unique_id = uuid();
    let chatDoc;
    let newFields;
    if (curChatRoom.people.length > 2) {
      chatDoc = doc(db, "groups", chatRoomID);
      newFields = {
        messages: [
          ...curChatRoom!.messages,
          {
            id: unique_id,
            text: messageInputRef.current!.value,
            to: others?.name || others.map((each: any) => each.name),
            author: curUserProfile?.name,
            time: Timestamp.now(),
          },
        ],
      };
    } else {
      chatDoc = doc(db, "dms", chatRoomID);
      newFields = {
        messages: [
          ...curChatRoom!.messages,
          {
            id: unique_id,
            text: messageInputRef.current!.value,
            to: others?.name || others.map((each: any) => each.name),
            author: curUserProfile?.name,
            time: Timestamp.now(),
          },
        ],
        receiverHasRead: false,
      };
    }
    //change fields if it is a group!

    await updateDoc(chatDoc, newFields);
    messageInputRef.current!.value = "";
  };

  //Removing a Person
  const removePersonHandler = async () => {
    const response = prompt(
      'Type "yes" to delete this contact and "no" to go back'
    );
    if (response === "yes") {
      const thisDoc = doc(db, "dms", chatRoomID);
      await deleteDoc(thisDoc);
    }
  };

  const leaveGroupHandler = async () => {
    const response = prompt(
      'Type "yes" to leave the group and "no" to go back'
    );
    if (response === "yes") {
      const chatDoc = doc(db, "groups", chatRoomID);
      const updatedPeople = curChatRoom.people.filter(
        (each: any) => each.id !== curUser.uid
      );
      if (updatedPeople.length <= 2) {
        await deleteDoc(chatDoc);
        dispatch(dataActions.setCurChatRoomID(""));
        router.push("/");
      } else {
        const newFields = {
          people: updatedPeople,
        };
        await updateDoc(chatDoc, newFields);
        dispatch(dataActions.setCurChatRoomID(""));
        router.push("/");
      }
    }
  };

  return (
    <section className={classes.section}>
      <header>
        <Navbar />
      </header>
      {!curChatRoom ? (
        <div className={classes.noChat}>
          <h2>Find Someone To Chat With :)</h2>
        </div>
      ) : (
        <main className={classes.chatBox}>
          <header>
            <div className={classes.profile}>
              <Avatar
                src={
                  curChatRoom.people.length > 2
                    ? curChatRoom?.group_profile_pic
                    : others?.profile_pic
                }
                alt="profile"
              />
              <div className={classes.persons}>
                <p>
                  {curChatRoom.people.length > 2
                    ? curChatRoom?.group_name
                    : others?.name}
                </p>
                {curChatRoom.people.length > 2 &&
                  curChatRoom.people.map((each: any) => (
                    <span key={each.id}>{each.name}, </span>
                  ))}
              </div>
            </div>
            {curChatRoom.people.length > 2 ? (
              <IconButton sx={{ color: "white" }} onClick={leaveGroupHandler}>
                <ExitToAppIcon />
              </IconButton>
            ) : (
              <IconButton sx={{ color: "white" }} onClick={removePersonHandler}>
                <PersonRemoveIcon />
              </IconButton>
            )}
          </header>
          <Messages curChatRoom={curChatRoom} />
          <form className={classes.footer} onSubmit={submitHandler}>
            <TextField
              fullWidth
              label="Message..."
              variant="filled"
              inputRef={messageInputRef}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SendIcon />
                  </InputAdornment>
                ),
              }}
            />
          </form>
        </main>
      )}
    </section>
  );
};

export default ChatRoom;
