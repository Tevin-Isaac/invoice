import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

interface ConnectWalletProps {
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export const ConnectWallet: React.FC<ConnectWalletProps> = ({
  onConnect,
  onDisconnect
}) => {
  const { isConnected } = useAccount();

  React.useEffect(() => {
    if (isConnected && onConnect) {
      onConnect();
    } else if (!isConnected && onDisconnect) {
      onDisconnect();
    }
  }, [isConnected, onConnect, onDisconnect]);

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
                    className="relative overflow-hidden bg-gradient-to-r from-purple-500 to-violet-500 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 group"
                  >
                    Connect Wallet
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="relative overflow-hidden bg-red-500 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Wrong network
                  </button>
                );
              }

              return (
                <div className="flex items-center gap-3">
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="flex items-center bg-gray-800 text-white px-4 py-2 rounded-xl"
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
                    className="bg-gray-800 text-white px-4 py-2 rounded-xl flex items-center gap-2"
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
