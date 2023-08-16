import { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// @types
import { Test } from '../../@types/test';
// redux
import { dispatch, useSelector } from '../../redux/store';
import { getTests } from '../../redux/slices/test';
import { getChannels } from '../../redux/slices/channel';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useLocales from '../../hooks/useLocales';
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import TestNewEditForm from '../../sections/@dashboard/test/new-edit-form';

// ----------------------------------------------------------------------

export default function TestCreate() {
  const { translate } = useLocales();
  const { themeStretch } = useSettings();

  const { id = '' } = useParams();

  const { pathname } = useLocation();

  const isEdit = pathname.includes('edit');

  const { tests } = useSelector((state) => state.test);

  useEffect(() => {
    dispatch(getTests());
    dispatch(getChannels());
  }, []);

  const currentTest = tests.find((test) => test.id === id) as Test | undefined;

  return (
    <Page title="Test: Create a new test">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={translate(!isEdit ? 'create_a_new_test' : 'edit_test')}
          links={[
            { name: translate('Dashboard'), href: PATH_DASHBOARD.root },
            { name: translate('Test'), href: PATH_DASHBOARD.test.list },
            { name: !isEdit ? translate('new_test') : currentTest?.title || '' },
          ]}
        />

        <TestNewEditForm isEdit={isEdit} currentTest={currentTest} />
      </Container>
    </Page>
  );
}
