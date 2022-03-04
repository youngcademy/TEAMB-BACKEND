import express, { Application, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const app: Application = express();

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('Hello, World!');
});

app.get('/test', function (req, res) {
    const user = { id: 3 };
    const token = jwt.sign({ user }, 'my_secret_key');
    res.send({
        token: token,
    });
});

app.listen('1234', () => {
    console.log(`
  ################################################
  🛡️ Server listening on port: 1234 🛡️
  ################################################
`);
});
