import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
// @types
import { Role } from '../../@types/role';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

type RoleState = {
  isLoading: boolean;
  error: Error | string | null;
  roles: Role[];
  role: Role | null;
};

const initialState: RoleState = {
  isLoading: false,
  error: null,
  roles: [],
  role: null,
};

const slice = createSlice({
  name: 'role',
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

    // GET ROLES SUCCESS
    getRolesSuccess(state, action) {
      state.roles = action.payload;
    },

    // GET ROLE SUCCESS
    getRoleSuccess(state, action) {
      state.role = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getRoles() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/management/roles');
      dispatch(slice.actions.getRolesSuccess(response.data.roles));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getRole(roleId: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/management/roles/${roleId}`);
      dispatch(slice.actions.getRoleSuccess(response.data.role));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function updateRole(roleId: string, body: Role) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.put(`/api/management/roles/${roleId}`, body);
      dispatch(slice.actions.getRoleSuccess(response.data.role));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function deleteRole(roleId: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.delete(`/api/management/roles/${roleId}`);
      dispatch(slice.actions.getRoleSuccess(response.data.role));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}