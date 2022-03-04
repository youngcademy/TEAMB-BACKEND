require('dotenv').config(); // .env 파일에 있는 환경 변수를 process.env로 로드해줌

import express, { Application, Request, Response, NextFunction } from 'express';
const cors = require('cors'); // cors 미들웨어 제공
const jwt = require('jsonwebtoken'); // JWT 생성 및 검증
const bodyParser = require('body-parser'); // req의 body를 파싱해줌

const app: Application = express();

app.use(cors());

// req의 body를 파싱
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// id, pw 데이터 배열
const users = [
    { id: 'dog', pw: '123' },
    { id: 'cat', pw: '456' },
];

// 로그인 함수(id, pw 확인)
const login = (id: string, pw: string) => {
    for (let i = 0; i < users.length; i++) {
        if (id === users[i].id && pw === users[i].pw) return id;
    }
    return '';
};

// Access token 생성
const generateAccessToken = (id: string) => {
    return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '10m',
    });
};

// Refresh token 생성
const generateRefreshToken = (id: string) => {
    return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '30 days',
    });
};

// login 요청 => 확인 후 Access 토큰, Refresh 토큰 전송
app.post('/login', (req, res) => {
    const id = req.body.id;
    const pw = req.body.pw;

    const user = login(id, pw);
    if (user === '') return res.sendStatus(500);

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
    // 요청의 헤더에 포함된 토큰을 받아옴
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        console.log('Wrong token format or token is not sended.');
        return res.sendStatus(400);
    }

    // 받아온 토큰 검사
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

// Access token을 Refresh token 기반으로 재발급
app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) return res.sendStatus(401);

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (error: boolean, user: any) => {
            if (error) return res.sendStatus(403);

            const accessToken = generateAccessToken(user.id);

            res.json({ accessToken });
        }
    );
});

// Access token 확인 요청
app.get('/user', authenticateAccessToken, (req: any, res) => {
    console.log(req.user);
    res.json(users.filter((user) => user.id === req.user.id));
});

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!');
});

app.listen('1234', () => {
    console.log(`
  ################################################
  🛡️ Server listening on port: 1234 🛡️
  ################################################
`);
});
