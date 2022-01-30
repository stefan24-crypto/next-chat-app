import classes from "./Chats.module.css";
import TextField from "@mui/material/TextField";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import { useAppSelector } from "../../store/hooks";
import ChatItem from "./ChatItem";
import { IconButton } from "@mui/material";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useRouter } from "next/router";
import ChatRoom from "../ChatRoom/ChatRoom";

const Chats: React.FC = () => {
  const users = useAppSelector((state) => state.data.users);
  const curUser = useAppSelector((state) => state.auth.curUser);
  const profile = users.find((each) => each.id === curUser.uid);
  const router = useRouter();
  const DMs = useAppSelector((state) => state.data.dms);
  const groups = useAppSelector((state) => state.data.groups);

  const yourMessages = DMs.filter((each) =>
    each.people.find((person) => person.name === curUser?.displayName)
  );
  const yourGroups = groups.filter((each) =>
    each.people.find((person) => person.id === curUser.uid)
  );
  const dmIDs = DMs.map((each) => each.id);

  const yourMessagesNames = yourMessages.map(
    (each) =>
      each.people.find((person) => person.name !== curUser.displayName)?.name
  );
  const otherPersons = users
    .filter((user) => !yourMessagesNames.includes(user.name))
    .filter((each) => each.name !== curUser.displayName);

  const otherGroups = groups.filter((group) => {
    const groupNames = group.people.map((each) => each.name);
    if (groupNames.includes(curUser.displayName)) {
      return false;
    } else {
      return true;
    }
  });

  console.log(otherGroups);

  const messageRead = async (id: string, arrOfMessages: any[]) => {
    if (clickedChatWhereNotSender(arrOfMessages)) {
      let chatDoc;
      if (dmIDs.includes(id)) {
        chatDoc = doc(db, "dms", id);
      } else {
        chatDoc = doc(db, "groups", id);
      }
      const newFields = {
        receiverHasRead: true,
      };
      await updateDoc(chatDoc, newFields);
    }
  };

  const clickedChatWhereNotSender = (sortedArrOfMessages: any[]) =>
    sortedArrOfMessages.at(-1)?.author !== curUser?.displayName;

  return (
    <section className={classes.section}>
      <header>
        <div className={classes.icons}>
          <div>
            <TextField label="Search..." variant="standard" fullWidth />
          </div>
          <div>
            <IconButton onClick={() => router.push("/make_group")}>
              <GroupAddIcon />
            </IconButton>
          </div>
        </div>
      </header>
      <div className={classes.side}>
        <div className={classes.heading}>
          <h1>Your Messages</h1>
        </div>
        <main className={classes.main}>
          {DMs.length === 0 ? (
            <div className={classes.none}>
              <p>No Messages</p>
            </div>
          ) : (
            [...yourMessages, ...yourGroups].map((each: any) => (
              <ChatItem
                key={each.id}
                object={each}
                hasRead={each?.receiverHasRead}
                neverMessaged={false}
                messageRead={messageRead}
                id={each.id}
              />
            ))
          )}
        </main>
        <footer className={classes.footer}>
          <div className={classes.heading}>
            <h1>Other Users</h1>
          </div>
          {[...otherPersons, ...otherGroups].map((each) => (
            <ChatItem
              key={each.id}
              object={each}
              hasRead={true}
              neverMessaged={true}
              messageRead={messageRead}
              id={each.id}
            />
          ))}
        </footer>
      </div>
    </section>
  );
};

export default Chats;
