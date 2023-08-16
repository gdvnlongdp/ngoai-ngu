import { formatDistanceToNowStrict } from 'date-fns';
import { vi, enUS } from 'date-fns/esm/locale';
// @mui
import { styled } from '@mui/material/styles';
import { Box, ListItemButton, ListItemText, ListItemAvatar } from '@mui/material';
// @types
import { Conversation } from '../../../@types/chat';
//
import useAuth from '../../../hooks/useAuth';
import BadgeStatus from '../../../components/BadgeStatus';
import useLocales from '../../../hooks/useLocales';
// components
import Avatar from '../../../components/Avatar';
// utils
import createAvatar from '../../../utils/createAvatar';

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
  isSelected: boolean;
  conversation: Conversation;
  isOpenSidebar: boolean;
  onSelectConversation: VoidFunction;
};

export default function ChatConversationItem({
  isSelected,
  conversation,
  isOpenSidebar,
  onSelectConversation,
}: Props) {
  const { user } = useAuth();
  const { translate } = useLocales();
  const { currentLang } = useLocales();

  const getDetails = (conversation: Conversation, currentUserId: string) => {
    const otherParticipants = conversation.participants.filter(
      (participant) => participant.id !== currentUserId
    );

    const displayNames = otherParticipants
      .map((participant) => participant.profile.name)
      .join(', ');

    let displayText = '';

    // Filter message.removeFor have user?.id
    const _messages = conversation.messages.filter((item) => !item.removeFor.includes(user?.id));

    const lastMessage = _messages[_messages.length - 1];
    if (lastMessage) {
      const sender = lastMessage.senderId === currentUserId ? translate('you') : '';
      const message =
        lastMessage.contentType === 'image' ? translate('sent_a_photo') : lastMessage.body;
      displayText = `${sender}${lastMessage.unsend ? translate('message_was_unsend') : message}`;
    }
    return { otherParticipants, displayNames, displayText };
  };

  const details = getDetails(conversation, user?.id);

  const displayLastActivity = conversation.messages[conversation.messages.length - 1].createdAt;

  const isGroup = details.otherParticipants.length > 1;
  const isUnread = conversation.unread.find((id) => id === user?.id);
  const isOnlineGroup =
    isGroup && details.otherParticipants.map((item: any) => item.status).includes('online');

  return (
    <RootStyle
      onClick={onSelectConversation}
      sx={{
        ...(isSelected && { bgcolor: 'action.selected' }),
      }}
    >
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
          {details.otherParticipants.slice(0, 2).map((participant: any) => (
            <AvatarWrapperStyle className="avatarWrapper" key={participant.id}>
              <Avatar
                src={participant.profile.avatar}
                alt={participant.id}
                color={participant.profile.avatar ? 'default' : createAvatar(participant.profile.name).color}
              >
                {createAvatar(participant.profile.name).name}
              </Avatar>
              {!isGroup && participant?.status && (
                <BadgeStatus
                  status={participant.status}
                  sx={{ right: 2, bottom: 2, position: 'absolute' }}
                />
              )}
            </AvatarWrapperStyle>
          ))}

          {isOnlineGroup && (
            <BadgeStatus status="online" sx={{ right: 2, bottom: 2, position: 'absolute' }} />
          )}
        </Box>
      </ListItemAvatar>

      {isOpenSidebar && (
        <>
          <ListItemText
            primary={details.displayNames}
            primaryTypographyProps={{
              noWrap: true,
              variant: 'subtitle2',
            }}
            secondary={details.displayText}
            secondaryTypographyProps={{
              noWrap: true,
              variant: isUnread ? 'subtitle2' : 'body2',
              color: isUnread ? 'textPrimary' : 'textSecondary',
            }}
          />

          <Box
            sx={{
              ml: 2,
              height: 44,
              display: 'flex',
              alignItems: 'flex-end',
              flexDirection: 'column',
            }}
          >
            <Box
              sx={{
                mb: 1.25,
                fontSize: 12,
                lineHeight: '22px',
                whiteSpace: 'nowrap',
                color: 'text.disabled',
              }}
            >
              {formatDistanceToNowStrict(new Date(displayLastActivity), {
                addSuffix: false,
                locale: currentLang.value === 'vn' ? vi : enUS,
              })}
            </Box>
            {isUnread && <BadgeStatus status="unread" size="small" />}
          </Box>
        </>
      )}
    </RootStyle>
  );
}

// ----------------------------------------------------------------------
