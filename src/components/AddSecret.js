import { useEffect, useState, useRef } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Input,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { AddIcon } from '@chakra-ui/icons';
import { isMobile } from 'react-device-detect';
import parseURI from 'otpauth-uri-parser';
import QrScanner from 'qr-scanner';

const GET_SECRET_VIA = {
  UNDECIDED: 'UNDECIDED',
  QR: 'QR',
  TEXT: 'TEXT',
};

function AddSecret({ saveSecret, themeData, enabled }) {
  const videoRef = useRef(null);
  const [showQrScanner, setShowQrScanner] = useState(false);
  const [scanner, setScanner] = useState();
  const [secretGetVia, setSecretGetVia] = useState(GET_SECRET_VIA.UNDECIDED);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [qrData, setQrData] = useState();
  const { register, handleSubmit, reset } = useForm();
  const toast = useToast();

  const onDisabledButton = () => {
    toast({
      title: 'New tier required', // Mensaje que quieres mostrar
      description: 'Purchase next tier to add more secrets',
      status: 'warning', // Color del toast
      duration: 5000, // Duración del toast en pantalla
      isClosable: true, // Permite cerrar el toast
      position: 'bottom',
    });
  };

  const onSubmit = data => {
    onClose();
    saveSecret(data);
    reset();
  };

  const stopScanning = () => {
    if (scanner) {
      scanner.stop();
    }
  };

  useEffect(() => {
    if (scanner && !showQrScanner) {
      stopScanning();
    }
  }, [showQrScanner]);

  const resetSecretGetVia = () => {
    setSecretGetVia(GET_SECRET_VIA.UNDECIDED);
    setQrData(null);
    reset();
    setShowQrScanner(false);
  };

  useEffect(() => {
    if (!isOpen) {
      resetSecretGetVia();
      setShowQrScanner(false);
    }
  }, [isOpen]);

  const handleScan = uri => {
    setShowQrScanner(false);
    const parsed = parseURI(uri);

    setQrData({
      service: parsed.query.issuer,
      account: parsed.label.account,
      secret: parsed.query.secret,
    });
    setSecretGetVia(GET_SECRET_VIA.TEXT);
  };

  useEffect(() => {
    if (showQrScanner && secretGetVia === GET_SECRET_VIA.QR) {
      const qrScanner = new QrScanner(
        videoRef.current,
        ({ data }) => {
          if (data && data.startsWith('otpauth')) {
            handleScan(data);
          }
        },
        {
          /* your options or returnDetailedScanResult: true if you're not specifying any other options */
          highlightCodeOutline: true,
          highlightScanRegion: true,
          preferredCamera: 'environment',
          // onDecodeError: error => alert(error),
        }
      );
      qrScanner.start();
      setScanner(qrScanner);
    }
  }, [showQrScanner, secretGetVia]);

  const title = 'Add 2FA Secret';
  const title2 = '2FA Secret';

  const helpDocs = (
    <Text fontSize={'0.8rem'} marginTop={1} textAlign={'center'}>
      Need help?{' '}
      <a
        style={{ textDecoration: 'underline' }}
        target="_blank"
        rel="noopener noreferrer"
        href="https://docs.2fai.xyz/tutorials/how-to-add-2fa-codes"
      >
        Check out the docs
      </a>
    </Text>
  );

  return (
    <>
      <Button
        /* isDisabled={!enabled} */ isActive={enabled}
        className="button2fa"
        onClick={enabled ? onOpen : onDisabledButton}
        background={themeData.button}
        style={{ opacity: 1 }}
      >
        <AddIcon marginRight={2} /> {isMobile ? '2FA' : title}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay bg="#0e0e0e9c!important" backdropFilter="blur(5px)" />
        <ModalContent
          bg={'#111013'}
          mr="3"
          ml="3"
          borderRadius={'10px!important'}
        >
          <ModalHeader bg="#01010c" borderTopRadius={'10px'}>
            <Text
              className="linear-wipe2"
              fontSize={'1.7rem'}
              textAlign={'center'}
            >
              Add a new {title2}
            </Text>
            {helpDocs}
          </ModalHeader>
          <ModalCloseButton />
          {secretGetVia === GET_SECRET_VIA.UNDECIDED ? (
            <>
              <ModalFooter
                justifyContent={'space-evenly'}
                bg="#01010c"
                borderBottomRadius={'10px!important'}
              >
                {/* <Center> */}
                <Button
                  style={{ borderRadius: '5px!important' }}
                  onClick={() => {
                    setSecretGetVia(GET_SECRET_VIA.QR);
                    setShowQrScanner(true);
                  }}
                >
                  Scan a QR code
                </Button>
                <Button
                  className="hover-border-11"
                  onClick={() => setSecretGetVia(GET_SECRET_VIA.TEXT)}
                >
                  Enter a setup key
                </Button>
                {/* </Center> */}
              </ModalFooter>
            </>
          ) : secretGetVia === GET_SECRET_VIA.TEXT ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalBody>
                <Text>Service</Text>
                <Input
                  type="text"
                  placeholder="Google"
                  defaultValue={qrData?.service}
                  {...register('service', { required: true, maxLength: 80 })}
                  marginBottom={2}
                />
                <Text>Account</Text>
                <Input
                  type="text"
                  placeholder="2fai@gmail.com"
                  defaultValue={qrData?.account}
                  {...register('account', {
                    required: true,
                    max: 100,
                    maxLength: 100,
                  })}
                  marginBottom={2}
                />
                <Text>2FA secret key from service</Text>
                <Input
                  type="text"
                  placeholder="j22h ni4e cd4o hqrx fka7 7uye wf2d xh77"
                  defaultValue={qrData?.secret}
                  {...register('secret', {
                    required: true,
                    minLength: 32,
                    maxLength: 80,
                  })}
                />
              </ModalBody>

              <ModalFooter justifyContent={'center'}>
                <Button onClick={() => resetSecretGetVia()}>Back</Button>
                <Button
                  background="#6f1b99!important"
                  marginLeft={4}
                  onClick={handleSubmit(onSubmit)}
                >
                  Encrypt & Save
                </Button>
              </ModalFooter>
            </form>
          ) : (
            <ModalBody>
              <Text>Scan 2FA QR code (must allow camera access)</Text>
              <video
                ref={videoRef}
                style={{
                  display: !showQrScanner ? 'none' : 'block',
                  width: '100%',
                }}
              ></video>
              <ModalFooter px={0}>
                <Button onClick={() => resetSecretGetVia()}>Back</Button>
              </ModalFooter>
            </ModalBody>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default AddSecret;
