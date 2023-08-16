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
import { getPermissions } from '../../redux/slices/permission';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import PermissionNewEditForm from '../../sections/@dashboard/permission/PermissionNewEditForm';

// ----------------------------------------------------------------------

export default function PermissionCreate() {
  const { translate } = useLocales();
  const { themeStretch } = useSettings();

  const { pathname } = useLocation();

  const { name = '' } = useParams();

  const isEdit = pathname.includes('edit');

  const { permissions } = useSelector((state) => state.permission);

  useEffect(() => {
    (async () => {
      await new Promise((resolve) => setTimeout(resolve, 5000));
    })()
    dispatch(getPermissions());
  }, []);

  const currentPermission = permissions.find((permission) => permission.name === name);

  return (
    <Page title="Permission: Create a new permission">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={translate(!isEdit ? 'create_a_new_permission' : 'edit_permisison')}
          links={[
            { name: translate('Dashboard'), href: PATH_DASHBOARD.root },
            { name: translate('Permission'), href: PATH_DASHBOARD.permission.list },
            { name: !isEdit ? translate('new_permission') : name },
          ]}
        />

        <PermissionNewEditForm isEdit={isEdit} currentPermission={currentPermission} />
      </Container>
    </Page>
  );
}
