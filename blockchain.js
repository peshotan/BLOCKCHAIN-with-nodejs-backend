const Block = require('./block');
const cryptoHash = require('./cryptohash');

class Blockchain {
    constructor() {
        this.chain = [Block.genesisBlock()];
        // each block in this chain will be an instance of the Block
    }

    addBlock({data}){
        // mine block is a static method
        const newBlock = Block.mineBlock({
            lastBlock : this.chain[this.chain.length - 1],
            data : data
        });
        this.chain.push(newBlock);
        return this.chain
    }

    static isValidChain(chain){
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesisBlock())) return false;

        for (let i = 1; i < chain.length; i++){
            const block = chain[i];
            const realLastHash = chain[i-1].hash;
            const { timestamp, lastHash, hash, data, nonce, difficulty } = block;

            // checking the lasthash reference
            if (realLastHash !== lastHash) {
                return false;
            }
            // validating the data field by validating the genrated hash (because if we have reached this far
            // then it is only the data field that is messing things up
            const validatedHash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
            console.log(timestamp, nonce, lastHash, data, difficulty, validatedHash);


            if (validatedHash !== hash) {
                console.log("THIS GETS HIT");
                console.log(chain.length, i);
                return false;
            }

            if (Math.abs(chain[i-1].difficulty - chain[i].difficulty) > 1 ) return false
        }

        return true;

    }

    replaceChain(newChain){
        // 3 cases:
            // if chain is shorter - DO NOT REPLACE
            // if invalid block - DO NOT REPLACE
            // if it passes everything do replace
        if (newChain.length < this.chain.length) {
            //console.error("incoming chain must be longer");
            return this.chain;
        } else {
            if (Blockchain.isValidChain(newChain)) {
                this.chain = newChain;
                //console.log("replaced chain with", this.chain);
            } else {
                //pass
                //console.error("incoming chain must be VALID");
                return;
            }
        }
    }
}

module.exports = Blockchain;