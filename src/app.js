import express from 'express';
import routers from './routers/indexRouter.js';

const app = express();
app.use(express.json());
app.use(routers);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Application running on port ${port}.`));