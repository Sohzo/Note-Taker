const express = require('express');
const path = require('path');
const api = require('./routes/index');

const PORT = process.env.port || 3001;

const app = express();

app.use('/api', api);
app.use(express.static('public'))

app.get('/', (req,res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () => 
    console.log(`http://localhost:${PORT}`)
)