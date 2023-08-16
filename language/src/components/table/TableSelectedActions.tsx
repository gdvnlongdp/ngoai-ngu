// @mui
import { Checkbox, Typography, Stack, StackProps } from '@mui/material';
// hooks
import useLocales from '../../hooks/useLocales';

// ----------------------------------------------------------------------

interface Props extends StackProps {
  dense?: boolean;
  actions?: React.ReactNode;
  rowCount: number;
  numSelected: number;
  onSelectAllRows: (checked: boolean) => void;
}

export default function TableSelectedActions({
  dense,
  actions,
  rowCount,
  numSelected,
  onSelectAllRows,
  sx,
  ...other
}: Props) {
  const { translate } = useLocales();

  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        px: 3,
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9,
        height: 58,
        borderRadius: 0,
        position: 'absolute',
        bgcolor: 'primary.lighter',
        ...(dense && {
          pl: 2,
          height: 38,
        }),
        ...sx,
      }}
      {...other}
    >
      <Checkbox
        indeterminate={numSelected > 0 && numSelected < rowCount}
        checked={rowCount > 0 && numSelected === rowCount}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          onSelectAllRows(event.target.checked)
        }
      />

      <Typography
        variant="subtitle1"
        sx={{
          ml: 2,
          flexGrow: 1,
          color: 'primary.main',
          ...(dense && {
            ml: 3,
          }),
        }}
      >
        {numSelected} {translate('selected')}
      </Typography>

      {actions && actions}
    </Stack>
  );
}
