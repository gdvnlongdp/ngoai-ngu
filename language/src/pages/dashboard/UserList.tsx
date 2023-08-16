import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
// @mui
import {
  Box,
  Tab,
  Tabs,
  Card,
  Table,
  Switch,
  Button,
  Tooltip,
  Divider,
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
import useTabs from '../../hooks/useTabs';
import useLocales from '../../hooks/useLocales';
import useSettings from '../../hooks/useSettings';
import useTable, { getComparator, emptyRows } from '../../hooks/useTable';
// @types
import { User } from '../../@types/user';
// redux
import { dispatch, useSelector } from '../../redux/store';
import { getRoles } from '../../redux/slices/role';
import { getUsers, deleteUser } from '../../redux/slices/user';
import { deleteProfile } from '../../redux/slices/profile';
import { getCodes } from '../../redux/slices/requirement';
// utils
import rolesToRoleNameArray from '../../utils/rolesToRoleNameArray';
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
import { UserTableToolbar, UserTableRow } from '../../sections/@dashboard/user/list';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['all', 'active', 'banned'];

const TABLE_HEAD = [
  { id: 'username', label: 'username', align: 'left' },
  { id: 'profle.name', label: 'name', align: 'left' },
  { id: 'role.name', label: 'role', align: 'left' },
  { id: 'isBanned', label: 'status', align: 'left' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function UserList() {
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

  const { enqueueSnackbar } = useSnackbar();
  const { themeStretch } = useSettings();

  const { roles } = useSelector((state) => state.role);
  const { users } = useSelector((state) => state.user);
  const { codes } = useSelector((state) => state.requirement);

  useEffect(() => {
    dispatch(getRoles());
    dispatch(getUsers());
    dispatch(getCodes());
  }, []);

  const [filterName, setFilterName] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('all');

  const handleFilterName = (filterName: string) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleFilterRole = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterRole(event.target.value);
  };

  const handleDeleteRow = async (id: string) => {
    try {
      setSelected([]);

      const user = users.find((user) => user.id === id);
      if (!user) {
        throw new Error(translate('something_went_wrong'));
      }

      await dispatch(deleteProfile(user.profile.id));
      await dispatch(deleteUser(user.id));
      await dispatch(getUsers());
      enqueueSnackbar(translate('delete_user_success'));
    } catch (error) {
      enqueueSnackbar(translate('delete_user_failed'), {
        variant: 'error',
      });
      console.error(error);
    }
  };

  const handleDeleteRows = async (selected: string[]) => {
    try {
      setSelected([]);

      const usersSelected = users.filter((user) => selected.includes(user.id));

      for (let user of usersSelected) {
        await dispatch(deleteProfile(user.profile.id));
        await dispatch(deleteUser(user.id));
      }

      await dispatch(getUsers());
      enqueueSnackbar(translate('delete_users_success'));
    } catch (error) {
      enqueueSnackbar(translate('delete_users_failed'), {
        variant: 'error',
      });
      console.error(error);
    }
  };

  const handleEditRow = (username: string) => {
    navigate(PATH_DASHBOARD.user.edit(username));
  };

  const dataFiltered = applySortFilter({
    users,
    comparator: getComparator(order, orderBy),
    filterName,
    filterRole,
    filterStatus,
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterRole) ||
    (!dataFiltered.length && !!filterStatus);

  return (
    <Page title="User: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={translate('User List')}
          links={[
            { name: translate('Dashboard'), href: PATH_DASHBOARD.root },
            { name: translate('User'), href: PATH_DASHBOARD.user.root },
            { name: translate('List') },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.user.new}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              {translate('new_user')}
            </Button>
          }
        />

        <Card>
          <Tabs
            allowScrollButtonsMobile
            variant="scrollable"
            scrollButtons="auto"
            value={filterStatus}
            onChange={onChangeFilterStatus}
            sx={{ px: 2, bgcolor: 'background.neutral' }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab disableRipple key={tab} label={translate(tab)} value={tab} />
            ))}
          </Tabs>

          <Divider />

          <UserTableToolbar
            filterName={filterName}
            filterRole={filterRole}
            onFilterName={handleFilterName}
            onFilterRole={handleFilterRole}
            optionsRole={rolesToRoleNameArray(roles)}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              {selected.length > 0 && (
                <TableSelectedActions
                  dense={dense}
                  numSelected={selected.length}
                  rowCount={users.length}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      users.map((row) => row.id)
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
                  rowCount={users.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      users.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <UserTableRow
                        key={row.id}
                        row={row}
                        code={codes.byId[row.id]}
                        selected={selected.includes(row.id)}
                        onSelectRow={() => onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => handleEditRow(row.username)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, users.length)}
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
  users,
  comparator,
  filterName,
  filterStatus,
  filterRole,
}: {
  users: User[];
  comparator: (a: any, b: any) => number;
  filterName: string;
  filterStatus: string;
  filterRole: string;
}) {
  const stabilizedThis = users.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  users = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    users = users.filter(
      (item: Record<string, any>) =>
        item.username.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item.profile.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterStatus !== 'all') {
    users = users.filter(
      (item: Record<string, any>) => item.isBanned === (filterStatus === 'banned')
    );
  }

  if (filterRole !== 'all') {
    users = users.filter((item: Record<string, any>) => item.role.name === filterRole);
  }

  return users;
}
