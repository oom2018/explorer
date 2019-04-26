
const ethUtils = require('ethereumjs-util');
const BlockHeader = require('./header.js');
var numberToBN = require('number-to-bn');

/**
 * Takes an input and transforms it into an BN
 *
 * @method toBN
 * @param {Number|String|BN} number, string, HEX string or BN
 * @return {BN} BN
 */
var toBN = function(number){
    try {
        return numberToBN.apply(null, arguments);
    } catch(e) {
        throw new Error(e + ' Given value: "'+ number +'"');
    }
};

/**
 * Creates a new block header object from Ethereum JSON RPC.
 * @param {Object} blockParams - Ethereum JSON RPC of block (eth_getBlockByNumber)
 */
function blockHeaderFromRpc (blockParams) {
    const blockHeader = new BlockHeader({
        parentHash: blockParams.parentHash,
        uncleHash: blockParams.sha3Uncles,
        coinbase: blockParams.miner,
        stateRoot: blockParams.stateRoot,
        transactionsTrie: blockParams.transactionsRoot,
        receiptTrie: blockParams.receiptRoot || blockParams.receiptsRoot || ethUtils.SHA3_NULL,
        bloom: blockParams.logsBloom,
        difficulty: blockParams.difficulty,
        number: blockParams.number,
        gasLimit: blockParams.gasLimit,
        gasUsed: blockParams.gasUsed,
        timestamp: blockParams.timestamp,
        extraData: blockParams.extraData,
        mixHash: blockParams.mixHash,
        nonce: blockParams.nonce
    });

    // override hash incase something was missing
    blockHeader.hash = function () {
        return ethUtils.toBuffer(blockParams.hash)
    };

    return blockHeader;
};

var getSigner = function(block) {
    if (block.number === 0)
        return block.miner;

    var sealers = block.extraData;
    if (sealers.length <= 130)
        return undefined;
    var sig = ethUtils.fromRpcSig('0x' + sealers.substring(sealers.length - 130, sealers.length)); // remove signature
    block.extraData = block.extraData.substring(0, block.extraData.length - 130);
    block.difficulty = toBN(block.difficulty).toString(10);
    block.totalDifficulty = toBN(block.totalDifficulty).toString(10);
    // var blk = ethBlock(block);
    var header = blockHeaderFromRpc(block);
    header.difficulty[0] = block.difficulty;
    var sigHash = ethUtils.keccak(header.serialize());
    var pubkey = ethUtils.ecrecover(sigHash, sig.v, sig.r, sig.s);

    return '0x' + ethUtils.pubToAddress(pubkey).toString('hex');
};

module.exports = getSigner;