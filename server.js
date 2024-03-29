const express = require('express');
const path = require('path');
const api = require('./routes/index.js');
const fs = require('fs');
//const util = require('util');
const unid = require('./helper/unid.js');

const PORT = process.env.PORT || 3001;

const app = express();

app.use('/api', api);
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

//GET route for homepage
app.get('/', (req,res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

//GET route for notes page
app.get('/notes', (req,res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req,res) => {
  console.info(`${req.method} request received for notes`)
  res.sendFile(path.join(__dirname, './db/db.json'))
});

//const readFromFile = util.promisify(fs.readFile);

const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );

//Function to write new notes to db.json file
const readAndAppend = (content, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedData = JSON.parse(data);
        parsedData.push(content);
        writeToFile(file, parsedData);
      }
    });
  };

//GET route for retrieving feedback


//POST method for note
app.post('/api/notes', (req,res) => {
    console.info(`${req.method} request received to submit note`);

    const { title, text } = req.body;

    if (title && text) {
        
        const newNote = {
            title,
            text,
            id: unid()
        };

        readAndAppend(newNote, './db/db.json');
        
        const response = {
            status: 'success',
            body: newNote
        };

        res.json(response);
    } else {
        res.json('Error is posting note');
    }
})


//GET route for wildcard - sends to homepage
app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

app.delete('/api/notes/:id', (req,res) => {
  const id = req.params.id * 1;
  

  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const allNotes = JSON.parse(data);
      const noteToDelete = allNotes.find(el => el.id === id);
      const index = allNotes.indexOf(noteToDelete);
      allNotes.splice(index);
      writeToFile('./db/db.json', allNotes);
    }
  });
});

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
});