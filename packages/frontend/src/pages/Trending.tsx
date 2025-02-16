import React from 'react';

const Trending: React.FC = () => {
  const trendingTokens = [
    {
      name: 'TANK',
      change: '+0.8%',
      price: '$0.000002',
      volume: '$16,270',
      trades: '61 trades',
    },
    {
      name: 'jungle bay memes',
      change: '+4.3%',
      price: '$0.000000',
      volume: '$918',
      trades: '12 trades',
    },
    {
      name: 'LUM',
      change: '+1.0%',
      price: '$1.862895',
      volume: '$20,111',
      trades: '202 trades',
    },
  ];

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">trending</h1>
        <div className="flex space-x-4">
          <button className="px-3 py-1 text-sm rounded-lg bg-gray-800 text-white">1h</button>
          <button className="px-3 py-1 text-sm rounded-lg bg-gray-800 text-white">6h</button>
          <button className="px-3 py-1 text-sm rounded-lg bg-blue-600 text-white">24h</button>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-400 px-4 mb-2">
        <span>24h % Change</span>
      </div>

      <div className="space-y-4">
        {trendingTokens.map((token, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-700 rounded-full" />
              <div>
                <h3 className="text-white font-medium">{token.name}</h3>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-gray-400">{token.price}</span>
                  <span className="text-gray-400">{token.volume}</span>
                  <span className="text-gray-400">{token.trades}</span>
                </div>
              </div>
            </div>
            <div className="text-green-500 font-medium">{token.change}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Trending;