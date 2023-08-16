import { useEffect, useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Stack, Input, Divider, IconButton, InputAdornment, Tooltip } from '@mui/material';
// @types
import { SendMessage } from '../../../@types/chat';
// redux
import { socket } from '../../../redux/slices/chat';
// hooks
import useLocales from '../../../hooks/useLocales';
import useAuth from '../../../hooks/useAuth';
// components
import Iconify from '../../../components/Iconify';
import EmojiPicker from '../../../components/EmojiPicker';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  minHeight: 56,
  display: 'flex',
  position: 'relative',
  alignItems: 'center',
  paddingLeft: theme.spacing(2),
}));

// ----------------------------------------------------------------------

type Props = {
  disabled: boolean;
  conversationId: string | null;
  onSend: (data: SendMessage) => void;
};

export default function ChatMessageInput({ disabled, conversationId, onSend }: Props) {
  const { translate } = useLocales();
  const { user } = useAuth();

  const [activeImage, setActiveImage] = useState(false);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSend();
      setIsTyping(false);
    } else {
      if (!isTyping) {
        setIsTyping(true);
      }
    }
  };

  const handleSetActiveImage = () => {
    setActiveImage(!activeImage);
  };

  const handleSend = () => {
    if (!message) {
      return '';
    }
    if (onSend && conversationId) {
      onSend({
        conversationId,
        message,
        contentType: activeImage ? 'image' : 'text',
        senderId: user?.id,
      });
    }
    return setMessage('');
  };

  useEffect(() => {
    socket.on('listen_is_typing', ({ isTyping, user: currentUser }) => {
      if (user?.id !== currentUser.id) {
        setIsTyping(false);
      }
    });
  }, [user?.id]);

  useEffect(() => {
    if (isTyping) {
      setTimeout(() => setIsTyping(false), 4000);
    }

    socket.emit('is_typing', {
      isTyping,
      conversationId,
      user: {
        id: user?.id,
        name: user?.profile?.name,
      },
    });
  }, [isTyping, conversationId, user]);

  return (
    <RootStyle>
      <Input
        disabled={disabled}
        fullWidth
        value={message}
        disableUnderline
        onKeyUp={handleKeyUp}
        onChange={(event) => setMessage(event.target.value)}
        placeholder={translate(activeImage ? 'paste_image_link_here' : 'type_a_message')}
        startAdornment={
          <InputAdornment position="start">
            <EmojiPicker disabled={disabled || activeImage} value={message} setValue={setMessage} />
          </InputAdornment>
        }
        endAdornment={
          <Stack direction="row" spacing={1} sx={{ flexShrink: 0, mr: 1.5 }}>
            <Tooltip title={translate('images')}>
              <span>
                <IconButton
                  disabled={disabled}
                  size="small"
                  color={activeImage ? 'primary' : 'default'}
                  onClick={handleSetActiveImage}
                >
                  <Iconify icon="ic:round-add-photo-alternate" width={22} height={22} />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        }
      />

      <Divider orientation="vertical" flexItem />

      <IconButton
        color="primary"
        disabled={disabled || !message}
        onClick={handleSend}
        sx={{ mx: 1 }}
      >
        <Iconify icon="ic:round-send" width={22} height={22} />
      </IconButton>
    </RootStyle>
  );
}
