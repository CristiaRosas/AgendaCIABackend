'use strict';
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';
import seguimientoRoutes from '../src/schemaSeguimiento/seguimiento.routes.js';

const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false }));
    app.use(cors());
    app.use(express.json());
    app.use(helmet());
    app.use(morgan('dev'));
}

const routes = (app) => {
    app.use('/AgendaCIA/v1/seguimientos', seguimientoRoutes); // Nueva ruta
}

const conectarDB = async () => {
    try {
        await dbConnection();
        console.log('Successful connection to database!');
    } catch (error) {
        console.log('Error connecting to database!', error);
        process.exit(1);
    }
}

export const initServer = async () => {
    const app = express();
    try {
        middlewares(app);
        await conectarDB(); 
        routes(app);
        return app;
    } catch (err) {
        console.log(`Server init failed: ${err}!`);
        throw err;
    }
}

// Exporta el handler para Vercel
const appPromise = initServer();
export default async function handler(req, res) {
    const app = await appPromise;
    app(req, res);
}