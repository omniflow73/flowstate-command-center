
import { createContext, useContext, ReactNode, useState } from 'react';

interface UserProfile {
  username: string;
  avatarUrl: string;
}

interface UserProfileContextType {
  profile: UserProfile;
  updateProfile: (newProfile: UserProfile) => void;
}

const defaultProfile = {
  username: 'User',
  avatarUrl: '',
};

const UserProfileContext = createContext<UserProfileContextType>({
  profile: defaultProfile,
  updateProfile: () => {},
});

export const UserProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);

  const updateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
  };

  return (
    <UserProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => {
  return useContext(UserProfileContext);
};
