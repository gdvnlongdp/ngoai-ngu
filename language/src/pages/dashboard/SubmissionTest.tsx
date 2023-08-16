import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { add, isAfter, format } from 'date-fns';
// @mui
import { styled } from '@mui/material/styles';
import { Container, Typography, Grid, Card, Box, Stack } from '@mui/material';
// @types
import { ISubmission, Test } from '../../@types/test';
// hooks
import useCountdown from '../../hooks/useCountdown';
import useLocales from '../../hooks/useLocales';
import useSettings from '../../hooks/useSettings';
// redux
import { dispatch, useSelector } from '../../redux/store';
import { getTest } from '../../redux/slices/test';
import { getSubmission } from '../../redux/slices/submission';
// components
import Label from '../../components/Label';
import Page from '../../components/Page';
// sections
import Submission from '../../sections/@dashboard/submission/SubmissionTest';
import Page404 from '../Page404';

// ----------------------------------------------------------------------

const CountdownStyle = styled('div')({
  display: 'flex',
  justifyContent: 'center',
});

const SeparatorStyle = styled(Typography)(({ theme }) => ({
  margin: theme.spacing(0, 1),
  [theme.breakpoints.up('sm')]: {
    margin: theme.spacing(0, 2.5),
  },
}));

export default function SubmissionTest() {
  const { themeStretch } = useSettings();

  const [fetched, setFetched] = useState(false);

  const { id = '' } = useParams();

  const { test } = useSelector((state) => state.test);
  const { submission } = useSelector((state) => state.submit);

  useEffect(() => {
    dispatch(getTest(id));
  }, [id]);

  useEffect(() => {
    (async () => {
      await dispatch(getSubmission(id));
      if (!fetched) {
        setFetched(true);
      }
    })();
  }, [id, fetched, setFetched]);

  if (test && !test?.publish) {
    return <Page404 />;
  }

  return (
    <Page title="Submission: Testing">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        {submission && fetched && !submission.submitedAt && (
          <Timter
            time={add(new Date(submission.startedAt), { minutes: submission.test.duration })}
          />
        )}
        {submission?.submitedAt ? (
          <Result submission={submission} test={test} />
        ) : (
          test && <Submission currentTest={test} />
        )}
      </Container>
    </Page>
  );
}

function Result({ submission, test }: { submission: ISubmission; test: Test | null }) {
  const { translate } = useLocales();

  if (!test) {
    return null;
  }

  const isAcceptSubmission = isAfter(
    add(new Date(submission.startedAt), { minutes: test.duration }),
    new Date(submission.submitedAt)
  );

  const compare = (a: boolean[], b: boolean[]) => JSON.stringify(a) === JSON.stringify(b);

  const correctAns = submission.answers.filter((ans, index) =>
    test.questions[index]
      ? compare(
          ans.answers.map((el) => el !== null),
          test.questions[index].answers.map((el) => el.isCorrect)
        )
      : false
  ).length;

  return (
    <Grid container spacing={3} justifyContent="center">
      <Grid item xs={12} md={4} textAlign="center">
        <Card sx={{ py: 10, px: 3 }}>
          <Label
            color={isAcceptSubmission ? 'success' : 'error'}
            sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
          >
            {translate(isAcceptSubmission ? 'on_time' : 'miss_deadline')}
          </Label>

          <Box sx={{ mb: 5, pb: '4px' }}>
            <Stack spacing={2}>
              <Typography variant="h3" color={isAcceptSubmission ? 'primary' : 'secondary'}>
                {correctAns} / {test.questions.length}
              </Typography>
              <Typography variant="h5">{submission.user.profile.name}</Typography>
              <Typography variant="subtitle2">
                {format(new Date(submission.submitedAt), 'dd/MM/yyyy hh:mm:ss')}
              </Typography>
            </Stack>
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
}

function Timter({ time }: { time: Date }) {
  const { translate } = useLocales();

  let countdown = useCountdown(time);

  if (parseInt(countdown.days) < 0) {
    countdown = {
      days: '00',
      hours: '00',
      minutes: '00',
      seconds: '00',
    };
  }

  return (
    <CountdownStyle>
      <div>
        <Typography variant="h3">{countdown.days}</Typography>
        <Typography sx={{ color: 'text.secondary' }}>{translate('days')}</Typography>
      </div>

      <SeparatorStyle variant="h3">:</SeparatorStyle>

      <div>
        <Typography variant="h3">{countdown.hours}</Typography>
        <Typography sx={{ color: 'text.secondary' }}>{translate('hours')}</Typography>
      </div>

      <SeparatorStyle variant="h3">:</SeparatorStyle>

      <div>
        <Typography variant="h3">{countdown.minutes}</Typography>
        <Typography sx={{ color: 'text.secondary' }}>{translate('minutes')}</Typography>
      </div>

      <SeparatorStyle variant="h3">:</SeparatorStyle>

      <div>
        <Typography variant="h3">{countdown.seconds}</Typography>
        <Typography sx={{ color: 'text.secondary' }}>{translate('seconds')}</Typography>
      </div>
    </CountdownStyle>
  );
}
