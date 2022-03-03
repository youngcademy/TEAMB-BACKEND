import express, { Application, Request, Response, NextFunction } from 'express';

const app: Application = express();

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('Hello, World!');
});

app.listen('1234', () => {
    console.log(`
  ################################################
  🛡️ Server listening on port: 1234 🛡️
  ################################################
`);
});
