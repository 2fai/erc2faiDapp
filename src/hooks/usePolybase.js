import { Polybase } from '@polybase/client';
import * as eth from '@polybase/eth';
import { useEffect, useState } from 'react';
import { dappConfig } from '../config/config';

export default function usePolybase(
  //litClient,
  decryptRec,
  isConnected,
  address,
  authSig,
  ready
) {
  //const [polybaseLoading, setPolybaseLoading] = useState(false);
  //const [polybaseRetrying, setPolybaseRetrying] = useState(false);
  //const [litClient, setLitClient] = useState();
  const [polybaseDb, setPolygbaseDb] = useState();
  const [defaultNamespace] = useState(dappConfig.defaultNamespace);
  const [collectionReference] = useState('Keys');
  const [appId] = useState('hack-fs');
  const [addedSigner, setAddedSigner] = useState(false); // need signer in order to create Polybase records
  const encodedNamespaceDb = encodeURIComponent(
    `${defaultNamespace}/${collectionReference}`
  );

  useEffect(() => {
    if (isConnected && address) {
      const db = new Polybase({
        defaultNamespace,
      });

      const addSigner = async () => {
        setAddedSigner(true);
        db.signer(async data => {
          const accounts = await eth.requestAccounts();
          const account = accounts[0];
          const sig = await eth.sign(data, account);
          return { h: 'eth-personal-sign', sig };
        });

        //const ava = await setAvatar(ensName);
        setPolygbaseDb(db);
      };

      addSigner();
    }
  }, [isConnected, address, authSig, ready]);

  const decryptPolybaseRecs = async recs => {
    const decryptedPolybaseRecs = [];
    for (let rec of recs) {
      const dr = await decryptRec(rec);
      decryptedPolybaseRecs.push(dr);
    }

    return decryptedPolybaseRecs;
  };

  const listRecordsWhereAppIdMatches = async (
    field = 'address',
    op = '==',
    val = address
  ) => {
    if (polybaseDb) {
      const records = await polybaseDb
        .collection(collectionReference)
        .where(field, op, val)
        .where('appId', '==', appId)
        .get();
      return records.data.map(d => d.data);
    } else {
      return [];
    }
  };

  const createPolybaseRecord = async (
    id,
    service,
    account,
    secret /* , callback */
  ) => {
    // schema creation types
    // id: string, appId: string, address: string, service: string, serviceKey: string,
    // account: string, accountKey: string, secret: string, secretKey: string
    //const id = `encrypted${Date.now().toString()}`;

    /* const record =  */ await polybaseDb
      .collection(collectionReference)
      .create([
        id,
        appId,
        address,
        service.encryptedString,
        service.encryptedSymmetricKey,
        account.encryptedString,
        account.encryptedSymmetricKey,
        secret.encryptedString,
        secret.encryptedSymmetricKey,
      ]);

    //callback();
  };

  return {
    addedSigner,
    encodedNamespaceDb,
    appId,
    createPolybaseRecord,
    listRecordsWhereAppIdMatches,
    decryptPolybaseRecs,
  };
}
