import { useState, type ReactNode } from 'react';
import type { ProfileInfo } from '../types';
import { SessionReactContext } from './useSession';

export const SessionProvider = ({
  children,
  initialProfile,
}: {
  children: ReactNode;
  initialProfile: ProfileInfo;
}) => {
  const [profile, setProfile] = useState<ProfileInfo>(initialProfile);

  return (
    <SessionReactContext.Provider value={{ profile, updateProfile: setProfile }}>
      {children}
    </SessionReactContext.Provider>
  );
};
