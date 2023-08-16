import * as Yup from 'yup';
import { useEffect, useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack } from '@mui/material';
// hooks
import useLocales from '../../../hooks/useLocales';
// utils
import axios from '../../../utils/axios';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// @types
import { Permission } from '../../../@types/permission';
// components
import { FormProvider, RHFTextField } from '../../../components/hook-form';

// ----------------------------------------------------------------------

type FormValuesProps = {
  name: string;
  description?: string;
};

type Props = {
  isEdit: boolean;
  currentPermission?: Permission;
};

export default function PermissionNewEditForm({ isEdit, currentPermission }: Props) {
  const { translate } = useLocales();
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const NewPermissionSchema = Yup.object().shape({
    name: Yup.string().required(translate('permission_is_required')),
    description: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentPermission?.name || '',
      description: currentPermission?.description || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentPermission]
  );

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewPermissionSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (isEdit && currentPermission) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentPermission]);

  const onSubmit = async (data: FormValuesProps) => {
    try {
      if (!isEdit) {
        await axios.post('/api/management/permissions', data);
      } else {
        await axios.put(`/api/management/permissions/${currentPermission?.id}`, data);
      }

      reset();
      enqueueSnackbar(translate(!isEdit ? 'create_success' : 'update_success'));
      navigate(PATH_DASHBOARD.permission.list);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(
        translate(!isEdit ? 'create_permission_failed' : 'update_permission_failed'),
        {
          variant: 'error',
        }
      );
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container justifyContent="center">
        <Grid item>
          <Card sx={{ py: 6, px: 3 }}>
            <Stack spacing={3} alignItems="flex-end">
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <RHFTextField name="name" label={translate('permission_name')} />
                </Grid>
                <Grid item xs={12}>
                  <RHFTextField
                    name="description"
                    multiline
                    rows={3}
                    label={translate('Description')}
                  />
                </Grid>
              </Grid>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {translate(!isEdit ? 'create_permission' : 'save_changes')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
