import { useState } from "react";
import { doc, Timestamp, updateDoc } from "firebase/firestore";
import { useAppSelector } from "../../store/hooks";
import classes from "./Text.module.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { IconButton } from "@mui/material";
import { Menu, MenuItem } from "@mui/material";
import { db } from "../../firebase";
import ChatRoom from "./ChatRoom";
import { DM } from "../../models";

interface TextProps {
  text: string;
  time: Timestamp;
  author: string;
  id: string;
  curChatRoom: DM;
}

const Text: React.FC<TextProps> = ({ text, time, author, id, curChatRoom }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const curUser = useAppSelector((state) => state.auth.curUser);
  const curUserProfile = useAppSelector((state) => state.data.users).find(
    (each) => each.id === curUser.uid
  );

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  //Deleting a Messages
  const deleteMessageHandler = async () => {
    let chatDoc;
    if (curChatRoom.people.length > 2) {
      chatDoc = doc(db, "groups", curChatRoom.id);
    } else {
      chatDoc = doc(db, "dms", curChatRoom.id);
    }
    const newMessages = curChatRoom.messages.filter((each) => each.id !== id);
    const newFields = {
      messages: newMessages,
    };
    await updateDoc(chatDoc, newFields);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  let textClasses = `${classes.text}`;

  if (curUser.displayName === author) {
    textClasses = `${classes.text} ${classes.mine}`;
  }
  return (
    <div className={textClasses}>
      <div className={classes.top}>
        <div className={classes.message}>
          <p>{text}</p>
          <span>
            {curChatRoom.people.length > 2 &&
              author !== curUser.displayName &&
              author}
          </span>
        </div>
        {author === curUser.displayName ? (
          <>
            <IconButton onClick={handleClick}>
              <KeyboardArrowDownIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <MenuItem onClick={deleteMessageHandler}>Delete</MenuItem>
            </Menu>
          </>
        ) : (
          ""
        )}
      </div>
      <span>{time.toDate().toDateString()}</span>
    </div>
  );
};

export default Text;
