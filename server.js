//define dependencies
const express = require(`express`);
const path = require(`path`);
const fs = require(`fs`);
const db = require(`./db/notes.json`);
const { v4: uuidv4 } = require('uuid');
//modify id for delete function
const uniqueId = new RegExp ("-", "g");
function newId() {return uuidv4().replace(uniqueId, "_")};
const {
  readFromFile,
  readAndAppend,
  writeToFile,
} = require('./helpers/fsUtils');

//define port
const PORT = process.env.PORT || 3001;

//create an instance of express
const app = express();

//serve static files
app.use(express.static('public'));

//middleware parses JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//get route for homepage
app.get(`/`, (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

//get route for notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

// get Route for retrieving complete notes
app.get('/api/notes', (req, res) => {
  readFromFile('./db/notes.json').then((data) => res.json(JSON.parse(data)));
});

// post Route for a new note
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

// delete route for a specific note- from class mini-project and study group
app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;
  readFromFile('./db/notes.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      // new array with deleted note filtered out
      const result = json.filter((app) => app.id !== noteId);

      // saves and returns new array
      writeToFile('./db/notes.json', result);
      res.json(result);

      
    });
});


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);