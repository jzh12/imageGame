import express from 'express';
import logger from 'morgan';
import pg from 'pg';
import 'dotenv/config';

const app = express();
const port = process.env.port || 3002;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use('/', express.static('client'));

const pool = new pg.Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.DB_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.PORT
});
const client = await pool.connect();

app.post('/feedback', async(req, res) => {
    const options = req.body;
    try {
        await client.query(`INSERT INTO FEEDBACK VALUES(${parseInt(options.stars)})`);
        res.status(200).send('Success!');
       
    } 
    catch (error) {
      console.log(error);
      res.status(500).send('Error adding user to database');
      client.close();
    }
});

app.post('/completionTime', async (req, res) => {
    const options = req.body;
    try {
        await client.query(`INSERT INTO SCORE VALUES(${options.time})`);
        res.status(200).send('Success!');
    } 
    catch (error) {
      console.log(error);
      res.status(500).send('Unable to add score to database');
    }
});

app.get('/totalFeedback', async(req, res) => { 
    try {
        const databaseResponse = await client.query("SELECT * FROM FEEDBACK");
        res.status(200).send(databaseResponse.rows);
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Unable to add feedback to database');
    }
});

app.get('/top10Times', async(req, res) => {
    
    try {
        const databaseResponse = await client.query("SELECT * FROM SCORE");
        res.status(200).send(databaseResponse.rows.sort((a, b) => a.time - b.time).slice(0,10));
    } 
    catch (error) {
      console.log(error);
      res.status(500).send('Unable to select the top 10 times from the database');
    }
});
app.put('/resetTime', async(req, res) => {
    try {
        await client.query(`DELETE FROM SCORE`);
    } 
    catch (error) {
      console.log(error);
      res.status(500).send('Unable to reset the database');
    }
});

app.delete('/deleteTime', async(req, res) => {
    try {
        await client.query(`DELETE FROM SCORE WHERE TIME = ${req.body.time}`);
        res.status(200).send(`Deleted ${req.body.time} from the scoreboard!`);
    } 
    catch (error) {
      console.log(error);
      res.status(500).send('Unable to delete score from database');
    }
});

app.all('*', async (request, response) => {
    response.status(404).send(`Not found: ${request.path}`);
});

app.listen(port, () => {
    const msg = `Server started on http://localhost:${port}`;
});



  
