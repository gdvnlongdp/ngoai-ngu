import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
// @types
import { Code } from '../../@types/code';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

function objFromArray(array: any[], key1d = 'id', key2d = 'id') {
  return array.reduce((accumulator, current) => {
    accumulator[current[key1d][key2d]] = current;
    return accumulator;
  }, {});
}

type CodeState = {
  isLoading: boolean;
  error: Error | string | null;
  codes: {
    byId: Record<string, Code>;
    allIds: string[];
  };
};

const initialState: CodeState = {
  isLoading: false,
  error: null,
  codes: { byId: {}, allIds: [] },
};

const slice = createSlice({
  name: 'requirement',
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

    // GET CODES
    getCodesSuccess(state, action) {
      const codes = action.payload;

      state.codes.byId = objFromArray(codes, 'user', 'id');
      state.codes.allIds = Object.keys(state.codes.byId);
    },
  },
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getCodes() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/management/requirements/reset-password/codes`);
      dispatch(slice.actions.getCodesSuccess(response.data.codes));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
