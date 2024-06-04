const forge = require("node-forge");
const fs = require("fs");
const NodeRSA = require("node-rsa");

// const publicKeyPem = fs.readFileSync("public_key.pem", "utf8");
const privateKeyPem = fs.readFileSync("private_key.pem", "utf8");

const privateKey = new NodeRSA(privateKeyPem);

const decrypt = (encryptedData) => {
  const decryptedData = privateKey.decrypt(encryptedData, "utf8");

  return decryptedData;
};
module.exports = {
  decrypt,
};
