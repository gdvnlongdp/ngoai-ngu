import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { Stack, Card } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// utils
import axios from '../../../../utils/axios';
// components
import { FormProvider, RHFTextField } from '../../../../components/hook-form';
// hooks
import useLocales from '../../../../hooks/useLocales';

// ----------------------------------------------------------------------

type FormValuesProps = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

export default function AccountChangePassword() {
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();

  const ChangePassWordSchema = Yup.object().shape({
    oldPassword: Yup.string().required(translate('old_password_is_required')),
    newPassword: Yup.string()
      .min(6, translate('password_is_too_short'))
      .required(translate('new_password_is_required')),
    confirmNewPassword: Yup.string().oneOf(
      [Yup.ref('newPassword'), null],
      translate('password_must_match')
    ),
  });

  const defaultValues = {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  };

  const methods = useForm({
    resolver: yupResolver(ChangePassWordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    try {
      const response = await axios.patch('/api/general/account/password', data);
      const { user } = response.data;
      if (!user) {
        throw new Error(translate('something_went_wrong'));
      }

      reset();
      enqueueSnackbar(translate('change_password_success'));
    } catch (error) {
      enqueueSnackbar(translate(error.message), { variant: 'error' });
      console.error(error);
    }
  };

  return (
    <Card sx={{ p: 3 }}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} alignItems="flex-end">
          <RHFTextField name="oldPassword" type="password" label={translate('Old_password')} />

          <RHFTextField name="newPassword" type="password" label={translate('New_password')} />

          <RHFTextField
            name="confirmNewPassword"
            type="password"
            label={translate('Confirm_password')}
          />

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {translate('save_changes')}
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Card>
  );
}
