import React, { useState, useEffect } from 'react';
import { Calculator, Info } from 'lucide-react';

interface BorrowCalculation {
  btcAmount: number;
  btcValue: number;
  maxMUSD: number;
  selectedMUSD: number;
  ltv: number;
  interestRate: number;
  duration: number;
  totalInterest: number;
  totalRepayment: number;
}

const BorrowInterface: React.FC = () => {
  const [calculation, setCalculation] = useState<BorrowCalculation>({
    btcAmount: 0,
    btcValue: 0,
    maxMUSD: 0,
    selectedMUSD: 0,
    ltv: 0,
    interestRate: 0.01, // 1% fixed rate
    duration: 0.5, // 6 months default
    totalInterest: 0,
    totalRepayment: 0
  });

  const [btcPrice] = useState(65000); // In a real app, this would be fetched from an API

  useEffect(() => {
    if (calculation.btcAmount > 0) {
      const btcValue = calculation.btcAmount * btcPrice;
      const maxMUSD = btcValue * 0.9; // 90% maximum LTV
      const ltv = calculation.selectedMUSD / btcValue;
      const totalInterest = calculation.selectedMUSD * calculation.interestRate * calculation.duration;
      const totalRepayment = calculation.selectedMUSD + totalInterest;

      setCalculation(prev => ({
        ...prev,
        btcValue,
        maxMUSD,
        ltv,
        totalInterest,
        totalRepayment
      }));
    }
  }, [calculation.btcAmount, calculation.selectedMUSD, calculation.duration]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center mb-6">
        <Calculator className="h-6 w-6 text-blue-500 mr-2" />
        <h2 className="text-2xl font-bold text-gray-900">Borrow MUSD</h2>
      </div>

      <div className="space-y-6">
        {/* BTC Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            BTC to Deposit
          </label>
          <div className="relative">
            <input
              type="number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
              step="0.001"
              min="0"
              value={calculation.btcAmount || ''}
              onChange={(e) => setCalculation(prev => ({
                ...prev,
                btcAmount: parseFloat(e.target.value) || 0,
                selectedMUSD: 0 // Reset selected MUSD when BTC amount changes
              }))}
            />
            <div className="absolute right-3 top-2 text-gray-500">BTC</div>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Value: ${(calculation.btcValue).toLocaleString()}
          </p>
        </div>

        {/* MUSD Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            MUSD to Borrow
          </label>
          <div className="relative">
            <input
              type="number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
              max={calculation.maxMUSD}
              value={calculation.selectedMUSD || ''}
              onChange={(e) => setCalculation(prev => ({
                ...prev,
                selectedMUSD: parseFloat(e.target.value) || 0
              }))}
            />
            <div className="absolute right-3 top-2 text-gray-500">MUSD</div>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Max available: ${calculation.maxMUSD.toLocaleString()} MUSD
          </p>
        </div>

        {/* Loan Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loan Duration
          </label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={calculation.duration}
            onChange={(e) => setCalculation(prev => ({
              ...prev,
              duration: parseFloat(e.target.value)
            }))}
          >
            <option value={0.25}>3 months</option>
            <option value={0.5}>6 months</option>
            <option value={1}>1 year</option>
            <option value={2}>2 years</option>
          </select>
        </div>

        {/* Loan Summary */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">Loan Summary</h3>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Loan-to-Value (LTV)</span>
            <span className="font-medium text-gray-900">
              {(calculation.ltv * 100).toFixed(1)}%
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Interest Rate (Fixed)</span>
            <span className="font-medium text-gray-900">1.00%</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Total Interest</span>
            <span className="font-medium text-gray-900">
              ${calculation.totalInterest.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between text-lg font-semibold">
            <span className="text-gray-900">Total Repayment</span>
            <span className="text-gray-900">
              ${calculation.totalRepayment.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Risk Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <Info className="h-5 w-5 text-yellow-500 mt-0.5 mr-2" />
            <div>
              <h4 className="text-sm font-medium text-yellow-800">
                Important Information
              </h4>
              <p className="mt-1 text-sm text-yellow-700">
                Your BTC collateral may be liquidated if the LTV ratio exceeds 90%. 
                Maintain a safe ratio by borrowing less or adding more collateral.
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          disabled={!calculation.selectedMUSD || calculation.selectedMUSD > calculation.maxMUSD}
          onClick={() => {/* Implement borrow function */}}
        >
          Confirm & Borrow
        </button>
      </div>
    </div>
  );
};

export default BorrowInterface;
