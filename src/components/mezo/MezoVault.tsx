import React, { useState } from 'react';
import { Bitcoin, DollarSign, AlertTriangle } from 'lucide-react';

interface VaultStats {
  btcDeposited: number;
  btcValue: number;
  musdBorrowed: number;
  ltv: number;
  liquidationThreshold: number;
}

const MezoVault: React.FC = () => {
  const [vaultStats, setVaultStats] = useState<VaultStats>({
    btcDeposited: 0.05,
    btcValue: 3250, // Assuming $65,000 per BTC
    musdBorrowed: 2600,
    ltv: 0.8,
    liquidationThreshold: 1.1
  });

  const calculateHealthFactor = () => {
    const currentLTV = vaultStats.musdBorrowed / vaultStats.btcValue;
    return (1 / currentLTV) * 100;
  };

  const healthFactor = calculateHealthFactor();
  const isHealthy = healthFactor > 110; // 110% is our minimum health factor

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Your Mezo Vault</h2>
        <div className={`px-4 py-2 rounded-full flex items-center ${
          isHealthy ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          <div className="w-2 h-2 rounded-full mr-2 ${isHealthy ? 'bg-green-500' : 'bg-red-500'}"></div>
          {isHealthy ? 'Healthy' : 'At Risk'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Bitcoin className="h-5 w-5 text-orange-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-700">BTC Collateral</h3>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-bold text-gray-900">{vaultStats.btcDeposited} BTC</p>
            <p className="text-sm text-gray-500">${vaultStats.btcValue.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <DollarSign className="h-5 w-5 text-blue-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-700">MUSD Borrowed</h3>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-bold text-gray-900">${vaultStats.musdBorrowed.toLocaleString()} MUSD</p>
            <p className="text-sm text-gray-500">{(vaultStats.ltv * 100).toFixed(1)}% LTV</p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700">Health Factor</h3>
          <span className="text-sm text-gray-500">{healthFactor.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${
              healthFactor > 150 ? 'bg-green-500' :
              healthFactor > 130 ? 'bg-yellow-500' :
              'bg-red-500'
            }`}
            style={{ width: `${Math.min(healthFactor, 200)}%` }}
          ></div>
        </div>
      </div>

      {!isHealthy && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
            <div>
              <h4 className="text-sm font-medium text-red-800">Liquidation Risk</h4>
              <p className="mt-1 text-sm text-red-700">
                Your position is close to liquidation. Consider repaying MUSD or adding more collateral.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4">
        <button
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => {/* Implement borrow function */}}
        >
          Borrow MUSD
        </button>
        <button
          className="w-full px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors"
          onClick={() => {/* Implement repay function */}}
        >
          Repay MUSD
        </button>
      </div>
    </div>
  );
};

export default MezoVault;
