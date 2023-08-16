import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
// @types
import { Permission } from '../../@types/permission';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

type PermissionState = {
  isLoading: boolean;
  error: Error | string | null;
  permissions: Permission[];
  permission: Permission | null;
};

const initialState: PermissionState = {
  isLoading: false,
  error: null,
  permissions: [],
  permission: null,
};

const slice = createSlice({
  name: 'permission',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET PERMISSIONS SUCCESS
    getPermissionsSuccess(state, action) {
      state.permissions = action.payload;
    },

    // GET PERMISSION SUCCESS
    getPermissionSuccess(state, action) {
      state.permission = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getPermissions() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/management/permissions');
      dispatch(slice.actions.getPermissionsSuccess(response.data.permissions));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getPermission(permissionId: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/management/permissions/${permissionId}`);
      dispatch(slice.actions.getPermissionSuccess(response.data.permission));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function updatePermission(permissionId: string, body: Permission) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.put(`/api/management/permissions/${permissionId}`, body);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function deletePermission(permissionId: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.delete(`/api/management/permissions/${permissionId}`);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
