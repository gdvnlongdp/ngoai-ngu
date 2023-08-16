import { ReactNode } from 'react';
import { formatDistanceToNowStrict } from 'date-fns';
import { vi, enUS } from 'date-fns/locale';
// @mui
import { styled } from '@mui/material/styles';
import { Avatar, Box, Typography, Stack } from '@mui/material';
// @types
import { Conversation, Message } from '../../../@types/chat';
// hooks
import useAuth from '../../../hooks/useAuth';
import useLocales from '../../../hooks/useLocales';
// components
import Image from '../../../components/Image';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(3),
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 320,
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.neutral,
}));

const InfoStyle = styled(Typography)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(0.75),
  color: theme.palette.text.secondary,
}));

const StackStyle = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(1.5),
  marginTop: theme.spacing(0.5),
  '#menu': {
    visibility: 'hidden',
  },
  '&:hover #menu': {
    visibility: 'visible',
  },
}));

// ----------------------------------------------------------------------

type Props = {
  message: Message;
  conversation: Conversation;
  onOpenLightbox: (value: string) => void;
  moreButton: ReactNode;
  handleSetIsMe: (value: boolean, message: Message) => void;
};

export default function ChatMessageItem({
  message,
  conversation,
  onOpenLightbox,
  moreButton,
  handleSetIsMe,
}: Props) {
  const { translate } = useLocales();
  const { user } = useAuth();
  const { currentLang } = useLocales();

  const sender = conversation.participants.find(
    (participant) => participant.id === message.senderId
  );

  const senderDetails =
    message.senderId === user?.id
      ? { type: 'me' }
      : {
          avatar: sender?.profile.avatar,
          name: sender?.profile.name,
        };

  const isMe = senderDetails.type === 'me';
  const isImage = message.contentType === 'image';
  const firstName = senderDetails.name && senderDetails.name.split(' ')[0];
  const exceptYou = message.removeFor.includes(user?.id);
  if (exceptYou) {
    return null;
  }

  return (
    <RootStyle
      sx={{
        ...(!message.senderId && { justifyContent: 'center' }),
      }}
    >
      <Box
        sx={{
          display: 'flex',
          ...(isMe && {
            ml: 'auto',
          }),
        }}
      >
        {senderDetails.type !== 'me' && senderDetails.avatar && (
          <Avatar
            alt={senderDetails.name}
            src={senderDetails.avatar}
            sx={{ width: 32, height: 32, mr: 2 }}
          />
        )}

        <div>
          <InfoStyle
            variant="caption"
            sx={{
              ...(isMe && { justifyContent: 'flex-end' }),
            }}
          >
            {message.senderId ? (
              <>
                {!isMe && `${firstName},`}&nbsp;
                {formatDistanceToNowStrict(new Date(message.createdAt), {
                  addSuffix: true,
                  locale: currentLang.value === 'vn' ? vi : enUS,
                })}
              </>
            ) : (
              message.body
            )}
          </InfoStyle>

          {message.senderId && (
            <StackStyle
              direction={isMe ? 'row' : 'row-reverse'}
              justifyContent="center"
              alignItems="center"
            >
              <div id="menu" onClick={() => handleSetIsMe(isMe, message)}>
                {moreButton}
              </div>
              {!message.unsend ? (
                <ContentStyle
                  sx={{
                    ...(isMe && { color: 'grey.800', bgcolor: 'primary.lighter' }),
                    ...(isImage && { p: 0 }),
                  }}
                >
                  {isImage ? (
                    <Image
                      alt="attachment"
                      src={message.body}
                      onClick={() => onOpenLightbox(message.body)}
                      sx={{ borderRadius: 1, cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
                    />
                  ) : (
                    <Typography variant="body2">{message.body}</Typography>
                  )}
                </ContentStyle>
              ) : (
                <ContentStyle
                  sx={{
                    ...(isMe && { color: 'grey.800', bgcolor: 'primary.lighter' }),
                  }}
                >
                  <Typography variant="body2">{translate('message_was_unsend')}</Typography>
                </ContentStyle>
              )}
            </StackStyle>
          )}
        </div>
      </Box>
    </RootStyle>
  );
}
