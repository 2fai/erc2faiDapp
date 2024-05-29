// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TwoFaiSecrets {
    mapping(address => string[]) public encryptedData;

    constructor() {}

    function storeEncryptedData(string memory _encryptedData) external {
        encryptedData[msg.sender].push(_encryptedData);
    }

    function deleteEncryptedData(uint256 _index) external {
        uint256 nStoredScrets = encryptedData[msg.sender].length;
        require(_index < nStoredScrets, "Index out of bounds");
        encryptedData[msg.sender][_index] = encryptedData[msg.sender][nStoredScrets - 1];
        encryptedData[msg.sender].pop();
    }

    function getUserData(address _address, uint256 _index) external view returns (string memory) {
        return encryptedData[_address][_index];
    }

    function getUserDataArray(address _address, uint256 _startIndex, uint256 _take) external view returns (string[] memory) {
        string [] memory datas = new string[](_take);
        uint256 userDataLength = encryptedData[_address].length;

        if(userDataLength == 0) {
            return datas;
        }

        uint256 lastIndex = _startIndex + _take - 1;
        uint256 lastRealIndex = userDataLength - 1;
        lastIndex = lastIndex > lastRealIndex ? lastRealIndex : lastIndex;
        uint256 storePos = 0;

        for(uint256 _i = _startIndex; _i <= lastIndex; _i++) {
            datas[storePos] = encryptedData[_address][_i];
            storePos++;
        }

        return datas;
    }
}