const Express = require("express");
const Blockchain = require("./blockchain");
const PORT = 3000;

const app = Express();
const blockchain = new Blockchain();

app.get("/api/blocks", (req, res) => {
    res.json(blockchain.chain);
});



app.listen(PORT, () => {
    console.log(`app has started on localhost:${PORT}`)
});

