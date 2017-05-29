const Express = require('express');

import Log from './logger';
import Views from '../routes/views';
import setupAuth from '../routes/auth';

function setupRouter(passport: any) {
    var router = Express.Router();

    router.use('/', Views);
    router.use('/', setupAuth(passport));

    return router;
}

export default setupRouter;