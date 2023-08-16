// form
import { useFormContext } from 'react-hook-form';
// @mui
import { Stack, MenuItem, InputAdornment } from '@mui/material';
// hooks
import useLocales from '../../../../hooks/useLocales';
// redux
import { useSelector } from '../../../../redux/store';
// components
import { RHFSelect, RHFTextField, RHFSwitch } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

export default function TestNewEditInfomation() {
  const { translate } = useLocales();
  const { channels } = useSelector((state) => state.channel);

  const { watch } = useFormContext();

  const values = watch();

  return (
    <Stack
      spacing={2}
      direction={{ xs: 'column', sm: 'row' }}
      sx={{ p: 3, bgcolor: !values.publish ? 'background.neutral' : undefined }}
    >
      <RHFTextField
        name="title"
        label={translate('Title')}
        InputLabelProps={{
          shrink: true,
        }}
      />

      <RHFSelect
        fullWidth
        name="channel"
        label={translate('Channel')}
        InputLabelProps={{ shrink: true }}
        SelectProps={{ native: false }}
      >
        <MenuItem
          value={''}
          sx={{
            mx: 1,
            my: 0.5,
            borderRadius: 0.75,
            typography: 'body2',
            fontStyle: 'italic',
          }}
        >
          {translate('select_channel')}
        </MenuItem>

        {channels.map((option) => (
          <MenuItem
            key={option.id}
            value={option.id}
            sx={{
              mx: 1,
              my: 0.5,
              borderRadius: 0.75,
              typography: 'body2',
            }}
          >
            {option.name}
          </MenuItem>
        ))}
      </RHFSelect>

      <RHFTextField
        name="duration"
        label={translate('Duration')}
        type="number"
        InputLabelProps={{
          shrink: true,
        }}
        InputProps={{
          endAdornment: <InputAdornment position="end">{translate('Minutes')}</InputAdornment>,
        }}
      />

      <RHFSwitch
        name="publish"
        label={translate('Publish')}
        labelPlacement="start"
        sx={{ mb: 1, mx: 0, width: 1, justifyContent: 'space-around' }}
      />
    </Stack>
  );
}
