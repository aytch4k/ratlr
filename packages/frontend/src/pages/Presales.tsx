import React from 'react';

const Presales: React.FC = () => {
  const presaleTokens = [
    {
      name: 'New Token Presale',
      status: 'Active',
      raised: '45.5 ETH',
      target: '100 ETH',
      timeLeft: '2d 14h',
    },
    {
      name: 'Upcoming Launch',
      status: 'Upcoming',
      raised: '0 ETH',
      target: '50 ETH',
      timeLeft: '5d 8h',
    },
  ];

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Presales</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Create Presale
        </button>
      </div>

      <div className="grid gap-4">
        {presaleTokens.map((token, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-medium text-white">{token.name}</h3>
                <span className={`text-sm ${
                  token.status === 'Active' ? 'text-green-500' : 'text-yellow-500'
                }`}>
                  {token.status}
                </span>
              </div>
              <div className="text-right">
                <div className="text-gray-400">Time Left</div>
                <div className="text-white font-medium">{token.timeLeft}</div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-400 mb-1">
                  <span>Progress</span>
                  <span>{token.raised} / {token.target}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${(parseFloat(token.raised) / parseFloat(token.target)) * 100}%`
                    }}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Presales;