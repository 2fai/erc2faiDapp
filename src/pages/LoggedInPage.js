import { useState, useEffect } from 'react';
import {
  Text,
  Flex,
  Button,
  Card,
  GridItem,
  Box,
  Image,
  Spinner,
  useMediaQuery,
  useToast,
} from '@chakra-ui/react';
import Header2 from '../components/Header2';
import './LoggedInPage.css';
import bgImage from '../img/2fai-patt.svg';
import coinBase from '../img/coinbase_slot.png';
import dextools from '../img/dextools_slot.png';
import backgrounddextools from '../img/background_dextools.jpg';
//import { Ethereum } from '@thirdweb-dev/chains';
//import { Base } from '../config/config';
//import { base } from 'wagmi/chains'

import { useAccount, useChainId } from 'wagmi';

import AddSecret from '../components/AddSecret';
import AddSecret_Coinbase from '../components/AddSecret_Coinbase';
import AddSecret_Dextools from '../components/AddSecret_Dextools';
import ServiceCard3 from '../components/ServiceCard3';
import LoaderModal from '../components/LoaderModal';
import { getThemeData } from '../theme';
import { timeout } from '../helper';
//import logo from '../logo2.png';
//import logo2 from '../img/logo192.png';
//import bgImage from '../img/2fai-patt.png';
//import Footer2 from '../components/Footer2';
import MobileFooterMenu from '../components/MobileFooterMenu.tsx';
import { dappConfig } from '../config/config.js';
import { ethers } from 'ethers';
import more_slots from '../img/more_slots.png';

import ad980_120 from '../img/ads/980_120.png';
import ad468_60 from '../img/ads/468_60.png';
import ad318_356 from '../img/ads/318_356.png';
import { UserCard } from '../components/UserCard.js';
import { useWeb3 } from '../hooks/useWeb3.js';
import useLitProtocol from '../hooks/useLitProtocol.js';
import usePolybase from '../hooks/usePolybase.js';
import { /* mainnet,  */ base, arbitrum, bsc } from 'wagmi/chains';
import _ from 'lodash';

import {
  //getSecret,
  getSecrets,
  // getSecretsContractARBReader,
  // getSecretsContractARBWriter,
  // getSecretsContractBASEReader,
  // getSecretsContractBASEWriter,
  storeSecret,
} from '../helpers/secretsContracts.js';
//import { getWagmiConfig } from '../helpers/wagmiConfig.js';
//const chainId = base.id;

const tiers = {
  0: 'Bronce',
  1: 'Silver',
  2: 'Gold',
  3: 'Diamond',
};

const tierSlots = {
  0: 1, // Increased by 1
  1: 3, // Increased by 1
  2: 5, // Increased by 1
  3: 9999, // Remains unlimited
};

const availableStorages = dappConfig.availableStorages;

// const StyledLink = styled(RouterLink)`
//   display: flex; // default to none

//   @media (min-width: 768px) {
//     display: none;
//   }

//   background: white;
//   color: black;
//   border-radius: 6px;
//   text-decoration: none;
//   &:hover {
//     color: #05a3ba;
//   }
// `;

