import config from './config';
import { findFirstMatch } from './utils';

export function setupViewsLocals(request: any, response: any, next: any) {
    if(request.locals === undefined)
        request.locals = {};

    // Website title
    request.locals.title = config.website.title;
    
    // Passeport authentification
    request.locals.isAuthenticated = request.isAuthenticated();

    console.log(request.session);

    next();
}

export function guessLanguage(request: any, response: any, next: any) {

    // Skip if language already defined
    if(request.session.language) return next();

    let acceptsLanguages: string[] = request.acceptsLanguages();

    // #1 Check user's language
    if(request.session.user && request.session.user.language) {
        request.session.language = request.session.user.language;
        return next();
    }

    // #2 Check accepted languages
    if(acceptsLanguages) {
        let firstFound: string = findFirstMatch<string>(config.language.locales, acceptsLanguages);

        if(firstFound) {
            request.session.language = firstFound
            return next();
        }
    }

    // #3 Take default language
    request.session.language = config.language.default;

    return next();
}