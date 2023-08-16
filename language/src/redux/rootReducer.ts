import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
// slices
import chatReducer from './slices/chat';
import userReducer from './slices/user';
import roleReducer from './slices/role';
import profileReducer from './slices/profile';
import permissionReducer from './slices/permission';
import channelReducer from './slices/channel';
import groupReducer from './slices/group';
import requirementReducer from './slices/requirement';
import testReducer from './slices/test';
import submitReducer from './slices/submission';

// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

const rootReducer = combineReducers({
  chat: chatReducer,
  user: userReducer,
  role: roleReducer,
  profile: profileReducer,
  permission: permissionReducer,
  channel: channelReducer,
  group: groupReducer,
  requirement: requirementReducer,
  test: testReducer,
  submit: submitReducer,
});

export { rootPersistConfig, rootReducer };
