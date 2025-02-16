import React from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { useMQTT } from '../contexts/MQTTContext';

const Dashboard: React.FC = () => {
  const { account, isConnected } = useWeb3();
  const { isConnected: isMqttConnected } = useMQTT();

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          RATLR Dashboard
        </h2>
        
        {/* Connection Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Wallet Status
            </h3>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-gray-600 dark:text-gray-400">
                {isConnected ? `Connected: ${account?.slice(0, 6)}...${account?.slice(-4)}` : 'Not Connected'}
              </span>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              MQTT Status
            </h3>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isMqttConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-gray-600 dark:text-gray-400">
                {isMqttConnected ? 'Connected' : 'Not Connected'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              className="p-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              disabled={!isConnected}
            >
              Deploy New Token
            </button>
            <button
              className="p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              disabled={!isConnected}
            >
              View My Tokens
            </button>
            <button
              className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              disabled={!isConnected}
            >
              Analytics Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Recent Activity
        </h3>
        <div className="space-y-4">
          <div className="text-gray-600 dark:text-gray-400">
            No recent activity to display
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;