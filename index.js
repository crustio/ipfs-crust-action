const core = require('@actions/core');
const github = require('@actions/github');
const { checkCid, checkSeeds, pinOnCrust } = require('./util');

try {
    // 1. Get all inputs
    const cid = core.getInput('cid'); // Currently, we only support CIDv0
    const seeds = core.getInput('seeds');
    const chainAddr = core.getInput('crust-endpoint');
    const ipfsGateway = core.getInput('ipfs-gateway');

    // 2. Check cid and seeds
    if (!checkCid(cid) || !checkSeeds(seeds)) {
        throw new Error('Illegal inputs');
    }

    // 3. Send place storage order to chain
    pinOnCrust(chainAddr, ipfsGateway, cid, seeds)
    .then(res => {
        console.log(`res: ${res}`);
        core.setOutput('res', res);
    })
    .catch(e => {
        throw new Error(e.message);
    });
} catch (error) {
    core.setFailed(error.message);
}