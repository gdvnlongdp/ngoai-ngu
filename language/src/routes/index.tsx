import { Suspense, lazy, ElementType } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// hooks
import useAuth from '../hooks/useAuth';
// layouts
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// guards
import GuestGuard from '../guards/GuestGuard';
import AuthGuard from '../guards/AuthGuard';
import BannedGuard from '../guards/BannedGuard';
// config
import { PATH_AFTER_LOGIN } from '../config';
// components
import LoadingScreen from '../components/LoadingScreen';

// ----------------------------------------------------------------------

const Loadable = (Component: ElementType) => (props: any) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { isAuthenticated } = useAuth();

  const isDashboard = pathname.includes('/dashboard') && isAuthenticated;

  return (
    <Suspense fallback={<LoadingScreen isDashboard={isDashboard} />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          ),
        },
        { path: 'reset-password', element: <ResetPassword /> },
        { path: 'new-password', element: <NewPassword /> },
      ],
    },

    // Dashboard Routes
    {
      path: 'dashboard',
      element: (
        <AuthGuard>
          <BannedGuard>
            <DashboardLayout />
          </BannedGuard>
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        {
          path: 'chat',
          children: [
            { element: <Chat />, index: true },
            {
              path: ':channelKey',
              element: <Chat />,
              children: [{ path: ':conversationKey', element: <Chat /> }],
            },
          ],
        },
        { path: 'analytics', element: <GeneralAnalytics /> },
        {
          path: 'submit',
          children: [
            { element: <Navigate to="/dashboard/submit/list" replace />, index: true },
            { path: 'list', element: <SubmissionList /> },
            { path: ':id', element: <SubmissionTest /> },
          ],
        },
        {
          path: 'user',
          children: [
            { element: <Navigate to="/dashboard/user/list" replace />, index: true },
            { path: 'list', element: <UserList /> },
            { path: 'new', element: <UserCreate /> },
            { path: ':username/edit', element: <UserCreate /> },
            { path: 'account', element: <UserAccount /> },
          ],
        },
        {
          path: 'role',
          children: [
            { element: <Navigate to="/dashboard/role/list" replace />, index: true },
            { path: 'list', element: <RoleList /> },
            { path: 'new', element: <RoleCreate /> },
            { path: ':name/edit', element: <RoleCreate /> },
          ],
        },
        {
          path: 'permission',
          children: [
            { element: <Navigate to="/dashboard/permission/list" replace />, index: true },
            { path: 'list', element: <PermissionList /> },
            { path: 'new', element: <PermissionCreate /> },
            { path: ':name/edit', element: <PermissionCreate /> },
          ],
        },
        {
          path: 'channel',
          children: [
            { element: <Navigate to="/dashboard/channel/list" replace />, index: true },
            { path: 'list', element: <ChannelList /> },
            { path: 'new', element: <ChannelCreate /> },
            { path: ':name/edit', element: <ChannelCreate /> },
          ],
        },
        {
          path: 'group',
          children: [
            { element: <Navigate to="/dashboard/group/list" replace />, index: true },
            { path: 'list', element: <GroupList /> },
            { path: 'new', element: <GroupCreate /> },
            { path: ':name/edit', element: <GroupCreate /> },
          ],
        },
        {
          path: 'test',
          children: [
            { element: <Navigate to="/dashboard/test/list" replace />, index: true },
            { path: 'list', element: <TestList /> },
            { path: 'new', element: <TestCreate /> },
            { path: ':id/edit', element: <TestCreate /> },
          ],
        },
      ],
    },

    // Main Routes
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: '500', element: <Page500 /> },
        { path: '404', element: <Page404 /> },
        { path: '403', element: <Page403 /> },
        { path: '*', element: <Navigate to="/404" replace /> },
      ],
    },
    {
      path: '/',
      element: <Navigate to="/dashboard" replace />,
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}

// AUTHENTICATION
const Login = Loadable(lazy(() => import('../pages/auth/Login')));
const ResetPassword = Loadable(lazy(() => import('../pages/auth/ResetPassword')));
const NewPassword = Loadable(lazy(() => import('../pages/auth/NewPassword')));

// GENERAL
const GeneralAnalytics = Loadable(lazy(() => import('../pages/dashboard/GeneralAnalytics')));

// USER
const UserList = Loadable(lazy(() => import('../pages/dashboard/UserList')));
const UserAccount = Loadable(lazy(() => import('../pages/dashboard/UserAccount')));
const UserCreate = Loadable(lazy(() => import('../pages/dashboard/UserCreate')));

// ROLE
const RoleList = Loadable(lazy(() => import('../pages/dashboard/RoleList')));
const RoleCreate = Loadable(lazy(() => import('../pages/dashboard/RoleCreate')));

// PERMISSION
const PermissionList = Loadable(lazy(() => import('../pages/dashboard/PermissionList')));
const PermissionCreate = Loadable(lazy(() => import('../pages/dashboard/PermissionCreate')));

// CHANNEL
const ChannelList = Loadable(lazy(() => import('../pages/dashboard/ChannelList')));
const ChannelCreate = Loadable(lazy(() => import('../pages/dashboard/ChannelCreate')));

// GROUP
const GroupList = Loadable(lazy(() => import('../pages/dashboard/GroupList')));
const GroupCreate = Loadable(lazy(() => import('../pages/dashboard/GroupCreate')));

// TEST
const TestList = Loadable(lazy(() => import('../pages/dashboard/TestList')));
const TestCreate = Loadable(lazy(() => import('../pages/dashboard/TestCreate')));

// APP
const SubmissionList = Loadable(lazy(() => import('../pages/dashboard/SubmissionList')));
const SubmissionTest = Loadable(lazy(() => import('../pages/dashboard/SubmissionTest')));
const Chat = Loadable(lazy(() => import('../pages/dashboard/Chat')));

// MAIN
const Page500 = Loadable(lazy(() => import('../pages/Page500')));
const Page403 = Loadable(lazy(() => import('../pages/Page403')));
const Page404 = Loadable(lazy(() => import('../pages/Page404')));
