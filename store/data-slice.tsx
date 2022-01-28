import { createSlice } from "@reduxjs/toolkit";
import { User, DM, Group } from "../models";

interface state {
  users: User[];
  curChatRoomID: string;
  dms: DM[] | Group[];
}

const initialState: state = {
  users: [],
  curChatRoomID: "",
  dms: [],
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setUsers(state, action) {
      state.users = action.payload;
    },
    setCurChatRoomID(state, action) {
      state.curChatRoomID = action.payload;
    },
    setDMs(state, action) {
      state.dms = action.payload;
    },
  },
});

export const dataActions = dataSlice.actions;
export default dataSlice;
