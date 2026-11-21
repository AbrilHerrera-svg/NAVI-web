import { useState, type ReactNode } from 'react';
import { mockProfile } from '../data/profileMock';
import type { ProfileInfo } from '../types';
import { SessionReactContext } from './useSession';

export const SessionProvider = ({
  children,
  initialProfile,
}: {
  children: ReactNode;
  initialProfile?: ProfileInfo;
}) => {
  const [profile, setProfile] = useState<ProfileInfo>(initialProfile ?? mockProfile);

  return (
    <SessionReactContext.Provider value={{ profile, updateProfile: setProfile }}>
      {children}
    </SessionReactContext.Provider>
  );
};