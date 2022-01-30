import { Timestamp } from "firebase/firestore";

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
  to: string | string[];
  time: Timestamp;
  author: string;
};

export interface DM {
  id: string;
  people: User[];
  messages: Message[] | [];
  receiverHasRead: boolean;
}

// interface MemberOfGroup {
//   id: string;
//   name: string;
//   profile_pic: string;
//   hasRead: boolean;
// }

export interface Group {
  id: string;
  people: User[];
  messages: Message[] | [];
  description: string;
  group_name: string;
  group_profile_pic: string;
}

export interface User {
  id: string;
  name: string;
  profile_pic: string;
}
