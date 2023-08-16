// @mui
import { styled } from '@mui/material/styles';
import {
  Box,
  List,
  Button,
  Collapse,
  ListItemText,
  ListItemAvatar,
  ListItemButton,
} from '@mui/material';
// @types
import { Participant as TParticipant } from '../../../@types/chat';
// hooks
import useLocales from '../../../hooks/useLocales';
// components
import Avatar from '../../../components/Avatar';
import Iconify from '../../../components/Iconify';
import Scrollbar from '../../../components/Scrollbar';
//
import ChatRoomPopup from './ChatRoomPopup';
// utils
import createAvatar from '../../../utils/createAvatar';

// ----------------------------------------------------------------------

const HEIGHT = 64;

const CollapseButtonStyle = styled(Button)(({ theme }) => ({
  ...theme.typography.overline,
  height: 40,
  borderRadius: 0,
  padding: theme.spacing(1, 2),
  justifyContent: 'space-between',
  color: theme.palette.text.disabled,
}));

type Props = {
  participants: TParticipant[];
  selectUserId: string | null;
  onShowPopupUserInfo: (id: string | null) => void;
  isCollapse: boolean;
  onCollapse: VoidFunction;
};

// ----------------------------------------------------------------------

export default function ChatRoomGroupParticipant({
  participants,
  selectUserId,
  onShowPopupUserInfo,
  isCollapse,
  onCollapse,
}: Props) {
  const { translate } = useLocales();

  return (
    <>
      <CollapseButtonStyle
        fullWidth
        disableRipple
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
        {translate('in_room')} ({participants.length})
      </CollapseButtonStyle>

      <Box sx={{ height: isCollapse ? HEIGHT * 4 : 0 }}>
        <Scrollbar>
          <Collapse in={isCollapse} sx={{ height: isCollapse ? HEIGHT * 4 : 0 }}>
            <List disablePadding>
              {participants.map((participant) => (
                <Participant
                  key={participant.id}
                  participant={participant}
                  isOpen={selectUserId === participant.id}
                  onShowPopup={() => onShowPopupUserInfo(participant.id)}
                  onClosePopup={() => onShowPopupUserInfo(null)}
                />
              ))}
            </List>
          </Collapse>
        </Scrollbar>
      </Box>
    </>
  );
}

// ----------------------------------------------------------------------

type ParticipantProps = {
  participant: TParticipant;
  isOpen: boolean;
  onClosePopup: VoidFunction;
  onShowPopup: VoidFunction;
};

function Participant({ participant, isOpen, onClosePopup, onShowPopup }: ParticipantProps) {
  const { id, profile, role } = participant;

  return (
    <>
      <ListItemButton onClick={onShowPopup} sx={{ height: HEIGHT, px: 2.5 }}>
        <ListItemAvatar>
          <Box sx={{ position: 'relative', width: 40, height: 40 }}>
            <Avatar
              src={profile.avatar}
              alt={id}
              color={profile.avatar ? 'default' : createAvatar(profile.name).color}
            >
              {createAvatar(profile.name).name}
            </Avatar>
          </Box>
        </ListItemAvatar>
        <ListItemText
          primary={profile.name}
          secondary={role.name}
          primaryTypographyProps={{ variant: 'subtitle2', noWrap: true }}
          secondaryTypographyProps={{ noWrap: true }}
        />
      </ListItemButton>
      <ChatRoomPopup participant={participant} isOpen={isOpen} onClose={onClosePopup} />
    </>
  );
}
