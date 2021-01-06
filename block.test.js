const Block = require("./block");
const {GENESIS_DATA, MINE_RATE} = require('./config');
const cryptohash = require('./cryptohash');
const hexToBinary = require('hex-to-binary');

describe("block", () => {
    const timestamp = 2000;
    const lastHash = "foo_lasthash";
    const hash = "foo_hash";
    const data = ["blockhain", 1];
    const nonce = 1;
    const difficulty = 1;
    const block = new Block({
        // timestamp : timestamp,
        // lastHash : lastHash,
        // data : data,
        // hash : hash
        timestamp,
        lastHash,
        hash,
        data,
        nonce,
        difficulty
    });

    it("block has a timestamp, lastHash, hash and data properties", () => {
        expect(block.timestamp).toEqual(timestamp);
        expect(block.hash).toEqual(hash);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.data).toEqual(data);
        expect(block.nonce).toEqual(nonce);
        expect(block.difficulty).toEqual(difficulty);
    });

    describe("Genesis Block", ()=> {
        const genesisBlock = Block.genesisBlock();

        it("checks whether the genesis block is created", () => {
           expect(genesisBlock instanceof Block).toBe(true);
        });

        it("checks whether data in the genesis block is the same", () => {
            expect(genesisBlock).toEqual(GENESIS_DATA);
        })
    });

    describe("mineBlock()", () => {
        const lastBlock = Block.genesisBlock();
        const data = "mined-data";
        const minedBlock = Block.mineBlock({lastBlock, data});

        it("requires the minedBlock to a instance of Block", () => {
            expect(minedBlock instanceof Block).toBe(true);
        });

        it("sets the `lastHash` to be the `hash` of the lastBlock", () => {
           expect(minedBlock.lastHash).toEqual(lastBlock.hash);
        });

        it("sets the `data` to be Equal to data of the `minedBlock", () => {
            expect(minedBlock.data).toEqual(data);
        });

        it("creates an SHA-256 `hash` based on proper inputs", () => {
            expect(minedBlock.hash).toEqual(
                cryptohash(
                    minedBlock.timestamp,
                    lastBlock.hash,
                    data,
                    minedBlock.nonce,
                    minedBlock.difficulty))
        });

        it("checks whether we have a timestamp for the mined block", () => {
            expect(minedBlock.timestamp).not.toEqual(undefined);
        });

        it("sets a `hash` that matches the difficulty level", () => {
            console.log(hexToBinary(minedBlock.hash));
            console.log("this difficulty is: ", minedBlock.difficulty);
            expect(hexToBinary(minedBlock.hash).substring(0, minedBlock.difficulty))
                .toEqual('0'.repeat(minedBlock.difficulty));
        });



    });



    describe("adjustDifficulty()", () => {

        it("raises the difficulty rate if the block is mined too quickly", () => {
            console.log("difficulty is: ", block.difficulty);
            expect(Block.adjustDifficulty({originalBlock : block, timestamp : (block.timestamp + MINE_RATE - 100)}))
                .toEqual(block.difficulty + 1);
        });

        it("lowers the difficulty rate if the block is mined too slowly", () => {
            console.log("difficulty is: ", block.difficulty);
            expect(Block.adjustDifficulty({originalBlock : block, timestamp : (block.timestamp + MINE_RATE + 100)}))
                .toEqual(block.difficulty - 1);
        });

        it("does not let the difficulty to fall below 1", () => {
            block.difficulty = -5;
            expect(Block.adjustDifficulty({originalBlock: block})).toEqual(1)
        })
    })



});

