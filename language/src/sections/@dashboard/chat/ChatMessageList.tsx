import { useEffect, useState, useRef } from 'react';
// @mui
import { Divider, Typography } from '@mui/material';
// @types
import { Conversation, Message } from '../../../@types/chat';
// hooks
import useAuth from '../../../hooks/useAuth';
import useLocales from '../../../hooks/useLocales';
// redux
import { dispatch } from '../../../redux/store';
import { removeForEveryone, removeForYou, socket, unSend } from '../../../redux/slices/chat';
//
import Scrollbar from '../../../components/Scrollbar';
import LightboxModal from '../../../components/LightboxModal';
import Iconify from '../../../components/Iconify';
import ChatMessageItem from './ChatMessageItem';

// ----------------------------------------------------------------------

import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import { styled, alpha } from '@mui/material/styles';

import { addMinutes, isAfter } from 'date-fns';

type Props = {
  conversation: Conversation;
};

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    '& .MuiList-root': {
      paddingTop: '4px',
      paddingBottom: '4px',
      '& .MuiMenuItem-root': {
        '&:hover': {
          color: theme.palette.primary.main,
        },
        '& .MuiBox-root': {
          width: 12,
          height: 12,
          marginRight: theme.spacing(1.5),
        },
        '&:active': {
          backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
        },
      },
    },
  },
}));

export default function ChatMessageList({ conversation }: Props) {
  const { user } = useAuth();
  const { translate } = useLocales();

  const scrollRef = useRef<HTMLDivElement>(null);

  const [isMe, setIsMe] = useState<boolean>(false);
  const [message, setMessage] = useState<Message | null>(null);

  const [userTyping, setUserTyping] = useState<any>(null);

  const [openLightbox, setOpenLightbox] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number>(0);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSetIsMe = (value: boolean, message: Message) => {
    setMessage(message);
    setIsMe(value);
  };

  useEffect(() => {
    const scrollMessagesToBottom = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    };
    scrollMessagesToBottom();
  }, [conversation.messages.length]);

  const imagesLightbox = conversation.messages
    .filter((messages) => messages.contentType === 'image')
    .map((messages) => messages.body);

  const handleOpenLightbox = (url: string) => {
    const selectedImage = imagesLightbox.findIndex((index) => index === url);
    setOpenLightbox(true);
    setSelectedImage(selectedImage);
  };

  useEffect(() => {
    socket.on('listen_is_typing', ({ isTyping, user }) => {
      setUserTyping(isTyping ? user : null);
    });
  }, []);

  const handleUnSend = () => {
    if (message?.id) {
      dispatch(unSend(conversation.id, message.id));
    }
    handleClose();
  };
  const handleRemoveForYou = () => {
    if (message?.id) {
      dispatch(removeForYou(conversation.id, message.id));
    }
    handleClose();
  };

  const handleRemoveForEveryone = () => {
    if (message?.id) {
      dispatch(removeForEveryone(conversation.id, message.id));
    }
    handleClose();
  };

  return (
    <>
      <Scrollbar scrollableNodeProps={{ ref: scrollRef }} sx={{ p: 3, height: 1 }}>
        {conversation.messages.map((message) => (
          <ChatMessageItem
            key={message.id}
            message={message}
            conversation={conversation}
            onOpenLightbox={handleOpenLightbox}
            handleSetIsMe={handleSetIsMe}
            moreButton={
              <IconButton
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                sx={{ mx: 1 }}
              >
                <Iconify icon="eva:more-horizontal-fill" width={14} height={14} />
              </IconButton>
            }
          />
        ))}
      </Scrollbar>

      {userTyping && user?.id !== userTyping.id && (
        <Typography variant="caption" sx={{ px: 1 }}>
          {userTyping.name} {translate('is_typing')}
        </Typography>
      )}

      <StyledMenu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuList dense>
          {isMe && (
            <div>
              <MenuItem
                onClick={handleUnSend}
                disableRipple
                disabled={
                  message?.unsend ||
                  (message !== null &&
                    isAfter(new Date(), addMinutes(new Date(message.createdAt), 10)))
                }
              >
                <Iconify icon={'icon-park-outline:undo'} color="blueviolet" />
                {translate('unsend')}
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={handleRemoveForEveryone}
                disableRipple
                disabled={
                  message !== null &&
                  isAfter(new Date(), addMinutes(new Date(message.createdAt), 10))
                }
              >
                <Iconify icon={'ant-design:usergroup-delete-outlined'} color="red" />
                {translate('remove_for_everyone')}
              </MenuItem>
            </div>
          )}
          <MenuItem onClick={handleRemoveForYou} disableRipple>
            <Iconify icon={'ant-design:user-delete-outlined'} color="red" />
            {translate('remove_for_you')}
          </MenuItem>
        </MenuList>
      </StyledMenu>

      <LightboxModal
        images={imagesLightbox}
        mainSrc={imagesLightbox[selectedImage]}
        photoIndex={selectedImage}
        setPhotoIndex={setSelectedImage}
        isOpen={openLightbox}
        onCloseRequest={() => setOpenLightbox(false)}
      />
    </>
  );
}
