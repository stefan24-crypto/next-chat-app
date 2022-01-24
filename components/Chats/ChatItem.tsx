import { useAppDispatch, useAppSelector } from "../../store/hooks";
import classes from "./ChatItem.module.css";
import SendIcon from "@mui/icons-material/Send";
import { dataActions } from "../../store/data-slice";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import { db } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { v4 as uuid } from "uuid";
import { Avatar } from "@mui/material";
import { DM } from "../../models";

interface ChatItemProps {
  id: string;
  name: string;
  lastMessage: any;
  profile_pic: string;
  hasMessaged: boolean;
  hasRead?: boolean;
  item?: DM;
  lastMessageItem?: any;
}

const ChatItem: React.FC<ChatItemProps> = ({
  id,
  name,
  lastMessage,
  lastMessageItem,
  profile_pic,
  hasMessaged,
  hasRead,
  item,
}) => {
  const dispatch = useAppDispatch();
  const curUser = useAppSelector((state) => state.auth.curUser);
  const users = useAppSelector((state) => state.data.users);
  const curUserProfile = users.find((each) => each.id === curUser.uid);
  const clickedOnUserProfile = users.find((each) => each.id === id);
  // if (hasMessaged) {
  //   if (lastMessageItem.author !== curUser.displayName) {
  //   }
  // } else {
  //   // createChatroom when clicked
  // }

  const addNewContactHandler = async () => {
    console.log(id);
    console.log("New Contact");
    const unique_id = uuid();
    //Add DM to curUser
    const curUserDoc = doc(db, "users", curUser.uid);
    const newFields = {
      messages: [
        ...curUserProfile!.messages,
        {
          id: unique_id,
          receiver: clickedOnUserProfile?.name,
          receiver_profile_pic: clickedOnUserProfile?.profile_pic,
          messages: [],
          receiverHasRead: true,
        },
      ],
    };

    await updateDoc(curUserDoc, newFields);
    //Add DM to clicked on user
    const unique_id_2 = uuid();
    const clickedOnUserDoc = doc(db, "users", id);
    const newFields2 = {
      messages: [
        ...clickedOnUserProfile!.messages,
        {
          id: unique_id_2,
          receiver: curUserProfile?.name,
          receiver_profile_pic: curUserProfile?.profile_pic,
          messages: [],
          receiverHasRead: true,
        },
      ],
    };
    await updateDoc(clickedOnUserDoc, newFields2);
  };

  return (
    <div
      className={classes.item}
      onClick={() =>
        hasMessaged
          ? dispatch(dataActions.setCurChatRoomID(id))
          : addNewContactHandler()
      }
    >
      <div className={classes.data}>
        <div className={classes.img}>
          {/* <img src={profile_pic} alt="Profile" /> */}
          <Avatar src={profile_pic} alt="profile" />
        </div>
        <div className={classes.info}>
          <p>{name}</p>
          <span>{lastMessage}</span>
        </div>
      </div>
      {!hasRead && hasMessaged && (
        <AnnouncementIcon color="secondary" className={classes.alert} />
      )}
    </div>
  );
};

export default ChatItem;
