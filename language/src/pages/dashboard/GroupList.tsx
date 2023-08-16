import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
// @mui
import {
  Box,
  Card,
  Table,
  Switch,
  Button,
  Tooltip,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  TablePagination,
  FormControlLabel,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useLocales from '../../hooks/useLocales';
import useSettings from '../../hooks/useSettings';
import useTable, { getComparator, emptyRows } from '../../hooks/useTable';
// @types
import { Group } from '../../@types/group';
// redux
import { dispatch, useSelector } from '../../redux/store';
import { getChannels } from '../../redux/slices/channel';
import { getGroups, deleteGroup } from '../../redux/slices/group';
// utils
import channelsToChannelNameArray from '../../utils/channelsToChannelNameArray';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import {
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedActions,
} from '../../components/table';
// sections
import { GroupTableToolbar, GroupTableRow } from '../../sections/@dashboard/group/list';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'channel', label: 'Channel', align: 'left' },
  { id: 'members', label: 'Members', align: 'left' },
  { id: 'description', label: 'Description', align: 'left' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function GroupList() {
  const { translate } = useLocales();

  const navigate = useNavigate();
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettings();
  const { enqueueSnackbar } = useSnackbar();

  const { channels } = useSelector((state) => state.channel);
  const { groups } = useSelector((state) => state.group);

  useEffect(() => {
    dispatch(getGroups());
    dispatch(getChannels());
  }, []);

  const [filterName, setFilterName] = useState('');
  const [filterChannel, setFilterChannel] = useState('all');

  const handleFilterName = (filterName: string) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleFilterChannel = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterChannel(event.target.value);
  };

  const handleDeleteRow = async (id: string) => {
    try {
      setSelected([]);

      const group = groups.find((group) => group.id === id);
      if (!group) {
        throw new Error(translate('something_went_wrong'));
      }

      await dispatch(deleteGroup(group.id));
      await dispatch(getGroups());
      enqueueSnackbar(translate('delete_group_success'));
    } catch (error) {
      enqueueSnackbar(translate('delete_group_failed'), {
        variant: 'error',
      });
      console.error(error);
    }
  };

  const handleDeleteRows = async (selected: string[]) => {
    try {
      setSelected([]);

      const groupsSelected = groups.filter((group) => selected.includes(group.id));

      for (let group of groupsSelected) {
        await dispatch(deleteGroup(group.id));
      }

      await dispatch(getGroups());
      enqueueSnackbar(translate('delete_groups_success'));
    } catch (error) {
      enqueueSnackbar(translate('delete_groups_failed'), {
        variant: 'error',
      });
      console.error(error);
    }
  };

  const handleEditRow = (name: string) => {
    navigate(PATH_DASHBOARD.group.edit(name));
  };

  const dataFiltered = applySortFilter({
    groups,
    comparator: getComparator(order, orderBy),
    filterName,
    filterChannel,
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound =
    (!dataFiltered.length && !!filterName) || (!dataFiltered.length && !!filterChannel);

  return (
    <Page title="Group: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={translate('Group List')}
          links={[
            { name: translate('Dashboard'), href: PATH_DASHBOARD.root },
            { name: translate('Group'), href: PATH_DASHBOARD.group.root },
            { name: translate('List') },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.group.new}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              {translate('new_group')}
            </Button>
          }
        />

        <Card>
          <GroupTableToolbar
            filterName={filterName}
            filterChannel={filterChannel}
            onFilterName={handleFilterName}
            onFilterChannel={handleFilterChannel}
            optionsChannel={channelsToChannelNameArray(channels)}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              {selected.length > 0 && (
                <TableSelectedActions
                  dense={dense}
                  numSelected={selected.length}
                  rowCount={groups.length}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      groups.map((row) => row.id)
                    )
                  }
                  actions={
                    <Tooltip title={translate('Delete')}>
                      <IconButton color="primary" onClick={() => handleDeleteRows(selected)}>
                        <Iconify icon={'eva:trash-2-outline'} />
                      </IconButton>
                    </Tooltip>
                  }
                />
              )}

              <Table size={dense ? 'small' : 'medium'}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={groups.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      groups.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <GroupTableRow
                        key={row.id}
                        row={row}
                        selected={selected.includes(row.id)}
                        onSelectRow={() => onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => handleEditRow(row.name)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, groups.length)}
                  />

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <Box sx={{ position: 'relative' }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={dataFiltered.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
            />

            <FormControlLabel
              control={<Switch checked={dense} onChange={onChangeDense} />}
              label={translate('Dense')}
              sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
            />
          </Box>
        </Card>
      </Container>
    </Page>
  );
}

// ----------------------------------------------------------------------

function applySortFilter({
  groups,
  comparator,
  filterName,
  filterChannel,
}: {
  groups: Group[];
  comparator: (a: any, b: any) => number;
  filterName: string;
  filterChannel: string;
}) {
  const stabilizedThis = groups.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  groups = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    groups = groups.filter(
      (item: Record<string, any>) =>
        item.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterChannel !== 'all') {
    groups = groups.filter((item: Record<string, any>) => item.channel.name === filterChannel);
  }

  return groups;
}
