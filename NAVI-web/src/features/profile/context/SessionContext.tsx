import { useState, type ReactNode } from 'react';
import type { ProfileInfo } from '../types';
import { SessionReactContext } from './useSession';

interface Props {
  initialProfile: ProfileInfo;
  children: ReactNode;
}

export const SessionProvider = ({ initialProfile, children }: Props) => {
  const [profile, setProfile] = useState<ProfileInfo>(initialProfile);

  return (
    <SessionReactContext.Provider value={{ profile, updateProfile: setProfile }}>
      {children}
    </SessionReactContext.Provider>
  );
};
