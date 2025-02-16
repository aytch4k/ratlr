import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ethers";
import "hardhat-gas-reporter";
import "solidity-coverage";
import * as dotenv from "dotenv";

// Load both package and root .env files
dotenv.config();
dotenv.config({ path: '../../.env' });

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1,
        details: {
          yul: true,
          yulDetails: {
            stackAllocation: true,
            optimizerSteps: "dhfoDgvulfnTUtnIf"
          }
        }
      },
      viaIR: true,
    },
  },
  networks: {
    hardhat: {
      chainId: 785, // Match Autheo testnet chain ID
    },
    autheoTestnet: {
      url: process.env.TESTNET_RPC_URL || "https://testnet-rpc1.autheo.com",
      chainId: parseInt(process.env.TESTNET_CHAIN_ID || "785"),
      accounts: process.env.PRIVATE_KEY ? [
        process.env.PRIVATE_KEY,
        // Derive additional accounts from the main private key
        "0000000000000000000000000000000000000000000000000000000000000001",
        "0000000000000000000000000000000000000000000000000000000000000002"
      ] : [],
      gasPrice: 10000000000, // 10 gwei
      timeout: 60000, // 1 minute
    },
    autheoTestnet2: {
      url: process.env.TESTNET_RPC2_URL || "https://testnet-rpc2.autheo.com",
      chainId: parseInt(process.env.TESTNET_CHAIN_ID || "785"),
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: {
      autheoTestnet: "not-needed", // Autheo doesn't require API key
    },
    customChains: [
      {
        network: "autheoTestnet",
        chainId: 785,
        urls: {
          apiURL: process.env.TESTNET_API_URL || "https://testnet-explorer.autheo.com/api",
          browserURL: process.env.TESTNET_EXPLORER_URL || "https://testnet-explorer.autheo.com",
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  mocha: {
    timeout: 40000,
  },
};

export default config;