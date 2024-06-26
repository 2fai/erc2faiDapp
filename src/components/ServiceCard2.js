import {
  Card,
  CardBody,
  Center,
  Box,
  CardFooter,
  Button,
  VStack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { CopyIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import * as authenticator from 'authenticator';
import { useState, useEffect } from 'react';
import SecretPopover from './SecretPopover';
import { openInNewTab } from '../helper';
//import { isMobile } from 'react-device-detect';

function ServiceCard({
  service,
  account,
  secret,
  isDemo,
  linkToEncodedData,
  themeData,
}) {
  // Inicializa el hook useToast
  const toast = useToast();

  // Función para manejar la copia
  const handleCopy = () => {
    toast({
      title: 'OTC Code Copied', // Mensaje que quieres mostrar
      description: 'The OTC Code has been copied to the clipboard',
      status: 'success', // Color del toast
      duration: 5000, // Duración del toast en pantalla
      isClosable: true, // Permite cerrar el toast
    });
  };

  const { color1, color2, textHighlight } = themeData;
  const [timerRefresh, setTimerRefresh] = useState(0);
  const [code, setCode] = useState('******');
  // starting duration offset from current time (new code at 0/60 and 30 seconds)
  const [duration, setDuration] = useState(
    new Date().getSeconds() > 30
      ? 60 - new Date().getSeconds()
      : 30 - new Date().getSeconds()
  );
  useEffect(() => {
    const getCode = async () => {
      const formattedToken = authenticator.generateToken(secret);
      setCode(formattedToken);
    };

    const interval = setInterval(() => {
      const secs = new Date().getSeconds();
      // every 30 seconds a new code is generated
      if (secs === 0 || secs === 30) {
        getCode();
        setDuration(30);
        setTimerRefresh(previousTimerRefresh => previousTimerRefresh + 1);
      }
    }, 1000);
    getCode();
    return () => clearInterval(interval);
  }, []);

  const spaceOutCode = num => `${num.slice(0, 3)} ${num.slice(3)}`;

  return (
    <Card my={2} width={'100%'}>
      <Box height={0}>
        <svg>
          <defs>
            <linearGradient id="your-unique-id" x1="1" y1="0" x2="0" y2="0">
              <stop offset="5%" stopColor={color2} />
              <stop offset="95%" stopColor={color1} />
            </linearGradient>
          </defs>
        </svg>
      </Box>

      <CardBody style={{ color: 'white' }}>
        <div>
          {service}: {account}
        </div>
        <CopyToClipboard text={code} onCopy={handleCopy}>
          <Center marginTop={5} style={{ cursor: 'pointer' }}>
            <CountdownCircleTimer
              key={timerRefresh}
              colors="url(#your-unique-id)"
              isPlaying
              duration={duration}
              size={150}
            >
              {({ remainingTime }) => (
                <VStack gap={0}>
                  <Text fontSize={'24px'} color={textHighlight} m={0} p={0}>
                    <strong>{spaceOutCode(code)}</strong>
                  </Text>
                  <Text color={''} fontSize={'13px'} m={0} p={0}>
                    <CopyIcon /> Copy
                  </Text>
                </VStack>
              )}
            </CountdownCircleTimer>
          </Center>
        </CopyToClipboard>
      </CardBody>

      <CardFooter justify={'center'} style={{ color: 'white' }}>
        <SecretPopover
          secret={secret}
          isDemo={isDemo}
          linkToEncodedData={linkToEncodedData}
          themeData={themeData}
        />
        {linkToEncodedData && (
          <Button
            onClick={() => openInNewTab(linkToEncodedData)}
            marginLeft={4}
            marginTop={1}
            fontSize={'0.9rem'}
          >
            <ExternalLinkIcon marginRight={2} /> Encrypted data
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ServiceCard;
