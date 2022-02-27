interface WithTimestamps {
  createdAt: number;
  editedAt: number;
}

export interface User extends WithTimestamps {
  _id: string;
  email: string;
  profile_photo?: string;
  cover_photo: string;
  password: string;
  facebookID: string;
  display_name?: string;
  description: string;
  first_name?: string;
  last_name?: string;
  friends: User[]; // ids;
  photos: Photo[];
}

export interface FriendRequest extends WithTimestamps {
  _id: string;
  from: User;
  to: User;
}

export interface Post extends WithTimestamps {
  _id: string;
  content: string;
  image: Photo;
  user: User;
  likes: User[];
}

export interface Photo extends WithTimestamps {
  id: string;
  url: string;
}

export interface Notification extends WithTimestamps {
  _id: string;
  to: User;
  from: User;
  clicked: boolean;
  url: string;
  type: string;
  message: string;
}

export interface Comment extends WithTimestamps {
  _id: string;
  content: string;
  user: User;
  post: Post;
  image: Photo;
  comment: Comment;
  likes: User[];
}
