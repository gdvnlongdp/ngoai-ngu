// @mui
import { styled } from '@mui/material/styles';
import { Typography, DialogContent } from '@mui/material';
// @types
import { Participant } from '../../../@types/chat';
// components
import Avatar from '../../../components/Avatar';
import Iconify from '../../../components/Iconify';
import { DialogAnimate } from '../../../components/animate';
// hooks
import useLocales from '../../../hooks/useLocales';
// utils
import createAvatar from '../../../utils/createAvatar';

// ----------------------------------------------------------------------

const RowStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: theme.spacing(1.5),
}));

// ----------------------------------------------------------------------

type Props = {
  participant: Participant;
  isOpen: boolean;
  onClose: VoidFunction;
};

export default function ChatRoomPopup({ participant, isOpen, onClose }: Props) {
  const { translate } = useLocales();
  const { id, profile, role } = participant;

  return (
    <DialogAnimate fullWidth maxWidth="xs" open={isOpen} onClose={onClose}>
      <DialogContent sx={{ pb: 5, textAlign: 'center' }}>
        <Avatar
          src={profile.avatar}
          alt={id}
          color={profile.avatar ? 'default' : createAvatar(profile.name).color}
          sx={{
            mt: 5,
            mb: 2,
            mx: 'auto',
            width: 96,
            height: 96,
          }}
        >
          {createAvatar(profile.name).name}
        </Avatar>
        <Typography variant="h6">{profile.name}</Typography>
        <Typography variant="body2" paragraph sx={{ color: 'text.secondary' }}>
          {role.name}
        </Typography>

        <RowStyle sx={{ justifyContent: 'flex-start' }}>
          <Iconify
            icon={'eva:phone-fill'}
            sx={{ mr: 1, width: 16, height: 16, color: 'text.disabled' }}
          />
          <Typography variant="body2">{profile.phone}</Typography>
        </RowStyle>
        <RowStyle sx={{ justifyContent: 'flex-start' }}>
          <Iconify
            icon={'ph:gender-intersex-bold'}
            sx={{ mr: 1, width: 16, height: 16, color: 'text.disabled' }}
          />
          <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
            {translate(profile.gender)}
          </Typography>
        </RowStyle>
      </DialogContent>
    </DialogAnimate>
  );
}
