import express, { Request, Response, NextFunction } from "express";

const app = express();
const jwt = require("jsonwebtoken");
const token = jwt.sign({ test: true }, "secertkey");
console.log(token);

app.get("/welcome", (req: Request, res: Response, next: NextFunction) => {
  res.send("WELCOME TO TeamBIG!");
});

app.listen("1234", () => {
  console.log(`
  ################################################
  🛡️  Server listening on port: 1234🛡️
  ################################################
`);
});
