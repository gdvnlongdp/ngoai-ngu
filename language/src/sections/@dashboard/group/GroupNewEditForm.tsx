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
import { Group } from '../../../@types/group';
import { User } from '../../../@types/user';
// redux
import { useSelector } from '../../../redux/store';
// components
import { FormProvider, RHFSelect, RHFTextField } from '../../../components/hook-form';
import useLocales from 'src/hooks/useLocales';

// ----------------------------------------------------------------------

type FormValuesProps = {
  name: string;
  channel: string;
  members: User[];
  description?: string;
};

type Props = {
  isEdit: boolean;
  currentGroup?: Group;
};

export default function GroupNewEditForm({ isEdit, currentGroup }: Props) {
  const { translate } = useLocales();

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const { channels } = useSelector((state) => state.channel);

  const NewGroupSchema = Yup.object().shape({
    name: Yup.string().required(translate('group_is_required')),
    channel: Yup.string().required(translate('channel_is_required')),
    members: Yup.array(),
    description: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentGroup?.name || '',
      channel: currentGroup?.channel.id || '',
      members: currentGroup?.members || [],
      description: currentGroup?.description || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentGroup]
  );

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewGroupSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    getValues,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const users = channels.find((channel) => channel.id === values.channel)?.members || [];

  useEffect(() => {
    if (isEdit && currentGroup) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentGroup]);

  const onSubmit = async (data: FormValuesProps) => {
    const memberIds = data.members.map((member) => member.id);

    console.log(memberIds);

    try {
      if (!isEdit) {
        await axios.post('/api/management/groups', {
          ...data,
          channelId: data.channel,
          memberIds,
        });
      } else {
        await axios.put(`/api/management/groups/${currentGroup?.id}`, {
          ...data,
          channelId: data.channel,
          memberIds,
        });
      }

      reset();
      enqueueSnackbar(translate(!isEdit ? 'create_success' : 'update_success'));
      navigate(PATH_DASHBOARD.group.list);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(translate(!isEdit ? 'create_group_failed' : 'update_group_failed'), {
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
                  <RHFTextField name="name" label={translate('group_name')} />
                </Grid>
                <Grid item xs={12}>
                  {channels.length && (
                    <RHFSelect
                      name="channel"
                      label={translate('Channel')}
                      placeholder={translate('Channel')}
                    >
                      <option value="" />
                      {channels.map((option, index) => (
                        <option key={index} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                    </RHFSelect>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="members"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        disabled={!values.channel}
                        multiple
                        freeSolo
                        value={users.filter((el) =>
                          getValues('members').find((i) => i.id === el.id)
                        )}
                        onChange={(event, newValue) => field.onChange(newValue)}
                        options={users}
                        getOptionLabel={(option) => option.username}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip
                              {...getTagProps({ index })}
                              key={option.id}
                              size="small"
                              label={option.username}
                            />
                          ))
                        }
                        renderInput={(params) => (
                          <TextField label={translate('user_tags')} {...params} />
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
                {translate(!isEdit ? 'create_group' : 'save_changes')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
