const pg = require('pg');
const client = new pg.Client('postgres://localhost/pet-finder-db');
const express = require('express');
const app = express();

app.get('/api/pets', async(req, res, next)=> {
  try {
    const SQL = `
      SELECT * FROM pets
    `;
    const response = await client.query(SQL);
    res.send(response.rows);
  }
  catch(ex){
    next(ex);
  }
});

const setup = async() => {
  await client.connect();
  const SQL = `
    DROP TABLE IF EXISTS pets;
    CREATE TABLE pets(
      id SERIAL PRIMARY KEY,
      name VARCHAR(20)
    );
    INSERT INTO pets (name) VALUES ('kirby');
    INSERT INTO pets (name) VALUES ('bitsy');
    INSERT INTO pets (name) VALUES ('pockets');
    INSERT INTO pets (name) VALUES ('pickle');
  `;
  await client.query(SQL);

  const port = process.env.PORT || 3100;
  app.listen(port, ()=>{
    console.log(`listening on port ${port}`);
  });
};

setup();