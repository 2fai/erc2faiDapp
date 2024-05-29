import { useState, useEffect } from 'react';
import {
  Text,
  Button,
  Card,
  Grid,
  GridItem,
  Box,
  useMediaQuery,
  //Spinner,
  //useMediaQuery,
  useToast,
} from '@chakra-ui/react';
import Header2 from '../components/Header2';
import './LoggedInPage.css';

import { useAccount /* , useChainId, useChains */, useChainId } from 'wagmi';
import bgImage from '../img/2fai-patt.svg';
import LoaderModal from '../components/LoaderModal';
import Footer2 from '../components/Footer2';
import { ethers } from 'ethers';
import { dappConfig /* , Base */ } from '../config/config.js';
//import { base } from 'wagmi/chains'
import _, { chain } from 'lodash';
import { getErrorMessage } from '../helpers/web3Helper.js';
import { useWeb3 } from '../hooks/useWeb3.js';
import MobileFooterMenu from '../components/MobileFooterMenu.tsx';
import { UserCard } from '../components/UserCard.js';
import { base } from 'wagmi/chains';

const moment = require('moment');

function RevShare() {
  const [isMobile] = useMediaQuery('(max-width: 1000px)');
  const { address, isConnected } = useAccount();
  const { getSigner, getProvider, switchNetworkAsync, connector } = useWeb3();
  const chainId = useChainId();
  const [polybaseLoading /* , setPolybaseLoading */] = useState(false);
  const [polybaseRetrying /* , setPolybaseRetrying */] = useState(false);
  const [current2fa /* , setCurrent2fa */] = useState();
  const toast = useToast();

  //const [userTier, setUserTier] = useState(0);
  const [userBalance, setUserBalance] = useState('0');
  //const [refresh, setRefresh] = useState(false);
  const [now, setNow] = useState('0 Day 0 hours 0 min');
  const [tokenPrice, setTokenPrice] = useState('0');
  const [rewardsPercent, setRewardsPercent] = useState('0');
  const [treesUser, setTreesUser] = useState([]);
  const [treesPendingClaimAvailable, setTreesPendingClaimAvailable] = useState(
    []
  );
  const [treesClaimedTimestamps, setTreesClaimedTimestamps] = useState([]);
  //const chains = useChains();
  //const chainIdConnected = useChainId({ config: chains });

  useEffect(() => {
    if (isConnected && address && getProvider && connector) {
      getProvider().then(provider => {
        if (
          provider &&
          provider.connection &&
          provider.connection.url &&
          provider.connection.url !== 'unknown:'
        ) {
          if (chainId != base.id) {
            provider = new ethers.providers.JsonRpcProvider(
              dappConfig.baseReadRPC
            );
          }
          const __contract = new ethers.Contract(
            dappConfig.twoFaiTokenAddress,
            ['function balanceOf(address adr) public view returns(uint256)'],
            provider
          );
          __contract
            .balanceOf(address)
            .then(answer => {
              const tokensHolded = ethers.BigNumber.from(answer.toString())
                .div(10 ** 9)
                .toString();
              setUserBalance(tokensHolded);
            })
            .catch(console.error);
          const ___contract = new ethers.Contract(
            dappConfig.uniswapV2Router,
            [
              'function getAmountsOut(uint256 amountIn, address[] path) public view returns(uint256[])',
            ],
            provider
          );
          ___contract
            .getAmountsOut('1000000000', [
              dappConfig.twoFaiTokenAddress,
              dappConfig.weth,
              dappConfig.usdc,
            ])
            .then(answer => {
              const tokenAmount = answer[2].toString(); //ethers.BigNumber.from(answer.toString()).div(10 ** 6).toString();
              setTokenPrice(parseFloat(tokenAmount) / (10 ** 6).toPrecision(4));
            });
          getCovalentHoldersQuery();
          getMerkleTreePending();
        }
      });
    }

    let now = moment();
    let nextMonday;
    if (now.day() === 1 && now.hour() === 0 && now.minute() === 0) {
      // If it's exactly Monday 00:00, set nextMonday to now to avoid waiting another week
      nextMonday = now;
    } else {
      // Otherwise, find the next Monday
      nextMonday = now.clone().add(1, 'weeks').startOf('isoWeek');
    }
    let currNow = moment.duration(nextMonday.diff(now));
    setNow(
      `${currNow.days()} Day ${currNow.hours()} hours ${currNow.minutes()} min`
    );
  }, [
    /* refresh,  */ /* chainIdConnected, */ address,
    isConnected,
    getProvider != null,
    chainId,
    connector,
  ]);

  const getCovalentHoldersQuery = async () => {
    const queryHoldersCovalent = `https://api.covalenthq.com/v1/8453/tokens/${dappConfig.twoFaiTokenAddress}/token_holders/?key=${dappConfig.covalentKey}&page-size=200`;
    const answer = await fetch(queryHoldersCovalent);
    answer.json().then(answerJson => {
      //console.log(answerJson.data.items)
      const filteredItems = answerJson.data.items.filter(
        el =>
          !dappConfig.bannedFromRevShare.includes(el.address.toLowerCase()) &&
          parseInt(el.balance) / 10 ** 9 > parseInt(dappConfig.minRevShare)
      );

      let totalAmountQualify = _.sumBy(filteredItems, el =>
        parseInt(el.balance)
      );
      let yourRecord = filteredItems.filter(
        el => el.address.toLowerCase() === (address?.toLowerCase() ?? '')
      );
      let yourBalance =
        yourRecord.length > 0 ? parseInt(yourRecord[0].balance) : 0;
      let yourRewardPercent = (
        (yourBalance / totalAmountQualify) *
        100
      ).toPrecision(3);
      setRewardsPercent(parseFloat(yourRewardPercent));
    });
  };

  function base64ToBytes32Hex(base64) {
    // Step 1: Decode the base64 string to a binary string
    const binaryString = atob(base64);
    let hexString = '';

    // Step 2: Convert the binary string to a hex string
    for (let i = 0; i < binaryString.length; i++) {
      const hex = binaryString.charCodeAt(i).toString(16).padStart(2, '0');
      hexString += hex;
    }

    // Ensure the hex string is 64 characters long for bytes32,
    // padding with zeros if necessary
    const paddedHex = hexString.padEnd(64, '0');

    // Return the hex string in '0x' prefixed format
    return `0x${paddedHex}`;
  }

  const getMerkleTreePending = async () => {
    if (address) {
      const queryMerkleTrees = `https://eu-west-2.aws.data.mongodb-api.com/app/application-0-lixxb/endpoint/twofaiusermerkletree?address=${address.toLowerCase()}`;
      const answer = await fetch(queryMerkleTrees);
      answer.json().then(answerJson => {
        treesUser.length = 0;
        for (const userLeafData of _.uniqBy(answerJson, el => el.timestamp)) {
          const proofsParsed = userLeafData.proof.map(el =>
            base64ToBytes32Hex(el.Data)
          );
          treesUser.push({
            ...userLeafData,
            proof: proofsParsed, //userLeafData.proof.map(buffer => '0x' + buffer.toString('hex'))
          });
        }

        //Set merkle trees pending claim and claimed
        setTreesUser([...treesUser]);
        //check against the contract which merkle trees are claimable
        if ((isConnected && address && getProvider && chainId, connector)) {
          getProvider().then(provider => {
            if (
              provider &&
              provider.connection &&
              provider.connection.url &&
              provider.connection.url !== 'unknown:' &&
              treesUser &&
              treesUser.map
            ) {
              if (chainId != base.id) {
                provider = new ethers.providers.JsonRpcProvider(
                  dappConfig.baseReadRPC
                );
              }
              const _contract = new ethers.Contract(
                dappConfig.twoFaiRevShare,
                [
                  'function areClaimabledTimestamps(address sender, uint256[] memory timestamps) public view returns(bool[] memory)',
                  'function areClaimedTimestamps(address sender, uint256[] memory timestamps) public view returns(bool[] memory)',
                  'function verifyClaim(address claimer, uint256 amount, uint256 timestampClaim, bytes32[] calldata merkleProof) public view returns(bool)',
                  //
                ],
                provider
              );
              _contract
                .areClaimabledTimestamps(
                  address,
                  treesUser.map(el => el.timestamp)
                )
                .then(answer => {
                  setTreesPendingClaimAvailable([
                    ...treesUser.filter((el, _i) => answer[_i]),
                  ]);
                })
                .catch(console.error);
              _contract
                .areClaimedTimestamps(
                  address,
                  treesUser.map(el => el.timestamp)
                )
                .then(answer => {
                  setTreesClaimedTimestamps([
                    ...treesUser.filter((el, _i) => answer[_i]),
                  ]);
                })
                .catch(console.error);
            }
          });
        }
      });
    }
  };

  const showErrorMessage = _error => {
    toast({
      title: 'Something went wrong!', // Mensaje que quieres mostrar
      description: getErrorMessage(_error),
      status: 'error', // Color del toast
      duration: 5000, // Duración del toast en pantalla
      isClosable: true, // Permite cerrar el toast
      position: 'bottom',
    });
  };

  const claimRewards = async () => {
    if (
      isConnected &&
      address &&
      getProvider &&
      getSigner &&
      chainId &&
      connector
    ) {
      getProvider().then(provider => {
        if (
          provider &&
          provider.connection &&
          provider.connection.url &&
          provider.connection.url !== 'unknown:' &&
          treesUser &&
          treesUser.map
        ) {
          getSigner().then(signer => {
            const _contract = new ethers.Contract(
              dappConfig.twoFaiRevShare,
              [
                'function areClaimabledTimestamps(address sender, uint256[] memory timestamps) public view returns(bool[] memory)',
                'function areClaimedTimestamps(address sender, uint256[] memory timestamps) public view returns(bool[] memory)',
                'function verifyClaim(address claimer, uint256 amount, uint256 timestampClaim, bytes32[] calldata merkleProof) public view returns(bool)',
                'function claimTokens(uint256 amount, uint256 timestampClaim, bytes32[] calldata merkleProof)',
                'function claimTokensBulk(uint256[] memory amounts, uint256[] memory timestamps, bytes32[][] calldata merkleProofs)',
              ],
              signer
            );

            let amountsClaim = treesPendingClaimAvailable.map(
              el => el.amount * 10 ** 9
            );
            let timestampsClaim = treesPendingClaimAvailable.map(
              el => el.timestamp
            );
            let proofs = treesPendingClaimAvailable.map(el => el.proof);
            _contract
              .claimTokensBulk(amountsClaim, timestampsClaim, proofs)
              .then(answer => {
                answer
                  .wait()
                  .then(() => {
                    toast({
                      title: 'Rewards claimed!', // Mensaje que quieres mostrar
                      description: `Successfully claimed ${_.sum(amountsClaim.map(el => parseInt(el.toString()) / 10 ** 9))} $2FAI`,
                      status: 'success', // Color del toast
                      duration: 5000, // Duración del toast en pantalla
                      isClosable: true, // Permite cerrar el toast
                      position: 'bottom',
                    });
                  })
                  .catch(showErrorMessage);
              })
              .catch(showErrorMessage);
          });
        }
      });
    }
  };

  // useEffect(() => {
  //   const desiredChainId = base.id;

  //   if (chainIdConnected !== desiredChainId && switchNetworkAsync) {
  //     switchNetworkAsync(desiredChainId).catch(switchError => {
  //       if (switchError && switchError.code && switchError.code === 4902) {
  //         try {
  //           window.ethereum.request({
  //             method: 'wallet_addEthereumChain',
  //             params: [
  //               {
  //                 // Parameters for the chain to be added
  //                 chainId: `0x${desiredChainId.toString(16)}`,
  //                 chainName: base.name, //"Base Mainnet",
  //                 nativeCurrency: base.nativeCurrency,
  //                 rpcUrls: base.rpcUrls,
  //                 blockExplorerUrls: base.blockExplorers,
  //                 iconsUrls: [],
  //                 // Other parameters like rpcUrls, blockExplorerUrls can be added here
  //               },
  //             ],
  //           });
  //         } catch (addError) {
  //           // Handle the error from adding a new network
  //           //console.error(addError);
  //         }
  //       }
  //     });
  //   }
  // }, [chainIdConnected]);

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
          minH: '95vh',
          '@media screen and (min-width: 768px)': {
            // Nota el cambio aquí a min-width
            backgroundImage: `url(${bgImage})`, // Aplica el backgroundImage solo en pantallas más grandes que 768px
          },
        }}
        bg="#05041a"
        minH="95vh"
      >
        <LoaderModal
          open={polybaseLoading || polybaseRetrying}
          message={
            polybaseLoading
              ? 'Sign the message in your wallet to encrypt and save your 2FA secret'
              : 'Still polling Polybase, please sign again.'
          }
          tableData={current2fa}
        />

        <Card
          padding={isMobile ? 4 : 10}
          mt={{ base: '2rem', md: '2.5rem' }}
          mb={{ base: '2rem', md: '2.5rem' }}
          border={'2px solid #05a3ba'}
          bg="#05a3ba1c!important"
          marginX={{ base: '2', md: '200px' }}
        >
          <UserCard isElegibleCard={true} />
        </Card>

        {/* Returning user with secrets*/}
        <Text
          fontWeight={'bold'}
          fontSize={{ base: '2xl', md: '4xl' }}
          color="#ffffff"
        >
          <span className="linear-wipe2">YOUR REV SHARE</span>
        </Text>
        <Box display="flex" justifyContent="center">
          <Box maxWidth="1440px" width="100%" mb={20}>
            {
              //#region First row of cards
            }
            <Grid
              templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(4, 1fr)' }}
              gap={5}
              id="logged-in-wrap"
            >
              {
                //#region 2FAI holdings
              }
              <GridItem
                w="100%"
                maxW={{ base: '95%', sm: '100%' }}
                justifyContent="center"
                border="1px solid #05a3ba"
                borderRadius="10px"
                m="0.5rem"
                bg="black"
                p="0.5rem"
              >
                <Box p={5} textAlign="center" color="white">
                  <Text fontSize="xl" fontWeight="bold" style={{borderBottom:'1px solid #05a3ba'}}>
                    $2FAI HOLDINGS
                  </Text>
                  {/* Aquí puedes añadir el valor dinámico de $2FAI HOLDINGS */}
                  <Text fontSize="lg">{userBalance}</Text>
                </Box>
              </GridItem>
              {
                //#endregion
              }

              {
                //#region Rev share earned
              }
              <GridItem
                w="100%"
                maxW={{ base: '95%', sm: '100%' }}
                justifyContent="center"
                border="1px solid #05a3ba"
                borderRadius="10px"
                m="0.5rem"
                bg="black"
                p="0.5rem"
              >
                <Box p={5} textAlign="center" color="white">
                  <Text fontSize="xl" fontWeight="bold" style={{borderBottom:'1px solid #05a3ba'}}>
                    REV SHARE EARNED
                  </Text>
                  {/* Aquí puedes añadir el valor dinámico de REV SHARE EARNED */}

                  {/* <Text fontSize="lg">$2FAI { _.sumBy(treesClaimedTimestamps, el => parseInt(el.amount)) } </Text> */}
                  {treesClaimedTimestamps &&
                  treesClaimedTimestamps.length > 0 ? (
                    (() => {
                      let pendingClaimTokens = _.sumBy(
                        treesClaimedTimestamps,
                        el => parseInt(el.amount)
                      );
                      let tokensValue = '';
                      if (tokenPrice !== '0') {
                        tokensValue = ` (${parseInt(parseFloat(tokenPrice) * pendingClaimTokens)} USDT)`;
                      }
                      return (
                        <Text fontSize="lg">{`${pendingClaimTokens} $2FAI ${tokensValue}`}</Text>
                      );
                    })()
                  ) : (
                    <Text fontSize="lg">0 $2FAI (0 USDT)</Text>
                  )}
                </Box>
              </GridItem>
              {
                //#endregion
              }

              {
                //#region Pending rewards
              }
              <GridItem
                w="100%"
                maxW={{ base: '95%', sm: '100%' }}
                justifyContent="center"
                border="1px solid #05a3ba"
                borderRadius="10px"
                m="0.5rem"
                bg="black"
                p="0.5rem"
              >
                <Box p={5} textAlign="center" color="white">
                  <Text fontSize="xl" fontWeight="bold" style={{borderBottom:'1px solid #05a3ba'}}>
                    PENDING REWARDS
                  </Text>
                  {/* Aquí puedes añadir el porcentaje dinámico de OF REWARDS */}
                  {treesPendingClaimAvailable &&
                  treesPendingClaimAvailable.length > 0 ? (
                    (() => {
                      let pendingClaimTokens = _.sumBy(
                        treesPendingClaimAvailable,
                        el => parseInt(el.amount)
                      );
                      let tokensValue = '';
                      if (tokenPrice !== '0') {
                        tokensValue = ` (${parseInt(parseFloat(tokenPrice) * pendingClaimTokens)} USDT)`;
                      }
                      return (
                        <Text fontSize="lg">{`${pendingClaimTokens} $2FAI ${tokensValue}`}</Text>
                      );
                    })()
                  ) : (
                    <Text fontSize="lg">0 $2FAI (0 USDT)</Text>
                  )}
                </Box>
              </GridItem>
              {
                //#endregion
              }

              {
                //#region % of rewards
              }
              <GridItem
                w="100%"
                maxW={{ base: '95%', sm: '100%' }}
                justifyContent="center"
                border="1px solid #05a3ba"
                borderRadius="10px"
                m="0.5rem"
                bg="black"
                p="0.5rem"
              >
                <Box p={5} textAlign="center" color="white">
                  <Text fontSize="xl" fontWeight="bold" style={{borderBottom:'1px solid #05a3ba'}}>
                    % OF REWARDS
                  </Text>
                  {/* Aquí puedes añadir el porcentaje dinámico de OF REWARDS */}
                  <Text fontSize="lg">{rewardsPercent}%</Text>
                </Box>
              </GridItem>
              {
                //#endregion
              }
            </Grid>
            {
              //#endregion
            }
            {
              //#region Second row of cards
            }
            <Grid
              display={{ base: 'none', md: 'grid' }}
              templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(4, 1fr)' }}
              gap={5}
              id="logged-in-wrap"
            >
              {
                //#region 2FAI price
              }
              <GridItem
                w="100%"
                maxW={{ base: '90%', sm: '100%' }}
                justifyContent="center"
                border="1px solid #05a3ba"
                borderRadius="10px"
                m="0.5rem"
                bg="black"
                p="0.5rem"
              >
                <Box p={5} textAlign="center" color="white">
                  <Text fontSize="xl" fontWeight="bold" style={{borderBottom:'1px solid #05a3ba'}}>
                    2FAI PRICE
                  </Text>
                  <Text fontSize="lg">{tokenPrice} $USDT</Text>
                </Box>
              </GridItem>
              {
                //#endregion
              }

              {
                //#region Snapshot
              }
              <GridItem
                w="100%"
                maxW={{ base: '90%', sm: '100%' }}
                justifyContent="center"
                border="1px solid #05a3ba"
                borderRadius="10px"
                m="0.5rem"
                bg="black"
                p="0.5rem"
              >
                <Box p={5} textAlign="center" color="white">
                  <Text fontSize="xl" fontWeight="bold" style={{borderBottom:'1px solid #05a3ba'}}>
                    NEXT SNAPSHOT
                  </Text>
                  {/* Aquí puedes añadir el porcentaje dinámico de OF REWARDS */}
                  <Text fontSize="lg">{now}</Text>
                </Box>
              </GridItem>
              {
                //#endregion
              }

              {
                //#region Burnt supply
              }
              <GridItem
                w="100%"
                maxW={{ base: '90%', sm: '100%' }}
                justifyContent="center"
                border="1px solid #05a3ba"
                borderRadius="10px"
                m="0.5rem"
                bg="black"
                p="0.5rem"
              >
                {/* TODO balance de tokens del deployer */}
                <Box p={5} textAlign="center" color="white">
                  <Text fontSize="xl" fontWeight="bold" style={{borderBottom:'1px solid #05a3ba'}}>
                    NEXT 2FAI TO BURN
                  </Text>
                  <Text fontSize="lg">0 $2Fai</Text>
                </Box>
              </GridItem>
              {
                //#endregion
              }

              {
                //#region Circulating supply
              }
              <GridItem
                w="100%"
                maxW={{ base: '90%', sm: '100%' }}
                justifyContent="center"
                border="1px solid #05a3ba"
                borderRadius="10px"
                m="0.5rem"
                bg="black"
                p="0.5rem"
              >
                <Box p={5} textAlign="center" color="white">
                  <Text fontSize="xl" fontWeight="bold" style={{borderBottom:'1px solid #05a3ba'}}>
                    CIRCULATING SUPPLY
                  </Text>
                  {/* Aquí puedes añadir el porcentaje dinámico de OF REWARDS */}
                  <Text fontSize="lg">96.000.000 $2FAI</Text>
                </Box>
              </GridItem>
              {
                //#endregion
              }
            </Grid>
            {
              //#endregion
            }
            {
              //#region Claim rewards
            }
            <Box textAlign="center" mt={5}>
              <Button
                size="lg"
                colorScheme={
                  treesPendingClaimAvailable &&
                  treesPendingClaimAvailable.length > 0
                    ? 'teal'
                    : 'gray'
                }
                variant="solid"
                px={10}
                py={6}
                borderRadius="md"
                _hover={{ bg: 'teal.600' }}
                onClick={
                  treesPendingClaimAvailable &&
                  treesPendingClaimAvailable.length > 0
                    ? claimRewards
                    : () => {}
                }
                isDisabled={
                  !treesPendingClaimAvailable ||
                  treesPendingClaimAvailable.length === 0
                }
                cursor={
                  treesPendingClaimAvailable &&
                  treesPendingClaimAvailable.length > 0
                    ? 'pointer'
                    : 'auto'
                }
                // backgroundColor={}
                className="claim-rewards-button"
              >
                CLAIM REWARDS
              </Button>
            </Box>
            {
              //#endregion
            }
          </Box>
        </Box>

        {isMobile && <MobileFooterMenu />}
      </Box>
    </>
  );
}

export default RevShare;
