// @mui
import { styled } from '@mui/material/styles';
import { Box, Typography, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material';
// @types
import { Conversation } from '../../../@types/chat';
//
import Avatar from '../../../components/Avatar';
import SearchNotFound from '../../../components/SearchNotFound';
// utils
import createAvatar from '../../../utils/createAvatar';
import useAuth from '../../../hooks/useAuth';
import useLocales from '../../../hooks/useLocales';

// ----------------------------------------------------------------------

const AVATAR_SIZE = 48;
const AVATAR_SIZE_GROUP = 32;

const RootStyle = styled(ListItemButton)(({ theme }) => ({
  padding: theme.spacing(1.5, 3),
  transition: theme.transitions.create('all'),
}));

const AvatarWrapperStyle = styled('div')(({ theme }) => ({
  position: 'relative',
  width: AVATAR_SIZE,
  height: AVATAR_SIZE,
  '& .MuiAvatar-img': { borderRadius: '50%' },
  '& .MuiAvatar-root': { width: '100%', height: '100%' },
}));

// ----------------------------------------------------------------------

type Props = {
  query: string;
  results: Conversation[];
  onSelectConversation: (conversation: Conversation) => void;
};

export default function ChatSearchResults({ query, results, onSelectConversation }: Props) {
  const { translate } = useLocales();
  const { user } = useAuth();

  const isFound = results.length > 0;

  return (
    <>
      <Typography paragraph variant="subtitle1" sx={{ px: 3, color: 'text.secondary' }}>
        {translate('conversations')}
      </Typography>

      {results.map((conversation) => {
        const otherParticipants = conversation.participants.filter(
          (participant) => participant.id !== user?.id
        );

        const isGroup = otherParticipants.length > 2;
        const displayNames = otherParticipants
          .map((participant: any) => participant.profile.name)
          .join(', ');

        return (
          <RootStyle key={conversation.id} onClick={() => onSelectConversation(conversation)}>
            <ListItemAvatar>
              <Box
                sx={{
                  ...(isGroup && {
                    position: 'relative',
                    width: AVATAR_SIZE,
                    height: AVATAR_SIZE,
                    '& .avatarWrapper': {
                      position: 'absolute',
                      width: AVATAR_SIZE_GROUP,
                      height: AVATAR_SIZE_GROUP,
                      '&:nth-of-type(1)': {
                        left: 0,
                        zIndex: 9,
                        bottom: 2,
                        '& .MuiAvatar-root': {
                          border: (theme) => `solid 2px ${theme.palette.background.paper}`,
                        },
                      },
                      '&:nth-of-type(2)': { top: 2, right: 0 },
                    },
                  }),
                }}
              >
                {otherParticipants.slice(0, 2).map((participant: any) => (
                  <AvatarWrapperStyle className="avatarWrapper" key={participant.id}>
                    <Avatar
                      src={participant.profile.avatar}
                      alt={participant.id}
                      color={
                        participant.profile.avatar
                          ? 'default'
                          : createAvatar(participant.profile.name).color
                      }
                    >
                      {createAvatar(participant.profile.name).name}
                    </Avatar>
                  </AvatarWrapperStyle>
                ))}
              </Box>
            </ListItemAvatar>

            <ListItemText
              primary={displayNames}
              primaryTypographyProps={{
                noWrap: true,
                variant: 'subtitle2',
              }}
            />
          </RootStyle>
        );
      })}

      {!isFound && (
        <SearchNotFound
          searchQuery={query}
          sx={{
            p: 3,
            mx: 'auto',
            width: `calc(100% - 48px)`,
            bgcolor: 'background.neutral',
          }}
        />
      )}
    </>
  );
}
