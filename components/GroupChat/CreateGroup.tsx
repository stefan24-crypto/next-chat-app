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
  CircularProgress,
} from "@mui/material";
import React, { useRef, useState } from "react";
import { User } from "../../models";
import { useAppSelector } from "../../store/hooks";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import classes from "./CreateGroup.module.css";
import { useRouter } from "next/router";
import { db, storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuid } from "uuid";
import { collection, addDoc } from "firebase/firestore";

const CreateGroup: React.FC = () => {
  const curUser = useAppSelector((state) => state.auth.curUser);
  const users = useAppSelector((state) => state.data.users);
  const curUserProfile = users.find((each) => each.id === curUser.uid);
  const [checked, setChecked] = useState<any>([]);
  const [image, setImage] = useState<any>(null);
  const [showUploadButton, setShowUploadButton] = useState(false);
  const [url, setUrl] = useState("");
  const descriptionRef = useRef<HTMLInputElement>();
  const groupNameRef = useRef<HTMLInputElement>();
  const router = useRouter();
  const groupsCollection = collection(db, "groups");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      console.log("here");
      setShowUploadButton(true);
      setImage(e.target.files![0]);
    }
  };
  const handleUpload = () => {
    const storageRef = ref(storage, `images/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(storageRef).then((url) => {
          setUrl(url);
          setShowUploadButton(false);
        });
      }
    );
  };

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

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (checked.length <= 1)
      return alert("You must have more than 2 people in the group chat!");
    const unique_id = uuid();
    const people = users.filter((each) => checked.includes(each.name));
    const data = {
      id: unique_id,
      people: [...people, curUserProfile],
      messages: [],
      description: descriptionRef.current!.value,
      group_name: groupNameRef.current!.value,
      group_profile_pic: url,
      receiverHasRead: true,
    };
    await addDoc(groupsCollection, data);
    router.push("/");
  };

  return (
    <section className={classes.section}>
      <form className={classes.form} onSubmit={submitHandler}>
        <div className={classes.heading}>
          <h1>Create A Group</h1>
        </div>
        <div className={classes.content}>
          <header>
            <div className={classes.box}>
              {showUploadButton ? (
                <div>
                  <Button variant="contained" onClick={handleUpload}>
                    Upload
                  </Button>
                </div>
              ) : url ? (
                <div>
                  <img
                    src={url}
                    alt="group_pic"
                    className={classes.group_pic}
                  />
                </div>
              ) : (
                <label htmlFor="file">
                  Choose Photo
                  <AddAPhotoIcon color="primary" sx={{ fontSize: "3rem" }} />
                  <input
                    id="file"
                    type="file"
                    accept="image/*"
                    required
                    className={classes.input_file}
                    onChange={handleChange}
                  />
                </label>
              )}
            </div>
            <TextField
              label="Description"
              variant="filled"
              multiline
              rows={10}
              fullWidth
              required
              inputRef={descriptionRef}
            />
          </header>
          <main>
            <TextField
              label="Group Name"
              variant="filled"
              fullWidth
              required
              inputRef={groupNameRef}
            />
            <div className={classes.list}>
              <label>Choose Group Members</label>
              <List sx={{ height: "100%", overflow: "auto", width: "100%" }}>
                {users
                  ?.filter((user) => user.name !== curUser?.displayName)
                  .map((each: any) => (
                    <ListItem
                      key={each.id}
                      secondaryAction={
                        <Checkbox
                          onChange={handleToggle(each.name)}
                          checked={checked.indexOf(each.name) !== -1}
                        />
                      }
                      sx={{ padding: "0.8rem" }}
                    >
                      <ListItemAvatar>
                        <Avatar alt="profile_pic" src={each.profile_pic} />
                      </ListItemAvatar>
                      <ListItemText id={each.id} primary={each.name} />
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
