import { config } from 'dotenv';
import { initServer } from './configs/server.js';

config();
const appPromise = initServer();

export default async function handler(req, res) {
  const app = await appPromise;
  app(req, res);
}