import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  Button,
  PopoverArrow,
  PopoverCloseButton,
  useToast, // Importa useToast
  Icon,
  // AlertIcon,
  Tooltip,
  useColorModeValue,
  Flex,
} from '@chakra-ui/react';
import {
  ViewIcon,
  CopyIcon,
  WarningIcon /* , CheckIcon  */,
} from '@chakra-ui/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { dappConfig } from '../config/config';

function SecretPopover({
  secret,
  isDemo,
  /* linkToEncodedData, */
  themeData,
  storeOnBaseFn = undefined,
  storeOnArbFn = undefined,
  storeOnBNBFn = undefined
}) {
  const warningIconColor = useColorModeValue('orange.600', 'orange.200');
  //const infoIconColor = useColorModeValue('red.500', 'red.200');

  let availability = 1;
  if (!storeOnBaseFn) {
    availability++;
  }
  if (!storeOnArbFn) {
    availability++;
  }
  if (!storeOnBNBFn) {
    availability++;
  }

  // Inicializa el hook useToast
  const toast = useToast();

  // Función para manejar la copia
  const handleCopy = () => {
    toast({
      title: '2FA Secret Copied', // Mensaje que quieres mostrar
      description: 'The 2FA Secret has been copied to the clipboard',
      status: 'success', // Color del toast
      duration: 5000, // Duración del toast en pantalla
      isClosable: true, // Permite cerrar el toast
    });
  };

  return (
    secret && (
      <>
        <Popover>
          <PopoverTrigger>
            <Button className="button_demo_2fa_tiers">
              <ViewIcon marginRight={1} /> 2FA Secret
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>{isDemo && 'Demo '}2FA Secret</PopoverHeader>
            <PopoverBody color={themeData.textHighlight}>
              <p>
                {secret.slice(0, 9)} .... {secret.slice(-9)}
              </p>
              {/* Envuelve el botón en CopyToClipboard y usa onCopy para llamar a handleCopy */}
              <CopyToClipboard text={secret} onCopy={handleCopy}>
                <Button marginTop={2} className="button_demo_2fa">
                  <CopyIcon marginRight={1} /> Copy full {isDemo && ' demo '}2FA
                  secret
                </Button>
              </CopyToClipboard>
            </PopoverBody>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger>
            <Button className="button_demo_2fa_tiers" mt={2}>
              Availability {availability}/4{' '}
              {availability == 1 && (
                <Tooltip
                  label="Your encrypted secrets are stored in one unique blockchain"
                  aria-label="A tooltip"
                >
                  <Icon
                    as={WarningIcon}
                    color={warningIconColor}
                    marginLeft={2}
                  />
                </Tooltip>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>{isDemo && 'Demo '}2FA Sources</PopoverHeader>
            <PopoverBody color={themeData.textHighlight}>
              {/* Envuelve el botón en CopyToClipboard y usa onCopy para llamar a handleCopy */}
              <Flex flexDirection={'column'}>
                <div>
                  <p>{dappConfig.availableStorages.Polybase}</p>
                </div>
                <div>
                  {storeOnBaseFn ? (
                    <Button
                      marginTop={2}
                      className="button_demo_2fa"
                      onClick={storeOnBaseFn}
                    >
                      Store on {dappConfig.availableStorages.BASE}
                    </Button>
                  ) : (
                    <p>{dappConfig.availableStorages.BASE}</p>
                  )}
                </div>
                <div>
                  {storeOnArbFn ? (
                    <Button
                      marginTop={2}
                      className="button_demo_2fa"
                      onClick={storeOnArbFn}
                    >
                      Store on {dappConfig.availableStorages.ARB}
                    </Button>
                  ) : (
                    <p>{dappConfig.availableStorages.ARB}</p>
                  )}
                </div>
                <div>
                  {storeOnBNBFn ? (
                    <Button
                      marginTop={2}
                      className="button_demo_2fa"
                      onClick={storeOnBNBFn}
                    >
                      Store on {dappConfig.availableStorages.BNB}
                    </Button>
                  ) : (
                    <p>{dappConfig.availableStorages.BNB}</p>
                  )}
                </div>
              </Flex>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </>
    )
  );
}

export default SecretPopover;
