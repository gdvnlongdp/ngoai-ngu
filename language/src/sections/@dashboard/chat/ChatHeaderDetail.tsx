// @mui
import { styled } from '@mui/material/styles';
import { Box, Link, Typography, AvatarGroup, IconButton } from '@mui/material';
// @types
import { Participant } from '../../../@types/chat';
// components
import Avatar from '../../../components/Avatar';
import Iconify from '../../../components/Iconify';
// hooks
import useLocales from '../../../hooks/useLocales';
// utils
import createAvatar from '../../../utils/createAvatar';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  flexShrink: 0,
  minHeight: 92,
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 3),
}));

// ----------------------------------------------------------------------

type Props = {
  participants: Participant[];
};

export default function ChatHeaderDetail({ participants }: Props) {
  const isGroup = participants.length > 1;

  return (
    <RootStyle>
      {isGroup ? (
        <GroupAvatar participants={participants} />
      ) : (
        <OneAvatar participants={participants} />
      )}

      <Box sx={{ flexGrow: 1 }} />
      <IconButton>
        <Iconify icon="eva:phone-fill" width={20} height={20} />
      </IconButton>
      <IconButton>
        <Iconify icon="eva:video-fill" width={20} height={20} />
      </IconButton>
      <IconButton>
        <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
      </IconButton>
    </RootStyle>
  );
}

// ----------------------------------------------------------------------

function OneAvatar({ participants }: Props) {
  const participant = [...participants][0];

  if (participant === undefined) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ position: 'relative' }}>
        <Avatar
          src={participant.profile.avatar}
          alt={participant.id}
          color={
            participant.profile.avatar ? 'default' : createAvatar(participant.profile.name).color
          }
        >
          {createAvatar(participant.profile.name).name}
        </Avatar>
      </Box>
      <Box sx={{ ml: 2 }}>
        <Typography variant="subtitle2">{participant.profile.name}</Typography>
      </Box>
    </Box>
  );
}

// ----------------------------------------------------------------------

function GroupAvatar({ participants }: Props) {
  const { translate } = useLocales();
  return (
    <div>
      <AvatarGroup
        max={3}
        sx={{
          mb: 0.5,
          '& .MuiAvatar-root': { width: 32, height: 32 },
        }}
      >
        {participants.map((participant) => (
          <Avatar
            key={participant.id}
            src={participant.profile.avatar}
            alt={participant.id}
            color={
              participant.profile.avatar ? 'default' : createAvatar(participant.profile.name).color
            }
          >
            {createAvatar(participant.profile.name).name}
          </Avatar>
        ))}
      </AvatarGroup>
      <Link
        variant="body2"
        underline="none"
        component="button"
        color="text.secondary"
        onClick={() => {}}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {participants.length} {translate('persons')}
          <Iconify icon="eva:arrow-ios-forward-fill" />
        </Box>
      </Link>
    </div>
  );
}
