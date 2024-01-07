import { IComment } from "../../../server/models/comments";

export interface Post {
  _id: string;
  image?: {
    url?: string;
  };
  user: string | User;
  likes: string[];
  likesCount: number;
  content: string;
  commentsCount: number;
  createdAt?: string;
}

export interface Notification {
  _id: string;
  to: string;
  from: string;
  clicked: boolean;
  url: string;
  type: string;
  message: string;
}

export interface FriendRequest {
  _id: string;
  to: string;
  from: string;
}

export interface User {
  _id: string;
  email: string;
  profile_photo: string;
  cover_photo: string;
  description: string;
  facebookID: string;
  display_name: string;
  first_name: string;
  last_name: string;
  friends: string[];
  photos: any;
}

export interface Comment {
  _id: string;
  content: string;
  user: string;
  image: any;
  comment: string;
  post: string;
  likes: string[];
  commentsCount: number;
}

// TYPE GUARDS
// for populated fields

// GENERIC

export function isComment(obj: User | any): obj is IComment {
  return obj && obj._id;
}

export function isUser(obj: User | any): obj is User {
  return obj && obj.first_name && typeof obj.first_name === "string";
}
