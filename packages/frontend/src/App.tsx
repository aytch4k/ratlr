import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { Web3Provider } from './contexts/Web3Context';
import Layout from './components/Layout';
import TokenList from './pages/TokenList';
import Presales from './pages/Presales';
import Trending from './pages/Trending';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <TokenList />,
      },
      {
        path: '/presales',
        element: <Presales />,
      },
      {
        path: '/trending',
        element: <Trending />,
      },
    ],
  },
]);

function App() {
  return (
    <ThemeProvider>
      <Web3Provider>
        <RouterProvider router={router} />
      </Web3Provider>
    </ThemeProvider>
  );
}

export default App;