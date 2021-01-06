const Blockchain = require('./blockchain');
const Block = require('./block');
const cryptoHash = require('./cryptohash');

describe("Blockchain", () => {
    let blockchain, newChain, originalChain;

    beforeEach(() => {
        blockchain = new Blockchain();
        newChain = new Blockchain();
    });

    it("is `blockchain` an instance of an Array data type", () => {
        expect(blockchain instanceof Blockchain).toBe(true);
    });

    it("starts with the genesis block", () => {
        expect(blockchain.chain[0]).toEqual(Block.genesisBlock());
        console.log(blockchain.chain[0].returnString());
    });

    it("checks whether the data of the blockchain is equal to the data", () => {
        const data = "foo data";
        blockchain.addBlock({data});
        expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(data)
    });

    // now we add tests for chainValidation
    describe("isValidChain()", () => {
        // is the first block genesis block?
        describe("when the first block of the chain is not the genesisBlock", () => {
            it("returns false", () => {
                blockchain.chain[0].data = "Fooooo_data";
                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
            });
        });

        describe("when the first block is the genesis block and the chain contains multiple blocks", () => {
            // we have 3 instances
            beforeEach(() => {
                blockchain.addBlock({data : 'Hello'});
                blockchain.addBlock({data : 'How'});
                blockchain.addBlock({data : 'Do you do?'});
            });

            describe("when the last blocks reference has been changed", () => {
                it("should return false", () => {
                    // lets change the last blocks reference (lastHash value) to something else
                    blockchain.chain[2].lastHash = "fake hash from a reference";
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });

            describe("when the chain contains an invalid block", () => {
                it("should return false", () => {
                    blockchain.chain[2].data = "fake data for block 2";
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });

            describe("when the chain does not contain any invalid block", () => {
                it("should return true", () => {
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
                });
            });

            describe("and the chain contains a block with jumped difficulty", () => {
                it("should return false", () => {
                    const lastBlock = blockchain.chain[blockchain.chain.length - 1];
                    const lastHash = lastBlock.hash;
                    const timestamp = Date.now();
                    const nonce = 0;
                    const difficulty = lastBlock.difficulty - 3;
                    const data = ["SAMPLE DATA"];

                    const hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);

                    const badBlock = new Block({timestamp, lastHash, hash, data, nonce, difficulty});

                    blockchain.chain.push(badBlock);
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);

                })
            })
        });
    });



    describe("replaceChain()", () => {
        beforeEach(() => {
            originalChain = blockchain.chain;
        });

        describe("when the new chain is not longer", () => {
            it("does not replace the chain", () => {
                blockchain.replaceChain(newChain);
                expect(blockchain.chain).toEqual(originalChain);
            })
        });

        describe("when the chain is longer", () => {
            beforeEach(() => {
                newChain.addBlock({data : "hello this is new block"});
                newChain.addBlock({data : "second block of information"});
            });

            describe("when the chain is invalid", () => {
                it("does NOT replace the chain", () => {
                    newChain.chain[1].hash = "hash is wrong";
                    //console.log(newChain.chain, "THIS IS THE TEMPERED CHAIN");
                    blockchain.replaceChain(newChain.chain);
                    expect(blockchain.chain).toEqual(originalChain);
                });
            });

            describe("when the chain is valid", () => {
                it("does replace the chain", () => {
                    blockchain.replaceChain(newChain.chain);
                    expect(blockchain.chain).toEqual(newChain.chain);
                });
            });
        });
    });
});