import pg from 'pg';
import {users} from './users.mjs'
import express from 'express'
import * as dotenv from 'dotenv'
dotenv.config()

const app = express()

const client = new pg.Client({
  host: 'localhost',
  port: 5432,
  database: 'testinho',
  user: 'testinho_admin',
  password: `${process.env.MYSQL_PASSWORD}`,
})

client.connect((err) => {
    if (err) {
      console.error('connection error', err.stack)
    } else {
      console.log('connected')
    }
  })

  const text = `
  CREATE TABLE IF NOT EXISTS "usertest" (
      "id" SERIAL,
      "firstName" VARCHAR(50) NOT NULL,
      "lastName" VARCHAR(50) NOT NULL,
      "email" VARCHAR(50) NOT NULL,
      "ip" VARCHAR,
      "PRIMARY KEY" SERIAL
    );`;

   
   client
    .query(text)
    .then (() =>
    users.forEach(user => {
        let text='INSERT INTO usertest(first_name,Last_name,email,ip) VALUES($1,$2,$3,$4)'
        let values = [user.firstName, user.lastName, user.email, user.ip]
        client.query(text,values, (err, res) => {
            if (err) {
              console.log(err.stack)
            } else {
              console.log(res.rows[0])
              
 }          
    
})}))
 .then(() => client.query("select DISTINCT * from usertest"))
 .then((results) => console.table(results.rows))
 .finally(() => client.end());




app.get('/user', (req, res) =>  {
  res.json(users)
})

app.get('/user/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = users.find(note => note.id === id)
  response.json(note)
})
app.use(express.json())
app.post("/user", (req, res) => {
  const { id, firstName, lastName, email, ip } = req.body;

  users.push({
      id: id,
      firstName: firstName,
      lastName: lastName,
      email: email,
      ip: ip
  });

  res.send(users);
});

app.patch("/user/:id", (req, res) => {
  const userId = Number(req.params.id);
  const user = users.find(user =>
      user.id === userId
  );
  const { firstName, lastName, email, ip } = req.body;

  user.firstName = firstName;
  user.lastName = lastName;
  user.email = email;
  user.ip = ip;

  res.send(users);
});



 const PORT = 3001
 app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`)
 })