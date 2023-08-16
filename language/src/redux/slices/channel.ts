import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
// @types
import { Channel } from '../../@types/channel';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

type ChannelState = {
  isLoading: boolean;
  error: Error | string | null;
  channels: Channel[];
  channel: Channel | null;
};

const initialState: ChannelState = {
  isLoading: false,
  error: null,
  channels: [],
  channel: null,
};

const slice = createSlice({
  name: 'channel',
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

    // GET CHANNEL SUCCESS
    getChannelSuccess(state, action) {
      state.channel = action.payload;
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
      const response = await axios.get('/api/management/channels');
      dispatch(slice.actions.getChannelsSuccess(response.data.channels));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getChannel(channelId: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/management/channels/${channelId}`);
      dispatch(slice.actions.getChannelSuccess(response.data.channel));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function updateChannel(channelId: string, body: Channel) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.put(`/api/management/channels/${channelId}`, body);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function deleteChannel(channelId: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.delete(`/api/management/channels/${channelId}`);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}