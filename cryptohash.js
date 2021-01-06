// TODO: `Finish cryptohash helper`

const crypto = require('crypto');

const generateHash = (...inputs) => {
    const hash = crypto.createHash('sha256');
    hash.update(inputs.join(" "));
    return hash.digest('hex');
};

module.exports = generateHash;