import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
// @types
import { User } from '../../@types/user';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

type UserState = {
  isLoading: boolean;
  error: Error | string | null;
  users: User[];
  user: User | null;
};

const initialState: UserState = {
  isLoading: false,
  error: null,
  users: [],
  user: null,
};

const slice = createSlice({
  name: 'user',
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

    // GET USERS SUCCESS
    getUsersSuccess(state, action) {
      state.users = action.payload;
    },

    // GET USER SUCCESS
    getUserSuccess(state, action) {
      state.user = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getUsers() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/management/users');
      dispatch(slice.actions.getUsersSuccess(response.data.users));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getUser(userId: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/management/users/${userId}`);
      dispatch(slice.actions.getUserSuccess(response.data.user));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function updateUser(userId: string, body: User) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.put(`/api/management/users/${userId}`, body);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function deleteUser(userId: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.delete(`/api/management/users/${userId}`);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}