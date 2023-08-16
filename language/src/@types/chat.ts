import { User } from './user';

// ----------------------------------------------------------------------

export type Participant = User;

export type Message = {
  id: string;
  body: string;
  contentType: 'text' | 'image';
  attachments: string[];
  createdAt: Date;
  senderId: string;
  unsend: boolean;
  removeFor: User[];
};

export type Conversation = {
  id: string;
  participants: Participant[];
  type: string;
  unread: Participant[];
  messages: Message[];
};

export type SendMessage = {
  conversationId: string;
  message: string;
  contentType: 'text' | 'image';
  senderId: string;
};
