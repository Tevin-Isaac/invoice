import { MezoConfig } from '@mezo-org/passport';

export const mezoConfig: MezoConfig = {
  appName: 'MezosInvoice',
  description: 'Bitcoin-backed invoicing platform with MUSD integration',
  // Using testnet for development
  network: 'testnet',
  // Default RPC endpoints
  rpcEndpoints: {
    testnet: 'https://testnet.mezo.network',
    mainnet: 'https://mainnet.mezo.network'
  },
  // Oracle configuration for BTC/USD price feeds
  oracles: {
    btcUsd: {
      testnet: 'MEZO_BTC_USD_TESTNET_ORACLE',
      mainnet: 'MEZO_BTC_USD_MAINNET_ORACLE'
    }
  },
  // MUSD contract addresses
  contracts: {
    musd: {
      testnet: 'MEZO_MUSD_TESTNET_CONTRACT',
      mainnet: 'MEZO_MUSD_MAINNET_CONTRACT'
    },
    vault: {
      testnet: 'MEZO_VAULT_TESTNET_CONTRACT',
      mainnet: 'MEZO_VAULT_MAINNET_CONTRACT'
    }
  },
  // Bridge configuration for MUSD
  bridge: {
    wormhole: {
      testnet: 'MEZO_WORMHOLE_TESTNET_BRIDGE',
      mainnet: 'MEZO_WORMHOLE_MAINNET_BRIDGE'
    }
  }
};
