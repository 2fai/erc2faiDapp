import '@rainbow-me/rainbowkit/styles.css';
import { ColorModeScript } from '@chakra-ui/react';
import React from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
//import * as serviceWorker from './serviceWorker';

import {
  RainbowKitProvider,
  // getDefaultWallets,
  // getDefaultConfig,
  // lightTheme,
  darkTheme,
} from '@rainbow-me/rainbowkit';
//import * as allWallets from '@rainbow-me/rainbowkit/wallets'
import { WagmiProvider } from 'wagmi';

//import { Ethereum, /* filecoin, polygonMumbai *//* Base */ } from '@thirdweb-dev/chains';
//import { /* mainnet,  */base, arbitrum } from 'wagmi/chains';
// import { Base } from './config/config';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { getWagmiConfig } from './helpers/wagmiConfig.js';

require('dotenv').config();

//const chains = [mainnet, /* filecoin, polygonMumbai */ Base];
//const projectId = process.env.REACT_APP_WALLET_CONNECT_ID;

// const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
// const wagmiConfig = createConfig({
//   autoConnect: true,
//   connectors: w3mConnectors({ projectId, version: 1, chains }),
//   publicClient,
// });
// const ethereumClient = new EthereumClient(wagmiConfig, chains);

const queryClient = new QueryClient();
//const { wallets } = getDefaultWallets()
const config = getWagmiConfig;
// getDefaultConfig({

//   appName: '2FAI DAPP',
//   projectId: projectId,
//   wallets: [
//     ...wallets,
//     {
//       groupName: 'Others',
//       wallets: Object.values(allWallets)
//     }
//   ],
//   chains: [base, arbitrum],
//   ssr: false
// })

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <>
    <ColorModeScript />
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          modalSize="compact"
          theme={darkTheme({
            accentColorForeground: '#1a1a1d',
            borderRadius: 'none',
            fontStack: 'system',
            overlayBlur: 'small',
          })}
        >
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
//serviceWorker.register(); //we dont need saturn anymore

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
