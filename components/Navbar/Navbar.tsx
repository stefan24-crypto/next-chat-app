import classes from "./Navbar.module.css";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import { IconButton, Avatar } from "@mui/material";
import { useAppSelector } from "../../store/hooks";
import LogoutIcon from "@mui/icons-material/Logout";
import { auth } from "../../firebase";

const Navbar: React.FC = () => {
  const curUser: any = useAppSelector((state) => state.auth.curUser);
  const users = useAppSelector((state) => state.data.users);
  const curUserProfile = users.find((each) => each.id === curUser.uid);
  return (
    <nav className={classes.nav}>
      <div className={classes.logo}>
        <WhatsAppIcon />
        <h1>WhatsApp</h1>
      </div>
      <div className={classes.icons}>
        <Badge badgeContent={0} color="error">
          <IconButton color="error">
            <NotificationsIcon />
          </IconButton>
        </Badge>
        <IconButton color="error" onClick={() => auth.signOut()}>
          <LogoutIcon />
        </IconButton>
        <Avatar src={curUserProfile?.profile_pic} alt="profile" />
      </div>
    </nav>
  );
};

export default Navbar;
