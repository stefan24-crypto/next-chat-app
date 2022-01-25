import { useState } from "react";
import { doc, Timestamp, updateDoc } from "firebase/firestore";
import { useAppSelector } from "../../store/hooks";
import classes from "./Text.module.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { IconButton } from "@mui/material";
import { Menu, MenuItem } from "@mui/material";
import { db } from "../../firebase";

interface TextProps {
  text: string;
  time: Timestamp;
  author: string;
  id: string;
}

const Text: React.FC<TextProps> = ({
  text,
  time,
  author,
  id,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const curUser = useAppSelector((state) => state.auth.curUser);
  const curUserProfile = useAppSelector((state) => state.data.users).find(
    (each) => each.id === curUser.uid
  );
  
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
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
        <p>{text}</p>
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
              <MenuItem onClick={handleClose}>Delete</MenuItem>
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
