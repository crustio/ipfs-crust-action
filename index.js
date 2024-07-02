const core = require('@actions/core');
const { ApiPromise, WsProvider } = require ('@polkadot/api');
const { typesBundleForPolkadot } = require( '@crustio/type-definitions');
const { checkSeeds, sendTx } = require('./util');

async function main() {
    // 1. Get all inputs
    const cid = core.getInput('cid');
    const seeds = core.getInput('seeds');
    const chainAddr = core.getInput('crust-endpoint');

    // 2. Check cid and seeds
    if (!checkSeeds(seeds)) {
        throw new Error('Illegal inputs');
    }

    // 3. Try to connect to Crust Chain
    const chain = new ApiPromise({
        provider: new WsProvider(chainAddr),
        typesBundle: typesBundleForPolkadot
    });
    await chain.isReady;

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
