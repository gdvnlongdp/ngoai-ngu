import { useState } from 'react';
// @mui
import { Checkbox, TableRow, TableCell, Typography, MenuItem } from '@mui/material';
// @types
import { Group } from '../../../../@types/group';
// components
import Avatar from '../../../../components/Avatar';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';
// utils
import createAvatar from '../../../../utils/createAvatar';
import useLocales from 'src/hooks/useLocales';

// ----------------------------------------------------------------------

type Props = {
  row: Group;
  selected: boolean;
  onEditRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function GroupTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
}: Props) {
  const { translate } = useLocales();
  const { id, name, channel, members, description } = row;

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
        <Avatar alt={id} color={createAvatar(name).color} sx={{ mr: 2, borderRadius: 1 }}>
          {createAvatar(name).name}
        </Avatar>
        <Typography variant="subtitle2" noWrap>
          {name}
        </Typography>
      </TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {channel ? channel.name : ' '}
      </TableCell>

      <TableCell align="left">{members?.length}</TableCell>

      <TableCell align="left">{description}</TableCell>

      <TableCell align="right">
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <>
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
      </TableCell>
    </TableRow>
  );
}
