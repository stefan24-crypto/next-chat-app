import { useAppDispatch, useAppSelector } from "../../store/hooks";
import classes from "./ChatItem.module.css";
import { dataActions } from "../../store/data-slice";

import CampaignIcon from "@mui/icons-material/Campaign";
import { db } from "../../firebase";
import { doc, updateDoc, collection, addDoc } from "firebase/firestore";
import { v4 as uuid } from "uuid";
import { Avatar, IconButton } from "@mui/material";
import { DM, User, Message } from "../../models";
import useShortenText from "../../hooks/useShortedText";

interface ChatItemProps {
  id: string;
  lastMessage: any;
  people?: User[];
  lastMessageItem?: any;
  hasMessaged: boolean;
  person?: User;
  hasRead?: boolean;
  yourDMs?: DM[];
  messages?: Message[];
  messageRead?: (id: string, arrOfMessages: any[]) => void;
}

const ChatItem: React.FC<ChatItemProps> = ({
  id,
  lastMessage,
  people,
  hasMessaged,
  lastMessageItem,
  person,
  hasRead,
  messages,
  messageRead,
}) => {
  const dispatch = useAppDispatch();
  const curUser = useAppSelector((state) => state.auth.curUser);
  const users = useAppSelector((state) => state.data.users);
  const curUserProfile = users.find((each) => each.id === curUser.uid);
  const clickedOnUserProfile = users.find((each) => each.id === id);
  const dmsCollection = collection(db, "dms");
  //check if if is a group chat: if people.length > 2;
  const otherPerson = people?.find((each) => each.name !== curUser.displayName);
  const shortenText = useShortenText(lastMessage, 25);

  const addNewContactHandler = async () => {
    const unique_id = uuid();
    const fields = {
      id: unique_id,
      people: [
        {
          id: curUserProfile?.id,
          name: curUserProfile?.name,
          profile_pic: curUserProfile?.profile_pic,
        },
        {
          id: clickedOnUserProfile?.id,
          name: clickedOnUserProfile?.name,
          profile_pic: clickedOnUserProfile?.profile_pic,
        },
      ],
      messages: [],
      receiverHasRead: true,
    };
    await addDoc(dmsCollection, fields);
  };

  const clickUserHandler = () => {
    if (hasMessaged) {
      dispatch(dataActions.setCurChatRoomID(id));
      const sortedMessages = [...messages!];
      sortedMessages?.sort((a, b) => a.time.seconds - b.time.seconds);
      messageRead!(id, sortedMessages);
    } else {
      addNewContactHandler();
    }
    console.log(clickedOnUserProfile);
  };

  return (
    <div className={classes.item} onClick={clickUserHandler}>
      <div className={classes.data}>
        <div className={classes.img}>
          <Avatar
            src={otherPerson?.profile_pic || person?.profile_pic}
            alt="profile"
          />
        </div>
        <div className={classes.info}>
          <p>{otherPerson?.name || person?.name}</p>
          <span>{shortenText}</span>
        </div>
      </div>
      <div className={classes.icons}>
        {!hasRead &&
          hasMessaged &&
          lastMessageItem.author !== curUserProfile?.name && (
            <CampaignIcon color="error" className={classes.alert} />
          )}
      </div>
    </div>
  );
};

export default ChatItem;
