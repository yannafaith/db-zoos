const express = require('express');
const helmet = require('helmet');
const knex = require('knex');

const knexConfig = {
  client: 'sqlite3',
  connection: {
    filename: './data/lambda.sqlite3',
  },
  useNullAsDefault: true, // needed for sqlite
};

const db = knex(knexConfig);

const server = express();

server.use(express.json());
server.use(helmet());


//  ============== GET Endpoints 

server.get('/api/zoos/', async (req, res) => {
  try {
    const zoos = await db('zoos')
    res.status(200).json(zoos);
  } catch (error) {
    res.status(500).json(error)
  }
});

server.get('/api/zoos/:id', async (req, res) => {
  try {
    const zoo = await db('zoos')
    .where({ id: req.params.id })
    .first()
    res.status(200).json(zoo);
  } catch (error) {
    res.status(500).json(error)
  }
});

//  ============== POST Endpoint

server.post('/api/zoos', (req, res) => {
  const zoo = req.body;
  db.insert(zoo)
    .into("zoos")
    .then( zoo => {
      res.status(201).json(zoo)
    })
    .catch(() => {
      res.status(500).json({error: "we encountered an error"})
    })
});

//  ============== DELETE Endpoint

server.delete('/api/zoos/:id', (req, res) => {
  db('zoos')
  .where({id: req.params.id})
  .del()
  .then(() => {
    res.status(200).json({message: "zoo deleted"})
  })
  .catch(() => {
    res.status(500).json({error: "error"})
  })
});



const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
