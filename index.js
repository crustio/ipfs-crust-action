const core = require('@actions/core');
const { ApiPromise, WsProvider } = require('@polkadot/api');
const { typesBundleForPolkadot, types } = require('@crustio/type-definitions');
const { checkCid, checkSeeds, sendTx } = require('./util');

async function main() {
    // 1. Get all inputs
    const cid = core.getInput('cid'); // Currently, we only support CIDv0
    const seeds = core.getInput('seeds');
    const chainAddr = core.getInput('crust-endpoint');
    const ipfsGateway = core.getInput('ipfs-gateway');

    // 2. Check cid and seeds
    if (!checkCid(cid) || !checkSeeds(seeds)) {
        throw new Error('Illegal inputs');
    }

    // 3. Try to connect to Crust Chain
    const chain = new ApiPromise({
        provider: new WsProvider(chainAddr),
        typesBundle: typesBundleForPolkadot
    });
    await chain.isReadyOrError;

    // 4. Get file size by hard code instead of requsting ipfs.gateway(leads timeout)
    // const ipfs = axios.create({
    //     baseURL: ipfsGateway + '/api/v0',
    //     timeout: 60 * 1000, // 1 min
    //     headers: {'Content-Type': 'application/json'},
    // });
    // const res = await ipfs.post(`/object/stat?arg=${cid}`);
    // const objInfo = parseObj(res.data);
    // const size = objInfo.CumulativeSize;
    const size = core.getInput('size');
    // console.log(`Got IPFS object size: ${size}`);

    // 5. Construct tx
    const tx = chain.tx.market.placeStorageOrder(cid, size, 0, '');

    // 6. Send tx and disconnect chain
    const txRes = await sendTx(tx, seeds);
    chain.disconnect();

    core.setOutput('res', txRes);
}

main().catch(error => {
    core.setFailed(error.message);
});
