import 'reflect-metadata';
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import sequelize from './sequelize';
import { Dog } from './models';
import { Order } from './order';

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

app.get('/orders', async (req: Request, res: Response): Promise<Response> => {
    const allOrders: Order[] = await Order.findAll();
    return res.status(200).json(allOrders);
});

app.get(
    '/orders/:id',
    async (req: Request, res: Response): Promise<Response> => {
        const { id } = req.params;
        const orders: Order | null = await Order.findByPk(id);
        return res.status(200).json(orders);
    }
);

app.post('/orders', async (req: Request, res: Response): Promise<Response> => {
    const order: Order = await Order.create({ ...req.body });
    return res.status(201).json(order);
});

app.put(
    '/orders/:id',
    async (req: Request, res: Response): Promise<Response> => {
        const { id } = req.params;
        await Order.update({ ...req.body }, { where: { id } });
        const updatedOrder: Order | null = await Order.findByPk(id);
        return res.status(200).json(updatedOrder);
    }
);

app.delete(
    '/orders/:id',
    async (req: Request, res: Response): Promise<Response> => {
        const { id } = req.params;
        const deletedOrder: Order | null = await Order.findByPk(id);
        await Order.destroy({ where: { id } });
        return res.status(200).json(deletedOrder);
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
