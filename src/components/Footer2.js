import React from 'react';
import { Flex, Box } from '@chakra-ui/react';
import xImage from '../img/x.png';
import tgImage from '../img/tg.png';
import gitbookImage from '../img/gitbook.png';
import mediumImage from '../img/medium.png';
import dextoolsImage from '../img/dextools.png';
import farcasterImage from '../img/farcaster.png';
import cgImage from '../img/coingecko.png';

const Footer = () => {
  return (
    <>
      <Flex
        id="socials"
        mt={0}
        align="center"
        justify="center"
        pt={{ base: 4, md: 0 }}
        pb={{ base: 20, md: 0 }}
        color="white"
      >
        <Box
          width={{ base: '40px', md: '64px' }}
          marginRight="1rem"
          display="inline-block"
          onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.1)')}
          onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
          style={{ transition: 'transform 0.2s' }}
        >
          <a
            href="https://twitter.com/2FAi_erc"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              alt="Twitter / X"
              title="Twitter / X"
              draggable="false"
              src={xImage}
              width={{ base: 32, md: 64 }}
              style={{ marginRight: '1rem' }}
            />
          </a>
        </Box>

        <Box
          width={{ base: '40px', md: '64px' }}
          marginRight="1rem"
          display="inline-block"
          onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.1)')}
          onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
          style={{ transition: 'transform 0.2s' }}
        >
          <a
            href="https://t.me/erc2FAi"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              alt="Telegram"
              title="Telegram"
              draggable="false"
              src={tgImage}
              width={64}
              style={{ marginRight: '1rem' }}
            />
          </a>
        </Box>

        <Box
          width={{ base: '40px', md: '64px' }}
          marginRight="1rem"
          display="inline-block"
          onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.1)')}
          onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
          style={{ transition: 'transform 0.2s' }}
        >
          <a
            href="mailto:erc2fai@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              alt="E-Mail"
              title="E-Mail"
              draggable="false"
              src={farcasterImage}
              width={64}
              style={{ marginRight: '1rem' }}
            />
          </a>
        </Box>

        <Box
          width={{ base: '40px', md: '64px' }}
          marginRight="1rem"
          display="inline-block"
          onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.1)')}
          onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
          style={{ transition: 'transform 0.2s' }}
        >
          <a
            href="https://docs.2fai.xyz"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              alt="Docs"
              title="Docs"
              draggable="false"
              src={gitbookImage}
              width={64}
              style={{ marginRight: '1rem' }}
            />
          </a>
        </Box>

        <Box
          width={{ base: '40px', md: '64px' }}
          marginRight="1rem"
          display="inline-block"
          onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.1)')}
          onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
          style={{ transition: 'transform 0.2s' }}
        >
          <a
            href="https://medium.com/@erc2fai"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              alt="Medium"
              title="Medium"
              src={mediumImage}
              width={64}
              style={{ marginRight: '1rem' }}
            />
          </a>
        </Box>

        <Box
          width={{ base: '40px', md: '64px' }}
          marginRight="1rem"
          display="inline-block"
          onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.1)')}
          onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
          style={{ transition: 'transform 0.2s' }}
        >
          <a
            href="https://www.dextools.io/app/base/pair-explorer/0xecf6701036fe645c8b1755b616ab20d713c3862f?t=1711061500068"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              alt="DexTools"
              title="DexTools"
              draggable="false"
              src={dextoolsImage}
              width={64}
            />
          </a>
        </Box>

        <Box
          width={{ base: '40px', md: '64px' }}
          marginRight="0rem"
          display="inline-block"
          onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.1)')}
          onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
          style={{ transition: 'transform 0.2s' }}
        >
          <a
            href="https://www.coingecko.com/en/coins/2fai"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              alt="CoinGecko"
              title="CoinGecko"
              draggable="false"
              src={cgImage}
              width={64}
            />
          </a>
        </Box>
      </Flex>
    </>
  );
};

export default Footer;
