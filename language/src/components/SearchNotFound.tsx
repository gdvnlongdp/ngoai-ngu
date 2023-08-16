import { Paper, PaperProps, Typography } from '@mui/material';
import useLocales from '../hooks/useLocales';

// ----------------------------------------------------------------------

interface Props extends PaperProps {
  searchQuery?: string;
}

export default function SearchNotFound({ searchQuery = '', ...other }: Props) {
  const { translate } = useLocales();

  return searchQuery ? (
    <Paper {...other}>
      <Typography gutterBottom align="center" variant="subtitle1">
        {translate('not_found')}
      </Typography>
      <Typography variant="body2" align="center">
        {translate('no_results_found_for')} &nbsp;
        <strong>&quot;{searchQuery}&quot;</strong>
      </Typography>
    </Paper>
  ) : (
    <Typography variant="body2"> {translate('please_enter_keywords')}</Typography>
  );
}
