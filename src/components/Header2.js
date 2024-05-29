import React, { useState } from 'react';
import {
  Flex,
  Image,
  Box,
  HStack,
  useBreakpointValue,
  Button,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  //useToast,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import logo from '../logo2.png';
import UniswapLogo from '../img/Uniswap_Logo.svg';
//import { Web3Button } from '@web3modal/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import './header.css';
import { Link } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import './header.css';
import { useDisconnect } from 'wagmi';

import styled from 'styled-components';

const StyledLink = styled(RouterLink)`
  display: none; // default to none
  @media (min-width: 1000px) {
    // Adjust breakpoint as needed
    display: flex;
  }
  padding: 1px;
  padding-left: 2px;
  padding-right: 2px;
  text-decoration: none;
  &:hover {
    color: #05a3ba;
  }
`;

const StyledLink2 = styled(RouterLink)`
  display: flex;
  font-size: 1.3rem;
  padding: 1px;
  padding-left: 2px;
  padding-right: 2px;
  text-decoration: none;
  &:hover {
    color: #05a3ba;
  }
`;

const Header2 = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
  const isMobile = useBreakpointValue({ base: true, md: false });
  //const toast = useToast();
  const isDappLive = true; //TODO to enable dapp
  const { disconnect } = useDisconnect();

  const launchDappClick = e => {
    if (!isDappLive) {
      e.preventDefault();
    }
  };

  const buttonStyle = {
    backgroundColor: 'blue', //'#4A90E2 !important', // Example blue color, adjust based on Web3Button
    color: 'white',
    padding: '5px 15px',
    border: 'none',
    borderRadius: '5px',
    cursor: !isDappLive ? 'not-allowed' : 'pointer',
    opacity: `${!isDappLive ? '0.5' : '1'} !important`,
    fontSize: '16px',
    fontWeight: 'bold',
    // Add any other styles mimicking the Web3Button
  };

  return (
    <Box maxWidth={{ base: '100%', md: '1550px' }} mx="auto">
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
        pt={{ base: '4', md: '2' }}
        pb={4}
      >
        {/* Logo Section */}
        <Flex align="center">
          <Link href="/" style={{ zIndex: 99999 }}>
            <Image
              src={logo}
              alt="Logo"
              mx="auto"
              width={isMobile ? '120px' : '130px'}
            />
          </Link>
        </Flex>

        {/* Mobile Menu Button */}
        {/*<IconButton
          zIndex={99999}
          icon={<HamburgerIcon />}
          display={{ base: 'block', lg: 'none' }} // Muestra el botón de hamburguesa solo en dispositivos móviles
          onClick={toggleDrawer}
          size="3rem"
          color="#ffffff"
          bg="transparent" // Fondo transparente para el botón de hamburguesa
        />*/}

        {/* Desktop Menu Items */}
        <Box
          display={{ base: 'flex', md: 'flex' }}
          alignItems="center"
          zIndex={99999}
          src={logo}
        >
          <HStack spacing={8} alignItems="center">
            <StyledLink
              to="/dashboard"
              style={{ textDecoration: 'none' }}
              className="header_link"
            >
              Secrets (OTP)
            </StyledLink>

            <StyledLink
              to="/revshare"
              style={{ textDecoration: 'none' }}
              className="header_link"
            >
              Rev Share
            </StyledLink>

            <StyledLink
              to="/dao"
              style={{ textDecoration: 'none' }}
              className="header_link"
            >
              DAO
            </StyledLink>

            <StyledLink
              to="https://docs.2fai.xyz/tiers-system"
              target="_blank"
              style={{ textDecoration: 'none' }}
              className="header_link"
            >
              Tiers
            </StyledLink>

            <StyledLink
              to="https://app.uniswap.org/swap?outputCurrency=0x1C1eC1bb5f12F24c97231165B13F3Eab9d4Ec00e&chain=base"
              target="_blank"
              style={{ textDecoration: 'none' }}
              className="header_link2 buy-2fai"
            >
              <Image
                src={UniswapLogo}
                className="uniswap-logo"
                alt="Uniswap Logo"
                boxSize="30px"
              />{' '}
              {/* Puedes ajustar boxSize según sea necesario */}
              Buy $2FAi
            </StyledLink>

            {/* Ejemplo de botón con Web3Button, ajusta según tus necesidades */}
            {isDappLive ? (
              // <ConnectButton></ConnectButton>

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
                            >
                              Launch APP
                            </Button>
                          );
                        }

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
                          <div style={{ display: 'flex', gap: 12 }}>
                            <Button
                              onClick={openChainModal}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                color: '#9d9d9d',
                              }}
                              type="button"
                              variant="default"
                            >
                              {chain.hasIcon && (
                                <div
                                  style={{
                                    background: chain.iconBackground,
                                    width: 24,
                                    height: 24,
                                    borderRadius: 999,
                                    overflow: 'hidden',
                                    marginRight: 0,
                                  }}
                                >
                                  {chain.iconUrl && (
                                    <img
                                      alt={chain.name ?? 'Chain icon'}
                                      src={chain.iconUrl}
                                      style={{ width: 24, height: 24 }}
                                    />
                                  )}
                                </div>
                              )}
                              {/*{chain.name}*/}
                            </Button>

                            <Button
                              style={{ color: '#9d9d9d' }}
                              variant="default"
                              onClick={openAccountModal}
                              type="button"
                              className="wallet_connected"
                            >
                              {account.displayName}
                              {/*{account.displayBalance
                                    ? ` (${account.displayBalance})`
                                    : ''}*/}
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
        <Drawer isOpen={isDrawerOpen} placement="right" onClose={toggleDrawer}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton fontSize={'1rem'} />
            <DrawerBody>
              <VStack spacing={5} mt="24px">
                <Image
                  src={logo}
                  alt="Logo"
                  mx="auto"
                  width={isMobile ? '150px' : '150px'}
                />

                <hr style={{ border: '1px solid #05a3ba' }} />

                <StyledLink2 to="/dashboard" style={{ textDecoration: 'none' }}>
                  Secrets (OTP)
                </StyledLink2>

                <StyledLink2 to="/revshare" style={{ textDecoration: 'none' }}>
                  Revenue Share
                </StyledLink2>

                <StyledLink2
                  to="https://docs.2fai.xyz/tiers-system"
                  target="_blank"
                  style={{ textDecoration: 'none' }}
                >
                  Tiers System
                </StyledLink2>

                <StyledLink2
                  to="https://app.uniswap.org/swap?outputCurrency=0x1C1eC1bb5f12F24c97231165B13F3Eab9d4Ec00e&chain=base"
                  target="_blank"
                  style={{ textDecoration: 'none', height: '45px' }}
                  className="header_link2 buy-2fai"
                >
                  <Image
                    src={UniswapLogo}
                    className="uniswap-logo"
                    alt="Uniswap Logo"
                    boxSize="30px"
                    height={'33px!important'}
                    mr={'0.5rem'}
                  />
                  Buy $2FAi
                </StyledLink2>
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Flex>
    </Box>
  );
};

export default Header2;
