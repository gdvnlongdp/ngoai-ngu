import { Role } from './role';
import { Profile } from './profile';

// ----------------------------------------------------------------------

export type User = {
  id: string;
  username: string;
  password: string;
  isBanned: boolean;
  role: Role;
  profile: Profile;
}