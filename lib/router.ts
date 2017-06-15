const Express = require('express');

import Log from './logger';
import Views from '../routes/views';
import setupAuth from '../routes/auth';
import { 
    guessLanguage
} from '../lib/middleware';

function setupRouter(passport: any) {
    var router = Express.Router();

    router.use(guessLanguage);

    router.use('/', Views);
    router.use('/', setupAuth(passport));

    return router;
}

export default setupRouter;