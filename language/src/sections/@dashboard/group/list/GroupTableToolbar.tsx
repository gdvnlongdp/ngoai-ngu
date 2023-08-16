import { Stack, InputAdornment, TextField, MenuItem } from '@mui/material';
// hooks
import useLocales from '../../../../hooks/useLocales';
// components
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

type Props = {
  optionsChannel: string[];
  filterName: string;
  filterChannel: string;
  onFilterName: (value: string) => void;
  onFilterChannel: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function GroupTableToolbar({
  filterName,
  filterChannel,
  onFilterName,
  onFilterChannel,
  optionsChannel,
}: Props) {
  const { translate } = useLocales();
  return (
    <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ py: 2.5, px: 3 }}>
      <TextField
        fullWidth
        select
        label={translate('Channel')}
        value={filterChannel}
        onChange={onFilterChannel}
        SelectProps={{
          MenuProps: {
            sx: { '& .MuiPaper-root': { maxHeight: 260 } },
          },
        }}
        sx={{
          maxWidth: { sm: 240 },
          textTransform: 'capitalize',
        }}
      >
        {optionsChannel.map((option) => (
          <MenuItem
            key={option}
            value={option}
            sx={{
              mx: 1,
              my: 0.5,
              borderRadius: 0.75,
              typography: 'body2',
              textTransform: 'capitalize',
            }}
          >
            {translate(option)}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth
        value={filterName}
        onChange={(event) => onFilterName(event.target.value)}
        placeholder={`${translate('search')} ${translate('group')}...`}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify
                icon={'eva:search-fill'}
                sx={{ color: 'text.disabled', width: 20, height: 20 }}
              />
            </InputAdornment>
          ),
        }}
      />
    </Stack>
  );
}
