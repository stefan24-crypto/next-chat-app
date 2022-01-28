import classes from "./ChatRoom.module.css";
import Navbar from "../Navbar/Navbar";
import Paper from "@mui/material/Paper";
import { useAppSelector } from "../../store/hooks";
import Text from "./Text";
import { Avatar, IconButton, InputAdornment, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import React, { useEffect, useRef } from "react";
import { deleteDoc, doc, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { v4 as uuid } from "uuid";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import Messages from "./Messages";

const ChatRoom: React.FC = () => {
  const users = useAppSelector((state) => state.data.users);
  const chatRoomID = useAppSelector((state) => state.data.curChatRoomID);
  const curUser = useAppSelector((state) => state.auth.curUser);
  const dms = useAppSelector((state) => state.data.dms);
  const messageInputRef = useRef<HTMLInputElement>();
  const curUserProfile = useAppSelector((state) => state.data.users).find(
    (each) => each.id === curUser.uid
  );
  const curChatRoom = dms.find((each) => each.id === chatRoomID);
  const scroll = useAppSelector((state) => state.ui.scroll);
  //check if it is a group chat!
  const otherPerson = curChatRoom?.people.find(
    (each) => each.name !== curUser.displayName
  );

  //Adding A message
  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const unique_id = uuid();
    const dmDoc = doc(db, "dms", chatRoomID);
    const newFields = {
      messages: [
        ...curChatRoom!.messages,
        {
          id: unique_id,
          text: messageInputRef.current!.value,
          to: otherPerson?.name,
          author: curUserProfile?.name,
          time: Timestamp.now(),
        },
      ],
      receiverHasRead: false,
    };
    await updateDoc(dmDoc, newFields);
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
              <Avatar src={otherPerson?.profile_pic} alt="profile" />
              <p>{otherPerson?.name}</p>
            </div>
            <IconButton sx={{ color: "white" }} onClick={removePersonHandler}>
              <PersonRemoveIcon />
            </IconButton>
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
