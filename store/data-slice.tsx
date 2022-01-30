import { createSlice } from "@reduxjs/toolkit";
import { User, DM, Group } from "../models";

interface state {
  users: User[];
  curChatRoomID: string;
  dms: DM[];
  groups: Group[];
}

const initialState: state = {
  users: [],
  curChatRoomID: "",
  dms: [],
  groups: [],
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
    setGroups(state, action) {
      state.groups = action.payload;
    },
  },
});

export const dataActions = dataSlice.actions;
export default dataSlice;
