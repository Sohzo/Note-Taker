const express = require('express');
const path = require('path');
const api = require('./routes/index.js');

const PORT = process.env.port || 3001;

const app = express();

app.use('/api', api);
app.use(express.static('public'))


//GET route for homepage
app.get('/', (req,res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

//GET route for notes page
app.get('/notes', (req,res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

//GET route for wildcard - sends to homepage
app.get('*', (req,res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

//GET route for retrieving feedback
app.get('/api/notes', (req,res) => {
    console.info(`${req.method} request received for notes`)

    readFromFile('./db/db.json').then((data) => res.josn(JSON.parse(data)))
});

app.post('/api/notes', (req,res) => {
    console.info(`${req.method} request received to submit note`);

    const { title, text } = req.body

    if (title && text) {
        
        const newNote = {
            title,
            text
        };

        
    }
})



app.listen(PORT, () => 
    console.log(`http://localhost:${PORT}`)
)