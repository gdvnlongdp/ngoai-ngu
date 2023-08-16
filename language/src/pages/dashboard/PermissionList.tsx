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
import { Permission } from '../../@types/permission';
// redux
import { dispatch, useSelector } from '../../redux/store';
import { getPermissions, deletePermission } from '../../redux/slices/permission';
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
import {
  PermissionTableToolbar,
  PermissionTableRow,
} from '../../sections/@dashboard/permission/list';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'description', label: 'Description', align: 'left' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function PermissionList() {
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

  const { permissions } = useSelector((state) => state.permission);

  useEffect(() => {
    (async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
    })()
    dispatch(getPermissions());
  }, []);

  const [filterName, setFilterName] = useState('');

  const handleFilterName = (filterName: string) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleDeleteRow = async (id: string) => {
    try {
      setSelected([]);

      const permission = permissions.find((permission) => permission.id === id);
      if (!permission) {
        throw new Error(translate('something_went_wrong'));
      }

      await dispatch(deletePermission(permission.id));
      await dispatch(getPermissions());
      enqueueSnackbar(translate('delete_permission_success'));
    } catch (error) {
      enqueueSnackbar(translate('delete_permission_failed'), {
        variant: 'error',
      });
      console.error(error);
    }
  };

  const handleDeleteRows = async (selected: string[]) => {
    try {
      setSelected([]);

      const permissionsSelected = permissions.filter((permission) =>
        selected.includes(permission.id)
      );

      for (let permission of permissionsSelected) {
        await dispatch(deletePermission(permission.id));
      }

      await dispatch(getPermissions());
      enqueueSnackbar(translate('delete_permissions_success'));
    } catch (error) {
      enqueueSnackbar(translate('delete_permissions_failed'), {
        variant: 'error',
      });
      console.error(error);
    }
  };

  const handleEditRow = (name: string) => {
    navigate(PATH_DASHBOARD.permission.edit(name));
  };

  const dataFiltered = applySortFilter({
    permissions,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound = !dataFiltered.length && !!filterName;

  return (
    <Page title="Permission: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={translate('Permission List')}
          links={[
            { name: translate('Dashboard'), href: PATH_DASHBOARD.root },
            { name: translate('Permission'), href: PATH_DASHBOARD.permission.root },
            { name: translate('List') },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.permission.new}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              {translate('new_permission')}
            </Button>
          }
        />

        <Card>
          <PermissionTableToolbar filterName={filterName} onFilterName={handleFilterName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              {selected.length > 0 && (
                <TableSelectedActions
                  dense={dense}
                  numSelected={selected.length}
                  rowCount={permissions.length}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      permissions.map((row) => row.id)
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
                  rowCount={permissions.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      permissions.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <PermissionTableRow
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
                    emptyRows={emptyRows(page, rowsPerPage, permissions.length)}
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
  permissions,
  comparator,
  filterName,
}: {
  permissions: Permission[];
  comparator: (a: any, b: any) => number;
  filterName: string;
}) {
  const stabilizedThis = permissions.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  permissions = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    permissions = permissions.filter(
      (item: Record<string, any>) =>
        item.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return permissions;
}
