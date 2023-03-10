//require port
const PORT = process.env.PORT || 3001;

//require needed pacakages
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

//require package that gives each note a unique id
const { v4 : uuidv4 } = require('uuid');

const savedNotes = require('./db/db.json');

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

//GET /api/notes reads the db.json file and returns all saved notes as JSON.
app.get('/api/notes', (req, res) => {
    res.json(savedNotes);
})


//GET /notes returns the notes.html file.
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

//function to create new note
function addNewNote(body, notesArray) {
    let newNote = body;
    newNote.id = "uuidv4()";
    notesArray.push(newNote);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(notesArray)
    );
    return newNote;
}

//POST /api/notes recieves a new note to save on the request body, add it to the db.json file, and then return the new note to the client.
app.post('/api/notes', (req, res) => {
    console.log(req);
    const newNote = addNewNote(req.body, savedNotes);
    res.json(newNote);
});

//tells front end pathway for the javaScript
app.get('/public/assets/js/index.js', (req, res) => {
    res.sendFile(path.join(__dirname, './public/assets/js/index.js'))
});

//tells front end pathway for the CSS
app.get('/public/assets/css/styles.css', (req, res) => {
    res.sendFile(path.join(__dirname, './public/assets/css/styles.css'))
})

//GET * returns the index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

//listening
app.listen(PORT, () => {
    console.log(`Listening now on ${PORT}!`)
})