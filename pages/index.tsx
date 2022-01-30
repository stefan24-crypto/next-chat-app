import { NextPage } from "next";
import Layout from "../components/Layout/Layout";
import Head from "next/head";
import { useRouter } from "next/router";
import Login from "../components/Login/Login";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { auth } from "../firebase";
import { onSnapshot, doc, collection } from "firebase/firestore";
import { authActions } from "../store/auth-slice";
import { dataActions } from "../store/data-slice";
import { db } from "../firebase";
import { CircularProgress } from "@mui/material";

const Home: NextPage = () => {
  const dispatch = useAppDispatch();
  const curUser = useAppSelector((state) => state.auth.curUser);
  const groups = useAppSelector((state) => state.data.groups);

  //Authentication
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch(authActions.setCurUser(authUser));
      } else {
        dispatch(authActions.setCurUser(null));
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  //Data
  useEffect(() => {
    onSnapshot(collection(db, "users"), (snapshot) => {
      snapshot.docs.map((doc) =>
        dispatch(
          dataActions.setUsers(
            snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
          )
        )
      );
    });
  }, []);

  useEffect(() => {
    onSnapshot(collection(db, "dms"), (snapshot) => {
      snapshot.docs.map((doc) =>
        dispatch(
          dataActions.setDMs(
            snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
          )
        )
      );
    });
  }, []);

  useEffect(() => {
    onSnapshot(collection(db, "groups"), (snapshot) => {
      snapshot.docs.map((doc) =>
        dispatch(
          dataActions.setGroups(
            snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
          )
        )
      );
    });
  }, []);

  return (
    <div>
      <Head>
        <title>WhatsApp</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="shortcut icon" href="whatsapp.png" type="image/x-icon" />
      </Head>
      {curUser ? <Layout /> : <Login />}
    </div>
  );
};

export default Home;
