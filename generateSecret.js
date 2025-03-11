const crypto = require('crypto');

// Генерация 64-байтового секрета в формате hex
const secret = crypto.randomBytes(64).toString('hex');
console.log('Generated Secret Key:', secret);
