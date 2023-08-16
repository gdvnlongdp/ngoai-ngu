import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// hooks
import useLocales from '../../../hooks/useLocales';
// @mui
import { Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// routes
import { PATH_AUTH } from '../../../routes/paths';
// components
import { FormProvider, RHFTextField } from '../../../components/hook-form';
// utils
import axios from '../../../utils/axios';

// ----------------------------------------------------------------------

type FormValuesProps = {
  username: string;
};

export default function ResetPasswordForm() {
  const navigate = useNavigate();

  const { translate } = useLocales();

  const ResetPasswordSchema = Yup.object().shape({
    username: Yup.string().required(translate('username_is_required')),
  });

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues: { username: '' },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    setError,
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    try {
      await axios.post('/api/auth/password/generate', {
        username: data.username,
      });
      sessionStorage.setItem('username-recovery', data.username);
      navigate(PATH_AUTH.newPassword);
    } catch (error) {
      console.error(error);
      setError('username', { type: 'custom', message: translate(error.message) });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFTextField name="username" label={translate('username')} />

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          {translate('send_request')}
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
