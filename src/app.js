import dotenv from 'dotenv';
import express from 'express';
import routers from './routers/indexRouter.js';


dotenv.config();

const app = express();
app.use(express.json());
app.use(routers);

const port = 5000;
app.listen(port, () => console.log(`Application running on port ${port}.`));
