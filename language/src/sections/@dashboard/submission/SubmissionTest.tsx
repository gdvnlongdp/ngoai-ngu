import * as Yup from 'yup';
import { useEffect, useMemo } from 'react';
import { useSnackbar } from 'notistack';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Grid,
  Stack,
  Typography,
  Divider,
  Checkbox,
} from '@mui/material';
// utils
import axios from '../../../utils/axios';
// @types
import { Test, Submission } from '../../../@types/test';
// redux
import { dispatch, useSelector } from '../../../redux/store';
import { getSubmission } from '../../../redux/slices/submission';
// hooks
import useLocales from '../../../hooks/useLocales';
// components
import Markdown from '../../../components/Markdown';
import { FormProvider } from '../../../components/hook-form';

// ----------------------------------------------------------------------

type FormValuesProps = {
  submissions: Submission[];
};

type Props = {
  currentTest?: Test;
};

export default function SubmissionTest({ currentTest }: Props) {
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();

  const { submission } = useSelector((state) => state.submit);

  const NewUserSchema = Yup.object().shape({
    submissions: Yup.array(),
  });

  const defaultValues = useMemo(
    () => ({
      submissions: [],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentTest]
  );

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTest]);

  const onSubmit = async (data: FormValuesProps) => {
    try {
      await axios.post(
        `/api/general/submits/submit/${submission?.id}`,
        data.submissions
      );
      enqueueSnackbar(translate('submit_success'));
      if (currentTest?.id) {
        dispatch(getSubmission(currentTest.id));
      }
    } catch (err) {
      console.log(err);
      enqueueSnackbar(translate('submit_failed'), { variant: 'error' });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={12}>
          <Card sx={{ py: 10, px: 10 }}>
            <Box
              sx={{
                display: 'grid',
                rowGap: 3,
              }}
            >
              <Typography variant="h6" sx={{ mb: 5, textTransform: 'uppercase' }} align="center">
                {currentTest?.title}
              </Typography>
              <Stack
                spacing={1}
                sx={{
                  mb: 5,
                  textTransform: 'capitalize',
                }}
              >
                <span>
                  {translate('Channel')}: <b>{currentTest?.channel.name}</b>
                </span>
                <span>
                  {translate('Duration')}: <b>{currentTest?.duration}</b>'
                </span>
              </Stack>
              {currentTest?.questions.map((question, index) => (
                <div key={index}>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ mb: 5 }}>
                    <Typography
                      variant="body1"
                      sx={{ mb: 2, textTransform: 'uppercase', fontWeight: 500 }}
                    >
                      {translate('question')} {index + 1}
                    </Typography>
                    {/* <Typography variant="body1" sx={{ mb: 2, ml: 2 }}>
                      {question.content}
                    </Typography> */}
                    <Markdown children={question.content} />

                    {question.answers.map(
                      (ans, i) =>
                        ans.content && (
                          <Stack
                            key={`ans${index}-index${i}`}
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <Controller
                              name={`submissions.${index}.answers.${i}`}
                              control={control}
                              render={({ field }) => <Checkbox {...field} />}
                            />
                            <Typography variant="inherit">{ans.content}</Typography>
                          </Stack>
                        )
                    )}
                  </Box>
                </div>
              ))}
            </Box>

            <Stack alignItems="center" sx={{ mt: 3 }}>
              <LoadingButton
                type="submit"
                variant="contained"
                disabled={submission?.submitedAt !== undefined}
                sx={{ width: 200 }}
                loading={isSubmitting}
              >
                {translate('submit')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
