
export interface User {
  id: string;
  name: string;
  role: string;
  avatarColor: string;
  initials: string;
}

export interface Message {
  id: number;
  text: string;
  sender: 'user' | string; // 'user' or user.id
}
