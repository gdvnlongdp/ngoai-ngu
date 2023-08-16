import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
// @types
import { Test, ISubmission } from '../../@types/test';
import { Channel } from '../../@types/channel';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

type SubmitState = {
  isLoading: boolean;
  error: Error | string | null;
  channels: Channel[];
  tests: Test[];
  submission: ISubmission | null;
};

const initialState: SubmitState = {
  isLoading: false,
  error: null,
  channels: [],
  tests: [],
  submission: null,
};

const slice = createSlice({
  name: 'submission',
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

    // GET CHANNELS SUCCESS
    getChannelsSuccess(state, action) {
      state.channels = action.payload;
    },

    // GET TESTS SUCCESS
    getTestsSuccess(state, action) {
      state.tests = action.payload;
    },

    // GET SUBMISSION SUCCESS
    getSubmissionSuccess(state, action) {
      state.submission = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getChannels() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/general/submits/channels');
      dispatch(slice.actions.getChannelsSuccess(response.data.channels));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getTests() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/general/submits/tests');
      dispatch(slice.actions.getTestsSuccess(response.data.tests));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getSubmission(id: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/general/submits/submission/${id}`);
      dispatch(slice.actions.getSubmissionSuccess(response.data.submission));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
