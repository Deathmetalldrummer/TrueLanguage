const express = require('express');
const fs = require('fs');
const app = express();
const port = 5000;
const cors = require('cors');
const server = app.listen(port, function () {
    console.log(`Example app listening on port ${port}.`);
});
// app.use(express.limit(100000000));
app.use(
    express.urlencoded({
        extended: true,
        limit: '50mb'
    })
)
app.use(express.json())
const corsOptions = {
    origin: '*',
    headers: 'origin, content-type, accept',
    optionsSuccessStatus: 200
}

app.get('/', (req, res) => {
    res.send('Hello World!')
});
app.post('/words', cors(corsOptions), (req, res) => {
    console.log(req.body.file);
    fs.writeFile(`./words/de/${req.body.file}`,req.body.content,function () {});
    res.send({data: 'true'})
});

app.use(function(req, res, next) {
    res.status(404).send("Sorry, that route doesn't exist. Have a nice day :)");
});
