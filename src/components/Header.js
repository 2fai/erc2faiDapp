import React /* , { useState } */ from 'react';
import {
  Flex,
  Image,
  Box,
  Link,
  HStack,
  useBreakpointValue,
  Button,
  //useToast,
} from '@chakra-ui/react';
import logo from '../logo2.png'; // Asegúrate de que la ruta de la imagen sea correcta
// import { Web3Button } from '@web3modal/react';
//import { useConnect } from 'wagmi'
//import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi';
//import { useConnect } from '@wagmi/core';
import UniswapLogo from '../img/Uniswap_Logo.svg';
import './header.css';
import { ConnectButton } from '@rainbow-me/rainbowkit';
//import { useWeb3 } from '../hooks/useWeb3';
import { useDisconnect } from 'wagmi';

const Header = () => {
  //const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  //const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
  const isMobile = useBreakpointValue({ base: true, md: false });
  //const toast = useToast();
  const isDappLive = true; //TODO to enable dapp
  //const { chains,  } = useConfig();
  //const { disconnect } = useWeb3();
  const { disconnect } = useDisconnect();

  // const web3Modal = createWeb3Modal({
  //   projectId: process.env.REACT_APP_WALLET_CONNECT_ID, // Replace 'your_project_id' with your actual Web3Modal project ID
  // });

  const launchDappClick = e => {
    if (!isDappLive) {
      e.preventDefault();
    }
  };

  const hideOnSmallScreens = {
    display: 'flex',
    '@media screen and (max-width: 1085px)': {
      display: 'none',
    },
    _hover: {
      color: '#05a3ba', // Color en hover
    },
  };

  const buttonStyle = {
    backgroundColor: 'blue !important', //'#4A90E2 !important', // Example blue color, adjust based on Web3Button
    color: 'white',
    padding: '5px 15px',
    border: 'none',
    borderRadius: '5px',
    cursor: !isDappLive ? 'not-allowed' : 'pointer',
    opacity: !isDappLive ? '0.5 !important' : '1 !important',
    fontSize: '16px',
    fontWeight: 'bold',
    // Add any other styles mimicking the Web3Button
  };

  return (
    <Box maxWidth={{ base: '100%', md: '1650px' }} margin={'0 auto'}>
      {' '}
      {/* Establece un ancho máximo y alinea el contenido en el centro */}
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        wrap="wrap"
        padding={{ base: '0.5rem', md: '0.5rem' }} // Ajusta el padding en dispositivos móviles
        color="white"
        width="100%" // Asegura que el contenedor ocupe todo el ancho
        pt={{ base: '4', md: '5' }}
        pb={4}
      >
        {/* Logo Section */}
        <Flex align="center">
          <Image
            draggable="false"
            zIndex={99999}
            src={logo}
            alt="Logo"
            mx="auto"
            width={isMobile ? '120px' : '130px'} // Redimensiona el logo en dispositivos móviles
            ml={3}
          />
        </Flex>

        {/* Mobile Menu Button */}
        {/*<IconButton
          zIndex={99999}
          src={logo}
          aria-label="Open menu"
          icon={<HamburgerIcon />}
          display={{ base: 'block', md: 'none' }} // Muestra el botón de hamburguesa solo en dispositivos móviles
          onClick={toggleDrawer}
          variant="outline"
          size="sm"
          width={'50px'}
          color="whiteAlpha"
          bg="transparent" // Fondo transparente para el botón de hamburguesa
          mr={3}
        />*/}

        {/* Desktop Menu Items */}
        <Box
          display={{ base: 'flex', md: 'flex' }}
          alignItems="center"
          zIndex={99999}
          src={logo}
        >
          <HStack spacing={8} alignItems="center">
            <Link
              className="link-smaller-text"
              display={{ base: 'none', md: 'flex' }}
              href="#features"
              style={{ textDecoration: 'none' }}
              sx={hideOnSmallScreens}
            >
              Features
            </Link>
            <Link
              className="link-smaller-text"
              display={{ base: 'none', md: 'flex' }}
              href="#tokenomics"
              style={{ textDecoration: 'none' }}
              sx={hideOnSmallScreens}
            >
              Tokenomics
            </Link>
            <Link
              className="link-smaller-text"
              display={{ base: 'none', md: 'flex' }}
              href="#roadmap"
              style={{ textDecoration: 'none' }}
              sx={hideOnSmallScreens}
            >
              Roadmap
            </Link>
            <Link
              className="link-smaller-text"
              display={{ base: 'none', md: 'flex' }}
              href="#revshare"
              style={{ textDecoration: 'none' }}
              sx={hideOnSmallScreens}
            >
              Rev Share
            </Link>
            <Link
              className="link-smaller-text"
              display={{ base: 'none', md: 'flex' }}
              href="#comparison"
              style={{ textDecoration: 'none' }}
              sx={hideOnSmallScreens}
            >
              Comparison
            </Link>
            <Link
              className="link-smaller-text"
              display={{ base: 'none', md: 'flex' }}
              href="https://docs.2fai.xyz"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
              sx={hideOnSmallScreens}
            >
              Whitepaper
            </Link>
            <Link
              className="link-smaller-text"
              display={{ base: 'none', md: 'flex' }}
              href="#socials"
              style={{ textDecoration: 'none' }}
              sx={hideOnSmallScreens}
            >
              Socials
            </Link>
            <Link
              display={{ base: 'none', md: 'flex' }}
              target="_blank"
              href="https://app.uniswap.org/swap?outputCurrency=0x1C1eC1bb5f12F24c97231165B13F3Eab9d4Ec00e&chain=base"
              style={{ textDecoration: 'none' }}
              sx={hideOnSmallScreens}
              className="header_link buy-2fai link-smaller-text"
            >
              {' '}
              <Image
                src={UniswapLogo}
                className="uniswap-logo"
                alt="Uniswap Logo"
                boxSize="30px"
              />{' '}
              Buy $2FAI
            </Link>
            {/* Ejemplo de botón con Web3Button, ajusta según tus necesidades */}
            {isDappLive ? (
              // <Button colorScheme="teal" variant="solid">
              //   <Web3Button label="Launch App" />
              // </Button>
              <ConnectButton.Custom>
                {({
                  account,
                  chain,
                  openAccountModal,
                  openChainModal,
                  openConnectModal,
                  authenticationStatus,
                  mounted,
                }) => {
                  const ready = mounted && authenticationStatus !== 'loading';
                  const connected =
                    ready &&
                    account &&
                    chain &&
                    (!authenticationStatus ||
                      authenticationStatus === 'authenticated');

                  return (
                    <div
                      {...(!ready && {
                        'aria-hidden': true,
                        style: {
                          buttonStyle,
                          /* opacity: 0,
                          pointerEvents: 'none',
                          userSelect: 'none',
                         */
                        },
                      })}
                    >
                      {(() => {
                        if (!connected) {
                          return (
                            <Button
                              onClick={openConnectModal}
                              variant="default"
                              type="button"
                              // style={buttonStyle}
                              backgroundColor={'#05a3ba!important'}
                              // padding={'25px !important'}
                              // pt={'25px !important'}
                              // pb={'25px !important'}
                              // margin={'10 !important'}
                            >
                              Launch APP
                            </Button>
                          );
                        }
                        // else {
                        //   return (
                        //     <Button
                        //       onClick={disconnect}
                        //       variant="default"
                        //       type="button"
                        //       // style={buttonStyle}
                        //       backgroundColor={'blue.500 !important'}
                        //       // padding={'25px !important'}
                        //       // pt={'25px !important'}
                        //       // pb={'25px !important'}
                        //       // margin={'10 !important'}
                        //     >
                        //       Disconnect
                        //     </Button>
                        //   )
                        // }

                        if (chain.unsupported) {
                          return (
                            <Button
                              onClick={openChainModal}
                              style={{ color: '#ffffff', border: '2px solid #05a3ba' }}
                              variant="destructive"
                              type="button"
                            >
                              Switch network
                            </Button>
                          );
                        }

                        // return (<Button
                        //   onClick={disconnect}
                        //   variant="default"
                        //   type="button"
                        //   // style={buttonStyle}
                        //   backgroundColor={'blue.500 !important'}
                        //   // padding={'25px !important'}
                        //   // pt={'25px !important'}
                        //   // pb={'25px !important'}
                        //   // margin={'10 !important'}
                        // >
                        //   Disconnect
                        // </Button>)

                        return (
                          <div
                            style={{ display: 'flex', gap: 12 }}
                            className="link-smaller-text"
                          >
                            <Button
                              onClick={openChainModal}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                color: '#9d9d9d',
                              }}
                              type="button"
                              variant="default"
                              className="link-smaller-text"
                              fontSize={'0.8rem !important'} //no va
                            >
                              {chain.hasIcon && (
                                <div
                                  style={{
                                    background: chain.iconBackground,
                                    width: 12,
                                    height: 12,
                                    borderRadius: 999,
                                    overflow: 'hidden',
                                    marginRight: 4,
                                  }}
                                >
                                  {chain.iconUrl && (
                                    <img
                                      alt={chain.name ?? 'Chain icon'}
                                      src={chain.iconUrl}
                                      style={{ width: 12, height: 12 }}
                                    />
                                  )}
                                </div>
                              )}
                              {chain.name}
                            </Button>

                            <Button
                              style={{ color: '#9d9d9d' }}
                              variant="default"
                              onClick={openAccountModal}
                              type="button"
                              className="link-smaller-text"
                            >
                              {account.displayName}
                              {account.displayBalance
                                ? ` (${account.displayBalance})`
                                : ''}
                            </Button>
                          </div>
                        );
                      })()}
                    </div>
                  );
                }}
              </ConnectButton.Custom>
            ) : (
              <button
                className="button_dapp"
                style={buttonStyle}
                onClick={launchDappClick}
              >
                Launch App
              </button>
            )}

            {/* Otros elementos que quieras incluir en la navegación */}
          </HStack>
        </Box>

        {/* Mobile Menu Drawer */}
        {/*<Drawer isOpen={isDrawerOpen} placement="right" onClose={toggleDrawer}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerBody background={'#000000!important'}>
              <VStack spacing={5} mt="24px">
                <Link href="/" style={{ textDecoration: 'none' }}>Home</Link>
                <Link href="#about" style={{ textDecoration: 'none' }}>About</Link>
                <Link href="#tokenomics" style={{ textDecoration: 'none' }}>Tokenomics</Link>
                <Link href="https://docs.2fai.xyz" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>Whitepaper</Link>

                { isDappLive? (                  
                  <Button colorScheme="teal" variant="solid"> 
                    <Web3Button label="Launch App" />
                  </Button>
                  ) : (
                  <button style={buttonStyle} onClick={launchDappClick}>Launch App</button>
                )}
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>*/}
      </Flex>
    </Box>
  );
};

export default Header;
