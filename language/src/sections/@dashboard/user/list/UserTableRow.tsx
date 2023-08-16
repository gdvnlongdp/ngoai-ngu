import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Checkbox, TableRow, TableCell, Typography, MenuItem, Badge } from '@mui/material';
// @types
import { User } from '../../../../@types/user';
import { Code } from '../../../../@types/code';

// hooks
import useLocales from '../../../../hooks/useLocales';
// components
import Avatar from '../../../../components/Avatar';
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';
// utils
import createAvatar from '../../../../utils/createAvatar';

// ----------------------------------------------------------------------

type Props = {
  row: User;
  code: Code;
  selected: boolean;
  onEditRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function UserTableRow({
  row,
  code,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
}: Props) {
  const { translate } = useLocales();
  const theme = useTheme();

  const { username, profile, role, isBanned } = row;

  const [openMenu, setOpenMenuActions] = useState<HTMLElement | null>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          src={profile.avatar}
          alt={profile.id}
          color={profile.avatar ? 'default' : createAvatar(profile.name).color}
          sx={{ mr: 2 }}
        >
          {createAvatar(profile.name).name}
        </Avatar>
        <Typography variant="subtitle2" noWrap>
          {username}
        </Typography>
      </TableCell>

      <TableCell align="left">{profile.name}</TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {translate(role.name)}
      </TableCell>

      <TableCell align="left">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={isBanned ? 'error' : 'success'}
          sx={{ textTransform: 'capitalize' }}
        >
          {translate(isBanned ? 'banned' : 'active')}
        </Label>
      </TableCell>

      <TableCell align="right">
        <Badge color="error" variant={code ? 'dot' : undefined}>
          <TableMoreMenu
            open={openMenu}
            onOpen={handleOpenMenu}
            onClose={handleCloseMenu}
            actions={
              <>
                {code && (
                  <MenuItem sx={{ color: 'secondary.main' }}>
                    <Iconify icon={'teenyicons:otp-outline'} />
                    <Typography variant="subtitle2" noWrap>
                      {code.otp}
                    </Typography>
                  </MenuItem>
                )}
                <MenuItem
                  onClick={() => {
                    onEditRow();
                    handleCloseMenu();
                  }}
                >
                  <Iconify icon={'eva:edit-fill'} />
                  {translate('Edit')}
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    onDeleteRow();
                    handleCloseMenu();
                  }}
                  sx={{ color: 'error.main' }}
                >
                  <Iconify icon={'eva:trash-2-outline'} />
                  {translate('Delete')}
                </MenuItem>
              </>
            }
          />
        </Badge>
      </TableCell>
    </TableRow>
  );
}
