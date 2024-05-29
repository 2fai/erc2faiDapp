export const getErrorMessageWeb3 = (_error /* : web3Error */) => {
  if (_error.reason) {
    return _error.reason;
  }

  let message = _error?.message;
  if (_error.data && _error.data.message) {
    message = _error.data.message;
  }

  //console.log(message)
  if (message != undefined) {
    message = message
      .replace(/execution reverted/gi, '')
      .replace(':', '')
      .trim();
  }

  if (message == 'header not found') {
    message = 'Network working bad... you could see old data';
  }

  return message;
};

export const getErrorMessage = _error => {
  let stringMessage = _error;
  if (typeof _web3Error != 'string') {
    stringMessage = getErrorMessageWeb3(_error);
  }
  return stringMessage;
};
