import express from 'express';
import { json } from 'body-parser';
import { errorHandler } from './middleware/errorHandler';
import config from './config';
import routes from './routes/index';

const app = express();
app.use(json());

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    // res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Allow-Methods', 'POST');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    } else {
        return next();
    }
});


app.use('/' + config.prefix, routes);
app.use(errorHandler);

app.listen(config.port, () => {
    console.log(`Servidor ejecutandose en el puerto: ${config.port}`);
});