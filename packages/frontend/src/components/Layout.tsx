import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useWeb3 } from '../contexts/Web3Context';
import { 
  Bars3Icon, 
  XMarkIcon,
  ChevronUpIcon,
  ChevronDownIcon 
} from '@heroicons/react/24/outline';

const Layout: React.FC = () => {
  const { pathname } = useLocation();
  const { connect, isConnected } = useWeb3();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All Pairs');
  const [selectedPlatform, setSelectedPlatform] = useState('All Partners');
  const [selectedPresale, setSelectedPresale] = useState('All Tokens');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(true);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800/50 px-6 py-2">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold">
            RATLR
          </Link>

          {/* Search and Filters - Desktop */}
          {pathname === '/' && (
            <div className="hidden md:flex flex-1 items-center justify-center space-x-3 px-4 max-w-4xl">
              <input
                type="text"
                placeholder="Search by token name, symbol, or requestor..."
                className="w-64 px-3 py-1 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-400">Type:</span>
                <select
                  className="bg-gray-800 text-white px-2 py-1 rounded-lg border border-gray-700"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option>All Pairs</option>
                </select>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-400">Platform:</span>
                <select
                  className="bg-gray-800 text-white px-2 py-1 rounded-lg border border-gray-700"
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                >
                  <option>All Partners</option>
                </select>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-400">Presale:</span>
                <select
                  className="bg-gray-800 text-white px-2 py-1 rounded-lg border border-gray-700"
                  value={selectedPresale}
                  onChange={(e) => setSelectedPresale(e.target.value)}
                >
                  <option>All Tokens</option>
                </select>
              </div>
            </div>
          )}

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/presales"
              className={`px-4 py-1 rounded-lg text-sm ${
                pathname === '/presales'
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Presales
            </Link>
            <Link
              to="/trending"
              className={`px-4 py-1 rounded-lg text-sm ${
                pathname === '/trending'
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Trending
            </Link>
            {!isConnected && (
              <button
                onClick={connect}
                className="px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                Connect
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white"
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pt-4 pb-3 border-t border-gray-700">
            {pathname === '/' && (
              <div className="px-2">
                <button
                  onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                  className="flex items-center justify-between w-full px-3 py-2 text-gray-400 hover:text-white"
                >
                  <span className="text-sm font-medium">Search & Filters</span>
                  {isSearchExpanded ? (
                    <ChevronUpIcon className="h-5 w-5" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5" />
                  )}
                </button>
                
                {isSearchExpanded && (
                  <div className="space-y-4 mt-2">
                    <input
                      type="text"
                      placeholder="Search by token name, symbol, or requestor..."
                      className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500 text-sm"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <span className="text-gray-400 text-sm">Type:</span>
                        <select
                          className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 text-sm"
                          value={selectedType}
                          onChange={(e) => setSelectedType(e.target.value)}
                        >
                          <option>All Pairs</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <span className="text-gray-400 text-sm">Platform:</span>
                        <select
                          className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 text-sm"
                          value={selectedPlatform}
                          onChange={(e) => setSelectedPlatform(e.target.value)}
                        >
                          <option>All Partners</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <span className="text-gray-400 text-sm">Presale:</span>
                        <select
                          className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 text-sm"
                          value={selectedPresale}
                          onChange={(e) => setSelectedPresale(e.target.value)}
                        >
                          <option>All Tokens</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="space-y-1 px-2 pt-4">
              <Link
                to="/presales"
                className={`block px-3 py-2 rounded-lg text-sm ${
                  pathname === '/presales'
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Presales
              </Link>
              <Link
                to="/trending"
                className={`block px-3 py-2 rounded-lg text-sm ${
                  pathname === '/trending'
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Trending
              </Link>
              {!isConnected && (
                <button
                  onClick={connect}
                  className="w-full mt-4 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  Connect
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="container mx-auto">
        <Outlet context={{ searchQuery }} />
      </main>
    </div>
  );
};

export default Layout;
