const express = require('express');
const path = require('path');
const compression = require('compression');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const SERVER_PORT = process.env.PORT || 5002;
const logger = require('./server/helpers/logger');
const userContextMiddleware = require('./server/middleware/userContext');
const { subscribe, unsubscribe, getSubscriptions } = require('./server/services/subscriptions');
const { search } = require('./server/services/search');
const { getLocationAddress } = require('./server/services/location');

const app = express();

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 5000, // limit each IP to 5000 requests per windowMs
});

const PUBLIC = path.join(__dirname, 'public');


app.use(compression());
app.use(express.static(PUBLIC));
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.use(bodyParser.json({ limit: '50mb', type: 'application/json' }));
app.disable('x-powered-by');
app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
app.use(limiter);

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Expose-Headers', '*');
    next();
});

app.post('/search', search);
app.post('/subscriptions', userContextMiddleware, subscribe);
app.post('/unsubscribe', userContextMiddleware, unsubscribe);
app.get('/subscriptions', userContextMiddleware, getSubscriptions);
app.get('/location-address',  getLocationAddress);

app.listen(SERVER_PORT, () => {
    logger.info('### startListening ##');
    logger.info(`Node app is running on port:  ${SERVER_PORT}`);
});

module.exports = {
    server: app,
};


