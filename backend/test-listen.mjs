import express from 'express';
const app = express();
const server = app.listen('3001', '0.0.0.0', (err) => {
  console.log('callback called, err=', err);
  console.log('server.listening=', server.listening);
});
