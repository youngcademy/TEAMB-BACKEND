require('dotenv').config(); // .env 파일에 있는 환경 변수를 process.env로 로드해줌

import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
// const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken'); // JWT 생성 및 검증
import swaggerUi from 'swagger-ui-express';
// import FriendsController from './friends/friendController';

import sequelize from './sequelize';
import { User } from './user';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(undefined, {
        swaggerOptions: {
            url: '/swagger.json',
        },
    })
);

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

// Access token의 유효성 검사
const authenticateAccessToken = (
    req: Request,
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
        (error: boolean, user: Record<string, unknown> | undefined) => {
            if (error) {
                console.log(error);
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        }
    );
};

app.get('/users', async (req: Request, res: Response): Promise<Response> => {
    const allUsers: User[] = await User.findAll();
    return res.status(200).json(allUsers);
});

app.get(
    '/users/:id',
    async (req: Request, res: Response): Promise<Response> => {
        const { id } = req.params;
        const user: User | null = await User.findByPk(id);
        return res.status(200).json(user);
    }
);

app.post('/users', async (req: Request, res: Response): Promise<Response> => {
    const user: User = await User.create({ ...req.body });
    return res.status(201).json(user);
});

app.put(
    '/users/:id',
    async (req: Request, res: Response): Promise<Response> => {
        const { id } = req.params;
        await User.update({ ...req.body }, { where: { id } });
        const updatedUser: User | null = await User.findByPk(id);
        return res.status(200).json(updatedUser);
    }
);

app.delete(
    '/users/:id',
    async (req: Request, res: Response): Promise<Response> => {
        const { id } = req.params;
        const deletedUser: User | null = await User.findByPk(id);
        await User.destroy({ where: { id } });
        return res.status(200).json(deletedUser);
    }
);

app.post('/login', async (req: Request, res: Response): Promise<Response> => {
    const id = req.body.userID;
    const pw = req.body.userPW;
    const loginUser: User | null = await User.findOne({
        where: { userID: id, userPW: pw },
    });
    if (loginUser === null) {
        console.log('Not found!');
        return res.sendStatus(404);
    }

    const accessToken = generateAccessToken(id);
    const refreshToken = generateRefreshToken(id);

    console.log('A token has been generated.');
    console.log(accessToken);
    return res.json({ accessToken, refreshToken });
});

// app.get('/ping', async (_req, res) => {
//     const controller = new FriendsController();
//     const response = await controller.getFriend(1, 'jack');
//     return res.send(response);
// });

const start = async (): Promise<void> => {
    try {
        await sequelize.sync();
        app.listen(1234, () => {
            console.log(
                '--------------------Server started on port 1234--------------------'
            );
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

void start();
