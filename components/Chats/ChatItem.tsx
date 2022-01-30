import { useAppSelector } from "../../store/hooks";
import { v4 as uuid } from "uuid";
import Item from "./Item";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

interface ChatItemProps {
  id: string;
  object: any;
  hasRead: boolean;
  neverMessaged: boolean;
  messageRead?: (id: string, arrOfMessages: any[]) => void;
}

const ChatItem: React.FC<ChatItemProps> = ({
  object,
  hasRead,
  neverMessaged,
  messageRead,
  id,
}) => {
  const curUser = useAppSelector((state) => state.auth.curUser);
  const users = useAppSelector((state) => state.data.users);
  const curUserProfile = users.find((each) => each.id === curUser.uid);
  const clickedOnUserProfile = users.find((each) => each.id === id);
  const dmsCollection = collection(db, "dms");

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

  const addGroupHandler = async () => {
    // console.log(id, object.id);
    //Do some logic here
    const chatDoc = doc(db, "groups", id);
    const newFields = {
      people: [
        ...object?.people,
        {
          id: curUserProfile?.id,
          name: curUserProfile?.name,
          profile_pic: curUserProfile?.profile_pic,
        },
      ],
    };

    await updateDoc(chatDoc, newFields);
  };

  if (neverMessaged) {
    return (
      <Item
        id={object.id}
        name={object?.people?.length > 2 ? object?.group_name : object?.name}
        picture={
          object?.people?.length > 2
            ? object?.group_profile_pic
            : object.profile_pic
        }
        lastMessageObject={
          object?.people?.length > 2 ? "Message Us" : "Message Me"
        }
        hasMessaged={false}
        hasRead={true}
        messages={object.messages}
        isGroup={false}
        addHandler={
          object?.people?.length > 2 ? addGroupHandler : addNewContactHandler
        }
      />
    );
  }

  let content;
  if (object?.people.length > 2) {
    content = (
      <Item
        id={object.id}
        name={object?.group_name}
        picture={object.group_profile_pic}
        lastMessageObject={object.messages.at(-1)}
        hasMessaged={true}
        hasRead={hasRead}
        messages={object?.messages}
        messageRead={messageRead}
        isGroup={true}
      />
    );
  } else {
    const otherProfile = object?.people?.find(
      (each: any) => each.name !== curUser.displayName
    );
    content = (
      <Item
        id={object.id}
        name={otherProfile?.name}
        picture={otherProfile?.profile_pic}
        hasRead={hasRead}
        hasMessaged={true}
        lastMessageObject={object?.messages.at(-1)}
        messages={object?.messages}
        isGroup={false}
        messageRead={messageRead}
      />
    );
  }

  return <>{content}</>;
};

export default ChatItem;
