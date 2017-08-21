const Express = require('express');

import Log from '../lib/logger';
import images from '../lib/images';
import resources from '../lib/resources';

interface View {
    path: string,
    render: string,
    locals: object
}

var views: View[] = [
    { 
        path: '/', 
        render: 'index',
        locals: {
            images: images,
            resources: resources
        }
    }
];

var router = Express.Router();

for (let view of views) {
    router.get(view.path, function(request: any, response: any) {
        response.render(view.render, view.locals);
    });

    Log.verbose('Loaded : [VIEW][GET] ' + view.path);
}

export default router;