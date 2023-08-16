import { Channel } from './channel';
import { User } from './user';

// ----------------------------------------------------------------------

export type Group = {
  id: string;
  name: string;
  channel: Channel;
  members: User[];
  description: string | null;
}