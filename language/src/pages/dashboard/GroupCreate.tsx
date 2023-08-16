import { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// redux
import { dispatch, useSelector } from '../../redux/store';
import { getGroups } from '../../redux/slices/group';
import { getChannels } from '../../redux/slices/channel';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import GroupNewEditForm from '../../sections/@dashboard/group/GroupNewEditForm';
import useLocales from 'src/hooks/useLocales';

// ----------------------------------------------------------------------

export default function GroupCreate() {
  const { translate } = useLocales();

  const { themeStretch } = useSettings();

  const { pathname } = useLocation();

  const { name = '' } = useParams();

  const isEdit = pathname.includes('edit');

  const { groups } = useSelector((state) => state.group);

  useEffect(() => {
    dispatch(getGroups());
    dispatch(getChannels());
  }, []);

  const currentGroup = groups.find((group) => group.name === name);

  return (
    <Page title="Group: Create a new group">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={translate(!isEdit ? 'create_a_new_group' : 'edit_group')}
          links={[
            { name: translate('Dashboard'), href: PATH_DASHBOARD.root },
            { name: translate('Group'), href: PATH_DASHBOARD.group.list },
            { name: !isEdit ? translate('new_group') : name },
          ]}
        />

        <GroupNewEditForm isEdit={isEdit} currentGroup={currentGroup} />
      </Container>
    </Page>
  );
}
