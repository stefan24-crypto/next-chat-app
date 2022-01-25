import { useRef, useState } from "react";
import classes from "./Login.module.css";
import { Paper, Typography, TextField, Button } from "@mui/material";
import WhatsApp from "@mui/icons-material/WhatsApp";
import { auth, storage, db } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { User } from "../../models";
import { setDoc, doc } from "@firebase/firestore";
import { useRouter } from "next/router";
import { useAppDispatch } from "../../store/hooks";
import { dataActions } from "../../store/data-slice";

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(false);
  const emailRef = useRef<HTMLInputElement>();
  const passwordRef = useRef<HTMLInputElement>();
  const UsernameRef = useRef<HTMLInputElement>();
  const [image, setImage] = useState<any>(null);
  const [url, setUrl] = useState("");
  const dispatch = useAppDispatch();

  //Handing Image
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      setImage(e.target.files![0]);
    }
  };

  const handleUpload = async () => {
    const storageRef = ref(storage, `images/${image?.name}`);
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
        });
      }
    );
  };

  //Submitting Form
  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = emailRef.current!.value;
    const password = passwordRef.current!.value;
    if (!isLogin) {
      const username = UsernameRef.current!.value;
      const profile_pic = url;
      console.log(url);
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        if (!auth.currentUser) return;
        await updateProfile(auth.currentUser, {
          displayName: username,
          photoURL: profile_pic,
        });
      } catch (error) {
        alert(error);
      }
      //Add User Data
      const userData: User = {
        id: auth.currentUser!.uid,
        name: username,
        profile_pic: profile_pic,
      };
      await setDoc(doc(db, "users", auth.currentUser!.uid), userData);
    } else {
      signInWithEmailAndPassword(auth, email, password).catch((error) =>
        alert(error.message)
      );
    }
    dispatch(dataActions.setCurChatRoomID(""));
    // router.push(`/${auth!.currentUser!.uid}`);
  };

  return (
    <>
      <section className={classes.section}>
        <div className={classes.heading}>
          <h1>WhatsApp</h1>
          <WhatsApp sx={{ fontSize: "3rem" }} />
        </div>
        <Paper elevation={3} className={classes.paper}>
          <form onSubmit={submitHandler}>
            <Typography
              variant="h4"
              sx={{ display: "flex", justifyContent: "center" }}
            >
              {isLogin ? "Log In" : "Sign Up"}
            </Typography>
            <div className={classes.inputs}>
              <TextField
                id="standard-basic"
                label="Email"
                variant="standard"
                fullWidth
                required
                inputRef={emailRef}
              />
              <TextField
                id="standard-basic"
                label="Password"
                variant="standard"
                fullWidth
                required
                inputRef={passwordRef}
              />
              {!isLogin && (
                <div className={classes.extra}>
                  <div className={classes.input}>
                    <TextField
                      id="standard-basic"
                      label="Username"
                      variant="standard"
                      fullWidth
                      required
                      inputRef={UsernameRef}
                    />
                  </div>

                  <div className={classes.file}>
                    {url ? (
                      <img src={url} alt="selected" className={classes.img} />
                    ) : (
                      <>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleChange}
                          required
                        />
                        <Button variant="contained" onClick={handleUpload}>
                          Upload
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className={classes.btns}>
              <Button variant="contained" fullWidth type="submit">
                {isLogin ? "Log In" : "Sign Up"}
              </Button>
            </div>
            {isLogin ? (
              <footer className={classes.footer}>
                <Typography variant="subtitle2">Need an Account?</Typography>
                <p className={classes.signUp} onClick={() => setIsLogin(false)}>
                  Sign Up
                </p>
              </footer>
            ) : (
              <footer className={classes.footer}>
                <Typography variant="subtitle2">
                  Already Have An Account?
                </Typography>
                <p className={classes.signUp} onClick={() => setIsLogin(true)}>
                  Log In
                </p>
              </footer>
            )}
          </form>
        </Paper>
      </section>
    </>
  );
};

export default Login;
