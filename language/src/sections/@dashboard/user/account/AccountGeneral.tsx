import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Grid, Card, Stack, Avatar as MuiAvatar } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import useAuth from '../../../../hooks/useAuth';
import useLocales from '../../../../hooks/useLocales';
// utils
import axios from '../../../../utils/axios';
import createAvatar from '../../../../utils/createAvatar';
// components
import { FormProvider, RHFSelect, RHFTextField } from '../../../../components/hook-form';
import Avatar from '../../../../components/Avatar';

// ----------------------------------------------------------------------

const GENDERS = [
  { code: 'male', label: 'Male' },
  { code: 'female', label: 'Female' },
];

type FormValuesProps = {
  name: string;
  phone: string;
  gender: string;
  avatar: string;
};

export default function AccountGeneral() {
  const { translate } = useLocales();

  const { enqueueSnackbar } = useSnackbar();

  const { user } = useAuth();

  const UpdateUserSchema = Yup.object().shape({
    name: Yup.string().required(translate('name_is_required')),
    phone: Yup.string().required(translate('phone_number_is_required')),
    gender: Yup.string().required(translate('gender_is_required')),
  });

  const defaultValues = {
    name: user?.profile.name || '',
    phone: user?.profile.phone || '',
    gender: user?.profile.gender || '',
    avatar: user?.profile.avatar || '',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = async (data: FormValuesProps) => {
    try {
      const response = await axios.put('/api/general/account/profile', data);
      const { profile } = response.data;
      if (!profile) {
        throw new Error(translate('something_went_wrong'));
      }

      enqueueSnackbar(translate('update_account_success'));
    } catch (error) {
      enqueueSnackbar(translate(error.message), { variant: 'error' });
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Stack spacing={3} sx={{ mb: '4px' }}>
              {values.avatar || values.name ? (
                <Avatar
                  alt="avatar"
                  src={values.avatar}
                  color={values.avatar ? 'default' : createAvatar(values.name).color}
                  sx={{
                    mx: 'auto',
                    width: { xs: 80, md: 128 },
                    height: { xs: 80, md: 128 },
                  }}
                >
                  {createAvatar(values.name).name}
                </Avatar>
              ) : (
                <MuiAvatar
                  sx={{
                    mx: 'auto',
                    width: { xs: 80, md: 128 },
                    height: { xs: 80, md: 128 },
                  }}
                />
              )}

              <RHFTextField
                name="avatar"
                label={translate('avatar_url')}
                placeholder="https://..."
                size="small"
                value={values.avatar}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                rowGap: 3,
                columnGap: 2,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFTextField name="name" label={translate('Name')} />

              <RHFTextField name="phone" label={translate('Phone')} type="number" />

              <RHFSelect name="gender" label={translate('Gender')} placeholder="Gender">
                {GENDERS.map((gender) => (
                  <option key={gender.code} value={gender.code}>
                    {translate(gender.label)}
                  </option>
                ))}
              </RHFSelect>
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {translate('save_changes')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
