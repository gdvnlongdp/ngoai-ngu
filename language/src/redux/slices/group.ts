import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
// @types
import { Group } from '../../@types/group';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

type GroupState = {
  isLoading: boolean;
  error: Error | string | null;
  groups: Group[];
  group: Group | null;
};

const initialState: GroupState = {
  isLoading: false,
  error: null,
  groups: [],
  group: null,
};

const slice = createSlice({
  name: 'group',
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

    // GET GROUPS SUCCESS
    getGroupsSuccess(state, action) {
      state.groups = action.payload;
    },

    // GET GROUP SUCCESS
    getGroupSuccess(state, action) {
      state.group = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getGroups() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/management/groups');
      dispatch(slice.actions.getGroupsSuccess(response.data.groups));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getGroup(groupId: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/management/groups/${groupId}`);
      dispatch(slice.actions.getGroupSuccess(response.data.group));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function updateGroup(groupId: string, body: Group) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.put(`/api/management/groups/${groupId}`, body);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function deleteGroup(groupId: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.delete(`/api/management/groups/${groupId}`);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
