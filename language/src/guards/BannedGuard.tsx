import { ReactNode } from 'react';
// hooks
import useAuth from '../hooks/useAuth';
// pages
import PageBlocked from '../pages/PageBlocked';
// components
import LoadingScreen from '../components/LoadingScreen';

// ----------------------------------------------------------------------

type BannedProps = {
  children: ReactNode;
};

export default function BannedGuard({ children }: BannedProps) {
  const { user, isInitialized } = useAuth();

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  if (user && user.isBanned) {
    return <PageBlocked />;
  }

  return <>{children}</>;
}
