import classes from "./Chats.module.css";
import TextField from "@mui/material/TextField";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { useAppSelector } from "../../store/hooks";
import ChatItem from "./ChatItem";
import { IconButton, Paper } from "@mui/material";

const Chats: React.FC = () => {
  const users = useAppSelector((state) => state.data.users);
  const curUser = useAppSelector((state) => state.auth.curUser);
  const profile = users.find((each) => each.id === curUser.uid);

  const thisUsersMessagesNames = profile?.messages.map((each) => each.receiver);

  const otherPersons = users.filter(
    (user) => !thisUsersMessagesNames?.includes(user.name)
  );
  const newOtherPersons = otherPersons.filter(
    (each) => each.name !== profile?.name
  );

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
          {profile?.messages.length === 0 ? (
            <div className={classes.none}>
              <p>No Messages</p>
            </div>
          ) : (
            profile?.messages.map((each) => (
              <ChatItem
                id={each.id}
                key={each.id}
                name={each.receiver}
                lastMessage={each.messages.at(-1)?.text || "Message Me"}
                lastMessageItem={each?.messages.at(-1) || "Message Me"}
                profile_pic={each.receiver_profile_pic}
                hasMessaged={true}
                hasRead={each.receiverHasRead}
                item={each}
              />
            ))
          )}
        </main>
        <footer className={classes.footer}>
          <div className={classes.heading}>
            <h1>Other Users</h1>
          </div>
          {newOtherPersons.map((each) => (
            <ChatItem
              id={each.id}
              key={each.id}
              name={each.name}
              lastMessage="Message Me!"
              profile_pic={each.profile_pic}
              hasMessaged={false}
            />
          ))}
        </footer>
      </div>
    </section>
  );
};

export default Chats;
