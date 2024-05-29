import React, { useEffect, useState } from 'react';
import {
  Flex,
  Heading,
  Text,
  useBreakpointValue,
  Button,
  HStack,
} from '@chakra-ui/react';
import './mainBanners.css';
import { SearchIcon } from '@chakra-ui/icons';
import { ReactComponent as BaseWordmarkIcon } from '../Base_Wordmark_White.svg'; // Asegúrate de ajustar la ruta a la ubicación de tu archivo SVG
import coinGecko from '../img/CoinGecko_main.png';

//import { FiTwitter, FiSend } from 'react-icons/fi'; // Mantener esta única importación
import Lottie from 'react-lottie';

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: null,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

const MainBanner = () => {
  const lottieSize = useBreakpointValue({ base: '80%', md: '100%' });
  const isMobile = useBreakpointValue({ base: true, md: false });
  const socialButtonDisplay = useBreakpointValue({ base: 'none', md: 'flex' }); // Controla la visibilidad

  const columnSpacing = useBreakpointValue({ base: 4, md: 10 });

  const [lottieOptions, setLottieOptions] = useState({ ...defaultOptions });

  useEffect(() => {
    const loadAnimationData = async () => {
      const response = await fetch(
        'https://lottie.host/656cfb1e-d6a9-4dec-8ba6-9308c7dfd683/vaFobmptkc.json'
      );
      const data = await response.json();
      setLottieOptions(prevOptions => ({
        ...prevOptions,
        animationData: data,
      }));
    };

    loadAnimationData();
  }, []);

  return (
    <>
      <Flex
        direction={{ base: 'column-reverse', md: 'row' }}
        align="center"
        justify="center"
        h={{ base: 'auto', md: 'auto' }}
        p={columnSpacing}
        color="white"
        width={isMobile ? '100%' : '85%'}
        margin="0 auto"
        minH="100vh"
        pb={{ base: 0, md: 15 }}
      >
        <Flex
          marginTop={{ base: '0rem', md: '-6rem' }}
          flexBasis={{ base: '100%', md: '50%' }}
          textAlign={'left'}
          flexDirection="column"
          marginRight={{ base: 0, md: '3rem' }}
        >
          <div className="astrodivider">
            <div className="astrodividermask"></div>
            <span>
              <i>🔒</i>
            </span>
          </div>

          <Heading
            fontSize={{ base: '5xl', md: '5xl', lg: '9xl' }}
            fontWeight="bold"
            mb={0}
            fontFamily="Space Grotesk"
            paddingTop={{ base: '3', md: '1' }}
            marginBottom={7}
            textAlign={'center'}
          >
            <span className="linear-wipe">2FA + AI</span>
            <br />
            WEB3 APP
            <Text
              fontSize={{ base: '0.7rem', md: '1.3rem' }}
              fontWeight="initial !important"
              id="about"
              color="#ffffff"
              mt={3}
            >
              Boosting privacy and security with Web3 2FA enhancements
            </Text>
          </Heading>
          <div className="astrodivider">
            <div className="astrodividermask"></div>
          </div>

          <HStack
            spacing={1}
            justifyContent="center"
            marginTop={{ base: '1.5rem', md: '2rem' }}
            display="flex"
            flexDirection={{ base: 'column', md: 'row' }}
          >
            <Button
              className="button_demo2"
              borderRadius={25}
              leftIcon={<SearchIcon />}
              colorScheme="white"
              variant="outline"
              borderColor="white"
              _hover={{ bg: '#05a3ba!important', color: 'white' }}
              onClick={() =>
                document
                  .getElementById('demo')
                  .scrollIntoView({ behavior: 'smooth' })
              }
              marginRight={{ base: '0rem', md: '1.2rem' }}
              marginBottom={{ base: '1.5rem', md: '0rem' }}
            >
              VIEW DEMO
            </Button>

            <Button
              className="button_social"
              variant="solid"
              bgColor="transparent"
            >
              Built on
              <a
                href="https://www.base.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <BaseWordmarkIcon
                  style={{ width: 'auto', height: '2rem', marginLeft: '10px' }}
                />{' '}
              </a>
            </Button>

            <Button
              className="button_social"
              variant="solid"
              bgColor="transparent"
              display={socialButtonDisplay}
            >
              <a
                href="https://www.coingecko.com/en/coins/2fai"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  alt="CoinGecko"
                  title="CoinGecko"
                  src={coinGecko}
                  width={45}
                  style={{ marginLeft: '10px' }}
                />
              </a>
            </Button>
          </HStack>
        </Flex>

        <Flex
          flexBasis={{ base: '100%', md: '50%' }}
          textAlign="center"
          justifyContent="center"
          marginTop={{ base: '-10rem', md: '-5rem' }}
          marginBottom={{ base: '3rem', md: '0rem' }}
        >
          <Lottie
            isClickToPauseDisabled={true}
            options={lottieOptions}
            style={{ cursor: 'initial', width: lottieSize, height: lottieSize }}
          />
        </Flex>
      </Flex>

      <Flex
        textAlign="center"
        justifyContent="center"
        marginTop={{ base: '0rem', md: '-10rem' }}
        display={isMobile ? 'none' : 'visible'}
        paddingBottom={{ base: '0rem', md: '3rem' }}
      >
        <span className="section mouse">
          <div className="container mouse w-container">
            <img
              src="https://assets-global.website-files.com/65be4e31e70b0afc4f441090/65be4e32e70b0afc4f441119_Rectangle%2016.svg"
              loading="lazy"
              className="image-3"
            />
            <img
              src="https://assets-global.website-files.com/65be4e31e70b0afc4f441090/65be4e32e70b0afc4f441112_weel.svg"
              loading="lazy"
              data-w-id="w-lightbox-item"
              className="image-2"
            />
          </div>
        </span>
      </Flex>
    </>
  );
};

export default MainBanner;
