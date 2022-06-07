//define dependencies
const express = require(`express`);
const path = require(`path`);
const fs = require(`fs`);
const db = require(`./db/notes.json`);
const { v4: uuidv4 } = require('uuid');
const uniqueId = new RegExp ("-", "g");
function newId() {return uuidv4().replace(uniqueId, "_")};
const {
  readFromFile,
  readAndAppend,
  writeToFile,
} = require('./helpers/fsUtils');

const PORT = process.env.PORT || 3001;

//create an instance of express
const app = express();

app.use(express.static('public'));

//middleware parses JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Get route for homepage
app.get(`/`, (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);


app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

// GET Route for retrieving all notes
app.get('/api/notes', (req, res) => {
  readFromFile('./db/notes.json').then((data) => res.json(JSON.parse(data)));
});

// POST Route for a new note
app.post('/api/notes', (req, res) => {
  console.log(req.body);

  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
      title,
      text,
      id: newId(),
    };

    readAndAppend(newNote,'./db/notes.json');
    res.json(newNote);

  }
});

// DELETE Route for a specific note
app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;
  readFromFile('./db/notes.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      // Make a new array of all tips except the one with the ID provided in the URL
      const result = json.filter((app) => app.id !== noteId);

      // Save that array to the filesystem
      writeToFile('./db/notes.json', result);
      res.json(result);

      
    });
});


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);