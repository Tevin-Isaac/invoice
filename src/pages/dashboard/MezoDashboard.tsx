import React, { useState } from 'react';
import MezoVault from '../../components/mezo/MezoVault';
import BorrowInterface from '../../components/mezo/BorrowInterface';
import { Wallet, ArrowRightLeft, History } from 'lucide-react';

const MezoDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'vault' | 'borrow' | 'history'>('vault');

  const tabs = [
    { id: 'vault', name: 'Vault Overview', icon: Wallet },
    { id: 'borrow', name: 'Borrow MUSD', icon: ArrowRightLeft },
    { id: 'history', name: 'Transaction History', icon: History },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Bitcoin-Backed Credit
        </h1>
        <p className="text-gray-600">
          Borrow MUSD against your Bitcoin at 1% fixed rate. Keep your BTC, access stable liquidity.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`group relative min-w-0 flex-1 overflow-hidden py-4 px-4 text-center text-sm font-medium hover:bg-gray-50 focus:z-10 focus:outline-none ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 border-b-2 border-transparent hover:text-gray-700'
                }`}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
              >
                <div className="flex items-center justify-center">
                  <tab.icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </div>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'vault' && <MezoVault />}
          {activeTab === 'borrow' && <BorrowInterface />}
          {activeTab === 'history' && (
            <div className="text-center py-12">
              <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
              <p className="text-gray-500">
                Your transaction history will appear here once you start using your vault.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Educational Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            How It Works
          </h3>
          <p className="text-gray-600">
            Deposit your Bitcoin as collateral and borrow MUSD stablecoins at a fixed 1% rate. 
            Keep your BTC exposure while accessing stable liquidity.
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Safe & Secure
          </h3>
          <p className="text-gray-600">
            Your Bitcoin stays secure in Mezo's smart contracts. Maintain full control of your 
            collateral with transparent, on-chain verification.
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Flexible Terms
          </h3>
          <p className="text-gray-600">
            Borrow up to 90% of your BTC value. Repay anytime with no prepayment penalties. 
            Add collateral whenever needed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MezoDashboard;
