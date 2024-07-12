// @ts-check
const { parentPort, workerData } = require('worker_threads');
const { isExactMatchThree } = require('./foundAdress');
const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient()
// const { default: consola } = require('consola');

// Example processing function
/**
 * 
 * @param {import("@prisma/client").SmartAgentObjects[]} chunk 
 * @param {(string | null)[]} allIntumAddresses 
 * @returns 
 */
function processChunk(chunk, allIntumAddresses) {
    
    const results = []
    const start = performance.now();
    for (const smartObj of chunk) {
        const isUnique = allIntumAddresses.map((address) => {
            return isExactMatchThree(address, smartObj.street_cache);
        }).every((match) => match === false);

        if (isUnique) {
            results.push(smartObj);
        }
    }
    const end = performance.now();
    const totalTime = end - start;
    // consola.info('totalTime: ' + totalTime)
    return results
}

const processedChunk = processChunk(workerData.chunk, workerData.allIntumAddresses);
parentPort?.postMessage(processedChunk);

