// @mui
import { TableRow, TableCell } from '@mui/material';
// hooks
import useLocales from '../../hooks/useLocales';
//
import EmptyContent from '../EmptyContent';

// ----------------------------------------------------------------------

type Props = {
  isNotFound: boolean;
};

export default function TableNoData({ isNotFound }: Props) {
  const { translate } = useLocales();

  return (
    <TableRow>
      {isNotFound ? (
        <TableCell colSpan={12}>
          <EmptyContent
            title={translate('no_data')}
            sx={{
              '& span.MuiBox-root': { height: 160 },
            }}
          />
        </TableCell>
      ) : (
        <TableCell colSpan={12} sx={{ p: 0 }} />
      )}
    </TableRow>
  );
}
