import * as Yup from 'yup';
import { useEffect, useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Box,
  Card,
  Grid,
  Stack,
  Switch,
  Typography,
  FormControlLabel,
  Avatar as MuiAvatar,
} from '@mui/material';
// utils
import axios from '../../../utils/axios';
import createAvatar from '../../../utils/createAvatar';
import generatePassword from '../../../utils/generatePassword';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// @types
import { User } from '../../../@types/user';
// redux
import { useSelector } from '../../../redux/store';
// hooks
import useLocales from '../../../hooks/useLocales';
// components
import Avatar from '../../../components/Avatar';
import Label from '../../../components/Label';
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFSelect, RHFTextField } from '../../../components/hook-form';

// ----------------------------------------------------------------------

const GENDERS = [
  { code: 'male', label: 'Male' },
  { code: 'female', label: 'Female' },
];

// ----------------------------------------------------------------------

type FormValuesProps = {
  // User
  username?: string;
  password?: string;
  isBanned: boolean;

  // Role
  role: string;

  // Profile
  name: string;
  phone: string;
  gender: string;
  avatar: string | null;
};

type Props = {
  isEdit: boolean;
  currentUser?: User;
};

export default function UserNewEditForm({ isEdit, currentUser }: Props) {
  const navigate = useNavigate();

  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();

  const { roles } = useSelector((state) => state.role);

  const NewUserSchema = Yup.object().shape({
    // User
    username: Yup.string().required(translate('username_is_required')),
    password: Yup.string()
      .min(6, translate('password_is_too_short'))
      .matches(/[a-zA-Z]/, translate('password_contain_latin_letter'))
      .required(translate('password_is_required')),
    isBanned: Yup.boolean(),

    // Role
    role: Yup.string().required(translate('role_is_required')),

    // Profile
    name: Yup.string().required(translate('name_is_required')),
    phone: Yup.string().required(translate('phone_number_is_required')),
    gender: Yup.string().required(translate('gender_is_required')),
    avatar: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      // User
      username: currentUser?.username || '',
      password: generatePassword(),
      isBanned: currentUser?.isBanned || false,

      // Role
      role: currentUser?.role.id || '',

      // Profile
      name: currentUser?.profile.name || '',
      phone: currentUser?.profile.phone || '',
      gender: currentUser?.profile.gender || '',
      avatar: isEdit
        ? currentUser?.profile.avatar || ''
        : `https://minimal-assets-api-dev.vercel.app/assets/images/avatars/avatar_${Math.floor(
            Math.random() * 24 + 1
          )}.jpg`,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser]
  );

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && currentUser) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentUser]);

  const handleGeneratePassword = () => {
    setValue('password', generatePassword());
  };

  const onSubmit = async (data: FormValuesProps) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (!isEdit) {
        // Handle create profile
        const response = await axios.post('/api/management/profiles', data);
        const { profile } = response.data;

        // Handle create user
        await axios.post('/api/management/users', {
          ...data,
          roleId: data.role,
          profileId: profile.id,
        });
      } else {
        // Except username and password in edit mode
        delete data.username;
        delete data.password;

        // Handle edit profile
        await axios.put(`/api/management/profiles/${currentUser?.profile.id}`, data);

        // Handle edit user
        await axios.put(`/api/management/users/${currentUser?.id}`, {
          ...data,
          roleId: data.role,
          profileId: currentUser?.profile.id,
        });
      }

      reset();
      enqueueSnackbar(translate(!isEdit ? 'create_success' : 'update_success'));
      navigate(PATH_DASHBOARD.user.list);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(translate(!isEdit ? 'create_user_failed' : 'update_user_failed'), {
        variant: 'error',
      });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3 }}>
            <Label
              color={values.isBanned ? 'error' : 'success'}
              sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
            >
              {translate(values.isBanned ? 'banned' : 'active')}
            </Label>

            <Box sx={{ mb: 5, pb: '4px' }}>
              <Stack spacing={2}>
                {values.avatar || values.name ? (
                  <Avatar
                    alt="avatar"
                    src={values.avatar || ''}
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
                  placeholder={translate('enter_url_here')}
                  size="small"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Stack>
            </Box>

            <FormControlLabel
              labelPlacement="start"
              control={
                <Controller
                  name="isBanned"
                  control={control}
                  render={({ field }) => <Switch {...field} checked={field.value} />}
                />
              }
              label={
                <>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    {translate('Banned')}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {translate('apply_disable_account')}
                  </Typography>
                </>
              }
              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ py: 10, px: 3 }}>
            {!isEdit && (
              <Button
                size="small"
                variant="outlined"
                startIcon={<Iconify icon={'ooui:reload'} />}
                sx={{ textTransform: 'capitalize', position: 'absolute', top: 24, right: 24 }}
                onClick={handleGeneratePassword}
              >
                {translate('generate_password')}
              </Button>
            )}
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFTextField
                name="username"
                label={translate('username')}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <RHFTextField
                name="password"
                label={translate('Password')}
                type={!isEdit ? 'text' : 'password'}
                disabled={isEdit}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <RHFTextField name="name" label={translate('Name')} />
              <RHFTextField name="phone" label={translate('Phone')} type="number" />
              {roles.length && (
                <RHFSelect name="role" label={translate('Role')} placeholder={translate('Role')}>
                  <option value="" />
                  {roles.map((option, index) => (
                    <option key={index} value={option.id} style={{ textTransform: 'capitalize' }}>
                      {translate(option.name)}
                    </option>
                  ))}
                </RHFSelect>
              )}
              <RHFSelect
                name="gender"
                label={translate('Gender')}
                placeholder={translate('Gender')}
              >
                <option value="" />
                {GENDERS.map((option) => (
                  <option
                    key={option.code}
                    value={option.code}
                    style={{ textTransform: 'capitalize' }}
                  >
                    {translate(option.label)}
                  </option>
                ))}
              </RHFSelect>
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {translate(!isEdit ? 'create_user' : 'save_changes')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
