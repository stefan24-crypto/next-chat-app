import React from "react";
import ChatRoom from "../ChatRoom/ChatRoom";
import Chats from "../Chats/Chats";
import classes from "./Layout.module.css";

const Layout: React.FC = () => {
  return (
    <main className={classes.main}>
      <Chats />
      <ChatRoom />
    </main>
  );
};

export default Layout;
