const hashGenerator = require('./cryptohash');
const Block = require("./block");

describe("Cryto-hash SHA 512", () => {
    const timestamp = Date.now();
    const hashedBlock = new Block({
        timestamp : Date.now(),
        lastHash : "foo_last_hash",
        data : "foo_data"
    });

    it("checks whether SHA-512 works or not", () => {
        expect(hashGenerator("foo")).toEqual("2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae");
    })
});