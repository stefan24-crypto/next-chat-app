import {
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Checkbox,
  Avatar,
  Button,
  IconButton,
} from "@mui/material";
import React, { useState } from "react";
import { User } from "../../models";
import { useAppSelector } from "../../store/hooks";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import classes from "./CreateGroup.module.css";
import { useRouter } from "next/router";

const CreateGroup: React.FC = () => {
  const [checked, setChecked] = useState<any>([]);
  const router = useRouter();

  const handleToggle = (value: any) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const users = useAppSelector((state) => state.data.users);
  return (
    <section className={classes.section}>
      <form className={classes.form}>
        <div className={classes.content}>
          <header>
            <div className={classes.box}>
              <label htmlFor="file">
                Choose Photo
                <AddAPhotoIcon color="primary" sx={{ fontSize: "3rem" }} />
                <input
                  id="file"
                  type="file"
                  accept="image/*"
                  required
                  className={classes.input_file}
                />
              </label>
              {/* <Button variant="contained">Upload</Button> */}
            </div>
            <TextField
              label="Description"
              variant="filled"
              multiline
              rows={10}
              fullWidth
            />
          </header>
          <main>
            <TextField label="Group Name" variant="filled" fullWidth />
            <div className={classes.list}>
              <label>Choose Group Members</label>
              <List sx={{ height: "100%", overflow: "auto", width: "100%" }}>
                {users?.map((each: any) => (
                  <ListItem
                    key={each.id}
                    secondaryAction={
                      <Checkbox
                        onChange={handleToggle(each.name)}
                        checked={checked.indexOf(each.name) !== -1}
                      />
                    }
                  >
                    <ListItemButton>
                      <ListItemAvatar>
                        <Avatar alt="profile_pic" src={each.profile_pic} />
                      </ListItemAvatar>
                      <ListItemText id={each.id} primary={each.name} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </div>
          </main>
        </div>
        <div className={classes.btns}>
          <IconButton color="primary" onClick={() => router.back()}>
            <ArrowBackIcon />
          </IconButton>
          <Button type="submit" variant="contained" className={classes.btn}>
            Submit
          </Button>
        </div>
      </form>
    </section>
  );
};

export default CreateGroup;
