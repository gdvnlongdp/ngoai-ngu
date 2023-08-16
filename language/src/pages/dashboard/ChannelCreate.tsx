import { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useLocales from '../../hooks/useLocales';
import useSettings from '../../hooks/useSettings';
// redux
import { dispatch, useSelector } from '../../redux/store';
import { getChannels } from '../../redux/slices/channel';
import { getUsers } from '../../redux/slices/user';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import ChannelNewEditForm from '../../sections/@dashboard/channel/ChannelNewEditForm';

// ----------------------------------------------------------------------

export default function ChannelCreate() {
  const { translate } = useLocales();

  const { themeStretch } = useSettings();

  const { pathname } = useLocation();

  const { name = '' } = useParams();

  const isEdit = pathname.includes('edit');

  const { channels } = useSelector((state) => state.channel);

  useEffect(() => {
    dispatch(getChannels());
    dispatch(getUsers());
  }, []);

  const currentChannel = channels.find((channel) => channel.name === name);

  return (
    <Page title="Channel: Create a new channel">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={translate(!isEdit ? 'create_a_new_channel' : 'edit_channel')}
          links={[
            { name: translate('Dashboard'), href: PATH_DASHBOARD.root },
            { name: translate('Channel'), href: PATH_DASHBOARD.channel.list },
            { name: !isEdit ? translate('new_channel') : name },
          ]}
        />

        <ChannelNewEditForm isEdit={isEdit} currentChannel={currentChannel} />
      </Container>
    </Page>
  );
}
