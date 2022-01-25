import classes from "./Chats.module.css";
import TextField from "@mui/material/TextField";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { useAppSelector } from "../../store/hooks";
import ChatItem from "./ChatItem";
import { IconButton, Paper } from "@mui/material";
import { doc, updateDoc, collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";

const Chats: React.FC = () => {
  const users = useAppSelector((state) => state.data.users);
  const curUser = useAppSelector((state) => state.auth.curUser);
  const profile = users.find((each) => each.id === curUser.uid);

  const DMs = useAppSelector((state) => state.data.dms);
  console.log(DMs);

  const yourMessages = DMs.filter((each) =>
    each.people.find((person) => person.name === curUser?.displayName)
  );

  const yourMessagesNames = yourMessages.map(
    (each) =>
      each.people.find((person) => person.name !== curUser.displayName)?.name
  );
  const otherPersons = users
    .filter((user) => !yourMessagesNames.includes(user.name))
    .filter((each) => each.name !== curUser.displayName);
  console.log(otherPersons);

  const messageRead = async (id: string, arrOfMessages: any[]) => {
    if (clickedChatWhereNotSender(arrOfMessages)) {
      const dmDoc = doc(db, "dms", id);
      const newFields = {
        receiverHasRead: true,
      };
      await updateDoc(dmDoc, newFields);
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
            <IconButton>
              <GroupAddIcon />
            </IconButton>
            <IconButton>
              <PersonAddIcon />
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
            yourMessages.map((each) => (
              <ChatItem
                id={each.id}
                key={each.id}
                lastMessage={each.messages.at(-1)?.text || "Message Me"}
                lastMessageItem={each?.messages.at(-1) || "Message Me"}
                people={each.people}
                hasMessaged={true}
                hasRead={each.receiverHasRead}
                yourDMs={yourMessages}
                messages={each.messages}
                messageRead={messageRead}
              />
            ))
          )}
        </main>
        <footer className={classes.footer}>
          <div className={classes.heading}>
            <h1>Other Users</h1>
          </div>
          {otherPersons.map((each) => (
            <ChatItem
              id={each.id}
              key={each.id}
              person={each}
              lastMessage="Message Me!"
              hasMessaged={false}
            />
          ))}
        </footer>
      </div>
    </section>
  );
};

export default Chats;
