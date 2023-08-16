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
import { getUsers } from '../../redux/slices/user';
import { getRoles } from '../../redux/slices/role';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import UserNewEditForm from '../../sections/@dashboard/user/UserNewEditForm';

// ----------------------------------------------------------------------

export default function UserCreate() {
  const { translate } = useLocales();
  const { themeStretch } = useSettings();

  const { pathname } = useLocation();

  const { username = '' } = useParams();

  const isEdit = pathname.includes('edit');

  const { users } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getUsers());
    dispatch(getRoles());
  }, []);

  const currentUser = users.find((user) => user.username === username);

  return (
    <Page title="User: Create a new user">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={translate(!isEdit ? 'create_a_new_user' : 'edit_user')}
          links={[
            { name: translate('Dashboard'), href: PATH_DASHBOARD.root },
            { name: translate('User'), href: PATH_DASHBOARD.user.list },
            { name: !isEdit ? translate('new_user') : username },
          ]}
        />

        <UserNewEditForm isEdit={isEdit} currentUser={currentUser} />
      </Container>
    </Page>
  );
}
