import { useState, useEffect } from 'react';
import * as LitJsSdk from '@lit-protocol/lit-node-client';

export default function useLitProtocol(address, isReady) {
  const [litClient, setLitClient] = useState();
  const [authSig, setAuthSig] = useState();
  const [chain] = useState('ethereum');

  const addressAccessControl = address => [
    {
      contractAddress: '',
      standardContractType: '',
      chain,
      method: '',
      parameters: [':userAddress'],
      returnValueTest: {
        comparator: '=',
        value: address,
      },
    },
  ];

  const encryptWithLit = async msg => {
    const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(msg);

    const encryptedSymmetricKey = await litClient.saveEncryptionKey({
      accessControlConditions: addressAccessControl(address),
      symmetricKey,
      authSig,
      chain,
    });

    const encryptedMessageStr =
      await LitJsSdk.blobToBase64String(encryptedString);

    const encryptedKeyStr = LitJsSdk.uint8arrayToString(
      encryptedSymmetricKey,
      'base16'
    );

    return {
      encryptedString: encryptedMessageStr,
      encryptedSymmetricKey: encryptedKeyStr,
    };
  };

  const decryptRec = async rec => {
    const {
      id,
      appId,
      address,
      publicKey,
      service,
      serviceKey,
      account,
      accountKey,
      secret,
      secretKey,
    } = rec;
    return Promise.all([
      id,
      decryptWithLit(service, serviceKey),
      decryptWithLit(account, accountKey),
      decryptWithLit(secret, secretKey),
    ]).then(([id, decryptedService, decryptedAccount, decryptedSecret]) => ({
      id,
      service: decryptedService,
      account: decryptedAccount,
      secret: decryptedSecret,
      encryptedItem: {
        id,
        appId,
        address,
        publicKey,
        service,
        serviceKey,
        account,
        accountKey,
        secret,
        secretKey,
      },
    }));
  };

  const decryptWithLit = async (encryptedString, encryptedSymmetricKey) => {
    if (litClient) {
      const encryptedMessageBlob =
        await LitJsSdk.base64StringToBlob(encryptedString);

      const symmetricKey = await litClient.getEncryptionKey({
        accessControlConditions: addressAccessControl(address),
        toDecrypt: encryptedSymmetricKey,
        chain,
        authSig,
      });

      const decryptedMessage = await LitJsSdk.decryptString(
        encryptedMessageBlob,
        symmetricKey
      );

      return decryptedMessage;
    }
  };

  useEffect(() => {
    if (address && isReady) {
      const connectToLit = async () => {
        const client = new LitJsSdk.LitNodeClient();
        await client.connect();
        return client;
      };
      connectToLit().then(async lc => {
        setLitClient(lc);

        if (window.ethereum) {
          const sig = await LitJsSdk.checkAndSignAuthMessage({
            chain,
            uri: "https://2fai.xyz/dashboard" //static message
          });

          setAuthSig(sig);
        }
      });
    }
  }, [address /* , isReady */]);

  return {
    encryptWithLit,
    decryptWithLit,
    decryptRec,
    authSig,
    ready: litClient && address && authSig && isReady,
  };
}
