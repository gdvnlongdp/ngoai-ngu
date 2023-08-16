// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import SvgIconStyle from '../../../components/SvgIconStyle';
// access
import { USER } from '../../../access/user';
import { TEST } from '../../../access/test';
import { ROLE } from '../../../access/role';
import { GROUP } from '../../../access/group';
import { CHANNEL } from '../../../access/channel';
import { PERMISSION } from '../../../access/permission';

// ----------------------------------------------------------------------

const getIcon = (name: string) => (
  <SvgIconStyle src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  analytics: getIcon('ic_analytics'),
  chat: getIcon('ic_chat'),
  submit: getIcon('ic_submit'),
  user: getIcon('ic_user'),
  role: getIcon('ic_role'),
  permission: getIcon('ic_permission'),
  channel: getIcon('ic_channel'),
  group: getIcon('ic_group'),
  test: getIcon('ic_test'),
};

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'general',
    items: [
      { title: 'test', path: PATH_DASHBOARD.submit.root, icon: ICONS.submit },
      { title: 'chat', path: PATH_DASHBOARD.chat.root, icon: ICONS.chat },
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'management',
    items: [
      { title: 'analytics', path: PATH_DASHBOARD.analytics, icon: ICONS.analytics },
      // USER
      {
        title: 'user',
        path: PATH_DASHBOARD.user.root,
        icon: ICONS.user,
        allows: Object.values(USER),
        children: [
          { title: 'list', path: PATH_DASHBOARD.user.list, allow: USER.READ },
          { title: 'create', path: PATH_DASHBOARD.user.new, allow: USER.CREATE },
          { title: 'account', path: PATH_DASHBOARD.user.account },
        ],
      },
      // TEST
      {
        title: 'test',
        path: PATH_DASHBOARD.test.root,
        icon: ICONS.test,
        allows: Object.values(TEST),
        children: [
          { title: 'list', path: PATH_DASHBOARD.test.list, allow: TEST.READ },
          { title: 'create', path: PATH_DASHBOARD.test.new, allow: TEST.CREATE },
        ],
      },
      // ROLE
      {
        title: 'role',
        path: PATH_DASHBOARD.role.root,
        icon: ICONS.role,
        allows: Object.values(ROLE),
        children: [
          { title: 'list', path: PATH_DASHBOARD.role.list, allow: ROLE.READ },
          { title: 'create', path: PATH_DASHBOARD.role.new, allow: ROLE.CREATE },
        ],
      },
      // PERMISSION
      {
        title: 'permission',
        path: PATH_DASHBOARD.permission.root,
        icon: ICONS.permission,
        allows: Object.values(PERMISSION),
        children: [
          { title: 'list', path: PATH_DASHBOARD.permission.list, allow: PERMISSION.READ },
          { title: 'create', path: PATH_DASHBOARD.permission.new, allow: PERMISSION.CREATE },
        ],
      },
      // CHANNEL
      {
        title: 'channel',
        path: PATH_DASHBOARD.channel.root,
        icon: ICONS.channel,
        allows: Object.values(CHANNEL),
        children: [
          { title: 'list', path: PATH_DASHBOARD.channel.list, allow: CHANNEL.READ },
          { title: 'create', path: PATH_DASHBOARD.channel.new, allow: CHANNEL.CREATE },
        ],
      },
      // GROUP
      {
        title: 'group',
        path: PATH_DASHBOARD.group.root,
        allows: Object.values(GROUP),
        icon: ICONS.group,
        children: [
          { title: 'list', path: PATH_DASHBOARD.group.list, allow: GROUP.READ },
          { title: 'create', path: PATH_DASHBOARD.group.new, allow: GROUP.CREATE },
        ],
      },
    ],
  },
];

export default navConfig;
