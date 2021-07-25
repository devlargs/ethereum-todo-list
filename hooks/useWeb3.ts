import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3 from 'web3';
import Web3Modal from 'web3modal';

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      rpc: {
        56: 'https://bsc-dataseed.binance.org/',
        97: 'https://data-seed-prebsc-1-s1.binance.org:8545',
      },
      network: 'binance',
    },
  },
};

let web3Modal;
if (typeof window !== 'undefined') {
  web3Modal = new Web3Modal({
    cacheProvider: true,
    disableInjectedProvider: false,
    providerOptions,
  });
}

export const getWeb3Modal = (): Web3Modal => web3Modal;

export const initWeb3 = (provider: string): Web3 => {
  const web3: Web3 = new Web3(provider);

  web3.eth.extend({
    methods: [
      {
        name: 'chainId',
        call: 'eth_chainId',
        outputFormatter: web3.utils.hexToNumber as any,
      },
    ],
  });

  return web3;
};
