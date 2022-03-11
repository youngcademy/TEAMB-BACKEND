/* eslint-disable @typescript-eslint/no-var-requires */
require("dotenv").config();
import express, { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const users = [
  { id: "hello", pw: "world" },
  { id: "good", pw: "bye" },
];

const login = (id: string, pw: string) => {
  const len = users.length;

  for (let i = 0; i < len; i++) {
    if (id === users[i].id && pw === users[i].pw) return id;
  }

  return "";
};
// access token을 secret key 기반으로 생성
const generateAccessToken = (id: string) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1m",
  });
};

// refersh token을 secret key  기반으로 생성
const generateRefreshToken = (id: string) => {
  return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "180 days",
  });
};

// login 요청 및 성공시 access token, refresh token 발급
app.post("/login", (req, res) => {
  const id = req.body.id;
  const pw = req.body.pw;

  const user = login(id, pw);
  if (user === "") return res.sendStatus(500);

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.json({ accessToken, refreshToken });
});

// access token의 유효성 검사
const authenticateAccessToken = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    console.log("wrong token format or token is not sended");
    return res.sendStatus(400);
  }

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (error: boolean, user: any) => {
      if (error) {
        console.log(error);
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    }
  );
};

// access token을 refresh token 기반으로 재발급
app.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) return res.sendStatus(401);

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (error: boolean, user: { id: string }) => {
      if (error) return res.sendStatus(403);

      const accessToken = generateAccessToken(user.id);

      res.json({ accessToken });
    }
  );
});

// access token 유효성 확인을 위한 예시 요청
app.get("/user", authenticateAccessToken, (req: any, res: Response) => {
  console.log(req.user);
  res.json(users.filter((user) => user.id === req.user.id));
});

app.get("/welcome", (req: Request, res: Response) => {
  res.send("welcome!");
});

app.listen("1234", () => {
  console.log(`
  ################################################
  🛡️  Server listening on port: 1234🛡️
  ################################################
`);
});
