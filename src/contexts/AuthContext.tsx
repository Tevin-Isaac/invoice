import React, { createContext, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount, useBalance, useDisconnect } from 'wagmi';
import { mezoTestnet } from '@mezo-org/passport';

interface User {
  address: string;
  balance: {
    btc: string;
    musd: string;
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  disconnect: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { address, isConnecting: isWalletConnecting } = useAccount();
  const { data: btcBalance, isLoading: isBtcLoading } = useBalance({
    address,
    chainId: mezoTestnet.id,
    token: '0x...' // Add BTC token address
  });
  const { data: musdBalance, isLoading: isMusdLoading } = useBalance({
    address,
    chainId: mezoTestnet.id,
    token: '0x...' // Add MUSD token address
  });
  const { disconnect: wagmiDisconnect } = useDisconnect();

  const isLoading = isWalletConnecting || isBtcLoading || isMusdLoading;

  const user: User | null = address ? {
    address,
    balance: {
      btc: btcBalance?.formatted || '0',
      musd: musdBalance?.formatted || '0'
    }
  } : null;

  useEffect(() => {
    if (user && !isLoading) {
      navigate('/dashboard');
    }
  }, [user, isLoading, navigate]);

  const disconnect = () => {
    wagmiDisconnect();
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, disconnect }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
