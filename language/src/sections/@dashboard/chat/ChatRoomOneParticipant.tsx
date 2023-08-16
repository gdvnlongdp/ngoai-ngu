// @mui
import { styled } from '@mui/material/styles';
import { Box, Button, Divider, Collapse, Typography } from '@mui/material';
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

const CollapseButtonStyle = styled(Button)(({ theme }) => ({
  ...theme.typography.overline,
  height: 40,
  borderRadius: 0,
  padding: theme.spacing(1, 2),
  justifyContent: 'space-between',
  color: theme.palette.text.disabled,
}));

const RowStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  margin: theme.spacing(1.5, 0),
}));

const RowIconStyle = styled(Iconify)(({ theme }) => ({
  width: 16,
  height: 16,
  marginTop: 4,
  marginRight: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

const RowTextStyle = styled(Typography)(({ theme }) => ({
  flexGrow: 1,
  maxWidth: 160,
  wordWrap: 'break-word',
  ...theme.typography.body2,
}));

// ----------------------------------------------------------------------

type Props = {
  participants: Participant[];
  isCollapse: boolean;
  onCollapse: VoidFunction;
};

export default function ChatRoomOneParticipant({ participants, isCollapse, onCollapse }: Props) {
  const { translate } = useLocales();
  const participant = [...participants][0];

  if (participant === undefined) {
    return null;
  }

  return (
    <>
      <Box
        sx={{
          pt: 4,
          pb: 3,
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <Avatar
          src={participant.profile.avatar}
          alt={participant.id}
          color={
            participant.profile.avatar ? 'default' : createAvatar(participant.profile.name).color
          }
          sx={{ width: 96, height: 96 }}
        >
          {createAvatar(participant.profile.name).name}
        </Avatar>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="subtitle1">{participant.profile.name}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {participant.role.name}
          </Typography>
        </Box>
      </Box>

      <Divider />

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
        {translate('information')}
      </CollapseButtonStyle>

      <Collapse in={isCollapse}>
        <Box sx={{ px: 2.5, pb: 1 }}>
          <RowStyle>
            <RowIconStyle icon={'bxs:phone'} />
            <RowTextStyle>{participant.profile.phone}</RowTextStyle>
          </RowStyle>
          <RowStyle>
            <RowIconStyle icon={'ph:gender-intersex-bold'} />
            <RowTextStyle sx={{ textTransform: 'capitalize' }}>
              {translate(participant.profile.gender)}
            </RowTextStyle>
          </RowStyle>
        </Box>
      </Collapse>
    </>
  );
}
