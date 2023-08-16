import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
// @types
import { Profile } from '../../@types/profile';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

type ProfileState = {
  isLoading: boolean;
  error: Error | string | null;
  profiles: Profile[];
  profile: Profile | null;
};

const initialState: ProfileState = {
  isLoading: false,
  error: null,
  profiles: [],
  profile: null,
};

const slice = createSlice({
  name: 'profile',
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

    // GET PROFILES SUCCESS
    getProfilesSuccess(state, action) {
      state.profiles = action.payload;
    },

    // GET PROFILE SUCCESS
    getProfileSuccess(state, action) {
      state.profile = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getProfiles() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/management/profiles');
      dispatch(slice.actions.getProfilesSuccess(response.data.profiles));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getProfile(profileId: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/management/profiles/${profileId}`);
      dispatch(slice.actions.getProfileSuccess(response.data.profile));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function updateProfile(profileId: string, body: Profile) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.put(`/api/management/profiles/${profileId}`, body);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function deleteProfile(profileId: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.delete(`/api/management/profiles/${profileId}`);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}