/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState /* , useRef */ } from 'react';
import { Box, Text, SimpleGrid, Image, Heading, Flex } from '@chakra-ui/react';
import { test2FAData } from '../testData';
import { test2FAData2 } from '../testData2';
import ContentBoxes from '../components/ContentBoxes';
import ServiceCard from '../components/ServiceCard';
import ServiceCard2 from '../components/ServiceCard2';
import MainBanner from '../components/MainBanner';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getThemeData } from '../theme';
import bgImage from '../img/2fai-patt.svg';
import './LandingPage.css';
import pieChart from '../img/pie_chart.png';
import roadMap from '../img/roadmap.png';
import roadMap_Vertical from '../img/roadmap_vertical.png';
import comparison from '../img/comparison.png';
import Lottie from 'react-lottie';
import AOS from 'aos';
import 'aos/dist/aos.css';
import dextools from '../img/1dextools.png';
import etherscan from '../img/base.png';
import uniswap from '../img/7uniswap.png';
import polybase from '../img/3polybase.png';
import lit from '../img/4lit.png';
import ens from '../img/5ensdomains.png';
import saturn from '../img/6saturn.png';

import partner1 from '../img/partner1.png';
import partner2 from '../img/partner2.png';

// Asegúrate de que defaultOptions está definido antes de usarlo
const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: null, // Este campo se actualizará dinámicamente
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

