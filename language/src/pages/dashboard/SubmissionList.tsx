import { useEffect, useState } from 'react';
// @mui
import { Container, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useLocales from '../../hooks/useLocales';
import useSettings from '../../hooks/useSettings';
// @types
import { Test } from '../../@types/test';
// redux
import { dispatch, useSelector } from '../../redux/store';
import { getChannels, getTests } from '../../redux/slices/submission';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import TestCard from '../../sections/@dashboard/submission/TestCard';

// ----------------------------------------------------------------------

export default function Submission() {
  const { translate } = useLocales();
  const { themeStretch } = useSettings();

  const [_tests, setTests] = useState<Test[]>([]);
  const { channels, tests } = useSelector((state) => state.submit);

  const [filterChannel, setFilterChannel] = useState('all');

  useEffect(() => {
    dispatch(getChannels());
    dispatch(getTests());
  }, []);

  const handleFilterChannel = (id: string) => {
    setFilterChannel(id);
  };

  useEffect(() => {
    if (filterChannel === 'all') {
      setTests(tests);
    } else {
      setTests(tests.filter((el) => el.channel.id === filterChannel));
    }
  }, [channels, filterChannel, tests]);

  return (
    <Page title="Submission: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={translate('Submission List')}
          links={[
            { name: translate('Dashboard'), href: PATH_DASHBOARD.root },
            { name: translate('Submission') },
          ]}
          action={
            channels.length > 0 && (
              <Box sx={{ minWidth: 260 }}>
                <FormControl fullWidth>
                  <InputLabel>{translate('Channel')}</InputLabel>
                  <Select
                    label={translate('Channel')}
                    value={filterChannel}
                    sx={{ textTransform: 'capitalize' }}
                  >
                    <MenuItem value={'all'} onClick={() => handleFilterChannel('all')}>
                      {translate('all')}
                    </MenuItem>
                    {channels.map((channel, index) => (
                      <MenuItem
                        key={index}
                        value={channel.id}
                        onClick={() => handleFilterChannel(channel.id)}
                        sx={{ textTransform: 'capitalize' }}
                      >
                        {channel.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )
          }
        />

        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
          }}
        >
          {_tests.map((test) => (
            <TestCard key={test.id} test={test} />
          ))}
        </Box>
      </Container>
    </Page>
  );
}
