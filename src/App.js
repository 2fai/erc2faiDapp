import React, { useEffect /* , { useEffect } */ } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { ChakraProvider, Box, extendTheme } from '@chakra-ui/react';
import { Helmet } from 'react-helmet'; // Asegúrate de importar Helmet
import { useAccount /* , useChainId, useChains */ } from 'wagmi';

import './App.css';
import LandingPage from './pages/LandingPage';
import LoggedInPage from './pages/LoggedInPage';
import DAO from './pages/DAO';
import RevShare from './pages/RevShare';
//import { useQuery } from './hooks/useQuery';
//import { Base } from './config/config';
/* import { useWeb3 } from './hooks/useWeb3';
import { base } from 'wagmi/chains'; */
//import axios from 'axios'
import { Polybase } from '@polybase/client';
import { dappConfig } from './config/config';

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  components: {
    Modal: {
      baseStyle: {
        dialog: {
          bg: '#111013',
          textAlign: 'center',
          border: '1px solid #05a3ba',
        },
        overlay: {
          bg: '##0e0e0e9c!important',
          backdropFilter: 'blur(5px)',
        },
      },
    },
    Toast: {
      baseStyle: {
        zIndex: 99999,
      },
    },
  },
});

function App() {
  const { isConnected, address } = useAccount();
  //const query = useQuery();
  // Use the JavaScript URL API to parse the current window's URL
  const currentUrl = new URL(window.location.href);
  // Use URLSearchParams to extract query parameters
  const searchParams = new URLSearchParams(currentUrl.search);

  useEffect(() => {
    let referral = searchParams.get('ref');

    //https://eu-west-2.aws.data.mongodb-api.com/app/application-0-lixxb/endpoint/getReferrals

    if (referral && isConnected && address) {
      //Referral has at least 1 card? double check on server too..
      const db = new Polybase({
        defaultNamespace: dappConfig.defaultNamespace,
      });
      if (db) {
        db.collection('Keys')
          .where('address', '==', referral)
          .where('appId', '==', 'hack-fs')
          .get()
          .then(records => {
            // eslint-disable-next-line no-constant-condition
            if (/* records && records.data && records.data.length > 0 */ true) {
              //disabled for now
              fetch(
                `https://eu-west-2.aws.data.mongodb-api.com/app/application-0-lixxb/endpoint/updateReferralGet?address=${address.toLowerCase()}&referral=${referral.toLowerCase()}`
              )
                .then(answer => {
                  answer
                    .json()
                    .then(_answer => {
                      console.log(_answer);
                    })
                    .catch(console.error);
                })
                .catch(console.error);
            }
          })
          .catch(console.error);
      }

      // axios.post("https://eu-west-2.aws.data.mongodb-api.com/app/application-0-lixxb/endpoint/updateReferral", {
      //     address: address.toLowerCase(),
      //     referral: referral.toLowerCase()
      // }, {
      //     headers: {
      //         "Content-Type": "application/json"
      //     }
      // })
      // .then(response => {
      //     console.log(response.data);
      // })
      // .catch(error => {
      //     console.error(error);
      // });
    }
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <Helmet>
        <title>2FAi - Revolutionizing 2FA with Web3 - Built on BASE</title>
        <meta
          name="description"
          content="2FAi redefines digital security by integrating BASE blockchain with AI for a decentralized, privacy-focused 2FA solution across Web2 and Web3, enhancing user safety without storing personal data."
        />
        <meta property="og:image" content="/src/img/og-image.png" />
      </Helmet>
      <Router>
        <Box textAlign="center" fontSize="xl">
          <Routes>
            <Route
              path="/"
              element={
                isConnected ? <Navigate to="/dashboard" /> : <LandingPage />
              }
            />
            <Route
              path="/dashboard"
              element={isConnected ? <LoggedInPage /> : <Navigate to="/" />}
            />
            <Route
              path="/revshare"
              element={isConnected ? <RevShare /> : <Navigate to="/" />}
            />
            <Route
              path="/dao"
              element={isConnected ? <DAO /> : <Navigate to="/" />}
            />
            {/* Agrega más rutas según sea necesario */}
          </Routes>
        </Box>
      </Router>
    </ChakraProvider>
  );
}

export default App;
