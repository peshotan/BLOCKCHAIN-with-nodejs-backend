const hexToBinary = require('hex-to-binary');
const {GENESIS_DATA, MINE_RATE} =  require('./config');
const hashGenerator = require('./cryptohash');

class Block{
    constructor({timestamp,lastHash, hash, data, nonce, difficulty}) {
        this.lastHash = lastHash;
        this.hash = hash;
        this.timestamp = timestamp || Date.now();
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty;
    };

    static genesisBlock() {
        return new this(GENESIS_DATA);
    };

    returnString() {
      return (
          `
          timestamp : ${this.timestamp},
          lasthash : ${this.lastHash},
          hash: ${this.hash},
          data: ${this.data},
          nonce: ${this.nonce},
          difficulty: ${this.difficulty}
          `)
    };

    static mineBlock({lastBlock, data}) {
        let hash, timestamp;
        const lastHash = lastBlock.hash;
        let difficulty = lastBlock.difficulty;
        let nonce = 0;

        do{
            nonce++;
            timestamp = Date.now();
            difficulty = this.adjustDifficulty({originalBlock : lastBlock, timestamp : timestamp});
            hash = hashGenerator(timestamp, lastHash, data, nonce, difficulty);
        } while(hexToBinary(hash).substring(0,difficulty) !== '0'.repeat(difficulty));

        // let hash = hashGenerator(timestamp, lastHash, data, nonce, difficulty);
        // we return a new Mined Instance of the BLOCK
        return new this({
            timestamp,
            lastHash,
            hash,
            data,
            nonce,
            difficulty
        });
    };

    // this syntax {parameters} is basically object destructuring, we are using the values in the our funcs not keys
    static adjustDifficulty({originalBlock, timestamp}){
        const { difficulty } = originalBlock;

        // taking care of the edge case
        if (difficulty < 1) return 1;
        if ((timestamp - originalBlock.timestamp) > MINE_RATE) return difficulty - 1;
        return difficulty + 1;
    };

}


module.exports = Block;