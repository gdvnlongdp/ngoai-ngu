// hooks
import useAuth from '../hooks/useAuth';
// utils
import createAvatar from '../utils/createAvatar';
//
import Avatar, { Props as AvatarProps } from './Avatar';

// ----------------------------------------------------------------------

export default function MyAvatar({ ...other }: AvatarProps) {
  const { user } = useAuth();
  const { name, avatar } = user?.profile;

  return (
    <Avatar
      src={avatar}
      alt={name}
      color={avatar ? 'default' : createAvatar(name).color}
      {...other}
    >
      {createAvatar(name).name}
    </Avatar>
  );
}