function LandingPage() {
  const [lottieOptions, setLottieOptions] = useState({ ...defaultOptions });
  const [lottieOptions2, setLottieOptions2] = useState({ ...defaultOptions });

  useEffect(() => {
    const loadAnimationData = async () => {
      const response = await fetch(
        'https://lottie.host/ccdd380c-e631-4339-a39f-2205034d9ba5/uJlFnIihY0.json'
      );
      const data = await response.json();
      setLottieOptions(prevOptions => ({
        ...prevOptions,
        animationData: data,
      }));

      // Carga el segundo archivo Lottie
      const response2 = await fetch(
        'https://lottie.host/c1246aae-c39b-4455-b91f-c3c1a5c07a00/I4oJiXDR5Z.json'
      );
      const data2 = await response2.json();
      setLottieOptions2(prevOptions => ({
        ...prevOptions,
        animationData: data2,
      }));
    };

    loadAnimationData();
  }, []); // Dependencias vacías para ejecutar una sola vez

  //const containerRef = useRef(null);

  //useEffect(() => {
  //  const container = containerRef.current;
  //  if (container) {
  //    container.style.opacity = '1';
  //  }
  //}, []);

  useEffect(() => {
    // Inicializa AOS.
    AOS.init({
      duration: 1100,
    });
    // Actualiza AOS cada vez que el DOM cambie.
    return () => {
      AOS.refresh();
    };
  }, []);

  const themeData = getThemeData('default');

  return (
    <>
      <div className="noise"></div>
      <Box
        mt={{ base: 0, md: 0 }} // mt 0 en dispositivos móviles, -40 en pantallas de escritorio
        backgroundPosition="center"
        backgroundSize="cover"
        sx={{
          bg: '#05041a',
          minH: '100vh',
          '@media screen and (min-width: 768px)': {
            // Nota el cambio aquí a min-width
            backgroundImage: `url(${bgImage})`, // Aplica el backgroundImage solo en pantallas más grandes que 768px
          },
        }}
        bg="#05041a" // Aquí se establece el color de fondo utilizando un color de Chakra UI
      >
        <Header />
        <MainBanner />
      </Box>

      <Box
        className="about"
        //ref={containerRef}
        color="#ffffff"
        padding={{ base: '1rem', md: '2rem' }}
      >
        <Heading
          fontSize={{ base: '3xl', md: '6xl' }}
          fontWeight="bold"
          color="#ffffff"
          marginTop={'1rem'}
          marginBottom={'1.5rem'}
          id="features"
          data-aos="fade"
        >
          <span className="linear-wipe2">WHY CHOOSE 2FAi?</span>
        </Heading>

        <Flex
          direction={{ base: 'column-reverse', md: 'row' }}
          align="center"
          justify="center"
          mx="auto"
        >
          <Box flex="0.7" mx={2} data-aos="fade-right">
            <Lottie
              options={lottieOptions}
              isClickToPauseDisabled={true}
              style={{ cursor: 'initial' }}
            />
          </Box>
          <Box flex="1.5" mx={2} data-aos="fade-up">
            <Text
              fontSize={{ base: '1rem', md: '1.2rem' }} // Tamaño de fuente más pequeño en dispositivos móviles
              color="#ffffff"
              fontWeight={'bold'}
              width={{ base: '100%', md: '80%' }} // Ancho del 100% en dispositivos móviles y 80% en pantallas de escritorio
              padding={15}
            >
              <hr className="hr-17" style={{ marginBottom: 35 }} />
              2FAi emerges as a pioneering solution in Web3, leveraging the
              power of the BASE blockchain and Artificial Intelligence (AI) to
              redefine how 2FA is implemented and managed <br />
              <br />
            </Text>
            <Text
              fontSize={{ base: '1rem', md: '1.2rem' }} // Tamaño de fuente más pequeño en dispositivos móviles
              color="#ffffff"
              width={{ base: '100%', md: '80%' }} // Ancho del 100% en dispositivos móviles y 80% en pantallas de escritorio
              padding={15}
            >
              2FAi, blending blockchain technology and cybersecurity, offers an
              innovative 2FA solution that enhances online security across Web2
              and Web3 without keeping personal data. This makes digital
              interactions simpler and more secure, providing a versatile layer
              of privacy and safety for users across the internet's spectrum.{' '}
              <hr className="hr-17" style={{ marginTop: 35 }} />
              <Box
                flex="1"
                display={'flex'}
                flexDirection={{ base: 'row', md: 'row' }}
                justifyContent="center"
                alignItems={'center'}
                mt={{ base: 10, md: 10 }}
                flexWrap={'wrap'}
              >
                <Text
                  className="keyfeature"
                  fontSize={{ base: 'sm', md: 'lg' }}
                  mr={{ base: 2, md: 3 }}
                  mb={3}
                >
                  Decentralized
                </Text>
                <Text
                  className="keyfeature"
                  fontSize={{ base: 'sm', md: 'lg' }}
                  mr={{ base: 2, md: 3 }}
                  mb={3}
                >
                  Privacy
                </Text>
                <Text
                  className="keyfeature"
                  fontSize={{ base: 'sm', md: 'lg' }}
                  mr={{ base: 2, md: 3 }}
                  mb={3}
                >
                  Multi-device
                </Text>
                <Text
                  className="keyfeature"
                  fontSize={{ base: 'sm', md: 'lg' }}
                  mr={{ base: 2, md: 3 }}
                  mb={3}
                >
                  Web3
                </Text>
                <Text
                  className="keyfeature"
                  fontSize={{ base: 'sm', md: 'lg' }}
                  mr={{ base: 2, md: 3 }}
                  mb={3}
                >
                  Encryption
                </Text>
                <Text
                  className="keyfeature"
                  fontSize={{ base: 'sm', md: 'lg' }}
                  mr={{ base: 2, md: 3 }}
                  mb={3}
                >
                  Ai Algorithms
                </Text>
                <Text
                  className="keyfeature"
                  fontSize={{ base: 'sm', md: 'lg' }}
                  mr={{ base: 2, md: 3 }}
                  mb={3}
                >
                  Rev Share
                </Text>
              </Box>
            </Text>
          </Box>
        </Flex>
      </Box>

      <Box
        className="tokenomics"
        //ref={containerRef}
        color="#ffffff"
        padding={{ base: '1rem', md: '2rem' }}
      >
        <Heading
          fontSize={{ base: '3xl', md: '6xl' }}
          fontWeight="bold"
          color="#ffffff"
          marginTop={'1rem'}
          marginBottom={'2.5rem'}
          id="tokenomics"
          data-aos="fade"
        >
          <span className="linear-wipe2">TOKENOMICS</span>
        </Heading>

        <Flex
          direction={{ base: 'column', md: 'row' }}
          maxWidth={{ base: '100%', md: '80%' }}
          align="center"
          justify="center"
          mx="auto"
        >
          <Box
            data-aos="fade-up"
            flex="1"
            mx={2}
            backgroundColor="transparent"
            borderRadius="md"
            marginInline={'initial'}
            width={{ base: '100%', md: '70%' }}
            display="flex"
            flexDirection="column"
            mb={{ base: 7, md: 0 }}
            mr={{ base: 0, md: 20 }}
          >
            <div className="astrodivider">
              <div className="astrodividermask"></div>
              <span>
                <i>⟠</i>
              </span>
            </div>

            <Box
              p={4}
              borderRadius="lg" // Añade bordes redondeados si lo deseas
              overflow="hidden"
              mb={25}
            >
              <SimpleGrid columns={2} spacing={3} justifyItems={'center'}>
                <Text
                  fontSize={{ base: 'xl', md: '2xl' }}
                  color="#05a3ba"
                  align="left"
                  p={0}
                >
                  Ticker:
                </Text>
                <Text
                  fontSize={{ base: 'xl', md: '2xl' }}
                  color="#ffffff"
                  align="right"
                  p={0}
                >
                  $2FAi
                </Text>
                <Text
                  fontSize={{ base: 'xl', md: '2xl' }}
                  color="#05a3ba"
                  align="left"
                  p={0}
                >
                  Supply:
                </Text>
                <Text
                  fontSize={{ base: 'xl', md: '2xl' }}
                  color="#ffffff"
                  align="right"
                  p={0}
                >
                  100M
                </Text>
                <Text
                  fontSize={{ base: 'xl', md: '2xl' }}
                  color="#05a3ba"
                  align="left"
                  p={0}
                >
                  Chain:
                </Text>
                <Text
                  fontSize={{ base: 'xl', md: '2xl' }}
                  color="#ffffff"
                  align="right"
                  p={0}
                >
                  BASE
                </Text>
                <Text
                  fontSize={{ base: 'xl', md: '2xl' }}
                  color="#05a3ba"
                  align="left"
                  p={0}
                >
                  Type:
                </Text>
                <Text
                  fontSize={{ base: 'xl', md: '2xl' }}
                  color="#ffffff"
                  align="right"
                  p={0}
                >
                  Deflationary
                </Text>
                <Text
                  fontSize={{ base: 'xl', md: '2xl' }}
                  color="#05a3ba"
                  align="left"
                  p={0}
                >
                  Tax:
                </Text>
                <Text
                  fontSize={{ base: 'xl', md: '2xl' }}
                  color="#ffffff"
                  align="right"
                  p={0}
                >
                  5 / 5
                </Text>
                <Text
                  fontSize={{ base: 'xl', md: '2xl' }}
                  color="#05a3ba"
                  align="left"
                  p={0}
                  display={{ base: 'none', md: 'block' }}
                >
                  CA:
                </Text>
                <Text
                  fontSize={{ base: 'sm', md: 'sm' }}
                  color="#ffffff"
                  mt={2}
                  align="right"
                  p={0}
                  display={{ base: 'none', md: 'block' }}
                >
                  0x1C1eC1bb5f12F24c97231165B13F3Eab9d4Ec00e
                </Text>
              </SimpleGrid>
              <Text
                fontSize={{ base: 'sm', md: 'sm' }}
                color="#ffffff"
                mt={5}
                align="center"
                p={0}
                display={{ base: 'block', md: 'none' }}
              >
                <span fontSize="xl" color="#05a3ba!important">
                  CA:
                </span>{' '}
                0x1C1eC1bb5f12F24c97231165B13F3Eab9d4Ec00e
              </Text>
            </Box>

            <div className="astrodivider">
              <div className="astrodividermask"></div>
            </div>
          </Box>
          <Box flex="1" mx={2} data-aos="fade">
            <Image
              draggable="false"
              src={pieChart}
              alt="2Fai tokenomics"
              mx="auto"
              maxWidth={{ base: '100%', md: '78%' }}
            />
          </Box>
        </Flex>
      </Box>

      <Box
        className="about"
        //ref={containerRef}
        color="#ffffff"
        padding={{ base: '1rem', md: '2rem' }}
      >
        <Heading
          fontSize={{ base: '3xl', md: '6xl' }}
          fontWeight="bold"
          color="#ffffff"
          marginTop={'1rem'}
          marginBottom={'1.5rem'}
          id="roadmap"
          data-aos="fade"
        >
          <span className="linear-wipe2">ROADMAP</span>
        </Heading>

        <Flex
          direction={{ base: 'column', md: 'row' }}
          width={{ base: '100%', md: '70%' }}
          align="center"
          justify="center"
          mx="auto"
          data-aos="fade-up"
        >
          {/* Imagen de Roadmap para escritorio */}
          <Box flex="1" mx={2} display={{ base: 'none', md: 'block' }}>
            <Image
              draggable="false"
              src={roadMap} // Utiliza la referencia importada aquí
              alt="2Fai roadmap"
              mx="auto"
            />
          </Box>
          {/* Imagen de Roadmap Vertical para móviles */}
          <Box flex="1" mx={2} display={{ base: 'block', md: 'none' }}>
            <Image
              draggable="false"
              src={roadMap_Vertical} // Utiliza la referencia importada aquí para móviles
              alt="2Fai vertical roadmap"
              mx="auto"
            />
          </Box>
        </Flex>
      </Box>

      <Box
        className="tokenomics"
        //ref={containerRef}
        color="#ffffff"
        padding={{ base: '1rem', md: '2rem' }}
      >
        <Heading
          fontSize={{ base: '3xl', md: '6xl' }}
          fontWeight="bold"
          color="#ffffff"
          marginTop={'1rem'}
          marginBottom={'1rem'}
          id="revshare"
          data-aos="fade"
        >
          <span className="linear-wipe2">REVENUE SHARE</span>
        </Heading>

        <Flex
          direction={{ base: 'column-reverse', md: 'row' }}
          align="center"
          justify="center"
          mx="auto"
        >
          <Box flex="0.7" mx={2} mt={-15} data-aos="fade-right">
            <Lottie
              options={lottieOptions2}
              isClickToPauseDisabled={true}
              mt={-15}
              style={{ cursor: 'initial' }}
            />
          </Box>
          <ContentBoxes />
        </Flex>
      </Box>

      <Box
        className="about"
        //ref={containerRef}
        color="#ffffff"
        paddingTop={'2rem'}
        paddingBottom={'3rem'}
        pr="3"
        pl="3"
      >
        <Heading
          fontSize={{ base: '3xl', md: '6xl' }}
          fontWeight="bold"
          color="#ffffff"
          paddingBottom={'1.5rem'}
          id="comparison"
          data-aos="fade"
        >
          <span className="linear-wipe2">COMPETITION COMPARISON</span>
        </Heading>

        <Flex
          direction={{ base: 'column', md: 'row' }}
          width={{ base: '100%', md: '70%' }}
          align="center"
          justify="center"
          mx="auto"
          data-aos="fade-up"
        >
          <Box flex="1" mx={2}>
            <Image
              draggable="false"
              src={comparison} // Utiliza la referencia importada aquí
              alt="2Fai roadmap"
              mx="auto"
              mt={{ base: 0, md: 5 }}
              mb={{ base: 2, md: 3 }}
              width={{ base: '100%', md: '70%' }}
            />
          </Box>
        </Flex>
        <Text
          fontSize={{ base: '0.7rem', md: '1rem' }}
          color="#ffffff"
          align="center"
          fontStyle={'italic'}
        >
          Google Authenticator / Microsoft Authenticator / 2FAi
        </Text>
      </Box>

      <Box
        className="tokenomics"
        //ref={containerRef}
        color="#ffffff"
        paddingTop={{ base: '2rem', md: '4rem' }}
        paddingBottom={{ base: '1rem', md: '2rem' }}
        pr="3"
        pl="3"
      >
        <Heading
          fontSize={{ base: '3xl', md: '6xl' }}
          fontWeight="bold"
          color="#ffffff"
          paddingBottom={'0rem'}
          id="comparison"
          data-aos="fade"
        >
          <span className="linear-wipe2">OUR TRUSTED PROVIDERS</span>
        </Heading>

        <Flex
          direction={{ base: 'column', md: 'row' }}
          width={{ base: '100%', md: '70%' }}
          mt={5}
          mb={5}
          align="center"
          justifyContent="center"
          mx="auto"
          data-aos="fade"
        >
          <Box
            flex="1"
            mx={2}
            display={'flex'}
            flexDirection={{ base: 'row', md: 'row' }}
            flexWrap={'wrap'}
            justifyContent="center"
            alignItems={'center'}
          >
            <Image
              draggable="false"
              className="imghover"
              src={dextools}
              alt="DexTools"
              opacity={'0.5'}
              mr={{ base: 0, md: 10 }}
              mb={2}
              width={{ base: '50%', md: '30%' }}
            />
            <Image
              draggable="false"
              className="imghover"
              src={etherscan}
              alt="BASE"
              opacity={'0.5'}
              mr={{ base: 0, md: 10 }}
              mb={2}
              width={{ base: '50%', md: '30%' }}
            />
            <Image
              draggable="false"
              className="imghover"
              src={uniswap}
              alt="Uniswap"
              opacity={'0.5'}
              mr={{ base: 0, md: 10 }}
              mb={2}
              width={{ base: '50%', md: '30%' }}
            />
            <Image
              draggable="false"
              className="imghover"
              src={polybase}
              alt="Polybase"
              opacity={'0.5'}
              mr={{ base: 0, md: 10 }}
              mb={2}
              width={{ base: '50%', md: '30%' }}
            />
            <Image
              draggable="false"
              className="imghover"
              src={lit}
              alt="Lit Protocol"
              opacity={'0.5'}
              mr={{ base: 0, md: 10 }}
              mb={2}
              width={{ base: '50%', md: '30%' }}
            />
            <Image
              draggable="false"
              className="imghover"
              src={ens}
              alt="ENS Domains"
              opacity={'0.5'}
              mr={{ base: 0, md: 10 }}
              mb={2}
              width={{ base: '50%', md: '30%' }}
            />
            <Image
              draggable="false"
              className="imghover"
              src={saturn}
              alt="Saturn"
              opacity={'0.5'}
              mr={{ base: 0, md: 10 }}
              width={{ base: '50%', md: '30%' }}
            />
          </Box>
        </Flex>

        <Heading
          fontSize={{ base: '3xl', md: '6xl' }}
          fontWeight="bold"
          color="#ffffff"
          paddingBottom={'0rem'}
          id="comparison"
          data-aos="fade"
          paddingTop={{ base: '2rem', md: '2rem' }}
        >
          <span className="linear-wipe2">OUR PARTNERS</span>
        </Heading>   

        <Flex
          direction={{ base: 'column', md: 'row' }}
          width={{ base: '100%', md: '70%' }}
          mt={5}
          mb={5}
          align="center"
          justifyContent="center"
          mx="auto"
          data-aos="fade"
        >
          <Box
            flex="1"
            mx={2}
            display={'flex'}
            flexDirection={{ base: 'row', md: 'row' }}
            flexWrap={'wrap'}
            justifyContent="center"
            alignItems={'center'}
          >
            <Image
              draggable="false"
              className="imghover"
              src={partner1}
              alt="GPT Plus"
              opacity={'0.5'}
              mr={{ base: 0, md: 10 }}
              mb={2}
              width={{ base: '50%', md: '30%' }}
            />
            <Image
              draggable="false"
              className="imghover"
              src={partner2}
              alt="Superstring"
              opacity={'0.5'}
              mr={{ base: 0, md: 10 }}
              mb={2}
              width={{ base: '50%', md: '30%' }}
            />
          </Box>
        </Flex>        

      </Box>

      <Box
        className="about"
        //ref={containerRef}
        color="#ffffff"
        paddingTop={{ base: '2rem', md: '2rem' }}
        paddingBottom={{ base: '1rem', md: '2rem' }}
        pr="3"
        pl="3"
      >
        <div>
          <Heading
            fontSize={{ base: '3xl', md: '6xl' }}
            fontWeight="bold"
            color="#ffffff"
            id="demo"
            data-aos="fade"
          >
            <span className="linear-wipe2">
              2FAi DEMO{' '}
              <Box display={{ base: 'none', md: 'initial' }}>
                ACCOUNTS & SECRETS
              </Box>
            </span>
          </Heading>
        </div>
        <br />
        <Box
          display="flex"
          mt={0}
          flexWrap="wrap"
          justifyContent="center"
          data-aos="fade-up"
        >
          {test2FAData.map(c => (
            <Box
              key={c.secret}
              width={{ base: '100%', md: '20%' }}
              boxSizing="border-box"
              justifyContent="center"
              border="1px solid #05a3ba"
              borderRadius="10px"
              margin="0.5rem"
            >
              <ServiceCard
                isDemo
                service={c.service}
                account={c.account}
                secret={c.secret}
                themeData={themeData}
                bg="black!important"
                border="1px solid #05a3ba"
              />
            </Box>
          ))}

          {test2FAData2.map(c => (
            <Box
              display={{ base: 'none', md: 'initial' }}
              key={c.secret}
              width={{ base: '100%', md: '20%' }}
              boxSizing="border-box"
              justifyContent="center"
              border="1px solid #05a3ba"
              borderRadius="10px"
              margin="0.5rem"
            >
              <ServiceCard2
                isDemo
                service={c.service}
                account={c.account}
                secret={c.secret}
                themeData={themeData}
                bg="black!important"
                border="1px solid #05a3ba"
              />
            </Box>
          ))}
        </Box>
      </Box>

      <Box
        className="about"
        //ref={containerRef}
        color="#ffffff"
        paddingTop={{ base: '1rem', md: '4.5rem' }}
        paddingBottom={'1rem'}
        pr="3"
        pl="3"
        justifyContent="center"
        alignContent="center"
        alignItems="center"
      >
        <Heading
          fontSize={{ base: '3xl', md: '6xl' }}
          fontWeight="bold"
          color="#ffffff"
          paddingBottom={'0rem'}
          id="comparison"
          data-aos="fade"
        >
          <Box display={{ base: 'none', md: 'inline' }}>
            <span className="linear-wipe2">OUR SOCIALS</span>
          </Box>
        </Heading>
      </Box>
      <Footer />
    </>
  );
}

export default LandingPage;
