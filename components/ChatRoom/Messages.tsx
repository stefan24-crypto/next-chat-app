import { useRef } from "react";
import { Paper } from "@mui/material";
import { useEffect } from "react";
import { DM } from "../../models";
import Text from "./Text";
import classes from "./Messages.module.css";

interface MessagesProps {
  curChatRoom: DM;
}

const Messages: React.FC<MessagesProps> = ({ curChatRoom }) => {
  const scorllToRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scorllToRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [curChatRoom.messages]);

  return (
    <Paper
      elevation={0}
      sx={{
        height: "550px",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        padding: "1rem",
        overflow: "auto",
      }}
    >
      {curChatRoom.messages.map((each) => (
        <Text
          author={each.author}
          text={each.text}
          time={each.time}
          key={each.id}
          id={each.id}
          curChatRoom={curChatRoom}
        />
      ))}
      <div className={classes.scroll_to} ref={scorllToRef}></div>
    </Paper>
  );
};

export default Messages;
