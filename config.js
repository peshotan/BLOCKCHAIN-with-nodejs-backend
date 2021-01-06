const INITIAL_DIFFICULTY = 6;
const MINE_RATE = 1000;

const GENESIS_DATA = {
    lastHash : "foo----",
    hash : "genesis_block",
    timestamp : "01/01/2019",
    nonce: 0,
    difficulty : INITIAL_DIFFICULTY,
    data : ["first block", "second block"]
};

module.exports =  {GENESIS_DATA, MINE_RATE};