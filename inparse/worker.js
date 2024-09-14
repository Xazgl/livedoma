// @ts-check
const { parentPort, workerData } = require('worker_threads');
const { isExactMatchThree } = require('./foundAdress');
const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient()
// const { default: consola } = require('consola');

// Example processing function
/**
 * 
 * @param {import("@prisma/client").InparseObjects[]} chunk 
 * @param {(string | null)[]} allIntumAddresses 
 * @returns 
 */
function processChunk(chunk, allIntumAddresses) {
    // let wait = true
    // /** @type {(string | null)[]} */
    // let allIntumAddresses = [];
    // db.objectIntrum
    //     .findMany({
    //         select: { street: true },
    //     })
    //     .then((objects) => objects.map((obj) => obj.street))
    //     .then((addresses) => {
    //         allIntumAddresses = addresses
    //         wait = false
    //     })
    // while (wait) {}
    const results = []
    const start = performance.now();
    for (const inparseObj of chunk) {
        const isUnique = allIntumAddresses.map((address) => {
            return isExactMatchThree(address, inparseObj.address);
        }).every((match) => match === false);

        if (isUnique) {
            results.push(inparseObj);
        }
    }
    const end = performance.now();
    const totalTime = end - start;
    // consola.info('totalTime: ' + totalTime)
    return results
}

const processedChunk = processChunk(workerData.chunk, workerData.allIntumAddresses);
parentPort?.postMessage(processedChunk);

// module.exports = {
//     processChunk: processChunk,
// };