const { Cashfree } = require('cashfree-pg');

const cashfree = new Cashfree(
    Cashfree.SANDBOX,
    process.env.CASHFREE_API_KEY,
    process.env.CASHFREE_API_SECRET
);

module.exports = cashfree;