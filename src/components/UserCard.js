import { useState, useEffect } from 'react';
import {
  Text,
  /* Flex, */
  HStack,
  Button,
  Card,
  /* GridItem, */
  Box,
  Image,
  VStack,
  Tooltip,
  useToast,
  /*     Spinner,
    useMediaQuery,
    useToast, */
} from '@chakra-ui/react';
import '../pages/LoggedInPage.css';
import { isMobile } from 'react-device-detect';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { CopyIcon, CheckCircleIcon /* , CloseIcon */ } from '@chakra-ui/icons';
import { toSvg } from 'jdenticon';
import { useAccount, useDisconnect, useChainId } from 'wagmi';
import { createPublicClient, http } from 'viem';
import { base, mainnet } from 'wagmi/chains';
import { dappConfig /* , Base */ } from '../config/config.js';
import { ethers } from 'ethers';
import { useWeb3 } from '../hooks/useWeb3.js';
import { getThemeData } from '../theme';
/* import { base } from 'wagmi/chains'; */
//import { imgProviderSrc } from '../ipfsHelpers';
//import blockies from 'ethereum-blockies';

export const UserCard = ({ isElegibleCard = false }) => {
  const minRevShare = dappConfig.minRevShare;

  const { address, isConnected } = useAccount();
  const shortAddress = addr => `${addr.slice(0, 5)}...${addr.slice(-4)}`;
  const { disconnect } = useDisconnect();

  const [ensName, setEnsName] = useState();
  const [ensProfile /* , setEnsProfile */] = useState();
  const [ensAvatar, setEnsAvatar] = useState();
  const [isElegible, setIsElegible] = useState(false);
  const { /* getSigner,  */ getProvider, switchNetworkAsync, connector } =
    useWeb3();

    const toast = useToast();

  //const chains = useChains();
  const chainId = useChainId();

  const [theme /* , setTheme */] = useState('default');
  const [themeData /* , setThemeData */] = useState(getThemeData(theme));

  const [nRefs, setNRefs] = useState(0);

  const publicClient = createPublicClient({
    chain: mainnet,
    transport: http(),
  });

  // useEffect(() => {
  //   if (window.ethereum && address && ethers.utils.isAddress(address)) {
  //     let urlBlockies = blockies
  //       .create({ seed: ethers.utils.getAddress(address), size: 8, scale: 16 })
  //       .toDataURL();
  //     if (
  //       urlBlockies !==
  //       'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAAAehJREFUeF7t2MERACAQwkDsv2idsY2sHZzJAzjb7rzsDxwCZNn/wwnQ5k+AOH8CEEAITDsgA6TxC4Fx/AQggB2g7YAM0OavBsb5E4AAdoC0AzJAGr8aGMdPAALYAdoOyABt/mpgnD8BCGAHSDsgA6Txq4Fx/AQggB2g7YAM0OavBsb5E4AAdoC0AzJAGr8aGMdPAALYAdoOyABt/mpgnD8BCGAHSDsgA6Txq4Fx/AQggB2g7YAM0OavBsb5E4AAdoC0AzJAGr8aGMdPAALYAdoOyABt/mpgnD8BCGAHSDsgA6Txq4Fx/AQggB2g7YAM0OavBsb5E4AAdoC0AzJAGr8aGMdPAALYAdoOyABt/mpgnD8BCGAHSDsgA6Txq4Fx/AQggB2g7YAM0OavBsb5E4AAdoC0AzJAGr8aGMdPAALYAdoOyABt/mpgnD8BCGAHSDsgA6Txq4Fx/AQggB2g7YAM0OavBsb5E4AAdoC0AzJAGr8aGMdPAALYAdoOyABt/mpgnD8BCGAHSDsgA6Txq4Fx/AQggB2g7YAM0OavBsb5E4AAdoC0AzJAGr8aGMdPAALYAdoOyABt/mpgnD8BCGAHSDsgA6Txq4Fx/AQggB2g7YAM0OavBsb5E4AAdoC0AzJAGr8aGMe/PQwNgAEnVeAsAAAAAElFTkSuQmCC'
  //     ) {
  //       setBlockies({ logo: urlBlockies });
  //     } else {
  //       setBlockies({
  //         logo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAAA6FJREFUeF7t3bFRJDEURVGNQRR465IINuYa2ATBWIMxIRAB5hYmiayLRxwQxKHql6ov/h+6n66entTd0unx/eZ7wd/f1wtUe+nb09l/BH5h9/s/BQC0/lorAHIAIwir1QFzAGyAHCAHQISsPAcoBBJBDQEkXyFw+xSM7b/9/ecASEAhsBCICFl5IbAQSAQ1BJB8hcDtQxC2//b3nwMgAYXAQiAiZOWFwEIgEcRDwPP5P13A5+0/qt+9+M/XA93Cy+WO6gOA5PPiAMgBiKIcgOSbL84BcgCiMAcg+eaLc4AcgCjMAUi++eIcIAcgCnMAkm++OAfIAYjCHIDkmy/OAXIAojAHIPnmi3OAHIAozAFIvvnicQf4uL/S/gD6Rsr0K1XTCEzrdwqAWQQCYPidwtnmXysAAoAY1CG0IYDk9+IcIAcginIAkm++OAfIAYjCHIDkmy/OAXIAojAHIPnmi3OAHIAozAFIvvniHCAHIApzAJJvvjgHyAGIQnYA3S6erv4XtlvXHnT06+f9AY4uoPbAaYADAAkOgIMLGAABQAo0BOAsYFrAHID4961WA8AaoBBo+vFWsdMAB0AA2MGRqN/2PagMgATsLuDu198QcHCAAyAAygDCQEOAqNfTQP42EOVfDQGo4OEdQM8L0B0utAGw/bkHT+vHDjB9AwGw+YEROYCduKL65QA4Buha/rSDBkAA2DrANMFlgDIA9mErbwjAY+M0xOQAOYB1YazOAXIAQmg6QzULoObzff4CAI8+LQOUAbAPW3kZoAxABDUENAQQQDqNLgSS/IVAfq0b9V964IL+/8/hE080g7ADTKfwADgTwwFA8q2VA+DXvah/Q8BTDqAMUX0OkAMQQFpcCPx6UA2pPgfIAQggLc4BcgBiqGkgydc0sJXAVgIv2IesvJXA1gGMIKxuFtAsABGy8mYBzQKIoGYBJF+zgKWvNOkYqhaI7c+zIA2x278RFAC2lB0A+Dg0B3if/To4B8gBqBOWATb/MCQHyAFyAFCgEFgIBHyWbxTZOoA9DGsdAB+nFgILgWSBWqwfxuQAOQAxWAgsBBJA/DSwEFgIJAJbCGohiABqFoCzgI/76ze1ABZrA2oKx8vn8wKmr/8UAIbA7gAHgLV/DoD6bS9gDoAE7C7g7tffEHBwgAMgAJoGCgMNAaLe8o0Wp+fRARAApMA0wGUAar79HSwAAqAQKAyUAUS9QiB/XIryr4YAVDAHOLiAuwPwA4preF0zuPpmAAAAAElFTkSuQmCC',
  //       });
  //     }
  //   }
  // }, [address, refresh]);

  // useEffect(() => {
  //     const desiredChainId = base.id;

  //     if (chainIdConnected !== desiredChainId && switchNetworkAsync) {
  //         switchNetworkAsync(desiredChainId).catch(switchError => {
  //         if (switchError && switchError.code && switchError.code === 4902) {
  //             try {
  //             window.ethereum.request({
  //                 method: 'wallet_addEthereumChain',
  //                 params: [
  //                 {
  //                     // Parameters for the chain to be added
  //                     chainId: `0x${desiredChainId.toString(16)}`,
  //                     chainName: base.name, //"Base Mainnet",
  //                     nativeCurrency: base.nativeCurrency,
  //                     rpcUrls: base.rpcUrls,
  //                     blockExplorerUrls: base.blockExplorers,
  //                     iconsUrls: [],
  //                     // Other parameters like rpcUrls, blockExplorerUrls can be added here
  //                 },
  //                 ],
  //             });
  //             } catch (addError) {
  //             // Handle the error from adding a new network
  //             //console.error(addError);
  //             }
  //         }
  //         });
  //     }
  // }, [chainIdConnected]);

  useEffect(() => {
    if (isConnected && address) {
      const addEns = async () => {
        const checkEns = async () => {
          if (publicClient && address) {
            try {
              const name = await publicClient.getEnsName({
                address,
              });

              setEnsName(name);
              return name;
            } catch (err) {
              console.log(err);
            }
          }
        };

        const setAvatar = async name => {
          if (name) {
            const avatarSrc = await publicClient.getEnsAvatar({
              name,
            });
            setEnsAvatar(avatarSrc);
          }
        };

        /* const ensName =  */ await checkEns().then(
          async name => await setAvatar(name)
        );
      };

      addEns();
    }
  }, [isConnected, address]);

  useEffect(() => {
    if (isConnected && address && getProvider && chainId && connector) {
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
              setIsElegible(
                ethers.BigNumber.from(tokensHolded).gte(minRevShare)
              );
            })
            .catch(console.error);
        }
      });
    }
  }, [
    /* chainIdConnected,  */ address,
    isConnected,
    getProvider != null,
    chainId,
    connector,
  ]);

  useEffect(() => {
    if (address) {
      fetch(
        `https://eu-west-2.aws.data.mongodb-api.com/app/application-0-lixxb/endpoint/getReferrals?address=${address.toLowerCase()}`
      )
        .then(answer => {
          answer
            .json()
            .then(_answer => {
              if (_answer && _answer.length) {
                setNRefs(_answer.length);
              } else {
                setNRefs(0);
              }
            })
            .catch(console.error);
        })
        .catch(console.error);
    }
  }, [address]);

  return (
    <HStack /* width={'80%'} */ justifyContent={isMobile ? 'center' : 'space-between'} spacing={8}>
      {/* Contenido existente a la izquierda */}
      <VStack alignItems="flex-start">
        <HStack>
          <a href={ensProfile} target="_blank" rel="noopener noreferrer">
            <Image
              borderRadius="full"
              boxSize={isMobile ? '80px' : '100px'}
              src={ensAvatar}
              fallbackSrc={
                `data:image/svg+xml;base64,${btoa(toSvg(address, 200))}`
                /* '/logo192.png' */
              }
              marginRight={isMobile ? 2 : 4}
            />
          </a>

          <VStack alignItems="flex-start">
            <Text mb={2}>
              <strong>
                Welcome{' '}
                {ensName ? (
                  <a
                    href={ensProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {ensName}
                  </a>
                ) : (
                  'anon'
                )}{' '}
              </strong>
              {theme === 'apecoinDao' && (
                <Text fontSize={'10px'} color={themeData.color2}>
                  2FAi Investor <CheckCircleIcon marginLeft={1} />
                </Text>
              )}
            </Text>

            <Text>
              <CopyToClipboard text={address}>
                <span
                  className="wallet-user"
                  style={{
                    color: 'rgba(255, 255, 255, 0.25)',
                    marginLeft: '5px',
                    cursor: 'pointer',
                  }}
                >
                  <CopyIcon marginRight={1} />
                  <Tooltip label="Click to copy address">
                    {shortAddress(address)}
                  </Tooltip>
                </span>
              </CopyToClipboard>
            </Text>

            <Button
              marginLeft={2}
              onClick={() => disconnect()}
              width={isMobile ? '100%' : 'fit-content'}
              className="logout-b"
            >
              Log out
            </Button>

      {/* Insertar aquí el componente de enlace de referido para móviles */}
      {isMobile && isElegibleCard && (
        <Box border="1px solid #05a3ba" borderRadius="md" p={4} bg="#0e0e0e" marginTop="4">
          <Text className="linear-wipe2" fontWeight={'bold'}>REF LINK</Text>
          <Text>
            <CopyToClipboard text={`https://2fai.xyz?ref=${address}`}>
              <span style={{color: 'white', cursor: 'pointer', backgroundColor: 'transparent'}}>
                <HStack p={0} m={0}>
                  <CopyIcon color={'white'} marginRight={1} />
                  <Tooltip label="Click to copy referral link">
                    <Text color={'white'}>{shortAddress(`ref=${address}`)}</Text>
                  </Tooltip>
                </HStack>
              </span>
            </CopyToClipboard>
          </Text>
        </Box>
      )}            
          </VStack>
        </HStack>
      </VStack>

      <HStack alignItems="flex-start">
        {isElegibleCard /* referral */ && !isMobile && (
          <HStack
            alignItems="flex-start"
            spacing={4}
            display={{ base: 'none', lg: 'flex' }}
          >
            <Box
              border="1px solid #05a3ba"
              borderRadius="md"
              p={4}
              bg="#0e0e0e"
            >
              <Text className="linear-wipe2" fontWeight={'bold'}>
                {' '}
                REF LINK
              </Text>
              <Text>
                <CopyToClipboard text={`https://2fai.xyz?ref=${address}`}
                  onCopy={() => toast({
                    title: 'Link copied!',
                    description: "Referral link has been copied to clipboard",
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                  })}>
                  <span
                    // className="wallet-user"
                    style={{
                      color: 'white', //'rgba(255, 255, 255, 0.25)',
                      // marginLeft: '5px',
                      cursor: 'pointer',
                      backgroundColor: 'transparent',
                    }}
                  >
                    <HStack p={0} m={0}>
                      <CopyIcon color={'white'} marginRight={1} />
                      <Tooltip label="Click to copy referral link">
                        <Text color={'white'}>
                          {shortAddress(`ref=${address}`)}
                        </Text>
                      </Tooltip>
                    </HStack>
                  </span>
                </CopyToClipboard>
              </Text>
            </Box>
          </HStack>
        )}

        {isElegibleCard /* referral */ && (
          <Tooltip label="Get 10% from the rev share allocation of each one of your referrals (unlimited)">
            <HStack
              alignItems="flex-start"
              spacing={4}
              display={{ base: 'none', lg: 'flex' }}
            >
              <Box
                border="1px solid #05a3ba"
                borderRadius="md"
                p={4}
                bg="#0e0e0e"
              >
                <Text className="linear-wipe2" fontWeight={'bold'}>
                  {' '}
                  REFERRALS
                </Text>
                <Text>{nRefs}</Text>
              </Box>
            </HStack>
          </Tooltip>
        )}

        {/* Cajas horizontales a la derecha */}
        {isElegibleCard && (
          <HStack
            alignItems="flex-start"
            spacing={4}
            display={{ base: 'none', lg: 'flex' }}
          >
            <Box
              border="1px solid #05a3ba"
              borderRadius="md"
              p={4}
              bg="#0e0e0e"
            >
              <Text className="linear-wipe2" fontWeight={'bold'}>
                {' '}
                REV SHARE
              </Text>
              <Text>{isElegible ? '✅' : '❌'} Elegible</Text>
            </Box>
          </HStack>
        )}
      </HStack>
    </HStack>
  );
};
