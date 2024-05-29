import {
  // RainbowKitProvider,
  getDefaultWallets,
  getDefaultConfig,
  // lightTheme,
  // darkTheme
} from '@rainbow-me/rainbowkit';
import * as allWallets from '@rainbow-me/rainbowkit/wallets';
import { /* mainnet,  */ base, arbitrum, bsc } from 'wagmi/chains';

const { wallets } = getDefaultWallets();
const projectId = process.env.REACT_APP_WALLET_CONNECT_ID;

export const getWagmiConfig = getDefaultConfig({
  appName: '2FAI DAPP',
  projectId: projectId,
  wallets: [
    ...wallets,
    {
      groupName: 'Others',
      wallets: Object.values(allWallets), //[rabbyWallet, trustWallet, ledgerWallet],
    },
  ],
  chains: [/* mainnet,  */ base, arbitrum, bsc],
  ssr: false, //true,
});
