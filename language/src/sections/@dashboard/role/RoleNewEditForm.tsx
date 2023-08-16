import * as Yup from 'yup';
import { useEffect, useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack, Autocomplete, Chip, TextField } from '@mui/material';
// utils
import axios from '../../../utils/axios';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// @types
import { Role } from '../../../@types/role';
import { Permission } from '../../../@types/permission';
// hooks
import useLocales from '../../../hooks/useLocales';
// redux
import { useSelector } from '../../../redux/store';
// components
import { FormProvider, RHFTextField } from '../../../components/hook-form';

// ----------------------------------------------------------------------

type FormValuesProps = {
  name: string;
  permissions: Permission[];
  description?: string;
};

type Props = {
  isEdit: boolean;
  currentRole?: Role;
};

export default function RoleNewEditForm({ isEdit, currentRole }: Props) {
  const { translate } = useLocales();

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const { permissions } = useSelector((state) => state.permission);

  const NewRoleSchema = Yup.object().shape({
    name: Yup.string().required(translate('role_is_required')),
    permissions: Yup.array(),
    description: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentRole?.name || '',
      permissions: currentRole?.permissions || [],
      description: currentRole?.description || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentRole]
  );

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewRoleSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (isEdit && currentRole) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentRole]);

  const onSubmit = async (data: FormValuesProps) => {
    const permissionIds = data.permissions.map((permission) => permission.id);

    try {
      if (!isEdit) {
        await axios.post('/api/management/roles', {
          ...data,
          permissionIds,
        });
      } else {
        await axios.put(`/api/management/roles/${currentRole?.id}`, {
          ...data,
          permissionIds,
        });
      }

      reset();
      enqueueSnackbar(translate(!isEdit ? 'create_success' : 'update_success'));
      navigate(PATH_DASHBOARD.role.list);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(translate(!isEdit ? 'create_role_failed' : 'update_role_failed'), {
        variant: 'error',
      });
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
                  <RHFTextField name="name" label={translate('role_name')} />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="permissions"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        multiple
                        freeSolo
                        value={permissions.filter((el) =>
                          getValues('permissions').find((i) => i.id === el.id)
                        )}
                        onChange={(event, newValue) => field.onChange(newValue)}
                        options={permissions}
                        getOptionLabel={(option) => option.name}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip
                              {...getTagProps({ index })}
                              key={option.id}
                              size="small"
                              label={option.name}
                            />
                          ))
                        }
                        renderInput={(params) => (
                          <TextField label={translate('permission_tags')} {...params} />
                        )}
                      />
                    )}
                  />
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
                {translate(!isEdit ? 'create_role' : 'save_changes')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
