import { useState } from 'react';
import uniq from 'lodash/uniq';
import flatten from 'lodash/flatten';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Button, Divider, Collapse, Typography } from '@mui/material';
// utils
import { fDateTime } from '../../../utils/formatTime';
import { getFileFullName, getFileThumb } from '../../../utils/getFileFormat';
// @types
import { Conversation, Message } from '../../../@types/chat';
// hooks
import useAuth from '../../../hooks/useAuth';
import useLocales from '../../../hooks/useLocales';
// components
import Iconify from '../../../components/Iconify';
import Scrollbar from '../../../components/Scrollbar';
import LightboxModal from '../../../components/LightboxModal';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  flexGrow: 1,
  height: '100%',
  display: 'flex',
  overflow: 'hidden',
  flexDirection: 'column',
  paddingBottom: theme.spacing(2),
}));

const FileItemStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginTop: theme.spacing(2),
  padding: theme.spacing(0, 2.5),
}));

const FileThumbStyle = styled('div')(({ theme }) => ({
  width: 40,
  height: 40,
  flexShrink: 0,
  display: 'flex',
  overflow: 'hidden',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.secondary,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.grey[500_16],
}));

const CollapseButtonStyle = styled(Button)(({ theme }) => ({
  ...theme.typography.overline,
  height: 40,
  flexShrink: 0,
  borderRadius: 0,
  padding: theme.spacing(1, 2),
  justifyContent: 'space-between',
  color: theme.palette.text.disabled,
}));

type Props = {
  conversation: Conversation;
  isCollapse: boolean;
  onCollapse: VoidFunction;
};

// ----------------------------------------------------------------------

export default function ChatRoomAttachment({ conversation, isCollapse, onCollapse }: Props) {
  const { translate } = useLocales();
  const { user } = useAuth();
  const totalAttachment = uniq(
    flatten(
      conversation.messages
        .filter((item) => !item.unsend && !item.removeFor.includes(user?.id))
        .map((item) => item.attachments)
    )
  ).length;

  const [openLightbox, setOpenLightbox] = useState(false);

  const [selectedImage, setSelectedImage] = useState<number>(0);

  const imagesLightbox = conversation.messages
    .filter((messages) => messages.contentType === 'image')
    .map((messages) => messages.body);

  const handleOpenLightbox = (url: string) => {
    const selectedImage = imagesLightbox.findIndex((index) => index === url);
    setOpenLightbox(true);
    setSelectedImage(selectedImage);
  };

  return (
    <RootStyle>
      <CollapseButtonStyle
        fullWidth
        color="inherit"
        onClick={onCollapse}
        endIcon={
          <Iconify
            icon={isCollapse ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'}
            width={16}
            height={16}
          />
        }
      >
        {translate('images')} ({totalAttachment})
      </CollapseButtonStyle>

      {!isCollapse && <Divider />}

      <Scrollbar>
        <Collapse in={isCollapse}>
          {conversation.messages
            .filter((item) => !item.unsend && !item.removeFor.includes(user?.id))
            .map((file) => (
              <div key={file.id} onClick={() => handleOpenLightbox(file.body)}>
                {file.attachments.map((fileUrl) => (
                  <AttachmentItem key={fileUrl} file={file} fileUrl={fileUrl} />
                ))}
              </div>
            ))}
        </Collapse>
      </Scrollbar>

      <LightboxModal
        images={imagesLightbox}
        mainSrc={imagesLightbox[selectedImage]}
        photoIndex={selectedImage}
        setPhotoIndex={setSelectedImage}
        isOpen={openLightbox}
        onCloseRequest={() => setOpenLightbox(false)}
      />
    </RootStyle>
  );
}

// ----------------------------------------------------------------------

type AttachmentItemProps = {
  file: Message;
  fileUrl: string;
};

function AttachmentItem({ file, fileUrl }: AttachmentItemProps) {
  return (
    <FileItemStyle key={fileUrl}>
      <FileThumbStyle>{getFileThumb(fileUrl)}</FileThumbStyle>
      <Box sx={{ ml: 1.5, maxWidth: 150 }}>
        <Typography variant="body2" noWrap>
          {getFileFullName(fileUrl)}
        </Typography>
        <Typography noWrap variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
          {fDateTime(file.createdAt)}
        </Typography>
      </Box>
    </FileItemStyle>
  );
}