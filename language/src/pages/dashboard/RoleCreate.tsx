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
import { getRoles } from '../../redux/slices/role';
import { getPermissions } from '../../redux/slices/permission';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import RoleNewEditForm from '../../sections/@dashboard/role/RoleNewEditForm';

// ----------------------------------------------------------------------

export default function RoleCreate() {
  const { translate } = useLocales();

  const { themeStretch } = useSettings();

  const { pathname } = useLocation();

  const { name = '' } = useParams();

  const isEdit = pathname.includes('edit');

  const { roles } = useSelector((state) => state.role);

  useEffect(() => {
    (async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
    })()
    dispatch(getRoles());
    dispatch(getPermissions());
  }, []);

  const currentRole = roles.find((role) => role.name === name);

  return (
    <Page title="Role: Create a new role">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={translate(!isEdit ? 'create_a_new_role' : 'edit_role')}
          links={[
            { name: translate('Dashboard'), href: PATH_DASHBOARD.root },
            { name: translate('Role'), href: PATH_DASHBOARD.role.list },
            { name: !isEdit ? translate('new_role') : name },
          ]}
        />

        <RoleNewEditForm isEdit={isEdit} currentRole={currentRole} />
      </Container>
    </Page>
  );
}
