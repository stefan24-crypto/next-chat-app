import { Timestamp } from "firebase/firestore";
import React from "react";

interface GroupChat {
  id: string;
  members: string[];
  messages: Message[];
}

// interface Message {
//   id: string;
//   author: string;
//   time: Timestamp;
//   text: string;
// }

// export interface DM {
//   id: string;
//   receiver: string;
//   receiver_profile_pic: string;
//   messages: Message[];
//   receiverHasRead: boolean;
// }

export type Message = {
  id: string;
  text: string;
  to: string;
  time: Timestamp;
  author: string;
};

export interface DM {
  id: string;
  people: User[];
  messages: Message[] | [];
  receiverHasRead: boolean;
  description?: string;
}

export interface User {
  id: string;
  name: string;
  profile_pic: string;
}
