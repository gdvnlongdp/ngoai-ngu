import { useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// @mui
import { Box, Card, Container, InputLabel, MenuItem, FormControl, Select } from '@mui/material';
// redux
import { dispatch, useSelector } from '../../redux/store';
import { createConversations, getChannels, getConversations } from '../../redux/slices/chat';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useLocales from '../../hooks/useLocales';
import useSettings from '../../hooks/useSettings';
// pages
import Page404 from '../Page404';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import { ChatSidebar, ChatWindow } from '../../sections/@dashboard/chat';

// ----------------------------------------------------------------------

export default function Chat() {
  const { translate } = useLocales();

  const navigate = useNavigate();

  const { themeStretch } = useSettings();
  const { channelKey = '' } = useParams();

  const { channels, isLoading } = useSelector((state) => state.chat);

  const handleOpenChatByChannel = useCallback(
    (channel: string) => navigate(PATH_DASHBOARD.chat.channel(channel)),
    [navigate]
  );

  const channel = channels.find((channel) => channel.id === channelKey);

  useEffect(() => {
    dispatch(getChannels());
  }, []);

  useEffect(() => {
    if (channel) {
      dispatch(getConversations(channel.id));
      dispatch(createConversations(channel.id));
    }
  }, [channel]);

  useEffect(() => {
    if (channels.length > 0 && channelKey === '') {
      handleOpenChatByChannel(channels[0].id);
    }
  }, [channels, channelKey, handleOpenChatByChannel]);

  if (!channel) {
    if (isLoading) {
      return null;
    }

    if (channels.length > 0) {
      return <Page404 />
    }
    
    return null;
  }

  return (
    <Page title="Chat">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading={translate('Chat')}
          links={[
            { name: translate('Dashboard'), href: PATH_DASHBOARD.root },
            { name: translate('Chat') },
          ]}
          action={
            <Box sx={{ minWidth: 260 }}>
              <FormControl fullWidth>
                <InputLabel>{translate('Channel')}</InputLabel>
                <Select label={translate('Channel')} value={channel.id}>
                  {channels.map((channel, index) => (
                    <MenuItem
                      key={index}
                      value={channel.id}
                      onClick={() => handleOpenChatByChannel(channel.id)}
                    >
                      {channel.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          }
        />
        <Card sx={{ height: '72vh', display: 'flex' }}>
          <ChatSidebar />
          <ChatWindow />
        </Card>
      </Container>
    </Page>
  );
}
