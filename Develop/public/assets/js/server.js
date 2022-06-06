//define dependencies
const express = require(`express`);
const path = require(`path`);
const fs = require(`fs`);

//create an instance of express
const app = express();

//middleware parses JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

//Get route for homepage
app.get(`/',(req,res)=>
res.sendFile(path.join(__dirname,`/ public / indexedDB.html`))
);

// GET route for notes page
app.get('/feedback', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/pages/notes.html'))
);




const port = process.env.PORT || 3001;

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);