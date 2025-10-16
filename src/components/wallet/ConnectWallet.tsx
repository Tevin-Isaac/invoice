import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import { mezoTestnet } from '@mezo-org/passport';
import { Loader2 } from 'lucide-react';

interface ConnectWalletProps {
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export const ConnectWallet: React.FC<ConnectWalletProps> = ({
  onConnect,
  onDisconnect
}) => {
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const { switchNetwork, isLoading: isSwitching } = useSwitchNetwork();

  React.useEffect(() => {
    if (isConnected && chain?.id === mezoTestnet.id && onConnect) {
      onConnect();
    } else if (!isConnected && onDisconnect) {
      onDisconnect();
    }
  }, [isConnected, chain?.id, onConnect, onDisconnect]);

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    disabled={isSwitching}
                    className="relative overflow-hidden bg-gradient-to-r from-purple-500 to-violet-500 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSwitching ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
                        Switching Network...
                      </>
                    ) : (
                      'Connect Wallet'
                    )}
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={() => switchNetwork?.(mezoTestnet.id)}
                    type="button"
                    disabled={isSwitching}
                    className="relative overflow-hidden bg-red-500 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSwitching ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
                        Switching to Mezo...
                      </>
                    ) : (
                      'Switch to Mezo Network'
                    )}
                  </button>
                );
              }

              return (
                <div className="flex items-center gap-3">
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="flex items-center bg-gray-800 text-white px-4 py-2 rounded-xl hover:bg-gray-700 transition-colors"
                  >
                    {chain.hasIcon && (
                      <div className="mr-2">
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            className="w-6 h-6"
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </button>

                  <button
                    onClick={openAccountModal}
                    type="button"
                    className="bg-gray-800 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-gray-700 transition-colors"
                  >
                    {account.displayBalance && (
                      <span>{account.displayBalance}</span>
                    )}
                    <span>{account.displayName}</span>
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