function LoggedInPage() {
  const chainId = useChainId();
  const { address, isConnected } = useAccount();
  const {
    /* getSigner, switchNetworkAsync,  */ getProvider,
    connector,
    getSigner,
    switchNetworkAsync,
  } = useWeb3();
  const [isMobile] = useMediaQuery('(max-width: 1000px)');
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const [polybaseLoading, setPolybaseLoading] = useState(false);
  const [polybaseRetrying, setPolybaseRetrying] = useState(false);
  const [current2fa, setCurrent2fa] = useState();
  const [theme /* , setTheme */] = useState('default');
  const [themeData, setThemeData] = useState(getThemeData(theme));
  const toast = useToast();
  const [userTier, setUserTier] = useState(0);

  const [cards, setCards] = useState();
  const [coinbaseCard, setCoinbaseCard] = useState(undefined);
  const [dextoolsCard, setDextoolsCard] = useState(undefined);
  //const [filteredCards, setFilteredCards] = useState(cards);
  const [refresh, setRefresh] = useState({ refresh: false });

  const { encryptWithLit, /* decryptWithLit, */ decryptRec, authSig, ready } =
    useLitProtocol(address, isConnected /*  && chainId && connector */);
  const {
    addedSigner,
    appId,
    createPolybaseRecord,
    /* decryptPolybaseRecs,  */ encodedNamespaceDb,
    listRecordsWhereAppIdMatches,
  } = usePolybase(decryptRec, isConnected, address, authSig, ready);

  //Check user tier
  useEffect(() => {
    if (getProvider && chainId && connector) {
      getProvider().then(provider => {
        if (
          provider &&
          provider.connection &&
          provider.connection.url &&
          provider.connection.url !== 'unknown:'
        ) {
          const _contract = new ethers.Contract(
            dappConfig.twoFaiTiers,
            ['function getUserTier(address adr) public view returns(uint8)'],
            provider
          );
          _contract
            .getUserTier(address)
            .then(answer => {
              setUserTier(answer);
            })
            .catch(console.error);
        }
      });
    }
  }, [getProvider != null, chainId, connector, refresh]);

  useEffect(() => {
    setThemeData(getThemeData(theme));
  }, [theme]);

  // const countAllRecords = async () => {
  //   if (polybaseDb) {
  //     const records = await polybaseDb
  //       .collection(collectionReference)
  //       .where('appId', '==', appId)
  //       .get();
  //     return records.data.length;
  //   } else {
  //     return 0;
  //   }
  // };

  // const deleteRecord = async id => {
  //   const record = await polybaseDb
  //     .collection(collectionReference)
  //     .record(id)
  //     .call('del');
  //   return record;
  // };

  const createRecord = async (
    service,
    account,
    secret,
    storagesSelected = [availableStorages.Polybase]
  ) => {
    setPolybaseLoading(true);
    try {
      // schema creation types
      // id: string, appId: string, address: string, service: string, serviceKey: string,
      // account: string, accountKey: string, secret: string, secretKey: string
      const id = `encrypted${Date.now().toString()}`;
      await createPolybaseRecord(id, service, account, secret);

      const signer = await getSigner();
      const blockchainReg = {
        id,
        appId,
        address,
        encryptedString: service.encryptedString,
        encryptedSymmetricKey: service.encryptedSymmetricKey,
        account: account.encryptedString,
        accountKey: account.encryptedSymmetricKey,
        secret: secret.encryptedString,
        secretKey: secret.encryptedSymmetricKey,
      };
      if (storagesSelected.includes(availableStorages.BASE)) {
        await storeSecret(
          signer,
          JSON.stringify(blockchainReg),
          availableStorages.BASE
        );
      }
      if (storagesSelected.includes(availableStorages.ARB)) {
        await storeSecret(
          signer,
          JSON.stringify(blockchainReg),
          availableStorages.ARB
        );
      }
      if (storagesSelected.includes(availableStorages.BNB)) {
        await storeSecret(
          signer,
          JSON.stringify(blockchainReg),
          availableStorages.BNB
        );
      }

      setPolybaseRetrying(false);

      if (service.service == 'COINBASE') {
        setCoinbaseCard({
          id,
          service: service.service,
          account: account.account,
          secret: secret.secret,
        });
      } else if (service.service == 'DEXTOOLS') {
        setDextoolsCard({
          id,
          service: service.service,
          account: account.account,
          secret: secret.secret,
        });
      } else {
        // update ui to show new card
        setCards(cards => [
          {
            id,
            service: service.service,
            account: account.account,
            secret: secret.secret,
          },
          ...cards,
        ]);
      }
    } catch (err) {
      console.log(err);

      // error handling and retry
      // -32603 is the error code if user cancels tx
      if (err.code !== -32603) {
        // if Polybase error, retry post data
        createRecord(service, account, secret);
        setPolybaseRetrying(true);
      }
    }
    setPolybaseLoading(false);
  };

  const encryptAndSaveSecret = async ({
    service,
    account,
    secret,
    storagesSelected = [[availableStorages.Polybase]],
  }) => {
    const encryptedService = await encryptWithLit(service);
    const encryptedAccount = await encryptWithLit(account);
    const encryptedSecret = await encryptWithLit(secret);

    const full2fa = {
      service: {
        decrypted: service,
        encrypted: encryptedService,
      },
      account: {
        decrypted: account,
        encrypted: encryptedAccount,
      },
      secret: {
        decrypted: secret,
        encrypted: encryptedSecret,
      },
    };

    setCurrent2fa(full2fa);

    createRecord(
      { ...encryptedService, service },
      { ...encryptedAccount, account },
      { ...encryptedSecret, secret },
      storagesSelected
    );
  };

  useEffect(() => {
    if (
      /* polybaseDb */ addedSigner &&
      addedSigner &&
      /* litClient */ ready &&
      authSig
    ) {
      const getEncryptedDataFromPolybase = async () => {
        try {
          const records = await listRecordsWhereAppIdMatches();
          await timeout(1000);
          records.forEach(
            element => (element['source'] = availableStorages.Polybase)
          );
          return records;
        } catch {
          return [];
        }
      };
      const getEncryptedDataFromBASE = async () => {
        const data = await getSecrets(address, 0, 100, availableStorages.BASE);
        return data.map(d => {
          try {
            const objectRt = JSON.parse(d.slice(1, -1).replaceAll('\\"', '"'));
            objectRt['source'] = availableStorages.BASE;
            return objectRt;
          } catch {
            return null;
          }
        });
      };
      const getEncryptedDataFromARB = async () => {
        const data = await getSecrets(address, 0, 100, availableStorages.ARB);
        return data.map(d => {
          try {
            const objectRt = JSON.parse(d.slice(1, -1).replaceAll('\\"', '"'));
            objectRt['source'] = availableStorages.ARB;
            return objectRt;
          } catch {
            return null;
          }
        });
      };
      const getEncryptedDataFromBNB = async () => {
        const data = await getSecrets(address, 0, 100, availableStorages.BNB);
        return data.map(d => {
          try {
            const objectRt = JSON.parse(d.slice(1, -1).replaceAll('\\"', '"'));
            objectRt['source'] = availableStorages.BNB;
            return objectRt;
          } catch {
            return null;
          }
        });
      };

      //Get and merge data from different sources
      Promise.all([
        getEncryptedDataFromPolybase(),
        getEncryptedDataFromBASE(),
        getEncryptedDataFromARB(),
        getEncryptedDataFromBNB()
      ]).then(answers => {
        const answer = answers
          .flat()
          .filter(el => el != null && el.service && el.account);
        const sortedAnswer =
          answer &&
          answer.sort((a, b) => {
            // if same service, alphabetize by account
            if (a.service.toLowerCase() === b.service.toLowerCase()) {
              return a.account.toLowerCase() > b.account.toLowerCase() ? 1 : -1;
            } else {
              // alphabetize by service
              return a.service.toLowerCase() > b.service.toLowerCase() ? 1 : -1;
            }
          });

        const groupedAnswer = _.groupBy(sortedAnswer, item => {
          const {
            id,
            appId,
            address,
            publicKey,
            service,
            serviceKey,
            account,
            accountKey,
            secret,
            secretKey,
          } = item;
          return JSON.stringify({
            id,
            appId,
            address,
            publicKey,
            service,
            serviceKey,
            account,
            accountKey,
            secret,
            secretKey,
          });
        });
        const groupedAnswerParsed = [];
        for (const key of Object.keys(groupedAnswer)) {
          //build the object with flags of sources
          const _objects = groupedAnswer[key];
          const answer = JSON.parse(key);
          answer[availableStorages.Polybase] =
            _objects.filter(el => el['source'] == availableStorages.Polybase)
              .length > 0;
          answer[availableStorages.ARB] =
            _objects.filter(el => el['source'] == availableStorages.ARB)
              .length > 0;
          answer[availableStorages.BASE] =
            _objects.filter(el => el['source'] == availableStorages.BASE)
              .length > 0;
          answer[availableStorages.BNB] =
            _objects.filter(el => el['source'] == availableStorages.BNB)
              .length > 0;
          groupedAnswerParsed.push(answer);
        }

        const decryptRegisters = async records => {
          const answer = [];
          for (const record of records) {
            const decryptedRec = await decryptRec(record);
            answer.push({
              ...decryptedRec,
              [availableStorages.Polybase]: record[availableStorages.Polybase],
              [availableStorages.ARB]: record[availableStorages.ARB],
              [availableStorages.BASE]: record[availableStorages.BASE],
              [availableStorages.BNB]: record[availableStorages.BNB],
            });
          }

          return answer;
        };

        decryptRegisters(groupedAnswerParsed).then(decryptedRecs => {
          setCards(
            decryptedRecs.filter(
              el => el.service != 'COINBASE' && el.service != 'DEXTOOLS'
            )
          );
          const coinbaseService = decryptedRecs.filter(
            el => el.service == 'COINBASE'
          );
          const dextoolsService = decryptedRecs.filter(
            el => el.service == 'DEXTOOLS'
          );
          if (coinbaseService && coinbaseService.length > 0) {
            setCoinbaseCard(coinbaseService[0]);
          }
          if (dextoolsService && dextoolsService.length > 0) {
            setDextoolsCard(dextoolsService[0]);
          }
        });
      });

      //MERGE from different sources //TODO
      // getEncryptedDataFromPolybase().then(async recs => {
      //   await decryptPolybaseRecs(recs).then(decryptedRecs => {
      //     const serviceSortedRecs =
      //       decryptedRecs &&
      //       decryptedRecs.sort((a, b) => {
      //         // if same service, alphabetize by account
      //         if (a.service.toLowerCase() === b.service.toLowerCase()) {
      //           return a.account.toLowerCase() > b.account.toLowerCase()
      //             ? 1
      //             : -1;
      //         } else {
      //           // alphabetize by service
      //           return a.service.toLowerCase() > b.service.toLowerCase()
      //             ? 1
      //             : -1;
      //         }
      //       });
      //     setCards(
      //       serviceSortedRecs.filter(
      //         el => el.service != 'COINBASE' && el.service != 'DEXTOOLS'
      //       )
      //     );
      //     const coinbaseService = serviceSortedRecs.filter(
      //       el => el.service == 'COINBASE'
      //     );
      //     const dextoolsService = serviceSortedRecs.filter(
      //       el => el.service == 'DEXTOOLS'
      //     );
      //     if (coinbaseService && coinbaseService.length > 0) {
      //       setCoinbaseCard(coinbaseService[0]);
      //     }
      //     if (dextoolsService && dextoolsService.length > 0) {
      //       setDextoolsCard(dextoolsService[0]);
      //     }
      //   });
      // });
      // countAllRecords().then(ans => {
      //   setAllRecordsCount(ans);
      // });
    }
  }, [
    addedSigner,
    /* litClient */ ready,
    authSig,
    /* polybaseDb */ addedSigner,
    refresh,
  ]);

  // Función para manejar el upgrade de tier
  const handleUpgradeTier = async () => {
    if (chainId && chainId != base.id) {
      toast({
        title: 'Switch to BASE',
        description: `Switch to BASE to increase your tier`,
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
      switchNetworkAsync({ chainId: base.id })
        .then(ans => {
          //handleUpgradeTier();
        })
        .catch(err => {
          //nothing
        });
    } else if (getProvider && chainId && connector) {
      getProvider().then(async provider => {
        const signer = provider.getSigner();

        if (
          provider &&
          provider.connection &&
          provider.connection.url &&
          provider.connection.url !== 'unknown:'
        ) {
          const nextTier = userTier + 1;
          const contract = new ethers.Contract(
            dappConfig.twoFaiTiers,
            [
              'function payForTier(uint8 tier, address _adr) public view returns(uint256)',
            ],
            provider
          );
          try {
            const amountApprove = await contract.payForTier(nextTier, address);
            //const tokenContract = new ethers.Contract(dappConfig.twoFaiTokenAddress, ["function approve(address adr, uint256 amount) public"], signer);
            //const approvalTx = await tokenContract.approve(dappConfig.twoFaiTiers, amountApprove.toString());
            //await approvalTx.wait();

            const burnContract = new ethers.Contract(
              dappConfig.twoFaiTiers,
              ['function burnForTier(uint8 tier) external payable'],
              signer
            );
            const burnTx = await burnContract.burnForTier(nextTier, {
              value: amountApprove,
            });
            await burnTx.wait();

            toast({
              title: 'Tier Upgraded!',
              description: `You have been upgraded to the ${tiers[nextTier]} tier`,
              status: 'success',
              duration: 5000,
              isClosable: true,
            });

            // Aquí es donde forzamos la actualización. Puedes elegir recargar la página:
            window.location.reload();

            // O si prefieres, solo actualiza el estado para que React re-renderice los componentes afectados:
            // setRefresh(!refresh); // Asegúrate de usar el estado 'refresh' en tus efectos para recargar datos cuando cambie
          } catch (error) {
            console.error('Error upgrading tier:', error);
            toast({
              title: 'Error',
              description: `There was an error upgrading to the ${tiers[nextTier]} tier. Check that you have enough ETH in the wallet.`,
              status: 'error',
              duration: 5000,
              isClosable: true,
            });
          }
        }
      });
    }
  };

  const storeNewChain = async (chainStore, secretStore) => {
    if (chainStore == availableStorages.BASE) {
      if (chainId != base.id) {
        await switchNetworkAsync({ chainId: base.id });
      }
      const signer = await getSigner();
      await storeSecret(
        signer,
        JSON.stringify(secretStore),
        availableStorages.BASE
      );
      setRefresh({ refresh: !refresh.refresh });
    }
    if (chainStore == availableStorages.ARB) {
      if (chainId != arbitrum.id) {
        await switchNetworkAsync({ chainId: arbitrum.id });
      }
      const signer = await getSigner();
      await storeSecret(
        signer,
        JSON.stringify(secretStore),
        availableStorages.ARB
      );
      setRefresh({ refresh: !refresh.refresh });
    }
    if (chainStore == availableStorages.BNB) {
      if (chainId != bsc.id) {
        await switchNetworkAsync({ chainId: bsc.id });
      }
      const signer = await getSigner();
      await storeSecret(
        signer,
        JSON.stringify(secretStore),
        availableStorages.BNB
      );
      setRefresh({ refresh: !refresh.refresh });
    }
  };

  const getFnStoreNewChain = (chainStore, secretStore) => {
    if (
      chainStore == availableStorages.BASE &&
      secretStore[availableStorages.BASE]
    ) {
      return undefined;
    } else if (
      chainStore == availableStorages.ARB &&
      secretStore[availableStorages.ARB]
    ) {
      return undefined;
    } else if (
      chainStore == availableStorages.BNB &&
      secretStore[availableStorages.BNB]
    ) {
      return undefined;
    } else {
      return () =>
        storeNewChain(chainStore, secretStore.encryptedItem).catch(
          console.error
        );
    }
  };

  return (
    <>
      {' '}
      <div className="noise"></div>
      <Header2 />
      <Box
        display="flex" // Activa Flexbox
        flexDirection="column" // Organiza los hijos en una columna
        backgroundPosition="center"
        backgroundSize="cover"
        sx={{
          bg: '#05041a',
          minH: 'auto',
          '@media screen and (min-width: 768px)': {
            // Nota el cambio aquí a min-width
            backgroundImage: `url(${bgImage})`, // Aplica el backgroundImage solo en pantallas más grandes que 768px
          },
        }}
        bg="#05041a"
        minH="auto"
        pr="3"
        pl="3"
      >
        {dappConfig.visibleDexToolsAds &&
          (isLargerThan768 ? (
            // Muestra este anuncio solo en escritorio
            <a
              href="https://www.dextools.io"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                zIndex={99999}
                src={ad980_120}
                alt="DexTools"
                title="DexTools"
                mx="auto"
                mt={6}
                mb={-4}
                border={'1px solid #05a3ba'}
                borderRadius={7}
              />
            </a>
          ) : (
            // Muestra este anuncio solo en móviles
            <a
              href="https://www.dextools.io"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                zIndex={99999}
                src={ad468_60}
                alt="DexTools"
                title="DexTools"
                mx="auto"
                mt={5}
                mb={5}
                border={'1px solid #05a3ba'}
                borderRadius={7}
              />
            </a>
          ))}

        <LoaderModal
          open={polybaseLoading || polybaseRetrying}
          message={
            polybaseLoading
              ? 'Sign the message in your wallet to encrypt and save your 2FA secret'
              : 'Still polling Polybase, please sign again'
          }
          tableData={current2fa}
        />

        {cards && (
          <Card
            padding={isMobile ? 4 : 10}
            mt={{ base: '2rem', md: '2.5rem' }}
            mb={{ base: '2rem', md: '2.5rem' }}
            border={'2px solid #05a3ba'}
            bg="#05a3ba1c!important"
            marginX={{ base: '2', md: '200px' }}
          >
            <UserCard isElegibleCard={false} />
          </Card>
        )}

        {(!address || !cards) && (
          <Flex
            height="100vh" // Asume que el spinner debe ocupar toda la altura de la ventana
            alignItems="center" // Centra el contenido verticalmente
            justifyContent="center" // Centra el contenido horizontalmente
          >
            <Spinner
              size="xl"
              color="#05a3ba"
              thickness="2px"
              speed="0.65s"
              emptyColor="gray.200"
            />
          </Flex>
        )}

        {/*  
      {cards && (
        <>          
          <Text fontWeight={'bold'} fontSize={{ base: '2xl', md: '4xl' }} mb={2} color="#ffffff">SECRETS CREATED BY USERS <span class='linear-wipe2'>{ allRecordsCount }</span></Text>
        </>
      )}  */}

        {/* Returning user with secrets*/}
        {cards && (
          <>
            <Text
              fontWeight={'bold'}
              fontSize={{ base: '3xl', md: '5xl' }}
              mb={{ base: 0, md: 0 }}
              mt={{ base: 4, md: 0 }}
              color="#ffffff"
            >
              <span className="linear-wipe2">YOUR SECRETS OTP</span>
            </Text>
          </>
        )}

        <Box display="flex" justifyContent="center">
          <Box display="flex" justifyContent="center" width="100%" mb={20}>
            <Flex wrap="wrap" justify="center" gap={5}>
              {
                //#region INICIO CAJA COINBASE SPECIAL SLOT
              }

              {dappConfig.visibleCoinbaseCard && (
                <>
                  {coinbaseCard ? (
                    <>
                      <GridItem
                        maxW={{ base: '95%', sm: '100%' }}
                        minW="300px"
                        minH="350px"
                        justifyContent="center"
                        border="1px solid #ffffff"
                        borderRadius="10px"
                        m="0.5rem"
                        bg="#0052ff"
                        p="0.5rem"
                      >
                        <Flex
                          direction="column"
                          justify="center"
                          align="center"
                          height="100%"
                          width="100%"
                        >
                          <Image
                            draggable="false"
                            className="imghover"
                            src={coinBase}
                            alt="coinbase"
                          />
                          <Text
                            fontSize="1.3rem"
                            pt={3}
                            fontWeight="semibold"
                            color="#fff"
                          >
                            Special Slot
                          </Text>
                          <Box p={2} mt={5} mb={5} className="coinbasebutton">
                            <AddSecret_Coinbase
                              enabled={true} // Siempre habilitado para este slot de regalo
                              saveSecret={encryptAndSaveSecret}
                              themeData={themeData}
                            />
                          </Box>
                        </Flex>
                      </GridItem>
                    </>
                  ) : (
                    <>
                      <GridItem
                        key={coinbaseCard.secret}
                        maxW={{ base: '95%', sm: '100%' }}
                        minW="300px"
                        minH="350px"
                        justifyContent="center"
                        border="1px solid #ffffff" // Resalta el primer slot como gratis
                        borderRadius="10px"
                        m="0.5rem"
                        bg="#0052ff"
                        p="0.5rem"
                      >
                        <ServiceCard3
                          linkToEncodedData={`https://testnet.polybase.xyz/v0/collections/${encodedNamespaceDb}/records/${coinbaseCard.id}`}
                          service={coinbaseCard.service}
                          account={coinbaseCard.account}
                          secret={coinbaseCard.secret}
                          themeData={themeData}
                          storeOnBaseFn={getFnStoreNewChain(
                            availableStorages.BASE,
                            coinbaseCard
                          )}
                          storeOnArbFn={getFnStoreNewChain(
                            availableStorages.ARB,
                            coinbaseCard
                          )}
                          storeOnBNBFn={getFnStoreNewChain(
                            availableStorages.BNB,
                            coinbaseCard
                          )}
                        />
                      </GridItem>
                    </>
                  )}
                </>
              )}
              {
                //#endregion FIN CAJA COINBASE SPECIAL SLOT
              }

              {
                //#region INICIO CAJA DEXTOOLS SPECIAL SLOT
              }

              {dappConfig.visibleDexToolsCard && (
                <>
                  {dextoolsCard ? (
                    <>
                      <GridItem
                        maxW={{ base: '95%', sm: '100%' }}
                        minW="300px"
                        minH="350px"
                        justifyContent="center"
                        border="1px solid #ffffff"
                        borderRadius="10px"
                        m="0.5rem"
                        bg="#0b1217"
                        p="0.5rem"
                        sx={{
                          backgroundImage: `url(${backgrounddextools})`,
                          backgroundSize: 'cover',
                        }}
                      >
                        <Flex
                          direction="column"
                          justify="center"
                          align="center"
                          height="100%"
                          width="100%"
                        >
                          <Image
                            draggable="false"
                            className="imghover"
                            src={dextools}
                            alt="dextools"
                          />
                          <Text
                            fontSize="1.3rem"
                            pt={3}
                            fontWeight="semibold"
                            color="#0b99c1"
                          >
                            Special Slot
                          </Text>
                          <Box p={2} mt={5} mb={5} className="dextoolsbutton">
                            <AddSecret_Dextools
                              enabled={true} // Siempre habilitado para este slot de regalo
                              saveSecret={encryptAndSaveSecret}
                              themeData={themeData}
                            />
                          </Box>
                        </Flex>
                      </GridItem>
                    </>
                  ) : (
                    <>
                      <GridItem
                        key={dextoolsCard.secret}
                        maxW={{ base: '95%', sm: '100%' }}
                        minW="300px"
                        minH="350px"
                        justifyContent="center"
                        border="1px solid #ffffff" // Resalta el primer slot como gratis
                        borderRadius="10px"
                        m="0.5rem"
                        bg="#0052ff"
                        p="0.5rem"
                      >
                        <ServiceCard3
                          linkToEncodedData={`https://testnet.polybase.xyz/v0/collections/${encodedNamespaceDb}/records/${dextoolsCard.id}`}
                          service={dextoolsCard.service}
                          account={dextoolsCard.account}
                          secret={dextoolsCard.secret}
                          themeData={themeData}
                          storeOnBaseFn={getFnStoreNewChain(
                            availableStorages.BASE,
                            dextoolsCard
                          )}
                          storeOnArbFn={getFnStoreNewChain(
                            availableStorages.ARB,
                            dextoolsCard
                          )}
                          storeOnBNBFn={getFnStoreNewChain(
                            availableStorages.BNB,
                            dextoolsCard
                          )}
                        />
                      </GridItem>
                    </>
                  )}
                </>
              )}
              {
                //#endregion FIN CAJA DEXTOOLS SPECIAL SLOT
              }

              {cards &&
                cards.map((c, index) => (
                  <GridItem
                    key={c.secret}
                    maxW={{ base: '95%', sm: '100%' }}
                    minW="300px"
                    minH="350px"
                    justifyContent="center"
                    border={
                      index === 0 ? '1px solid #05a3ba' : '1px solid #05a3ba'
                    } // Resalta el primer slot como gratis
                    borderRadius="10px"
                    m="0.5rem"
                    bg="#05041a"
                    p="0.5rem"
                  >
                    <ServiceCard3
                      linkToEncodedData={`https://testnet.polybase.xyz/v0/collections/${encodedNamespaceDb}/records/${c.id}`}
                      service={c.service}
                      account={c.account}
                      secret={c.secret}
                      themeData={themeData}
                      storeOnBaseFn={getFnStoreNewChain(
                        availableStorages.BASE,
                        c
                      )}
                      storeOnArbFn={getFnStoreNewChain(
                        availableStorages.ARB,
                        c
                      )}
                      storeOnBNBFn={getFnStoreNewChain(
                        availableStorages.BNB,
                        c
                      )}
                    />
                  </GridItem>
                ))}

              {cards && tierSlots[userTier] > cards.length && (
                <GridItem
                  maxW={{ base: '95%', sm: '100%' }}
                  minW="318px"
                  minH="350px"
                  justifyContent="center"
                  border="1px solid #05a3ba"
                  borderRadius="10px"
                  m="0.5rem"
                  bg="#01010c !important"
                  p="0.5rem"
                >
                  <Flex
                    direction="column"
                    justify="center"
                    align="center"
                    height="100%"
                    width="100%"
                  >
                    <Text fontSize="1.2rem" fontWeight="semibold">
                      <Box as="span" color="#05a3ba">
                        Tier:
                      </Box>{' '}
                      {tiers[userTier]}
                    </Text>
                    <Text fontSize="1.2rem" fontWeight="semibold">
                      <Box as="span" color="#05a3ba">
                        Actual Slots:
                      </Box>{' '}
                      {cards.length}/{tierSlots[userTier]}
                    </Text>

                    {cards && (
                      <Box p={2} mt={10} className="twofabutton">
                        {cards && (
                          <AddSecret
                            enabled={
                              cards && tierSlots[userTier] > cards.length
                            }
                            saveSecret={encryptAndSaveSecret}
                            themeData={themeData}
                          />
                        )}
                      </Box>
                    )}
                  </Flex>
                </GridItem>
              )}

              {
                //#region INICIO CAJA AD DEXTOOLS
              }
              {dappConfig.visibleDexToolsAds && (
                <GridItem
                  maxW={{ base: '95%', sm: '100%' }}
                  minW="300px"
                  minH="350px"
                  justifyContent="center"
                  border="1px solid #05a3ba"
                  borderRadius="10px"
                  m="0.5rem"
                  bg="#01010c !important"
                  p="0rem"
                >
                  <Flex
                    direction="column"
                    justify="center"
                    align="center"
                    height="100%"
                    width="100%"
                  >
                    <a
                      href="https://www.dextools.io"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        zIndex={99999}
                        src={ad318_356}
                        mx="auto"
                        borderRadius={10}
                        alt="DexTools"
                        title="DexTools"
                      />
                    </a>
                  </Flex>
                </GridItem>
              )}
              {
                //#endregion INICIO CAJA AD DEXTOOLS
              }

              {cards &&
                tierSlots[userTier] <= cards.length &&
                userTier < Object.keys(tierSlots).length - 1 && (
                  <GridItem
                    maxW={{ base: '95%', sm: '100%' }}
                    minW="318px"
                    minH="350px"
                    justifyContent="center"
                    alignItems="center"
                    display="flex"
                    flexDirection="column"
                    border="1px solid #05a3ba"
                    borderRadius="10px"
                    m="0.5rem"
                    bg="#05041a"
                    p="0.5rem"
                    pt="0px !important"
                  >
                    <Text fontSize="1rem" fontWeight="semibold" pb={5} pt={3}>
                      <Box as="span" color="#05a3ba">
                        Tier:{' '}
                      </Box>
                      {tiers[userTier]}
                      <Box ml={5} as="span" color="#05a3ba">
                        Slots:
                      </Box>{' '}
                      {cards.length}/{tierSlots[userTier]}
                    </Text>

                    <Image
                      onClick={handleUpgradeTier}
                      cursor={'pointer'}
                      draggable="false"
                      className="imghover"
                      src={more_slots}
                      alt="More Slots"
                      width={'145px'}
                      height={'145px'}
                      mt={5}
                    />

                    <Text
                      color="#ffffff"
                      textAlign="center"
                      fontSize="1rem"
                      pt={4}
                    >
                      NEED MORE SLOTS?
                    </Text>
                    {/* Asumiendo que tienes un método para manejar la compra de un nuevo tier */}
                    {userTier < Object.keys(tiers).length - 1 && ( // Asegura que no es el último tier
                      <>
                        <Button
                          onClick={handleUpgradeTier}
                          mt={2}
                          className="upgradetier"
                        >
                          Upgrade to {tiers[userTier + 1]} Tier
                        </Button>
                        <Text
                          fontSize={'0.8rem'}
                          marginTop={2}
                          textAlign={'center'}
                        >
                          Need help?{' '}
                          <a
                            style={{ textDecoration: 'underline' }}
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://docs.2fai.xyz/tiers-system"
                          >
                            Check out the Tiers
                          </a>
                        </Text>
                      </>
                    )}
                  </GridItem>
                )}
            </Flex>
          </Box>
        </Box>

        {isMobile && <MobileFooterMenu />}
      </Box>
    </>
  );
}

export default LoggedInPage;
