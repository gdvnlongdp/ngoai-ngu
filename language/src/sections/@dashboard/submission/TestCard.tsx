import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import { Box, Card, Divider, Button, Typography } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// @types
import { Test } from '../../../@types/test';
// utils
import axios from '../../../utils/axios';
import createAvatar from '../../../utils/createAvatar';
import cssStyles from '../../../utils/cssStyles';
// hooks
import useLocales from '../../../hooks/useLocales';
// components
import Avatar from '../../../components/Avatar';
import Label from '../../../components/Label';
import Image from '../../../components/Image';
import SvgIconStyle from '../../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const OverlayStyle = styled('div')(({ theme }) => ({
  ...cssStyles().bgBlur({ blur: 2, color: theme.palette.primary.darker }),
  top: 0,
  zIndex: 8,
  content: "''",
  width: '100%',
  height: '100%',
  position: 'absolute',
}));

// ----------------------------------------------------------------------

type Props = {
  test: Test;
};

export default function TestCard({ test }: Props) {
  const navigate = useNavigate();

  const theme = useTheme();

  const { translate } = useLocales();

  const { id, title, createdBy: user, duration, channel, publish, updatedAt } = test;

  const registerTest = async (testId: string) => {
    await axios.post(`/api/general/submits/register/${testId}`);
  };

  const handleOpenTest = (id: string) => {
    registerTest(id);
    navigate(PATH_DASHBOARD.submit.test(id));
  };

  return (
    <Card sx={{ textAlign: 'center', ':hover': { transform: 15 } }}>
      {!publish && (
        <Label
          color="error"
          sx={{
            textTransform: 'uppercase',
            position: 'absolute',
            top: 24,
            right: 24,
            zIndex: 20,
            bgcolor: 'background.paper',
          }}
        >
          {translate('comming_soon')}
        </Label>
      )}

      <Box sx={{ position: 'relative' }}>
        <SvgIconStyle
          src="https://minimal-assets-api-dev.vercel.app/assets/icons/shape-avatar.svg"
          sx={{
            width: 144,
            height: 62,
            zIndex: 10,
            left: 0,
            right: 0,
            bottom: -26,
            mx: 'auto',
            position: 'absolute',
            color: 'background.paper',
          }}
        />
        <Avatar
          src={user.profile.avatar}
          alt={user.profile.id}
          color={user.profile.avatar ? 'default' : createAvatar(user.profile.name).color}
          sx={{
            width: 64,
            height: 64,
            zIndex: 11,
            left: 0,
            right: 0,
            bottom: -32,
            mx: 'auto',
            position: 'absolute',
          }}
        >
          {createAvatar(user.profile.name).name}
        </Avatar>
        <OverlayStyle
          sx={{
            ...cssStyles().bgBlur({
              blur: 10,
              color: publish ? theme.palette.primary.main : theme.palette.error.darker,
            }),
          }}
        />
        <Image src={user.profile.avatar} alt={user.profile.id} ratio="16/9" />
      </Box>

      <Typography variant="subtitle1" sx={{ mt: 6 }}>
        {title}
      </Typography>

      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2 }}>
        {translate('created_by')}: <b>{user.profile.name}</b>
      </Typography>

      <Button
        variant="contained"
        sx={{ my: 2.5, width: 160 }}
        disabled={!publish}
        onClick={() => handleOpenTest(id)}
      >
        {translate('start')}
      </Button>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Box sx={{ py: 3, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div>
          <Typography variant="caption" component="div" sx={{ mb: 0.75, color: 'text.disabled' }}>
            {translate('Duration')}
          </Typography>
          <Typography variant="subtitle1">{duration}'</Typography>
        </div>

        <div>
          <Typography variant="caption" component="div" sx={{ mb: 0.75, color: 'text.disabled' }}>
            {translate('publish_date')}
          </Typography>
          <Typography variant="subtitle1">{format(parseISO(updatedAt), 'dd/MM/yyyy')}</Typography>
        </div>

        <div>
          <Typography variant="caption" component="div" sx={{ mb: 0.75, color: 'text.disabled' }}>
            {translate('Channel')}
          </Typography>
          <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
            {channel.name}
          </Typography>
        </div>
      </Box>
    </Card>
  );
}
