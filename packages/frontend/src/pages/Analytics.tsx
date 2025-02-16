import React from 'react';
import { useWeb3 } from '../contexts/Web3Context';

const Analytics: React.FC = () => {
  const { account, isConnected } = useWeb3();

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Analytics Dashboard
        </h2>
        
        {/* Wallet Status */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-gray-600 dark:text-gray-400">
              {isConnected ? `Connected: ${account?.slice(0, 6)}...${account?.slice(-4)}` : 'Connect wallet to view analytics'}
            </span>
          </div>
        </div>

        {/* Analytics Content */}
        {isConnected ? (
          <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Total Tokens
                </h3>
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  0
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Total Value
                </h3>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  $0.00
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Active Trades
                </h3>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  0
                </p>
              </div>
            </div>

            {/* Charts Section */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
                Performance Chart
              </h3>
              <div className="h-64 flex items-center justify-center text-gray-600 dark:text-gray-400">
                No data available
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-600 dark:text-gray-400">
            Please connect your wallet to view analytics
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;