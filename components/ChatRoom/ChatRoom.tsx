import classes from "./ChatRoom.module.css";
import Navbar from "../Navbar/Navbar";
import Paper from "@mui/material/Paper";
import { useAppSelector } from "../../store/hooks";
import Text from "./Text";
import { Avatar, InputAdornment, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import React, { useRef } from "react";
import { doc, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { v4 as uuid } from "uuid";

const ChatRoom: React.FC = () => {
  const users = useAppSelector((state) => state.data.users);
  const chatRoomID = useAppSelector((state) => state.data.curChatRoomID);
  const curUser = useAppSelector((state) => state.auth.curUser);
  const messageInputRef = useRef<HTMLInputElement>();
  const curUserProfile = useAppSelector((state) => state.data.users).find(
    (each) => each.id === curUser.uid
  );
  const curChatRoom = curUserProfile?.messages.find(
    (each) => each.id === chatRoomID
  );
  const otherPersonChatRoom = users
    .find((each) => each.name === curChatRoom?.receiver)
    ?.messages.find((each) => each.receiver === curUserProfile?.name);
  const otherPersonProfile = users.find(
    (each) => each.name === curChatRoom?.receiver
  );

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    //Add Message to curUserProfile
    const unique_id = uuid();
    const message = messageInputRef.current!.value;

    const otherMessages = curUserProfile?.messages.filter(
      (each) => each.id !== curChatRoom?.id
    );
    const curUserDoc = doc(db, "users", curUser.uid);
    const newFields = {
      messages: [
        ...otherMessages!,
        {
          id: curChatRoom?.id,
          receiver: curChatRoom!.receiver,
          receiver_profile_pic: curChatRoom?.receiver_profile_pic,
          receiverHasRead: true,
          messages: [
            ...curChatRoom!.messages,
            {
              id: unique_id,
              author: curUserProfile!.name,
              time: Timestamp.now(),
              text: message,
            },
          ],
        },
      ],
    };

    await updateDoc(curUserDoc, newFields);
    //AddMessage to otherPersonInChatRoom
    const unique_id_2 = uuid();
    const otherMessages2 = otherPersonProfile?.messages.filter(
      (each) => each.id !== otherPersonChatRoom?.id
    );

    const otherUserDoc = doc(db, "users", otherPersonProfile!.id);
    const newFields2 = {
      messages: [
        ...otherMessages2!,
        {
          id: otherPersonChatRoom?.id,
          receiver: otherPersonChatRoom?.receiver,
          receiver_profile_pic: otherPersonChatRoom?.receiver_profile_pic,
          receiverHasRead: false,
          messages: [
            ...otherPersonChatRoom!.messages,
            {
              id: unique_id_2,
              author: curUserProfile!.name,
              time: Timestamp.now(),
              text: message,
            },
          ],
        },
      ],
    };
    await updateDoc(otherUserDoc, newFields2);

    messageInputRef.current!.value = "";
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
            <p>{curChatRoom.receiver}</p>

            <Avatar src={curChatRoom.receiver_profile_pic} alt="profile" />
          </header>
          <Paper
            elevation={0}
            sx={{
              height: "550px",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              padding: "1rem",
            }}
          >
            {curChatRoom.messages.map((each) => (
              <Text
                author={each.author}
                text={each.text}
                time={each.time}
                key={each.id}
                id={each.id}
                curChatRoomID={chatRoomID}
              />
            ))}
          </Paper>
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
