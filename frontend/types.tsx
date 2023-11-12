export type User = {
  id: number;
  username: string;
  full_name: string;
};

export type UserCreate = {
  username: string;
  password: string;
  full_name: string;
}

export type Message = {
  content: string;
  conversation_id?: number;
  user_id: number;
}

export type Conversation = {
  user: User;
  conversation_id: number;
  created_at: string;
}