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
import { Role } from '../../@types/role';
// redux
import { dispatch, useSelector } from '../../redux/store';
import { getRoles, deleteRole } from '../../redux/slices/role';
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
import { RoleTableToolbar, RoleTableRow } from '../../sections/@dashboard/role/list';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'permissions', label: 'Permissions', align: 'left' },
  { id: 'description', label: 'Description', align: 'left' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function RoleList() {
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

  const { roles } = useSelector((state) => state.role);

  useEffect(() => {
    dispatch(getRoles());
  }, []);

  const [filterName, setFilterName] = useState('');
  const [filterRole, setFilterRole] = useState('all');

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

      const role = roles.find((role) => role.id === id);
      if (!role) {
        throw new Error(translate('something_went_wrong'));
      }

      await dispatch(deleteRole(role.id));
      await dispatch(getRoles());
      enqueueSnackbar(translate('delete_role_success'));
    } catch (error) {
      enqueueSnackbar(translate('delete_role_failed'), {
        variant: 'error',
      });
      console.error(error);
    }
  };

  const handleDeleteRows = async (selected: string[]) => {
    try {
      setSelected([]);

      const rolesSelected = roles.filter((role) => selected.includes(role.id));

      for (let role of rolesSelected) {
        await dispatch(deleteRole(role.id));
      }

      await dispatch(getRoles());
      enqueueSnackbar(translate('delete_roles_success'));
    } catch (error) {
      enqueueSnackbar(translate('delete_roles_failed'), {
        variant: 'error',
      });
      console.error(error);
    }
  };

  const handleEditRow = (name: string) => {
    navigate(PATH_DASHBOARD.role.edit(name));
  };

  const dataFiltered = applySortFilter({
    roles,
    comparator: getComparator(order, orderBy),
    filterName,
    filterRole,
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound =
    (!dataFiltered.length && !!filterName) || (!dataFiltered.length && !!filterRole);

  return (
    <Page title="Role: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={translate('Role List')}
          links={[
            { name: translate('Dashboard'), href: PATH_DASHBOARD.root },
            { name: translate('Role'), href: PATH_DASHBOARD.role.root },
            { name: translate('List') },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.role.new}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              {translate('new_role')}
            </Button>
          }
        />

        <Card>
          <RoleTableToolbar
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
                  rowCount={roles.length}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      roles.map((row) => row.id)
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
                  rowCount={roles.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      roles.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <RoleTableRow
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
                    emptyRows={emptyRows(page, rowsPerPage, roles.length)}
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
  roles,
  comparator,
  filterName,
  filterRole,
}: {
  roles: Role[];
  comparator: (a: any, b: any) => number;
  filterName: string;
  filterRole: string;
}) {
  const stabilizedThis = roles.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  roles = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    roles = roles.filter(
      (item: Record<string, any>) =>
        item.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterRole !== 'all') {
    roles = roles.filter((item: Record<string, any>) => item.name === filterRole);
  }

  return roles;
}
