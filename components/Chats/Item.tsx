import { useAppDispatch, useAppSelector } from "../../store/hooks";
import classes from "./Item.module.css";
import { dataActions } from "../../store/data-slice";

import CampaignIcon from "@mui/icons-material/Campaign";
import { db } from "../../firebase";
import { doc, updateDoc, collection, addDoc } from "firebase/firestore";
import { v4 as uuid } from "uuid";
import { Avatar, IconButton } from "@mui/material";
import { DM, User, Message } from "../../models";
import useShortenText from "../../hooks/useShortedText";
import { UIActions } from "../../store/ui-slice";
import GroupIcon from "@mui/icons-material/Group";

interface ItemProps {
  id: string;
  picture: string;
  name: string;
  lastMessageObject: any;
  hasMessaged: boolean;
  hasRead: boolean;
  messageRead?: (id: string, arrOfMessages: any[]) => void;
  addHandler?: () => void;
  messages: Message[];
  isGroup: boolean;
}

const Item: React.FC<ItemProps> = ({
  id,
  picture,
  name,
  lastMessageObject,
  messageRead,
  addHandler,
  hasMessaged,
  hasRead,
  messages,
  isGroup,
}) => {
  const dispatch = useAppDispatch();
  const curUser = useAppSelector((state) => state.auth.curUser);
  const users = useAppSelector((state) => state.data.users);
  const curUserProfile = users.find((each) => each.id === curUser.uid);
  const shortenText = useShortenText(lastMessageObject?.text, 25);

  const clickUserHandler = () => {
    if (hasMessaged) {
      dispatch(dataActions.setCurChatRoomID(id));
      const sortedMessages = [...messages!];
      sortedMessages?.sort((a, b) => a.time.seconds - b.time.seconds);
      messageRead!(id, sortedMessages);
      dispatch(UIActions.setScrollTo(true));
    } else {
      addHandler!();
    }
  };

  return (
    <div className={classes.item} onClick={clickUserHandler}>
      <div className={classes.data}>
        <div className={classes.img}>
          <Avatar src={picture} alt="profile" />
        </div>
        <div className={classes.info}>
          <p>
            {name} <span>{isGroup ? <GroupIcon /> : ""}</span>
          </p>
          <span>{shortenText || lastMessageObject}</span>
        </div>
      </div>
      <div className={classes.icons}>
        {!hasRead &&
          hasMessaged &&
          lastMessageObject?.author !== curUserProfile?.name && (
            <CampaignIcon color="error" className={classes.alert} />
          )}
      </div>
    </div>
  );
};

export default Item;
