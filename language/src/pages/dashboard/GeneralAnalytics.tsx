import { useEffect } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container } from '@mui/material';
// hooks
import useLocales from '../../hooks/useLocales';
import useSettings from '../../hooks/useSettings';
// redux
import { dispatch, useSelector } from '../../redux/store';
import { getRoles } from '../../redux/slices/role';
import { getUsers } from '../../redux/slices/user';
import { getChannels } from '../../redux/slices/channel';
import { getTests } from '../../redux/slices/test';
// components
import Page from '../../components/Page';
// sections
import {
  AnalyticsCurrentVisits,
  AnalyticsWebsiteVisits,
  AnalyticsWidgetSummary,
  AnalyticsCurrentSubject,
  AnalyticsConversionRates,
} from '../../sections/@dashboard/general/analytics';
import Scrollbar from 'src/components/Scrollbar';

// ----------------------------------------------------------------------

export default function GeneralAnalytics() {
  const theme = useTheme();

  const { translate } = useLocales();
  const { themeStretch } = useSettings();

  const { roles } = useSelector((state) => state.role);
  const { users } = useSelector((state) => state.user);
  const { channels } = useSelector((state) => state.channel);
  const { tests } = useSelector((state) => state.test);

  useEffect(() => {
    dispatch(getRoles());
    dispatch(getUsers());
    dispatch(getChannels());
    dispatch(getTests());
  }, []);

  return (
    <Page title="General: Analytics">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              sx={{ textTransform: 'capitalize' }}
              title={translate('user')}
              total={users.length}
              color="info"
              icon={'ant-design:user-outlined'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              sx={{ textTransform: 'capitalize' }}
              title={translate('role')}
              total={roles.length}
              icon={'material-symbols:admin-panel-settings-rounded'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              sx={{ textTransform: 'capitalize' }}
              title={translate('channel')}
              total={channels.length}
              color="warning"
              icon={'fluent:channel-add-16-filled'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              sx={{ textTransform: 'capitalize' }}
              title={translate('test')}
              total={tests.length}
              color="error"
              icon={'bi:journal-check'}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AnalyticsWebsiteVisits
              title="Website Visits"
              subheader="(+43%) than last year"
              chartLabels={[
                '01/01/2003',
                '02/01/2003',
                '03/01/2003',
                '04/01/2003',
                '05/01/2003',
                '06/01/2003',
                '07/01/2003',
                '08/01/2003',
                '09/01/2003',
                '10/01/2003',
                '11/01/2003',
              ]}
              chartData={[
                {
                  name: 'Team A',
                  type: 'column',
                  fill: 'solid',
                  data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                },
                {
                  name: 'Team B',
                  type: 'area',
                  fill: 'gradient',
                  data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                },
                {
                  name: 'Team C',
                  type: 'line',
                  fill: 'solid',
                  data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AnalyticsCurrentVisits
              title={translate('Role')}
              chartData={roles.map((role) => ({
                label: role.name,
                value: users.filter((user) => user.role.id === role.id).length,
              }))}
              chartColors={roles.map((role, index) => {
                const color = (
                  Object.keys(theme.palette.chart) as (keyof typeof theme.palette.chart)[]
                )[index];
                return theme.palette.chart[color][0];
              })}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AnalyticsConversionRates
              title="Conversion Rates"
              subheader="(+43%) than last year"
              chartData={[
                { label: 'Italy', value: 400 },
                { label: 'Japan', value: 430 },
                { label: 'China', value: 448 },
                { label: 'Canada', value: 470 },
                { label: 'France', value: 540 },
                { label: 'Germany', value: 580 },
                { label: 'South Korea', value: 690 },
                { label: 'Netherlands', value: 1100 },
                { label: 'United States', value: 1200 },
                { label: 'United Kingdom', value: 1380 },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Scrollbar>
              <AnalyticsCurrentSubject
                title={translate('Channel')}
                chartLabels={channels.map((el) => el.name)}
                chartData={roles.map((role) => ({
                  name: role.name,
                  data: channels.map(
                    (channel) =>
                      users.filter(
                        (user) =>
                          user.role.id === role.id &&
                          channel.members.map((el) => el.id).includes(user.id)
                      ).length
                  ),
                }))}
                chartColors={[...Array(roles.length)].map(() => theme.palette.text.secondary)}
              />
            </Scrollbar>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
