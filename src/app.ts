require('dotenv').config(); // .env 파일에 있는 환경 변수를 process.env로 로드해줌

import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
const jwt = require('jsonwebtoken'); // JWT 생성 및 검증

import sequelize from './sequelize';
import { Dog } from './models';

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

app.get('/dogs', async (req: Request, res: Response): Promise<Response> => {
    const allDogs: Dog[] = await Dog.findAll();
    return res.status(200).json(allDogs);
});

app.get('/dogs/:id', async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const dog: Dog | null = await Dog.findByPk(id);
    return res.status(200).json(dog);
});

app.post('/dogs', async (req: Request, res: Response): Promise<Response> => {
    const dog: Dog = await Dog.create({ ...req.body });
    return res.status(201).json(dog);
});

app.put('/dogs/:id', async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    await Dog.update({ ...req.body }, { where: { id } });
    const updatedDog: Dog | null = await Dog.findByPk(id);
    return res.status(200).json(updatedDog);
});

app.delete(
    '/dogs/:id',
    async (req: Request, res: Response): Promise<Response> => {
        const { id } = req.params;
        const deletedDog: Dog | null = await Dog.findByPk(id);
        await Dog.destroy({ where: { id } });
        return res.status(200).json(deletedDog);
    }
);

const start = async (): Promise<void> => {
    try {
        await sequelize.sync();
        app.listen(3000, () => {
            console.log(
                '--------------------Server started on port 3000--------------------'
            );
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

void start();
