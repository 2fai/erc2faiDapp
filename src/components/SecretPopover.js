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
} from '@chakra-ui/react';
import { ViewIcon, CopyIcon } from '@chakra-ui/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';

function SecretPopover({ secret, isDemo, /* linkToEncodedData, */ themeData }) {
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
      <Popover>
        <PopoverTrigger>
          <Button className="button_demo_2fa">
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
    )
  );
}

export default SecretPopover;
