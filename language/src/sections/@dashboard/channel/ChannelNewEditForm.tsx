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
// hooks
import useLocales from '../../../hooks/useLocales';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// @types
import { Channel } from '../../../@types/channel';
import { User } from '../../../@types/user';
// redux
import { useSelector } from '../../../redux/store';
// components
import { FormProvider, RHFTextField } from '../../../components/hook-form';

// ----------------------------------------------------------------------

type FormValuesProps = {
  name: string;
  members: User[];
  description?: string;
};

type Props = {
  isEdit: boolean;
  currentChannel?: Channel;
};

export default function ChannelNewEditForm({ isEdit, currentChannel }: Props) {
  const { translate } = useLocales();

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const { users } = useSelector((state) => state.user);

  const NewChannelSchema = Yup.object().shape({
    name: Yup.string().required(translate('channel_is_required')),
    members: Yup.array(),
    description: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentChannel?.name || '',
      members: currentChannel?.members || [],
      description: currentChannel?.description || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentChannel]
  );

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewChannelSchema),
    defaultValues,
  });

  const {
    control,
    reset,
    getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (isEdit && currentChannel) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentChannel]);

  const onSubmit = async (data: FormValuesProps) => {
    const memberIds = data.members.map((member) => member.id);

    try {
      if (!isEdit) {
        await axios.post('/api/management/channels', {
          ...data,
          memberIds,
        });
      } else {
        await axios.put(`/api/management/channels/${currentChannel?.id}`, {
          ...data,
          memberIds,
        });
      }

      reset();
      enqueueSnackbar(translate(!isEdit ? 'create_success' : 'update_success'));
      navigate(PATH_DASHBOARD.channel.list);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(translate(!isEdit ? 'create_channel_failed' : 'update_channel_failed'), {
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
                  <RHFTextField name="name" label={translate('channel_name')} />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="members"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
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
                {translate(!isEdit ? 'create_channel' : 'save_changes')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
