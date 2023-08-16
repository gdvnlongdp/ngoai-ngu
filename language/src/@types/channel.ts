import { User } from './user';

// ----------------------------------------------------------------------

export type Channel = {
  id: string;
  name: string;
  members: User[],
  groups: number;
  description: string | null;
}