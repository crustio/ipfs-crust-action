const { Keyring } = require('@polkadot/keyring');
const axios = require('axios');
const { ApiPromise, WsProvider } = require('@polkadot/api');
const { typesBundleForPolkadot, types } = require('@crustio/type-definitions');

/* PUBLIC METHODS */
/**
 * Check CIDv0 legality
 * @param {string} cid 
 * @returns boolean
 */
function checkCid(cid) {
    return cid.length === 46 && cid.substr(0, 2) === 'Qm';
}

/**
 * Check seeds(12 words) legality
 * @param {string} seeds 
 * @returns boolean
 */
function checkSeeds(seeds) {
    return seeds.split(' ').length === 12;
}

/**
 * Send tx to Crust Network
 * @param {string} chainAddr Chain's ws endpoint
 * @param {string} ipfsGateway IPFS public gateway
 * @param {string} cid IPFS CIDv0 hash
 * @param {string} seeds 12 secret words 
 * @returns Promise<boolean> Pin success or failed
 */
async function pinOnCrust(chainAddr, ipfsGateway, cid, seeds) {
    // 1. Try to connect to Crust Chain
    const chain = new ApiPromise({
        provider: new WsProvider(chainAddr),
        typesBundle: typesBundleForPolkadot
    });

    await chain.isReadyOrError;

    // 2. Get file size
    const ipfs = axios.create({
        baseURL: ipfsGateway + '/api/v0',
        timeout: 60 * 1000, // 1 min
        headers: {'Content-Type': 'application/json'},
    });
    const res = await ipfs.post(`/object/stat?arg=${cid}`);
    const objInfo = parseObj(res.data);
    const size = objInfo.CumulativeSize;

    // 3. Load keyring
    console.log('⛓  Sending tx to chain...');
    const krp = loadKeyringPair(seeds);

    // 4. Construct tx
    const tx = chain.tx.market.placeStorageOrder(cid, size, 0);

    // 5. Send tx to chain
    return new Promise((resolve, reject) => {
        tx.signAndSend(krp, ({events = [], status}) => {
            console.log(
                `  ↪ 💸  Transaction status: ${status.type}, nonce: ${tx.nonce}`
            );

            if (
                status.isInvalid ||
                status.isDropped ||
                status.isUsurped ||
                status.isRetracted
            ) {
                chain.disconnect();
                reject(new Error('Invalid transaction'));
            } else {
                // Pass it
            }

            if (status.isInBlock) {
                events.forEach(({event: {method, section}}) => {
                if (section === 'system' && method === 'ExtrinsicFailed') {
                    // Error with no detail, just return error
                    console.error(`  ↪ ❌  Send transaction(${tx.type}) failed.`);
                    chain.disconnect();
                    resolve(false);
                } else if (method === 'ExtrinsicSuccess') {
                    console.log(`  ↪ ✅  Send transaction(${tx.toHex()}) success.`);
                    chain.disconnect();
                    resolve(true);
                }
                });
            } else {
                // Pass it
            }
        }).catch(e => {
            chain.disconnect();
            reject(e);
        });
    });
}

/* PRIVATE METHODS  */
/**
 * Load keyring pair with seeds
 * @param {string} seeds 
 */
 function loadKeyringPair(seeds) {
    const kr = new Keyring({
        type: 'sr25519',
    });

    const krp = kr.addFromUri(seeds);
    return krp;
}

/**
 * Parse any object to JSON object
 * @param {Object} o any type 
 * @returns JSONObject
 */
function parseObj(o) {
    return JSON.parse(JSON.stringify(o));
}

module.exports = {
    checkCid,
    checkSeeds,
    pinOnCrust
}