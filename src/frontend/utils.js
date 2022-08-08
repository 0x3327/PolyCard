const aesjs = require('aes-js');
const { sha3_256 } = require('js-sha3');


const utils = {
    aesEncryptKey: (text, key) => {
        const textBytes = aesjs.utils.hex.toBytes(text);
        const keyHash = sha3_256(key);
        let keyHashBytes = aesjs.utils.hex.toBytes(keyHash);
        
        const iv = aesjs.utils.hex.toBytes(sha3_256('initializationvector').slice(0, 32));
         
        const aesCbc = new aesjs.ModeOfOperation.cbc(keyHashBytes, iv);
        const encryptedBytes = aesCbc.encrypt(textBytes);

        return aesjs.utils.hex.fromBytes(encryptedBytes);
    },

    aesDecryptKey: (encText, key) => {
        const keyHash = sha3_256(key);
        let keyHashBytes = aesjs.utils.hex.toBytes(keyHash);

        const encryptedBytes = aesjs.utils.hex.toBytes(encText);

        const iv = aesjs.utils.hex.toBytes(sha3_256('initializationvector').slice(0, 32));

        const aesCbc = new aesjs.ModeOfOperation.cbc(keyHashBytes, iv);
        const decryptedBytes = aesCbc.decrypt(encryptedBytes);

        return aesjs.utils.hex.fromBytes(decryptedBytes);
    },

    sha3: (text) => sha3_256(text),
}

export default utils;