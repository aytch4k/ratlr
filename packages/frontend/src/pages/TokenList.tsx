import React from 'react';
import { useOutletContext } from 'react-router-dom';

interface ContextType {
  searchQuery: string;
}

const TokenList: React.FC = () => {
  const { searchQuery } = useOutletContext<ContextType>();

  return (
    <div className="space-y-4 p-4">
      {/* Token List */}
      <div className="space-y-4">
        {/* Example Token Card */}
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gray-700 rounded-lg flex-shrink-0" />
            <div className="flex-grow">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-semibold text-white">let's go</h3>
                <span className="text-gray-400">letsgo</span>
                <span className="text-gray-400">clanker_v3</span>
                <span className="text-blue-400">(WETH)</span>
                <span className="text-gray-400">10 seconds ago</span>
              </div>
              <div className="flex items-center gap-2">
                <img
                  src="placeholder-avatar.jpg"
                  alt=""
                  className="w-6 h-6 rounded-full"
                />
                <a href="#" className="text-blue-400 hover:underline">
                  Bankr (@bankr) (5217 followers)
                </a>
              </div>
              <div className="text-gray-400 mt-2">
                Address: 0x3c0e...0978
              </div>
            </div>
          </div>
        </div>

        {/* Additional Token Cards */}
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gray-700 rounded-lg flex-shrink-0" />
            <div className="flex-grow">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-semibold text-white">QUU</h3>
                <span className="text-gray-400">QUU</span>
                <span className="text-gray-400">clanker_v3</span>
                <span className="text-blue-400">(WETH)</span>
                <span className="text-gray-400">23 seconds ago</span>
              </div>
              <div className="flex items-center gap-2">
                <img
                  src="placeholder-avatar.jpg"
                  alt=""
                  className="w-6 h-6 rounded-full"
                />
                <a href="#" className="text-blue-400 hover:underline">
                  Streamm.tv bot (@livestream) (32 followers)
                </a>
              </div>
              <div className="text-gray-400 mt-2">
                Address: 0x4103...A70D
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenList;