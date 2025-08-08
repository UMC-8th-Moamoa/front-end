// src/contexts/SignupContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

interface SignupContextType {
  email: string;
  setEmail: (email: string) => void;
}

const SignupContext = createContext<SignupContextType | undefined>(undefined);

export const SignupProvider = ({ children }: { children: ReactNode }) => {
  const [email, setEmail] = useState('');

  return (
    <SignupContext.Provider value={{ email, setEmail }}>
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