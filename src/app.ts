import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello Hello Hello Hello My World!');
});''

app.get('/hi', (req, res) => {
  res.send('Hello World!');
});''

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});