import { Box, Flex, Text, Image, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import React from 'react';
import secrets from '../img/secrets.png';
import revshare from '../img/revshare.png';
import tiers from '../img/tiers.png';
import dao from '../img/dao.png';
import buy from '../img/buy.png';
import docs from '../img/docs.png';

const menuItems = (toast: any) => [
  {
    enabled: true,
    label: 'Secrets',
    icon: (
      <Image
        src={secrets}
        alt="Secrets OTP"
        style={{ width: '45%', height: '45%' }}
      />
    ),
    link: '/',
  },
  {
    enabled: true,
    label: 'Rev Share',
    icon: (
      <Image
        src={revshare}
        alt="Revenue Share"
        style={{ width: '45%', height: '45%' }}
      />
    ),
    link: '/revshare',
  },
  {
    enabled: true,
    label: 'DAO',
    icon: <Image src={dao} alt="DAO" style={{ width: '45%', height: '45%' }} />,
    link: '/dao',
  },
  {
    enabled: true,
    label: 'Tiers',
    icon: (
      <Image src={tiers} alt="Tiers" style={{ width: '45%', height: '45%' }} />
    ),
    link: 'https://docs.2fai.xyz/tiers-system',
  },
  {
    enabled: true,
    label: 'Buy',
    icon: (
      <Image
        src={buy}
        alt="Buy $2FAi"
        style={{ width: '45%', height: '45%' }}
      />
    ),
    link: 'https://app.uniswap.org/swap?outputCurrency=0x1C1eC1bb5f12F24c97231165B13F3Eab9d4Ec00e&chain=base',
  },
  {
    enabled: true,
    label: 'Docs',
    icon: (
      <Image src={docs} alt="Docs" style={{ width: '45%', height: '45%' }} />
    ),
    link: 'https://docs.2fai.xyz/',
  },
];

const MobileFooterMenu = () => {
  const toast = useToast();

  const items = menuItems(toast)
    .filter(item => item.enabled)
    .slice(0, 6);

  const renderItem = (item, index) => {
    // Verificar si el enlace es externo
    const isExternalLink = item.link.startsWith('http');

    if (isExternalLink) {
      // Enlace externo, usar <a> con target="_blank" y rel="noopener noreferrer"
      return (
        <Box
          as="a"
          key={index}
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none' }}
        >
          <Flex
            flexDirection="column"
            alignItems="center"
            color="white"
            textAlign="center"
          >
            {item.icon}
            <Text fontSize="0.75rem" mt="1" color="white">
              {item.label}
            </Text>
          </Flex>
        </Box>
      );
    } else {
      // Enlace interno, usar <Link> de react-router-dom
      return (
        <Box
          as={Link}
          key={index}
          to={item.link}
          style={{ textDecoration: 'none' }}
        >
          <Flex
            flexDirection="column"
            alignItems="center"
            color="white"
            textAlign="center"
          >
            {item.icon}
            <Text fontSize="0.75rem" mt="1" color="white">
              {item.label}
            </Text>
          </Flex>
        </Box>
      );
    }
  };

  return (
    <Box
      position="fixed"
      bottom="0"
      left="0"
      width="100%"
      backgroundColor="#1a202c"
      borderTop="1px solid #05a3ba"
      p="10px"
      pb="5px"
      zIndex="1"
    >
      <Flex justifyContent="space-between" position="relative">
        {items.map(renderItem)}
      </Flex>
    </Box>
  );
};

export default MobileFooterMenu;
