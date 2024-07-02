import { Keyring } from "@polkadot/keyring";

/* PUBLIC METHODS */
/**
 * Check seeds(12 words) legality
 * @param {string} seeds
 * @returns boolean
 */
function checkSeeds(seeds) {
  return seeds.split(" ").length === 12;
}

/**
 * Send tx to Crust Network
 * @param {import('@polkadot/api/types').SubmittableExtrinsic} tx
 * @param {string} seeds 12 secret words
 * @returns Promise<boolean> send tx success or failed
 */
async function sendTx(tx, seeds) {
  // 1. Load keyring
  console.log("⛓  Sending tx to chain...");
  const krp = loadKeyringPair(seeds);

  // 2. Send tx to chain
  return new Promise((resolve, reject) => {
    tx.signAndSend(krp, ({ events = [], status }) => {
      console.log(`  ↪ 💸  Transaction status: ${status.type}, nonce: ${tx.nonce}`);

      if (status.isInvalid || status.isDropped || status.isUsurped || status.isRetracted) {
        reject(new Error("Invalid transaction"));
      } else {
        // Pass it
      }

      if (status.isInBlock) {
        events.forEach(({ event: { method, section } }) => {
          if (section === "system" && method === "ExtrinsicFailed") {
            // Error with no detail, just return error
            console.error("  ↪ ❌  Send transaction failed");
            resolve(false);
          } else if (method === "ExtrinsicSuccess") {
            console.log("  ↪ ✅  Send transaction success.");
            resolve(true);
          }
        });
      } else {
        // Pass it
      }
    }).catch((e) => {
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
    type: "sr25519",
  });

  const krp = kr.addFromUri(seeds);
  return krp;
}

module.exports = {
  checkSeeds,
  sendTx,
};
