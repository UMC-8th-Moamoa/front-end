// src/contexts/SignupContext.tsx

import { createContext, useContext, useState } from 'react';

interface SignupData {
  id: string;
  password: string;
  phone: string;
  email: string;
  name: string;
  birthday: string;
}

interface SignupContextType {
  data: Partial<SignupData>;
  updateData: (newData: Partial<SignupData>) => void;
  resetData: () => void;
}

const SignupContext = createContext<SignupContextType | undefined>(undefined);

export const SignupProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<Partial<SignupData>>({});

  const updateData = (newData: Partial<SignupData>) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  const resetData = () => setData({});

  return (
    <SignupContext.Provider value={{ data, updateData, resetData }}>
      {children}
    </SignupContext.Provider>
  );
};

export const useSignup = () => {
  const context = useContext(SignupContext);
  if (!context) {
    throw new Error('useSignup must be used within a SignupProvider');
  }
  return context;
};