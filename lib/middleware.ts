import config from './config';

export function setupViewsLocals(request: any, response: any, next: any) {
    if(request.locals === undefined)
        request.locals = {};

    // Website title
    request.locals.title = config.website.title;
    
    // Passeport authentification
    request.locals.isAuthenticated = request.isAuthenticated();

    next();
}

export function guessLanguage(request: any, response: any, next: any) {

    let acceptsLanguages = request.acceptsLanguages()

    if(acceptsLanguages && acceptsLanguages.length > 0) {
        acceptsLanguages.some((element: any) => {
            if(config.language.locales.includes(element)) {
                request.language = element;
                return true;
            }

            return false;
        });
    }

    if(!request.language) {
        request.language = config.language.default;
    }

    next();
}