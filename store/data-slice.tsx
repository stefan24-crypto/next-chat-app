import { createSlice } from "@reduxjs/toolkit";
import { User } from "../models";



interface state {
  users: User[];
  curChatRoomID: string;
}

const initialState: state = {
  users: [],
  curChatRoomID: "",
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
  },
});

export const dataActions = dataSlice.actions;
export default dataSlice;
