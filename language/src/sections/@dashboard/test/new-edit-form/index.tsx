import * as Yup from 'yup';
import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// hooks
import useLocales from '../../../../hooks/useLocales';
// @mui
import { LoadingButton } from '@mui/lab';
import { Card, Stack } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// @types
import { ITest, Test } from '../../../../@types/test';
// components
import { FormProvider } from '../../../../components/hook-form';
// utils
import axios from '../../../../utils/axios';
//
import TestPreview from './TestPreview';
import TestNewEditDetails from './TestNewEditDetails';
import TestNewEditInfomation from './TestNewEditInfomation';

// ----------------------------------------------------------------------

type FormValuesProps = ITest;

type Props = {
  isEdit?: boolean;
  currentTest?: Test;
};

export default function TestNewEditForm({ isEdit, currentTest }: Props) {
  const navigate = useNavigate();

  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState(false);
  const [previewValue, setPreviewValue] = useState<FormValuesProps | null>(null);

  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingSend, setLoadingSend] = useState(false);

  const handleOpenPreview = () => {
    setOpen(true);
  };

  const handleClosePreview = () => {
    setOpen(false);
  };

  const NewUserSchema = Yup.object().shape({
    title: Yup.string().nullable().required(translate('title_is_required')),
    channel: Yup.string().nullable().required(translate('channel_is_required')),
    duration: Yup.mixed().nullable().required(translate('duration_is_required')),
  });

  const defaultValues = useMemo(
    () => ({
      title: currentTest?.title || '',
      channel: currentTest?.channel.id || '',
      duration: currentTest?.duration || 45,
      publish: currentTest?.publish || false,
      questions: currentTest?.questions || [
        {
          content: '',
          answers: [
            { content: '', isCorrect: false },
            { content: '', isCorrect: false },
            { content: '', isCorrect: false },
            { content: '', isCorrect: false },
          ],
        },
      ],
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
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  useEffect(() => {
    if (isEdit && currentTest) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentTest]);

  const handleSaveAsDraft = (data: FormValuesProps) => {
    handleOpenPreview();
    setPreviewValue(data);
    setLoadingSave(true);
  };

  const handleCreateAndSend = async (data: FormValuesProps) => {
    setLoadingSend(true);

    try {
      if (!isEdit) {
        await axios.post('/api/management/tests', data);
      } else {
        await axios.put(`/api/management/tests/${currentTest?.id}`, data);
      }
      
      reset();
      setLoadingSend(false);
      enqueueSnackbar(translate(!isEdit ? 'create_success' : 'update_success'));
      navigate(PATH_DASHBOARD.test.list);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(translate(!isEdit ? 'create_test_failed' : 'update_test_failed'), {
        variant: 'error',
      });
    }
  };

  return (
    <FormProvider methods={methods}>
      <Card>
        <TestNewEditInfomation />
        <TestNewEditDetails />
      </Card>

      <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
        <LoadingButton
          color="inherit"
          size="large"
          variant="contained"
          loading={loadingSave && isSubmitting}
          onClick={handleSubmit(handleSaveAsDraft)}
        >
          {translate('preview')}
        </LoadingButton>

        <LoadingButton
          size="large"
          variant="contained"
          loading={loadingSend && isSubmitting}
          onClick={handleSubmit(handleCreateAndSend)}
        >
          {translate(isEdit ? 'update_test' : 'create_test')}
        </LoadingButton>
      </Stack>

      {previewValue && (
        <TestPreview
          value={previewValue}
          isEdit={isEdit}
          isOpen={open}
          isValid={isValid}
          isSubmitting={isSubmitting}
          onClose={handleClosePreview}
          onSubmit={handleSubmit(handleCreateAndSend)}
        />
      )}
    </FormProvider>
  );
}
