const Express = require('express');

import Log from '../lib/logger';
import images from '../lib/images';

interface View {
    path: string,
    render: string,
    locals: {
        styles?: string[],
        scripts?: string[],
        [propName: string]: any
    }
}

var views: View[] = [
    { 
        path: '/', 
        render: 'index',
        locals: {}
    },
    { 
        path: '/login', 
        render: 'login',
        locals: {}
    },
    { 
        path: '/signup', 
        render: 'signup',
        locals: {}
    },
    { 
        path: '/proposals', 
        render: 'proposals',
        locals: {}
    },
    { 
        path: '/gallery', 
        render: 'gallery',
        locals: {
            styles: [
                'gallery.css'
            ],
            scripts: [
                'gallery.js'
            ],
            images: images
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