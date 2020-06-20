const crypto = require('crypto');

const crpytoHash = (...inputs) => {
    const hash = crypto.createHash('sha256');
    hash.update(inputs.map(input => JSON.stringify(input)).sort().join(' '));
    return hash.digest('hex');
};

module.exports = crpytoHash;