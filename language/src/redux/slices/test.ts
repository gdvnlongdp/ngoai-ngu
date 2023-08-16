import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
// @types
import { Test } from '../../@types/test';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

type TestState = {
  isLoading: boolean;
  error: Error | string | null;
  tests: Test[];
  test: Test | null;
};

const initialState: TestState = {
  isLoading: false,
  error: null,
  tests: [],
  test: null,
};

const slice = createSlice({
  name: 'test',
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

    // GET TESTS SUCCESS
    getTestsSuccess(state, action) {
      state.tests = action.payload;
    },

    // GET TEST SUCCESS
    getTestSuccess(state, action) {
      state.test = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getTests() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/management/tests');
      dispatch(slice.actions.getTestsSuccess(response.data.tests));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getTest(id: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/management/tests/${id}`);
      dispatch(slice.actions.getTestSuccess(response.data.test));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function updateTest(id: string, body: Test) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.put(`/api/management/tests/${id}`, body);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function deleteTest(id: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.delete(`/api/management/tests/${id}`);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}