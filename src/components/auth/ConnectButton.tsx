import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Loader2, Wallet } from 'lucide-react';

interface ConnectButtonProps {
  className?: string;
  showAddress?: boolean;
}

const ConnectButton: React.FC<ConnectButtonProps> = ({ className = '', showAddress = true }) => {
  const { user, isLoading, connect, disconnect } = useAuth();

  if (isLoading) {
    return (
      <button
        className={`flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-400 rounded-xl cursor-wait ${className}`}
        disabled
      >
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        Connecting...
      </button>
    );
  }

  if (user) {
    return (
      <button
        onClick={disconnect}
        className={`flex items-center justify-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl transition-colors ${className}`}
      >
        <Wallet className="w-5 h-5 mr-2" />
        {showAddress ? `${user.address.slice(0, 6)}...${user.address.slice(-4)}` : 'Disconnect'}
      </button>
    );
  }

  return (
    <button
      onClick={connect}
      className={`flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-colors ${className}`}
    >
      <Wallet className="w-5 h-5 mr-2" />
      Connect Wallet
    </button>
  );
};

export default ConnectButton;
