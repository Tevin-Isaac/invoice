import { createContext, useContext, useEffect, useState } from 'react';
import { useAccount, useBalance, useContractRead, useContractWrite } from 'wagmi';
import { mezoTestnet } from '@mezo-org/passport';
import { useAuth } from '../contexts/AuthContext';

// TODO: Import actual ABI and contract addresses
const VAULT_ABI = [];
const MUSD_ABI = [];
const VAULT_ADDRESS = '0x...';
const MUSD_ADDRESS = '0x...';

interface MezoState {
  btcPrice: string;
  musdBalance: string;
  btcBalance: string;
  vaultHealth: number;
  isConnected: boolean;
}

interface MezoContextType {
  state: MezoState;
  borrowMUSD: (amount: string) => Promise<void>;
  repayMUSD: (amount: string) => Promise<void>;
  depositBTC: (amount: string) => Promise<void>;
  withdrawBTC: (amount: string) => Promise<void>;
  isLoading: boolean;
}

const MezoContext = createContext<MezoContextType | undefined>(undefined);

export function MezoProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(false);

  // Get BTC balance
  const { data: btcBalance } = useBalance({
    address,
    token: '0x...', // BTC token address
    chainId: mezoTestnet.id,
    watch: true,
  });

  // Get MUSD balance
  const { data: musdBalance } = useBalance({
    address,
    token: MUSD_ADDRESS,
    chainId: mezoTestnet.id,
    watch: true,
  });

  // Get BTC price from oracle
  const { data: btcPrice } = useContractRead({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: 'getBTCPrice',
    chainId: mezoTestnet.id,
    watch: true,
  });

  // Get vault health
  const { data: vaultHealth } = useContractRead({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: 'getVaultHealth',
    args: [address],
    chainId: mezoTestnet.id,
    watch: true,
    enabled: !!address,
  });

  // Contract write functions
  const { writeAsync: borrowMUSDAsync } = useContractWrite({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: 'borrowMUSD',
  });

  const { writeAsync: repayMUSDAsync } = useContractWrite({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: 'repayMUSD',
  });

  const { writeAsync: depositBTCAsync } = useContractWrite({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: 'depositBTC',
  });

  const { writeAsync: withdrawBTCAsync } = useContractWrite({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: 'withdrawBTC',
  });

  const state: MezoState = {
    btcPrice: btcPrice?.toString() || '0',
    musdBalance: musdBalance?.formatted || '0',
    btcBalance: btcBalance?.formatted || '0',
    vaultHealth: Number(vaultHealth || 0),
    isConnected,
  };

  const borrowMUSD = async (amount: string) => {
    try {
      setIsLoading(true);
      await borrowMUSDAsync({ args: [amount] });
    } catch (error) {
      console.error('Failed to borrow MUSD:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const repayMUSD = async (amount: string) => {
    try {
      setIsLoading(true);
      await repayMUSDAsync({ args: [amount] });
    } catch (error) {
      console.error('Failed to repay MUSD:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const depositBTC = async (amount: string) => {
    try {
      setIsLoading(true);
      await depositBTCAsync({ args: [amount] });
    } catch (error) {
      console.error('Failed to deposit BTC:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const withdrawBTC = async (amount: string) => {
    try {
      setIsLoading(true);
      await withdrawBTCAsync({ args: [amount] });
    } catch (error) {
      console.error('Failed to withdraw BTC:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MezoContext.Provider
      value={{
        state,
        borrowMUSD,
        repayMUSD,
        depositBTC,
        withdrawBTC,
        isLoading,
      }}
    >
      {children}
    </MezoContext.Provider>
  );
}

export function useMezo() {
  const context = useContext(MezoContext);
  if (context === undefined) {
    throw new Error('useMezo must be used within a MezoProvider');
  }
  return context;
}
