const Express = require('express');

import Log from './logger';

var router = Express.Router();

import Views from '../routes/views';

router.use('/', Views);

export default router;