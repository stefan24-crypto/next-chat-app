import { useEffect } from "react";
import CreateGroup from "../../components/GroupChat/CreateGroup";
import Head from "next/head";
import { db } from "../../firebase";
import { onSnapshot, collection } from "firebase/firestore";
import { dataActions } from "../../store/data-slice";
import { useAppDispatch } from "../../store/hooks";

const MakeGroupPage = () => {
  const dispatch = useAppDispatch();
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

  return (
    <div>
      <Head>
        <title>WhatsApp</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="shortcut icon" href="whatsapp.png" type="image/x-icon" />
      </Head>
      <CreateGroup />
    </div>
  );
};

export default MakeGroupPage;
