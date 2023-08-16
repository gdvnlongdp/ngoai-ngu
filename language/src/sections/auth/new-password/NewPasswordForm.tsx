import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, IconButton, OutlinedInput, InputAdornment, FormHelperText } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import useLocales from '../../../hooks/useLocales';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
// utils
import axios from '../../../utils/axios';

// ----------------------------------------------------------------------

type FormValuesProps = {
  code1: string;
  code2: string;
  code3: string;
  code4: string;
  code5: string;
  code6: string;
  username: string;
  password: string;
  confirmPassword: string;
};

type ValueNames = 'code1' | 'code2' | 'code3' | 'code4' | 'code5' | 'code6';

export default function NewPasswordForm() {
  const { translate } = useLocales();
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const [showPassword, setShowPassword] = useState(false);

  const usernameRecovery = sessionStorage.getItem('username-recovery');

  const VerifyCodeSchema = Yup.object().shape({
    code1: Yup.string().required(translate('code_is_required')),
    code2: Yup.string().required(translate('code_is_required')),
    code3: Yup.string().required(translate('code_is_required')),
    code4: Yup.string().required(translate('code_is_required')),
    code5: Yup.string().required(translate('code_is_required')),
    code6: Yup.string().required(translate('code_is_required')),
    username: Yup.string().required(translate('username_is_required')),
    password: Yup.string()
      .min(6, translate('password_is_too_short'))
      .required(translate('password_is_required')),
    confirmPassword: Yup.string()
      .required(translate('confirm_password_is_required'))
      .oneOf([Yup.ref('password'), null], translate('password_must_match')),
  });

  const defaultValues = {
    code1: '',
    code2: '',
    code3: '',
    code4: '',
    code5: '',
    code6: '',
    username: usernameRecovery || '',
    password: '',
    confirmPassword: '',
  };

  const methods = useForm({
    mode: 'all',
    resolver: yupResolver(VerifyCodeSchema),
    defaultValues,
  });

  const {
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  useEffect(() => {
    const target = document.querySelector('input.field-code');

    target?.addEventListener('paste', handlePaste);

    return () => {
      target?.removeEventListener('paste', handlePaste);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePaste = (event: any) => {
    let data = event.clipboardData.getData('text');

    data = data.split('');

    [].forEach.call(document.querySelectorAll('.field-code'), (node: any, index) => {
      node.value = data[index];

      const fieldIndex = `code${index + 1}`;

      setValue(fieldIndex as ValueNames, data[index]);
    });

    event.preventDefault();
  };

  const handleChangeWithNextField = (
    event: React.ChangeEvent<HTMLInputElement>,
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  ) => {
    const { maxLength, value, name } = event.target;

    const fieldIndex = name.replace('code', '');

    const fieldIntIndex = Number(fieldIndex);

    if (value.length >= maxLength) {
      if (fieldIntIndex < 6) {
        const nextfield = document.querySelector(`input[name=code${fieldIntIndex + 1}]`);

        if (nextfield !== null) {
          (nextfield as HTMLElement).focus();
        }
      }
    }

    handleChange(event);
  };

  const onSubmit = async (data: FormValuesProps) => {
    try {
      await axios.post('/api/auth/password/verify', {
        username: data.username,
        code: `${data.code1}${data.code2}${data.code3}${data.code4}${data.code5}${data.code6}`,
        password: data.password,
      });

      sessionStorage.removeItem('username-recovery');

      enqueueSnackbar(translate('change_password_success'));

      navigate(PATH_DASHBOARD.root, { replace: true });
    } catch (error) {
      console.error(error);
      enqueueSnackbar(translate('change_password_failed'), { variant: 'error' });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFTextField name="username" label={translate('username')} disabled={!!usernameRecovery} />

        <Stack direction="row" spacing={2} justifyContent="center">
          {['code1', 'code2', 'code3', 'code4', 'code5', 'code6'].map((name, index) => (
            <Controller
              key={name}
              name={`code${index + 1}` as ValueNames}
              control={control}
              render={({ field, fieldState: { error } }) => (
                <OutlinedInput
                  {...field}
                  error={!!error}
                  autoFocus={index === 0}
                  placeholder="-"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    handleChangeWithNextField(event, field.onChange)
                  }
                  inputProps={{
                    className: 'field-code',
                    maxLength: 1,
                    sx: {
                      p: 0,
                      textAlign: 'center',
                      width: { xs: 36, sm: 56 },
                      height: { xs: 36, sm: 56 },
                    },
                  }}
                />
              )}
            />
          ))}
        </Stack>

        {(!!errors.code1 ||
          !!errors.code2 ||
          !!errors.code3 ||
          !!errors.code4 ||
          !!errors.code5 ||
          !!errors.code6) && (
          <FormHelperText error sx={{ px: 2 }}>
            {translate('code_is_required')}
          </FormHelperText>
        )}

        <RHFTextField
          name="password"
          label={translate('password')}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <RHFTextField
          name="confirmPassword"
          label={translate('Confirm_password')}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
          sx={{ mt: 3 }}
        >
          {translate('Change Password')}
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
