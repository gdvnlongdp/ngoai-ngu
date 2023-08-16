import { User } from './user';

// ----------------------------------------------------------------------

export type Code = {
  id: string;
  user: User;
  otp: string;
}