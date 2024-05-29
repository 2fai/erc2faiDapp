import { ethers } from 'ethers';
import { dappConfig } from '../config/config';

const secretsContractABIWrite = [
  'function storeEncryptedData(string memory _encryptedData) external',
  'function deleteEncryptedData(uint256 _index) external',
];

const secretsContractABIRead = [
  'function getUserData(address _address, uint256 _index) external view returns (string memory)',
  'function getUserDataArray(address _address, uint256 _startIndex, uint256 _take) external view returns (string[] memory)',
];

export function getSecretsContractBASEWriter(signer) {
  return new ethers.Contract(
    dappConfig.twoFaiRedundancyBASE,
    secretsContractABIWrite,
    signer
  );
}

export function getSecretsContractARBWriter(signer) {
  return new ethers.Contract(
    dappConfig.twoFaiRedundancyARB,
    secretsContractABIWrite,
    signer
  );
}

export function getSecretsContractBNBWriter(signer) {
  return new ethers.Contract(
    dappConfig.twoFaiRedundancyBNB,
    secretsContractABIWrite,
    signer
  );
}

export function getSecretsContractBASEReader() {
  return new ethers.Contract(
    dappConfig.twoFaiRedundancyBASE,
    secretsContractABIRead,
    new ethers.providers.JsonRpcProvider(dappConfig.baseReadRPC)
  );
}

export function getSecretsContractARBReader() {
  return new ethers.Contract(
    dappConfig.twoFaiRedundancyARB,
    secretsContractABIRead,
    new ethers.providers.JsonRpcProvider(dappConfig.arbitrumReadRPC)
  );
}

export function getSecretsContractBNBReader() {
  return new ethers.Contract(
    dappConfig.twoFaiRedundancyBNB,
    secretsContractABIRead,
    new ethers.providers.JsonRpcProvider(dappConfig.bnbReadRPC)
  );
}

export async function getSecret(
  address,
  index,
  chain = dappConfig.availableStorages.BASE
) {
  if (chain == dappConfig.availableStorages.BASE) {
    return await getSecretsContractBASEReader().getUserData(address, index);
  } else if(chain == dappConfig.availableStorages.ARB) {
    return await getSecretsContractARBReader().getUserData(address, index);
  } else {
    return await getSecretsContractBNBReader().getUserData(address, index);
  }
}

export async function getSecrets(
  address,
  startIndex,
  take,
  chain = dappConfig.availableStorages.BASE
) {
  if (chain == dappConfig.availableStorages.BASE) {
    return await getSecretsContractBASEReader().getUserDataArray(
      address,
      startIndex,
      take
    );
  } else if(chain == dappConfig.availableStorages.ARB) {
    return await getSecretsContractARBReader().getUserDataArray(
      address,
      startIndex,
      take
    );
  } else {
    return await getSecretsContractBNBReader().getUserDataArray(
      address,
      startIndex,
      take
    );
  }
}

export async function storeSecret(
  signer,
  secretObj,
  chain = dappConfig.availableStorages.BASE
) {
  if (chain == dappConfig.availableStorages.BASE) {
    return await getSecretsContractBASEWriter(signer).storeEncryptedData(
      JSON.stringify(secretObj)
    );
  } else if(chain == dappConfig.availableStorages.ARB) {
    return await getSecretsContractARBWriter(signer).storeEncryptedData(
      JSON.stringify(secretObj)
    );
  } else {    
    return await getSecretsContractBNBWriter(signer).storeEncryptedData(
      JSON.stringify(secretObj)
    );
  }
}
