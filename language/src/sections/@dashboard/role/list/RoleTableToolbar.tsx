import { Stack, InputAdornment, TextField } from '@mui/material';
// hooks
import useLocales from '../../../../hooks/useLocales';
// components
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

type Props = {
  optionsRole: string[];
  filterName: string;
  filterRole: string;
  onFilterName: (value: string) => void;
  onFilterRole: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function RoleTableToolbar({ filterName, onFilterName }: Props) {
  const { translate } = useLocales();

  return (
    <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ py: 2.5, px: 3 }}>
      <TextField
        fullWidth
        value={filterName}
        onChange={(event) => onFilterName(event.target.value)}
        placeholder={`${translate('search')} ${translate('role')}...`}
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
