import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { getConfig, mezoTestnet } from '@mezo-org/passport';
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

interface MezoPassportProviderProps {
  children: React.ReactNode;
}

export function MezoPassportProvider({ children }: MezoPassportProviderProps) {
  return (
    <WagmiProvider config={getConfig({ appName: "MezosInvoice" })}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider initialChain={mezoTestnet}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
