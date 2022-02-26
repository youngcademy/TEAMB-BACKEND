import express, { Request, Response, NextFunction } from "express";

const app = express();

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
