// @mui
import { InputAdornment, ClickAwayListener } from '@mui/material';
// hooks
import useLocales from '../../../hooks/useLocales';
// components
import Iconify from '../../../components/Iconify';
import InputStyle from '../../../components/InputStyle';

// ----------------------------------------------------------------------

type Props = {
  query: string;
  onChange: React.ChangeEventHandler;
  onFocus: VoidFunction;
  onClickAway: VoidFunction;
};

export default function ChatConversationSearch({ query, onChange, onFocus, onClickAway }: Props) {
  const { translate } = useLocales();

  return (
    <ClickAwayListener onClickAway={onClickAway}>
      <InputStyle
        fullWidth
        size="small"
        value={query}
        onFocus={onFocus}
        onChange={onChange}
        placeholder={`${translate('search')} ...`}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify
                icon="eva:search-fill"
                sx={{ color: 'text.disabled', width: 20, height: 20 }}
              />
            </InputAdornment>
          ),
        }}
        sx={{ mt: 0.1, mr: 2 }}
      />
    </ClickAwayListener>
  );
}
