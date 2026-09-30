const { Cashfree, CFEnvironment } = require('cashfree-pg');

// Defer credential validation to request time so Railway doesn't crash at boot
// when Cashfree keys are missing (e.g. local dev / non-payment testing).
const cashfree = new Cashfree({
    cashfree_Env: process.env.CASHFREE_ENV === 'PRODUCTION' ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX,
    api_key: process.env.CASHFREE_API_KEY || 'missing-key',
    api_secret: process.env.CASHFREE_API_SECRET || 'missing-secret',
});
module.exports = cashfree;
