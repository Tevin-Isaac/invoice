import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomicfoundation/hardhat-network-helpers";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  defaultNetwork: "mezotestnet",
  networks: {
    hardhat: {
      chainId: 31611,
    },
    mezotestnet: {
      url: "https://rpc.test.mezo.org",
      chainId: 31611,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      // Native currency configuration
      nativeCurrency: {
        name: "Bitcoin",
        symbol: "BTC",
        decimals: 18
      }
    },
    mezomainnet: {
      // Multiple RPC endpoints for redundancy
      url: process.env.MEZO_RPC_URL || "https://rpc-http.mezo.boar.network",
      // Alternative RPC endpoints:
      // - https://rpc_evm-mezo.imperator.co
      // - https://mainnet.mezo.public.validationcloud.io
      chainId: 31612,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      // Native currency configuration
      nativeCurrency: {
        name: "Bitcoin",
        symbol: "BTC",
        decimals: 18
      }
    }
  },
  solidity: {
    version: "0.8.28",
    settings: {
      evmVersion: "london",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  // Path configurations
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  // Mocha configuration for testing
  mocha: {
    timeout: 40000
  },
  // Gas reporting configuration
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY
  },
  // TypeChain configuration
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6"
  }
};

export default config;