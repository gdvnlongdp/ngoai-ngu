// ----------------------------------------------------------------------

function path(root: string, sublink: string) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  verify: path(ROOTS_AUTH, '/verify'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  newPassword: path(ROOTS_AUTH, '/new-password'),
};

export const PATH_PAGE = {
  page403: '/403',
  page404: '/404',
  page500: '/500',
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  analytics: path(ROOTS_DASHBOARD, '/analytics'),
  submit: {
    root: path(ROOTS_DASHBOARD, '/submit'),
    test: (id: string) => path(ROOTS_DASHBOARD, `/submit/${id}`),
  },
  chat: {
    root: path(ROOTS_DASHBOARD, '/chat'),
    new: path(ROOTS_DASHBOARD, '/chat/new'),
    channel: (channelKey: string) => path(ROOTS_DASHBOARD, `/chat/${channelKey}`),
    view: (channelKey: string, conversationKey: string) => path(ROOTS_DASHBOARD, `/chat/${channelKey}/${conversationKey}`),
  },
  user: {
    root: path(ROOTS_DASHBOARD, '/user'),
    new: path(ROOTS_DASHBOARD, '/user/new'),
    list: path(ROOTS_DASHBOARD, '/user/list'),
    account: path(ROOTS_DASHBOARD, '/user/account'),
    edit: (username: string) => path(ROOTS_DASHBOARD, `/user/${username}/edit`),
  },
  role: {
    root: path(ROOTS_DASHBOARD, '/role'),
    new: path(ROOTS_DASHBOARD, '/role/new'),
    list: path(ROOTS_DASHBOARD, '/role/list'),
    edit: (name: string) => path(ROOTS_DASHBOARD, `/role/${name}/edit`),
  },
  permission: {
    root: path(ROOTS_DASHBOARD, '/permission'),
    new: path(ROOTS_DASHBOARD, '/permission/new'),
    list: path(ROOTS_DASHBOARD, '/permission/list'),
    edit: (name: string) => path(ROOTS_DASHBOARD, `/permission/${name}/edit`),
  },
  channel: {
    root: path(ROOTS_DASHBOARD, '/channel'),
    new: path(ROOTS_DASHBOARD, '/channel/new'),
    list: path(ROOTS_DASHBOARD, '/channel/list'),
    edit: (name: string) => path(ROOTS_DASHBOARD, `/channel/${name}/edit`),
  },
  group: {
    root: path(ROOTS_DASHBOARD, '/group'),
    new: path(ROOTS_DASHBOARD, '/group/new'),
    list: path(ROOTS_DASHBOARD, '/group/list'),
    edit: (name: string) => path(ROOTS_DASHBOARD, `/group/${name}/edit`),
  },
  test: {
    root: path(ROOTS_DASHBOARD, '/test'),
    new: path(ROOTS_DASHBOARD, '/test/new'),
    list: path(ROOTS_DASHBOARD, '/test/list'),
    edit: (id: string) => path(ROOTS_DASHBOARD, `/test/${id}/edit`),
  },
};
